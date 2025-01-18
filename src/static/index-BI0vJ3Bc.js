(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
  new MutationObserver((o) => {
      for (const l of o) if (l.type === "childList") for (const u of l.addedNodes) u.tagName === "LINK" && u.rel === "modulepreload" && s(u);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(o) {
      const l = {};
      return (
          o.integrity && (l.integrity = o.integrity),
          o.referrerPolicy && (l.referrerPolicy = o.referrerPolicy),
          o.crossOrigin === "use-credentials" ? (l.credentials = "include") : o.crossOrigin === "anonymous" ? (l.credentials = "omit") : (l.credentials = "same-origin"),
          l
      );
  }
  function s(o) {
      if (o.ep) return;
      o.ep = !0;
      const l = i(o);
      fetch(o.href, l);
  }
})();
function Co(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Mc = { exports: {} },
  Ws = {},
  Ac = { exports: {} },
  me = {};
/**
* @license React
* react.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/ var Hm;
function sS() {
  if (Hm) return me;
  Hm = 1;
  var t = Symbol.for("react.element"),
      e = Symbol.for("react.portal"),
      i = Symbol.for("react.fragment"),
      s = Symbol.for("react.strict_mode"),
      o = Symbol.for("react.profiler"),
      l = Symbol.for("react.provider"),
      u = Symbol.for("react.context"),
      c = Symbol.for("react.forward_ref"),
      d = Symbol.for("react.suspense"),
      h = Symbol.for("react.memo"),
      m = Symbol.for("react.lazy"),
      y = Symbol.iterator;
  function v(M) {
      return M === null || typeof M != "object" ? null : ((M = (y && M[y]) || M["@@iterator"]), typeof M == "function" ? M : null);
  }
  var w = {
          isMounted: function () {
              return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
      },
      S = Object.assign,
      b = {};
  function C(M, F, fe) {
      (this.props = M), (this.context = F), (this.refs = b), (this.updater = fe || w);
  }
  (C.prototype.isReactComponent = {}),
      (C.prototype.setState = function (M, F) {
          if (typeof M != "object" && typeof M != "function" && M != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          this.updater.enqueueSetState(this, M, F, "setState");
      }),
      (C.prototype.forceUpdate = function (M) {
          this.updater.enqueueForceUpdate(this, M, "forceUpdate");
      });
  function P() {}
  P.prototype = C.prototype;
  function E(M, F, fe) {
      (this.props = M), (this.context = F), (this.refs = b), (this.updater = fe || w);
  }
  var D = (E.prototype = new P());
  (D.constructor = E), S(D, C.prototype), (D.isPureReactComponent = !0);
  var I = Array.isArray,
      z = Object.prototype.hasOwnProperty,
      N = { current: null },
      Q = { key: !0, ref: !0, __self: !0, __source: !0 };
  function q(M, F, fe) {
      var de,
          pe = {},
          ge = null,
          Ce = null;
      if (F != null) for (de in (F.ref !== void 0 && (Ce = F.ref), F.key !== void 0 && (ge = "" + F.key), F)) z.call(F, de) && !Q.hasOwnProperty(de) && (pe[de] = F[de]);
      var xe = arguments.length - 2;
      if (xe === 1) pe.children = fe;
      else if (1 < xe) {
          for (var ke = Array(xe), At = 0; At < xe; At++) ke[At] = arguments[At + 2];
          pe.children = ke;
      }
      if (M && M.defaultProps) for (de in ((xe = M.defaultProps), xe)) pe[de] === void 0 && (pe[de] = xe[de]);
      return { $$typeof: t, type: M, key: ge, ref: Ce, props: pe, _owner: N.current };
  }
  function K(M, F) {
      return { $$typeof: t, type: M.type, key: F, ref: M.ref, props: M.props, _owner: M._owner };
  }
  function ie(M) {
      return typeof M == "object" && M !== null && M.$$typeof === t;
  }
  function ue(M) {
      var F = { "=": "=0", ":": "=2" };
      return (
          "$" +
          M.replace(/[=:]/g, function (fe) {
              return F[fe];
          })
      );
  }
  var _e = /\/+/g;
  function Te(M, F) {
      return typeof M == "object" && M !== null && M.key != null ? ue("" + M.key) : F.toString(36);
  }
  function he(M, F, fe, de, pe) {
      var ge = typeof M;
      (ge === "undefined" || ge === "boolean") && (M = null);
      var Ce = !1;
      if (M === null) Ce = !0;
      else
          switch (ge) {
              case "string":
              case "number":
                  Ce = !0;
                  break;
              case "object":
                  switch (M.$$typeof) {
                      case t:
                      case e:
                          Ce = !0;
                  }
          }
      if (Ce)
          return (
              (Ce = M),
              (pe = pe(Ce)),
              (M = de === "" ? "." + Te(Ce, 0) : de),
              I(pe)
                  ? ((fe = ""),
                    M != null && (fe = M.replace(_e, "$&/") + "/"),
                    he(pe, F, fe, "", function (At) {
                        return At;
                    }))
                  : pe != null && (ie(pe) && (pe = K(pe, fe + (!pe.key || (Ce && Ce.key === pe.key) ? "" : ("" + pe.key).replace(_e, "$&/") + "/") + M)), F.push(pe)),
              1
          );
      if (((Ce = 0), (de = de === "" ? "." : de + ":"), I(M)))
          for (var xe = 0; xe < M.length; xe++) {
              ge = M[xe];
              var ke = de + Te(ge, xe);
              Ce += he(ge, F, fe, ke, pe);
          }
      else if (((ke = v(M)), typeof ke == "function")) for (M = ke.call(M), xe = 0; !(ge = M.next()).done; ) (ge = ge.value), (ke = de + Te(ge, xe++)), (Ce += he(ge, F, fe, ke, pe));
      else if (ge === "object")
          throw (
              ((F = String(M)),
              Error("Objects are not valid as a React child (found: " + (F === "[object Object]" ? "object with keys {" + Object.keys(M).join(", ") + "}" : F) + "). If you meant to render a collection of children, use an array instead."))
          );
      return Ce;
  }
  function Ge(M, F, fe) {
      if (M == null) return M;
      var de = [],
          pe = 0;
      return (
          he(M, de, "", "", function (ge) {
              return F.call(fe, ge, pe++);
          }),
          de
      );
  }
  function st(M) {
      if (M._status === -1) {
          var F = M._result;
          (F = F()),
              F.then(
                  function (fe) {
                      (M._status === 0 || M._status === -1) && ((M._status = 1), (M._result = fe));
                  },
                  function (fe) {
                      (M._status === 0 || M._status === -1) && ((M._status = 2), (M._result = fe));
                  }
              ),
              M._status === -1 && ((M._status = 0), (M._result = F));
      }
      if (M._status === 1) return M._result.default;
      throw M._result;
  }
  var ae = { current: null },
      U = { transition: null },
      te = { ReactCurrentDispatcher: ae, ReactCurrentBatchConfig: U, ReactCurrentOwner: N };
  function G() {
      throw Error("act(...) is not supported in production builds of React.");
  }
  return (
      (me.Children = {
          map: Ge,
          forEach: function (M, F, fe) {
              Ge(
                  M,
                  function () {
                      F.apply(this, arguments);
                  },
                  fe
              );
          },
          count: function (M) {
              var F = 0;
              return (
                  Ge(M, function () {
                      F++;
                  }),
                  F
              );
          },
          toArray: function (M) {
              return (
                  Ge(M, function (F) {
                      return F;
                  }) || []
              );
          },
          only: function (M) {
              if (!ie(M)) throw Error("React.Children.only expected to receive a single React element child.");
              return M;
          },
      }),
      (me.Component = C),
      (me.Fragment = i),
      (me.Profiler = o),
      (me.PureComponent = E),
      (me.StrictMode = s),
      (me.Suspense = d),
      (me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = te),
      (me.act = G),
      (me.cloneElement = function (M, F, fe) {
          if (M == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + M + ".");
          var de = S({}, M.props),
              pe = M.key,
              ge = M.ref,
              Ce = M._owner;
          if (F != null) {
              if ((F.ref !== void 0 && ((ge = F.ref), (Ce = N.current)), F.key !== void 0 && (pe = "" + F.key), M.type && M.type.defaultProps)) var xe = M.type.defaultProps;
              for (ke in F) z.call(F, ke) && !Q.hasOwnProperty(ke) && (de[ke] = F[ke] === void 0 && xe !== void 0 ? xe[ke] : F[ke]);
          }
          var ke = arguments.length - 2;
          if (ke === 1) de.children = fe;
          else if (1 < ke) {
              xe = Array(ke);
              for (var At = 0; At < ke; At++) xe[At] = arguments[At + 2];
              de.children = xe;
          }
          return { $$typeof: t, type: M.type, key: pe, ref: ge, props: de, _owner: Ce };
      }),
      (me.createContext = function (M) {
          return (M = { $$typeof: u, _currentValue: M, _currentValue2: M, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }), (M.Provider = { $$typeof: l, _context: M }), (M.Consumer = M);
      }),
      (me.createElement = q),
      (me.createFactory = function (M) {
          var F = q.bind(null, M);
          return (F.type = M), F;
      }),
      (me.createRef = function () {
          return { current: null };
      }),
      (me.forwardRef = function (M) {
          return { $$typeof: c, render: M };
      }),
      (me.isValidElement = ie),
      (me.lazy = function (M) {
          return { $$typeof: m, _payload: { _status: -1, _result: M }, _init: st };
      }),
      (me.memo = function (M, F) {
          return { $$typeof: h, type: M, compare: F === void 0 ? null : F };
      }),
      (me.startTransition = function (M) {
          var F = U.transition;
          U.transition = {};
          try {
              M();
          } finally {
              U.transition = F;
          }
      }),
      (me.unstable_act = G),
      (me.useCallback = function (M, F) {
          return ae.current.useCallback(M, F);
      }),
      (me.useContext = function (M) {
          return ae.current.useContext(M);
      }),
      (me.useDebugValue = function () {}),
      (me.useDeferredValue = function (M) {
          return ae.current.useDeferredValue(M);
      }),
      (me.useEffect = function (M, F) {
          return ae.current.useEffect(M, F);
      }),
      (me.useId = function () {
          return ae.current.useId();
      }),
      (me.useImperativeHandle = function (M, F, fe) {
          return ae.current.useImperativeHandle(M, F, fe);
      }),
      (me.useInsertionEffect = function (M, F) {
          return ae.current.useInsertionEffect(M, F);
      }),
      (me.useLayoutEffect = function (M, F) {
          return ae.current.useLayoutEffect(M, F);
      }),
      (me.useMemo = function (M, F) {
          return ae.current.useMemo(M, F);
      }),
      (me.useReducer = function (M, F, fe) {
          return ae.current.useReducer(M, F, fe);
      }),
      (me.useRef = function (M) {
          return ae.current.useRef(M);
      }),
      (me.useState = function (M) {
          return ae.current.useState(M);
      }),
      (me.useSyncExternalStore = function (M, F, fe) {
          return ae.current.useSyncExternalStore(M, F, fe);
      }),
      (me.useTransition = function () {
          return ae.current.useTransition();
      }),
      (me.version = "18.3.1"),
      me
  );
}
var Wm;
function kl() {
  return Wm || ((Wm = 1), (Ac.exports = sS())), Ac.exports;
}
/**
* @license React
* react-jsx-runtime.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/ var qm;
function oS() {
  if (qm) return Ws;
  qm = 1;
  var t = kl(),
      e = Symbol.for("react.element"),
      i = Symbol.for("react.fragment"),
      s = Object.prototype.hasOwnProperty,
      o = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
      l = { key: !0, ref: !0, __self: !0, __source: !0 };
  function u(c, d, h) {
      var m,
          y = {},
          v = null,
          w = null;
      h !== void 0 && (v = "" + h), d.key !== void 0 && (v = "" + d.key), d.ref !== void 0 && (w = d.ref);
      for (m in d) s.call(d, m) && !l.hasOwnProperty(m) && (y[m] = d[m]);
      if (c && c.defaultProps) for (m in ((d = c.defaultProps), d)) y[m] === void 0 && (y[m] = d[m]);
      return { $$typeof: e, type: c, key: v, ref: w, props: y, _owner: o.current };
  }
  return (Ws.Fragment = i), (Ws.jsx = u), (Ws.jsxs = u), Ws;
}
var Km;
function aS() {
  return Km || ((Km = 1), (Mc.exports = oS())), Mc.exports;
}
var k = aS(),
  A = kl();
const He = Co(A);
var $a = {},
  Oc = { exports: {} },
  _t = {},
  Dc = { exports: {} },
  Lc = {};
/**
* @license React
* scheduler.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/ var Gm;
function lS() {
  return (
      Gm ||
          ((Gm = 1),
          (function (t) {
              function e(U, te) {
                  var G = U.length;
                  U.push(te);
                  e: for (; 0 < G; ) {
                      var M = (G - 1) >>> 1,
                          F = U[M];
                      if (0 < o(F, te)) (U[M] = te), (U[G] = F), (G = M);
                      else break e;
                  }
              }
              function i(U) {
                  return U.length === 0 ? null : U[0];
              }
              function s(U) {
                  if (U.length === 0) return null;
                  var te = U[0],
                      G = U.pop();
                  if (G !== te) {
                      U[0] = G;
                      e: for (var M = 0, F = U.length, fe = F >>> 1; M < fe; ) {
                          var de = 2 * (M + 1) - 1,
                              pe = U[de],
                              ge = de + 1,
                              Ce = U[ge];
                          if (0 > o(pe, G)) ge < F && 0 > o(Ce, pe) ? ((U[M] = Ce), (U[ge] = G), (M = ge)) : ((U[M] = pe), (U[de] = G), (M = de));
                          else if (ge < F && 0 > o(Ce, G)) (U[M] = Ce), (U[ge] = G), (M = ge);
                          else break e;
                      }
                  }
                  return te;
              }
              function o(U, te) {
                  var G = U.sortIndex - te.sortIndex;
                  return G !== 0 ? G : U.id - te.id;
              }
              if (typeof performance == "object" && typeof performance.now == "function") {
                  var l = performance;
                  t.unstable_now = function () {
                      return l.now();
                  };
              } else {
                  var u = Date,
                      c = u.now();
                  t.unstable_now = function () {
                      return u.now() - c;
                  };
              }
              var d = [],
                  h = [],
                  m = 1,
                  y = null,
                  v = 3,
                  w = !1,
                  S = !1,
                  b = !1,
                  C = typeof setTimeout == "function" ? setTimeout : null,
                  P = typeof clearTimeout == "function" ? clearTimeout : null,
                  E = typeof setImmediate < "u" ? setImmediate : null;
              typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
              function D(U) {
                  for (var te = i(h); te !== null; ) {
                      if (te.callback === null) s(h);
                      else if (te.startTime <= U) s(h), (te.sortIndex = te.expirationTime), e(d, te);
                      else break;
                      te = i(h);
                  }
              }
              function I(U) {
                  if (((b = !1), D(U), !S))
                      if (i(d) !== null) (S = !0), st(z);
                      else {
                          var te = i(h);
                          te !== null && ae(I, te.startTime - U);
                      }
              }
              function z(U, te) {
                  (S = !1), b && ((b = !1), P(q), (q = -1)), (w = !0);
                  var G = v;
                  try {
                      for (D(te), y = i(d); y !== null && (!(y.expirationTime > te) || (U && !ue())); ) {
                          var M = y.callback;
                          if (typeof M == "function") {
                              (y.callback = null), (v = y.priorityLevel);
                              var F = M(y.expirationTime <= te);
                              (te = t.unstable_now()), typeof F == "function" ? (y.callback = F) : y === i(d) && s(d), D(te);
                          } else s(d);
                          y = i(d);
                      }
                      if (y !== null) var fe = !0;
                      else {
                          var de = i(h);
                          de !== null && ae(I, de.startTime - te), (fe = !1);
                      }
                      return fe;
                  } finally {
                      (y = null), (v = G), (w = !1);
                  }
              }
              var N = !1,
                  Q = null,
                  q = -1,
                  K = 5,
                  ie = -1;
              function ue() {
                  return !(t.unstable_now() - ie < K);
              }
              function _e() {
                  if (Q !== null) {
                      var U = t.unstable_now();
                      ie = U;
                      var te = !0;
                      try {
                          te = Q(!0, U);
                      } finally {
                          te ? Te() : ((N = !1), (Q = null));
                      }
                  } else N = !1;
              }
              var Te;
              if (typeof E == "function")
                  Te = function () {
                      E(_e);
                  };
              else if (typeof MessageChannel < "u") {
                  var he = new MessageChannel(),
                      Ge = he.port2;
                  (he.port1.onmessage = _e),
                      (Te = function () {
                          Ge.postMessage(null);
                      });
              } else
                  Te = function () {
                      C(_e, 0);
                  };
              function st(U) {
                  (Q = U), N || ((N = !0), Te());
              }
              function ae(U, te) {
                  q = C(function () {
                      U(t.unstable_now());
                  }, te);
              }
              (t.unstable_IdlePriority = 5),
                  (t.unstable_ImmediatePriority = 1),
                  (t.unstable_LowPriority = 4),
                  (t.unstable_NormalPriority = 3),
                  (t.unstable_Profiling = null),
                  (t.unstable_UserBlockingPriority = 2),
                  (t.unstable_cancelCallback = function (U) {
                      U.callback = null;
                  }),
                  (t.unstable_continueExecution = function () {
                      S || w || ((S = !0), st(z));
                  }),
                  (t.unstable_forceFrameRate = function (U) {
                      0 > U || 125 < U ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : (K = 0 < U ? Math.floor(1e3 / U) : 5);
                  }),
                  (t.unstable_getCurrentPriorityLevel = function () {
                      return v;
                  }),
                  (t.unstable_getFirstCallbackNode = function () {
                      return i(d);
                  }),
                  (t.unstable_next = function (U) {
                      switch (v) {
                          case 1:
                          case 2:
                          case 3:
                              var te = 3;
                              break;
                          default:
                              te = v;
                      }
                      var G = v;
                      v = te;
                      try {
                          return U();
                      } finally {
                          v = G;
                      }
                  }),
                  (t.unstable_pauseExecution = function () {}),
                  (t.unstable_requestPaint = function () {}),
                  (t.unstable_runWithPriority = function (U, te) {
                      switch (U) {
                          case 1:
                          case 2:
                          case 3:
                          case 4:
                          case 5:
                              break;
                          default:
                              U = 3;
                      }
                      var G = v;
                      v = U;
                      try {
                          return te();
                      } finally {
                          v = G;
                      }
                  }),
                  (t.unstable_scheduleCallback = function (U, te, G) {
                      var M = t.unstable_now();
                      switch ((typeof G == "object" && G !== null ? ((G = G.delay), (G = typeof G == "number" && 0 < G ? M + G : M)) : (G = M), U)) {
                          case 1:
                              var F = -1;
                              break;
                          case 2:
                              F = 250;
                              break;
                          case 5:
                              F = 1073741823;
                              break;
                          case 4:
                              F = 1e4;
                              break;
                          default:
                              F = 5e3;
                      }
                      return (
                          (F = G + F),
                          (U = { id: m++, callback: te, priorityLevel: U, startTime: G, expirationTime: F, sortIndex: -1 }),
                          G > M ? ((U.sortIndex = G), e(h, U), i(d) === null && U === i(h) && (b ? (P(q), (q = -1)) : (b = !0), ae(I, G - M))) : ((U.sortIndex = F), e(d, U), S || w || ((S = !0), st(z))),
                          U
                      );
                  }),
                  (t.unstable_shouldYield = ue),
                  (t.unstable_wrapCallback = function (U) {
                      var te = v;
                      return function () {
                          var G = v;
                          v = te;
                          try {
                              return U.apply(this, arguments);
                          } finally {
                              v = G;
                          }
                      };
                  });
          })(Lc)),
      Lc
  );
}
var Ym;
function uS() {
  return Ym || ((Ym = 1), (Dc.exports = lS())), Dc.exports;
}
/**
* @license React
* react-dom.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/ var Qm;
function cS() {
  if (Qm) return _t;
  Qm = 1;
  var t = kl(),
      e = uS();
  function i(n) {
      for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, a = 1; a < arguments.length; a++) r += "&args[]=" + encodeURIComponent(arguments[a]);
      return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var s = new Set(),
      o = {};
  function l(n, r) {
      u(n, r), u(n + "Capture", r);
  }
  function u(n, r) {
      for (o[n] = r, n = 0; n < r.length; n++) s.add(r[n]);
  }
  var c = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
      d = Object.prototype.hasOwnProperty,
      h = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
      m = {},
      y = {};
  function v(n) {
      return d.call(y, n) ? !0 : d.call(m, n) ? !1 : h.test(n) ? (y[n] = !0) : ((m[n] = !0), !1);
  }
  function w(n, r, a, f) {
      if (a !== null && a.type === 0) return !1;
      switch (typeof r) {
          case "function":
          case "symbol":
              return !0;
          case "boolean":
              return f ? !1 : a !== null ? !a.acceptsBooleans : ((n = n.toLowerCase().slice(0, 5)), n !== "data-" && n !== "aria-");
          default:
              return !1;
      }
  }
  function S(n, r, a, f) {
      if (r === null || typeof r > "u" || w(n, r, a, f)) return !0;
      if (f) return !1;
      if (a !== null)
          switch (a.type) {
              case 3:
                  return !r;
              case 4:
                  return r === !1;
              case 5:
                  return isNaN(r);
              case 6:
                  return isNaN(r) || 1 > r;
          }
      return !1;
  }
  function b(n, r, a, f, p, g, x) {
      (this.acceptsBooleans = r === 2 || r === 3 || r === 4),
          (this.attributeName = f),
          (this.attributeNamespace = p),
          (this.mustUseProperty = a),
          (this.propertyName = n),
          (this.type = r),
          (this.sanitizeURL = g),
          (this.removeEmptyString = x);
  }
  var C = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (n) {
      C[n] = new b(n, 0, !1, n, null, !1, !1);
  }),
      [
          ["acceptCharset", "accept-charset"],
          ["className", "class"],
          ["htmlFor", "for"],
          ["httpEquiv", "http-equiv"],
      ].forEach(function (n) {
          var r = n[0];
          C[r] = new b(r, 1, !1, n[1], null, !1, !1);
      }),
      ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (n) {
          C[n] = new b(n, 2, !1, n.toLowerCase(), null, !1, !1);
      }),
      ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (n) {
          C[n] = new b(n, 2, !1, n, null, !1, !1);
      }),
      "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
          .split(" ")
          .forEach(function (n) {
              C[n] = new b(n, 3, !1, n.toLowerCase(), null, !1, !1);
          }),
      ["checked", "multiple", "muted", "selected"].forEach(function (n) {
          C[n] = new b(n, 3, !0, n, null, !1, !1);
      }),
      ["capture", "download"].forEach(function (n) {
          C[n] = new b(n, 4, !1, n, null, !1, !1);
      }),
      ["cols", "rows", "size", "span"].forEach(function (n) {
          C[n] = new b(n, 6, !1, n, null, !1, !1);
      }),
      ["rowSpan", "start"].forEach(function (n) {
          C[n] = new b(n, 5, !1, n.toLowerCase(), null, !1, !1);
      });
  var P = /[\-:]([a-z])/g;
  function E(n) {
      return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
      .split(" ")
      .forEach(function (n) {
          var r = n.replace(P, E);
          C[r] = new b(r, 1, !1, n, null, !1, !1);
      }),
      "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (n) {
          var r = n.replace(P, E);
          C[r] = new b(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
      }),
      ["xml:base", "xml:lang", "xml:space"].forEach(function (n) {
          var r = n.replace(P, E);
          C[r] = new b(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
      }),
      ["tabIndex", "crossOrigin"].forEach(function (n) {
          C[n] = new b(n, 1, !1, n.toLowerCase(), null, !1, !1);
      }),
      (C.xlinkHref = new b("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1)),
      ["src", "href", "action", "formAction"].forEach(function (n) {
          C[n] = new b(n, 1, !1, n.toLowerCase(), null, !0, !0);
      });
  function D(n, r, a, f) {
      var p = C.hasOwnProperty(r) ? C[r] : null;
      (p !== null ? p.type !== 0 : f || !(2 < r.length) || (r[0] !== "o" && r[0] !== "O") || (r[1] !== "n" && r[1] !== "N")) &&
          (S(r, a, p, f) && (a = null),
          f || p === null
              ? v(r) && (a === null ? n.removeAttribute(r) : n.setAttribute(r, "" + a))
              : p.mustUseProperty
              ? (n[p.propertyName] = a === null ? (p.type === 3 ? !1 : "") : a)
              : ((r = p.attributeName), (f = p.attributeNamespace), a === null ? n.removeAttribute(r) : ((p = p.type), (a = p === 3 || (p === 4 && a === !0) ? "" : "" + a), f ? n.setAttributeNS(f, r, a) : n.setAttribute(r, a))));
  }
  var I = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
      z = Symbol.for("react.element"),
      N = Symbol.for("react.portal"),
      Q = Symbol.for("react.fragment"),
      q = Symbol.for("react.strict_mode"),
      K = Symbol.for("react.profiler"),
      ie = Symbol.for("react.provider"),
      ue = Symbol.for("react.context"),
      _e = Symbol.for("react.forward_ref"),
      Te = Symbol.for("react.suspense"),
      he = Symbol.for("react.suspense_list"),
      Ge = Symbol.for("react.memo"),
      st = Symbol.for("react.lazy"),
      ae = Symbol.for("react.offscreen"),
      U = Symbol.iterator;
  function te(n) {
      return n === null || typeof n != "object" ? null : ((n = (U && n[U]) || n["@@iterator"]), typeof n == "function" ? n : null);
  }
  var G = Object.assign,
      M;
  function F(n) {
      if (M === void 0)
          try {
              throw Error();
          } catch (a) {
              var r = a.stack.trim().match(/\n( *(at )?)/);
              M = (r && r[1]) || "";
          }
      return (
          `
` +
          M +
          n
      );
  }
  var fe = !1;
  function de(n, r) {
      if (!n || fe) return "";
      fe = !0;
      var a = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
          if (r)
              if (
                  ((r = function () {
                      throw Error();
                  }),
                  Object.defineProperty(r.prototype, "props", {
                      set: function () {
                          throw Error();
                      },
                  }),
                  typeof Reflect == "object" && Reflect.construct)
              ) {
                  try {
                      Reflect.construct(r, []);
                  } catch (j) {
                      var f = j;
                  }
                  Reflect.construct(n, [], r);
              } else {
                  try {
                      r.call();
                  } catch (j) {
                      f = j;
                  }
                  n.call(r.prototype);
              }
          else {
              try {
                  throw Error();
              } catch (j) {
                  f = j;
              }
              n();
          }
      } catch (j) {
          if (j && f && typeof j.stack == "string") {
              for (
                  var p = j.stack.split(`
`),
                      g = f.stack.split(`
`),
                      x = p.length - 1,
                      T = g.length - 1;
                  1 <= x && 0 <= T && p[x] !== g[T];

              )
                  T--;
              for (; 1 <= x && 0 <= T; x--, T--)
                  if (p[x] !== g[T]) {
                      if (x !== 1 || T !== 1)
                          do
                              if ((x--, T--, 0 > T || p[x] !== g[T])) {
                                  var _ =
                                      `
` + p[x].replace(" at new ", " at ");
                                  return n.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", n.displayName)), _;
                              }
                          while (1 <= x && 0 <= T);
                      break;
                  }
          }
      } finally {
          (fe = !1), (Error.prepareStackTrace = a);
      }
      return (n = n ? n.displayName || n.name : "") ? F(n) : "";
  }
  function pe(n) {
      switch (n.tag) {
          case 5:
              return F(n.type);
          case 16:
              return F("Lazy");
          case 13:
              return F("Suspense");
          case 19:
              return F("SuspenseList");
          case 0:
          case 2:
          case 15:
              return (n = de(n.type, !1)), n;
          case 11:
              return (n = de(n.type.render, !1)), n;
          case 1:
              return (n = de(n.type, !0)), n;
          default:
              return "";
      }
  }
  function ge(n) {
      if (n == null) return null;
      if (typeof n == "function") return n.displayName || n.name || null;
      if (typeof n == "string") return n;
      switch (n) {
          case Q:
              return "Fragment";
          case N:
              return "Portal";
          case K:
              return "Profiler";
          case q:
              return "StrictMode";
          case Te:
              return "Suspense";
          case he:
              return "SuspenseList";
      }
      if (typeof n == "object")
          switch (n.$$typeof) {
              case ue:
                  return (n.displayName || "Context") + ".Consumer";
              case ie:
                  return (n._context.displayName || "Context") + ".Provider";
              case _e:
                  var r = n.render;
                  return (n = n.displayName), n || ((n = r.displayName || r.name || ""), (n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef")), n;
              case Ge:
                  return (r = n.displayName || null), r !== null ? r : ge(n.type) || "Memo";
              case st:
                  (r = n._payload), (n = n._init);
                  try {
                      return ge(n(r));
                  } catch {}
          }
      return null;
  }
  function Ce(n) {
      var r = n.type;
      switch (n.tag) {
          case 24:
              return "Cache";
          case 9:
              return (r.displayName || "Context") + ".Consumer";
          case 10:
              return (r._context.displayName || "Context") + ".Provider";
          case 18:
              return "DehydratedFragment";
          case 11:
              return (n = r.render), (n = n.displayName || n.name || ""), r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
          case 7:
              return "Fragment";
          case 5:
              return r;
          case 4:
              return "Portal";
          case 3:
              return "Root";
          case 6:
              return "Text";
          case 16:
              return ge(r);
          case 8:
              return r === q ? "StrictMode" : "Mode";
          case 22:
              return "Offscreen";
          case 12:
              return "Profiler";
          case 21:
              return "Scope";
          case 13:
              return "Suspense";
          case 19:
              return "SuspenseList";
          case 25:
              return "TracingMarker";
          case 1:
          case 0:
          case 17:
          case 2:
          case 14:
          case 15:
              if (typeof r == "function") return r.displayName || r.name || null;
              if (typeof r == "string") return r;
      }
      return null;
  }
  function xe(n) {
      switch (typeof n) {
          case "boolean":
          case "number":
          case "string":
          case "undefined":
              return n;
          case "object":
              return n;
          default:
              return "";
      }
  }
  function ke(n) {
      var r = n.type;
      return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function At(n) {
      var r = ke(n) ? "checked" : "value",
          a = Object.getOwnPropertyDescriptor(n.constructor.prototype, r),
          f = "" + n[r];
      if (!n.hasOwnProperty(r) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
          var p = a.get,
              g = a.set;
          return (
              Object.defineProperty(n, r, {
                  configurable: !0,
                  get: function () {
                      return p.call(this);
                  },
                  set: function (x) {
                      (f = "" + x), g.call(this, x);
                  },
              }),
              Object.defineProperty(n, r, { enumerable: a.enumerable }),
              {
                  getValue: function () {
                      return f;
                  },
                  setValue: function (x) {
                      f = "" + x;
                  },
                  stopTracking: function () {
                      (n._valueTracker = null), delete n[r];
                  },
              }
          );
      }
  }
  function Oo(n) {
      n._valueTracker || (n._valueTracker = At(n));
  }
  function Qd(n) {
      if (!n) return !1;
      var r = n._valueTracker;
      if (!r) return !0;
      var a = r.getValue(),
          f = "";
      return n && (f = ke(n) ? (n.checked ? "true" : "false") : n.value), (n = f), n !== a ? (r.setValue(n), !0) : !1;
  }
  function Do(n) {
      if (((n = n || (typeof document < "u" ? document : void 0)), typeof n > "u")) return null;
      try {
          return n.activeElement || n.body;
      } catch {
          return n.body;
      }
  }
  function zl(n, r) {
      var a = r.checked;
      return G({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: a ?? n._wrapperState.initialChecked });
  }
  function Xd(n, r) {
      var a = r.defaultValue == null ? "" : r.defaultValue,
          f = r.checked != null ? r.checked : r.defaultChecked;
      (a = xe(r.value != null ? r.value : a)), (n._wrapperState = { initialChecked: f, initialValue: a, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null });
  }
  function Zd(n, r) {
      (r = r.checked), r != null && D(n, "checked", r, !1);
  }
  function Nl(n, r) {
      Zd(n, r);
      var a = xe(r.value),
          f = r.type;
      if (a != null) f === "number" ? ((a === 0 && n.value === "") || n.value != a) && (n.value = "" + a) : n.value !== "" + a && (n.value = "" + a);
      else if (f === "submit" || f === "reset") {
          n.removeAttribute("value");
          return;
      }
      r.hasOwnProperty("value") ? Fl(n, r.type, a) : r.hasOwnProperty("defaultValue") && Fl(n, r.type, xe(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Jd(n, r, a) {
      if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
          var f = r.type;
          if (!((f !== "submit" && f !== "reset") || (r.value !== void 0 && r.value !== null))) return;
          (r = "" + n._wrapperState.initialValue), a || r === n.value || (n.value = r), (n.defaultValue = r);
      }
      (a = n.name), a !== "" && (n.name = ""), (n.defaultChecked = !!n._wrapperState.initialChecked), a !== "" && (n.name = a);
  }
  function Fl(n, r, a) {
      (r !== "number" || Do(n.ownerDocument) !== n) && (a == null ? (n.defaultValue = "" + n._wrapperState.initialValue) : n.defaultValue !== "" + a && (n.defaultValue = "" + a));
  }
  var os = Array.isArray;
  function rr(n, r, a, f) {
      if (((n = n.options), r)) {
          r = {};
          for (var p = 0; p < a.length; p++) r["$" + a[p]] = !0;
          for (a = 0; a < n.length; a++) (p = r.hasOwnProperty("$" + n[a].value)), n[a].selected !== p && (n[a].selected = p), p && f && (n[a].defaultSelected = !0);
      } else {
          for (a = "" + xe(a), r = null, p = 0; p < n.length; p++) {
              if (n[p].value === a) {
                  (n[p].selected = !0), f && (n[p].defaultSelected = !0);
                  return;
              }
              r !== null || n[p].disabled || (r = n[p]);
          }
          r !== null && (r.selected = !0);
      }
  }
  function Vl(n, r) {
      if (r.dangerouslySetInnerHTML != null) throw Error(i(91));
      return G({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function eh(n, r) {
      var a = r.value;
      if (a == null) {
          if (((a = r.children), (r = r.defaultValue), a != null)) {
              if (r != null) throw Error(i(92));
              if (os(a)) {
                  if (1 < a.length) throw Error(i(93));
                  a = a[0];
              }
              r = a;
          }
          r == null && (r = ""), (a = r);
      }
      n._wrapperState = { initialValue: xe(a) };
  }
  function th(n, r) {
      var a = xe(r.value),
          f = xe(r.defaultValue);
      a != null && ((a = "" + a), a !== n.value && (n.value = a), r.defaultValue == null && n.defaultValue !== a && (n.defaultValue = a)), f != null && (n.defaultValue = "" + f);
  }
  function nh(n) {
      var r = n.textContent;
      r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function ih(n) {
      switch (n) {
          case "svg":
              return "http://www.w3.org/2000/svg";
          case "math":
              return "http://www.w3.org/1998/Math/MathML";
          default:
              return "http://www.w3.org/1999/xhtml";
      }
  }
  function Bl(n, r) {
      return n == null || n === "http://www.w3.org/1999/xhtml" ? ih(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var Lo,
      rh = (function (n) {
          return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
              ? function (r, a, f, p) {
                    MSApp.execUnsafeLocalFunction(function () {
                        return n(r, a, f, p);
                    });
                }
              : n;
      })(function (n, r) {
          if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
          else {
              for (Lo = Lo || document.createElement("div"), Lo.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = Lo.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
              for (; r.firstChild; ) n.appendChild(r.firstChild);
          }
      });
  function as(n, r) {
      if (r) {
          var a = n.firstChild;
          if (a && a === n.lastChild && a.nodeType === 3) {
              a.nodeValue = r;
              return;
          }
      }
      n.textContent = r;
  }
  var ls = {
          animationIterationCount: !0,
          aspectRatio: !0,
          borderImageOutset: !0,
          borderImageSlice: !0,
          borderImageWidth: !0,
          boxFlex: !0,
          boxFlexGroup: !0,
          boxOrdinalGroup: !0,
          columnCount: !0,
          columns: !0,
          flex: !0,
          flexGrow: !0,
          flexPositive: !0,
          flexShrink: !0,
          flexNegative: !0,
          flexOrder: !0,
          gridArea: !0,
          gridRow: !0,
          gridRowEnd: !0,
          gridRowSpan: !0,
          gridRowStart: !0,
          gridColumn: !0,
          gridColumnEnd: !0,
          gridColumnSpan: !0,
          gridColumnStart: !0,
          fontWeight: !0,
          lineClamp: !0,
          lineHeight: !0,
          opacity: !0,
          order: !0,
          orphans: !0,
          tabSize: !0,
          widows: !0,
          zIndex: !0,
          zoom: !0,
          fillOpacity: !0,
          floodOpacity: !0,
          stopOpacity: !0,
          strokeDasharray: !0,
          strokeDashoffset: !0,
          strokeMiterlimit: !0,
          strokeOpacity: !0,
          strokeWidth: !0,
      },
      cw = ["Webkit", "ms", "Moz", "O"];
  Object.keys(ls).forEach(function (n) {
      cw.forEach(function (r) {
          (r = r + n.charAt(0).toUpperCase() + n.substring(1)), (ls[r] = ls[n]);
      });
  });
  function sh(n, r, a) {
      return r == null || typeof r == "boolean" || r === "" ? "" : a || typeof r != "number" || r === 0 || (ls.hasOwnProperty(n) && ls[n]) ? ("" + r).trim() : r + "px";
  }
  function oh(n, r) {
      n = n.style;
      for (var a in r)
          if (r.hasOwnProperty(a)) {
              var f = a.indexOf("--") === 0,
                  p = sh(a, r[a], f);
              a === "float" && (a = "cssFloat"), f ? n.setProperty(a, p) : (n[a] = p);
          }
  }
  var fw = G({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function $l(n, r) {
      if (r) {
          if (fw[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(i(137, n));
          if (r.dangerouslySetInnerHTML != null) {
              if (r.children != null) throw Error(i(60));
              if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(i(61));
          }
          if (r.style != null && typeof r.style != "object") throw Error(i(62));
      }
  }
  function Ul(n, r) {
      if (n.indexOf("-") === -1) return typeof r.is == "string";
      switch (n) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
              return !1;
          default:
              return !0;
      }
  }
  var Hl = null;
  function Wl(n) {
      return (n = n.target || n.srcElement || window), n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var ql = null,
      sr = null,
      or = null;
  function ah(n) {
      if ((n = Ms(n))) {
          if (typeof ql != "function") throw Error(i(280));
          var r = n.stateNode;
          r && ((r = ia(r)), ql(n.stateNode, n.type, r));
      }
  }
  function lh(n) {
      sr ? (or ? or.push(n) : (or = [n])) : (sr = n);
  }
  function uh() {
      if (sr) {
          var n = sr,
              r = or;
          if (((or = sr = null), ah(n), r)) for (n = 0; n < r.length; n++) ah(r[n]);
      }
  }
  function ch(n, r) {
      return n(r);
  }
  function fh() {}
  var Kl = !1;
  function dh(n, r, a) {
      if (Kl) return n(r, a);
      Kl = !0;
      try {
          return ch(n, r, a);
      } finally {
          (Kl = !1), (sr !== null || or !== null) && (fh(), uh());
      }
  }
  function us(n, r) {
      var a = n.stateNode;
      if (a === null) return null;
      var f = ia(a);
      if (f === null) return null;
      a = f[r];
      e: switch (r) {
          case "onClick":
          case "onClickCapture":
          case "onDoubleClick":
          case "onDoubleClickCapture":
          case "onMouseDown":
          case "onMouseDownCapture":
          case "onMouseMove":
          case "onMouseMoveCapture":
          case "onMouseUp":
          case "onMouseUpCapture":
          case "onMouseEnter":
              (f = !f.disabled) || ((n = n.type), (f = !(n === "button" || n === "input" || n === "select" || n === "textarea"))), (n = !f);
              break e;
          default:
              n = !1;
      }
      if (n) return null;
      if (a && typeof a != "function") throw Error(i(231, r, typeof a));
      return a;
  }
  var Gl = !1;
  if (c)
      try {
          var cs = {};
          Object.defineProperty(cs, "passive", {
              get: function () {
                  Gl = !0;
              },
          }),
              window.addEventListener("test", cs, cs),
              window.removeEventListener("test", cs, cs);
      } catch {
          Gl = !1;
      }
  function dw(n, r, a, f, p, g, x, T, _) {
      var j = Array.prototype.slice.call(arguments, 3);
      try {
          r.apply(a, j);
      } catch (B) {
          this.onError(B);
      }
  }
  var fs = !1,
      Io = null,
      jo = !1,
      Yl = null,
      hw = {
          onError: function (n) {
              (fs = !0), (Io = n);
          },
      };
  function pw(n, r, a, f, p, g, x, T, _) {
      (fs = !1), (Io = null), dw.apply(hw, arguments);
  }
  function mw(n, r, a, f, p, g, x, T, _) {
      if ((pw.apply(this, arguments), fs)) {
          if (fs) {
              var j = Io;
              (fs = !1), (Io = null);
          } else throw Error(i(198));
          jo || ((jo = !0), (Yl = j));
      }
  }
  function bi(n) {
      var r = n,
          a = n;
      if (n.alternate) for (; r.return; ) r = r.return;
      else {
          n = r;
          do (r = n), r.flags & 4098 && (a = r.return), (n = r.return);
          while (n);
      }
      return r.tag === 3 ? a : null;
  }
  function hh(n) {
      if (n.tag === 13) {
          var r = n.memoizedState;
          if ((r === null && ((n = n.alternate), n !== null && (r = n.memoizedState)), r !== null)) return r.dehydrated;
      }
      return null;
  }
  function ph(n) {
      if (bi(n) !== n) throw Error(i(188));
  }
  function gw(n) {
      var r = n.alternate;
      if (!r) {
          if (((r = bi(n)), r === null)) throw Error(i(188));
          return r !== n ? null : n;
      }
      for (var a = n, f = r; ; ) {
          var p = a.return;
          if (p === null) break;
          var g = p.alternate;
          if (g === null) {
              if (((f = p.return), f !== null)) {
                  a = f;
                  continue;
              }
              break;
          }
          if (p.child === g.child) {
              for (g = p.child; g; ) {
                  if (g === a) return ph(p), n;
                  if (g === f) return ph(p), r;
                  g = g.sibling;
              }
              throw Error(i(188));
          }
          if (a.return !== f.return) (a = p), (f = g);
          else {
              for (var x = !1, T = p.child; T; ) {
                  if (T === a) {
                      (x = !0), (a = p), (f = g);
                      break;
                  }
                  if (T === f) {
                      (x = !0), (f = p), (a = g);
                      break;
                  }
                  T = T.sibling;
              }
              if (!x) {
                  for (T = g.child; T; ) {
                      if (T === a) {
                          (x = !0), (a = g), (f = p);
                          break;
                      }
                      if (T === f) {
                          (x = !0), (f = g), (a = p);
                          break;
                      }
                      T = T.sibling;
                  }
                  if (!x) throw Error(i(189));
              }
          }
          if (a.alternate !== f) throw Error(i(190));
      }
      if (a.tag !== 3) throw Error(i(188));
      return a.stateNode.current === a ? n : r;
  }
  function mh(n) {
      return (n = gw(n)), n !== null ? gh(n) : null;
  }
  function gh(n) {
      if (n.tag === 5 || n.tag === 6) return n;
      for (n = n.child; n !== null; ) {
          var r = gh(n);
          if (r !== null) return r;
          n = n.sibling;
      }
      return null;
  }
  var yh = e.unstable_scheduleCallback,
      vh = e.unstable_cancelCallback,
      yw = e.unstable_shouldYield,
      vw = e.unstable_requestPaint,
      We = e.unstable_now,
      xw = e.unstable_getCurrentPriorityLevel,
      Ql = e.unstable_ImmediatePriority,
      xh = e.unstable_UserBlockingPriority,
      zo = e.unstable_NormalPriority,
      ww = e.unstable_LowPriority,
      wh = e.unstable_IdlePriority,
      No = null,
      vn = null;
  function Sw(n) {
      if (vn && typeof vn.onCommitFiberRoot == "function")
          try {
              vn.onCommitFiberRoot(No, n, void 0, (n.current.flags & 128) === 128);
          } catch {}
  }
  var en = Math.clz32 ? Math.clz32 : kw,
      bw = Math.log,
      Cw = Math.LN2;
  function kw(n) {
      return (n >>>= 0), n === 0 ? 32 : (31 - ((bw(n) / Cw) | 0)) | 0;
  }
  var Fo = 64,
      Vo = 4194304;
  function ds(n) {
      switch (n & -n) {
          case 1:
              return 1;
          case 2:
              return 2;
          case 4:
              return 4;
          case 8:
              return 8;
          case 16:
              return 16;
          case 32:
              return 32;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
              return n & 4194240;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
              return n & 130023424;
          case 134217728:
              return 134217728;
          case 268435456:
              return 268435456;
          case 536870912:
              return 536870912;
          case 1073741824:
              return 1073741824;
          default:
              return n;
      }
  }
  function Bo(n, r) {
      var a = n.pendingLanes;
      if (a === 0) return 0;
      var f = 0,
          p = n.suspendedLanes,
          g = n.pingedLanes,
          x = a & 268435455;
      if (x !== 0) {
          var T = x & ~p;
          T !== 0 ? (f = ds(T)) : ((g &= x), g !== 0 && (f = ds(g)));
      } else (x = a & ~p), x !== 0 ? (f = ds(x)) : g !== 0 && (f = ds(g));
      if (f === 0) return 0;
      if (r !== 0 && r !== f && !(r & p) && ((p = f & -f), (g = r & -r), p >= g || (p === 16 && (g & 4194240) !== 0))) return r;
      if ((f & 4 && (f |= a & 16), (r = n.entangledLanes), r !== 0)) for (n = n.entanglements, r &= f; 0 < r; ) (a = 31 - en(r)), (p = 1 << a), (f |= n[a]), (r &= ~p);
      return f;
  }
  function Pw(n, r) {
      switch (n) {
          case 1:
          case 2:
          case 4:
              return r + 250;
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
              return r + 5e3;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
              return -1;
          case 134217728:
          case 268435456:
          case 536870912:
          case 1073741824:
              return -1;
          default:
              return -1;
      }
  }
  function Tw(n, r) {
      for (var a = n.suspendedLanes, f = n.pingedLanes, p = n.expirationTimes, g = n.pendingLanes; 0 < g; ) {
          var x = 31 - en(g),
              T = 1 << x,
              _ = p[x];
          _ === -1 ? (!(T & a) || T & f) && (p[x] = Pw(T, r)) : _ <= r && (n.expiredLanes |= T), (g &= ~T);
      }
  }
  function Xl(n) {
      return (n = n.pendingLanes & -1073741825), n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Sh() {
      var n = Fo;
      return (Fo <<= 1), !(Fo & 4194240) && (Fo = 64), n;
  }
  function Zl(n) {
      for (var r = [], a = 0; 31 > a; a++) r.push(n);
      return r;
  }
  function hs(n, r, a) {
      (n.pendingLanes |= r), r !== 536870912 && ((n.suspendedLanes = 0), (n.pingedLanes = 0)), (n = n.eventTimes), (r = 31 - en(r)), (n[r] = a);
  }
  function Ew(n, r) {
      var a = n.pendingLanes & ~r;
      (n.pendingLanes = r), (n.suspendedLanes = 0), (n.pingedLanes = 0), (n.expiredLanes &= r), (n.mutableReadLanes &= r), (n.entangledLanes &= r), (r = n.entanglements);
      var f = n.eventTimes;
      for (n = n.expirationTimes; 0 < a; ) {
          var p = 31 - en(a),
              g = 1 << p;
          (r[p] = 0), (f[p] = -1), (n[p] = -1), (a &= ~g);
      }
  }
  function Jl(n, r) {
      var a = (n.entangledLanes |= r);
      for (n = n.entanglements; a; ) {
          var f = 31 - en(a),
              p = 1 << f;
          (p & r) | (n[f] & r) && (n[f] |= r), (a &= ~p);
      }
  }
  var Pe = 0;
  function bh(n) {
      return (n &= -n), 1 < n ? (4 < n ? (n & 268435455 ? 16 : 536870912) : 4) : 1;
  }
  var Ch,
      eu,
      kh,
      Ph,
      Th,
      tu = !1,
      $o = [],
      qn = null,
      Kn = null,
      Gn = null,
      ps = new Map(),
      ms = new Map(),
      Yn = [],
      _w = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
          " "
      );
  function Eh(n, r) {
      switch (n) {
          case "focusin":
          case "focusout":
              qn = null;
              break;
          case "dragenter":
          case "dragleave":
              Kn = null;
              break;
          case "mouseover":
          case "mouseout":
              Gn = null;
              break;
          case "pointerover":
          case "pointerout":
              ps.delete(r.pointerId);
              break;
          case "gotpointercapture":
          case "lostpointercapture":
              ms.delete(r.pointerId);
      }
  }
  function gs(n, r, a, f, p, g) {
      return n === null || n.nativeEvent !== g
          ? ((n = { blockedOn: r, domEventName: a, eventSystemFlags: f, nativeEvent: g, targetContainers: [p] }), r !== null && ((r = Ms(r)), r !== null && eu(r)), n)
          : ((n.eventSystemFlags |= f), (r = n.targetContainers), p !== null && r.indexOf(p) === -1 && r.push(p), n);
  }
  function Rw(n, r, a, f, p) {
      switch (r) {
          case "focusin":
              return (qn = gs(qn, n, r, a, f, p)), !0;
          case "dragenter":
              return (Kn = gs(Kn, n, r, a, f, p)), !0;
          case "mouseover":
              return (Gn = gs(Gn, n, r, a, f, p)), !0;
          case "pointerover":
              var g = p.pointerId;
              return ps.set(g, gs(ps.get(g) || null, n, r, a, f, p)), !0;
          case "gotpointercapture":
              return (g = p.pointerId), ms.set(g, gs(ms.get(g) || null, n, r, a, f, p)), !0;
      }
      return !1;
  }
  function _h(n) {
      var r = Ci(n.target);
      if (r !== null) {
          var a = bi(r);
          if (a !== null) {
              if (((r = a.tag), r === 13)) {
                  if (((r = hh(a)), r !== null)) {
                      (n.blockedOn = r),
                          Th(n.priority, function () {
                              kh(a);
                          });
                      return;
                  }
              } else if (r === 3 && a.stateNode.current.memoizedState.isDehydrated) {
                  n.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
                  return;
              }
          }
      }
      n.blockedOn = null;
  }
  function Uo(n) {
      if (n.blockedOn !== null) return !1;
      for (var r = n.targetContainers; 0 < r.length; ) {
          var a = iu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
          if (a === null) {
              a = n.nativeEvent;
              var f = new a.constructor(a.type, a);
              (Hl = f), a.target.dispatchEvent(f), (Hl = null);
          } else return (r = Ms(a)), r !== null && eu(r), (n.blockedOn = a), !1;
          r.shift();
      }
      return !0;
  }
  function Rh(n, r, a) {
      Uo(n) && a.delete(r);
  }
  function Mw() {
      (tu = !1), qn !== null && Uo(qn) && (qn = null), Kn !== null && Uo(Kn) && (Kn = null), Gn !== null && Uo(Gn) && (Gn = null), ps.forEach(Rh), ms.forEach(Rh);
  }
  function ys(n, r) {
      n.blockedOn === r && ((n.blockedOn = null), tu || ((tu = !0), e.unstable_scheduleCallback(e.unstable_NormalPriority, Mw)));
  }
  function vs(n) {
      function r(p) {
          return ys(p, n);
      }
      if (0 < $o.length) {
          ys($o[0], n);
          for (var a = 1; a < $o.length; a++) {
              var f = $o[a];
              f.blockedOn === n && (f.blockedOn = null);
          }
      }
      for (qn !== null && ys(qn, n), Kn !== null && ys(Kn, n), Gn !== null && ys(Gn, n), ps.forEach(r), ms.forEach(r), a = 0; a < Yn.length; a++) (f = Yn[a]), f.blockedOn === n && (f.blockedOn = null);
      for (; 0 < Yn.length && ((a = Yn[0]), a.blockedOn === null); ) _h(a), a.blockedOn === null && Yn.shift();
  }
  var ar = I.ReactCurrentBatchConfig,
      Ho = !0;
  function Aw(n, r, a, f) {
      var p = Pe,
          g = ar.transition;
      ar.transition = null;
      try {
          (Pe = 1), nu(n, r, a, f);
      } finally {
          (Pe = p), (ar.transition = g);
      }
  }
  function Ow(n, r, a, f) {
      var p = Pe,
          g = ar.transition;
      ar.transition = null;
      try {
          (Pe = 4), nu(n, r, a, f);
      } finally {
          (Pe = p), (ar.transition = g);
      }
  }
  function nu(n, r, a, f) {
      if (Ho) {
          var p = iu(n, r, a, f);
          if (p === null) wu(n, r, f, Wo, a), Eh(n, f);
          else if (Rw(p, n, r, a, f)) f.stopPropagation();
          else if ((Eh(n, f), r & 4 && -1 < _w.indexOf(n))) {
              for (; p !== null; ) {
                  var g = Ms(p);
                  if ((g !== null && Ch(g), (g = iu(n, r, a, f)), g === null && wu(n, r, f, Wo, a), g === p)) break;
                  p = g;
              }
              p !== null && f.stopPropagation();
          } else wu(n, r, f, null, a);
      }
  }
  var Wo = null;
  function iu(n, r, a, f) {
      if (((Wo = null), (n = Wl(f)), (n = Ci(n)), n !== null))
          if (((r = bi(n)), r === null)) n = null;
          else if (((a = r.tag), a === 13)) {
              if (((n = hh(r)), n !== null)) return n;
              n = null;
          } else if (a === 3) {
              if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
              n = null;
          } else r !== n && (n = null);
      return (Wo = n), null;
  }
  function Mh(n) {
      switch (n) {
          case "cancel":
          case "click":
          case "close":
          case "contextmenu":
          case "copy":
          case "cut":
          case "auxclick":
          case "dblclick":
          case "dragend":
          case "dragstart":
          case "drop":
          case "focusin":
          case "focusout":
          case "input":
          case "invalid":
          case "keydown":
          case "keypress":
          case "keyup":
          case "mousedown":
          case "mouseup":
          case "paste":
          case "pause":
          case "play":
          case "pointercancel":
          case "pointerdown":
          case "pointerup":
          case "ratechange":
          case "reset":
          case "resize":
          case "seeked":
          case "submit":
          case "touchcancel":
          case "touchend":
          case "touchstart":
          case "volumechange":
          case "change":
          case "selectionchange":
          case "textInput":
          case "compositionstart":
          case "compositionend":
          case "compositionupdate":
          case "beforeblur":
          case "afterblur":
          case "beforeinput":
          case "blur":
          case "fullscreenchange":
          case "focus":
          case "hashchange":
          case "popstate":
          case "select":
          case "selectstart":
              return 1;
          case "drag":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "mousemove":
          case "mouseout":
          case "mouseover":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "scroll":
          case "toggle":
          case "touchmove":
          case "wheel":
          case "mouseenter":
          case "mouseleave":
          case "pointerenter":
          case "pointerleave":
              return 4;
          case "message":
              switch (xw()) {
                  case Ql:
                      return 1;
                  case xh:
                      return 4;
                  case zo:
                  case ww:
                      return 16;
                  case wh:
                      return 536870912;
                  default:
                      return 16;
              }
          default:
              return 16;
      }
  }
  var Qn = null,
      ru = null,
      qo = null;
  function Ah() {
      if (qo) return qo;
      var n,
          r = ru,
          a = r.length,
          f,
          p = "value" in Qn ? Qn.value : Qn.textContent,
          g = p.length;
      for (n = 0; n < a && r[n] === p[n]; n++);
      var x = a - n;
      for (f = 1; f <= x && r[a - f] === p[g - f]; f++);
      return (qo = p.slice(n, 1 < f ? 1 - f : void 0));
  }
  function Ko(n) {
      var r = n.keyCode;
      return "charCode" in n ? ((n = n.charCode), n === 0 && r === 13 && (n = 13)) : (n = r), n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function Go() {
      return !0;
  }
  function Oh() {
      return !1;
  }
  function Ot(n) {
      function r(a, f, p, g, x) {
          (this._reactName = a), (this._targetInst = p), (this.type = f), (this.nativeEvent = g), (this.target = x), (this.currentTarget = null);
          for (var T in n) n.hasOwnProperty(T) && ((a = n[T]), (this[T] = a ? a(g) : g[T]));
          return (this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? Go : Oh), (this.isPropagationStopped = Oh), this;
      }
      return (
          G(r.prototype, {
              preventDefault: function () {
                  this.defaultPrevented = !0;
                  var a = this.nativeEvent;
                  a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), (this.isDefaultPrevented = Go));
              },
              stopPropagation: function () {
                  var a = this.nativeEvent;
                  a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), (this.isPropagationStopped = Go));
              },
              persist: function () {},
              isPersistent: Go,
          }),
          r
      );
  }
  var lr = {
          eventPhase: 0,
          bubbles: 0,
          cancelable: 0,
          timeStamp: function (n) {
              return n.timeStamp || Date.now();
          },
          defaultPrevented: 0,
          isTrusted: 0,
      },
      su = Ot(lr),
      xs = G({}, lr, { view: 0, detail: 0 }),
      Dw = Ot(xs),
      ou,
      au,
      ws,
      Yo = G({}, xs, {
          screenX: 0,
          screenY: 0,
          clientX: 0,
          clientY: 0,
          pageX: 0,
          pageY: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          getModifierState: uu,
          button: 0,
          buttons: 0,
          relatedTarget: function (n) {
              return n.relatedTarget === void 0 ? (n.fromElement === n.srcElement ? n.toElement : n.fromElement) : n.relatedTarget;
          },
          movementX: function (n) {
              return "movementX" in n ? n.movementX : (n !== ws && (ws && n.type === "mousemove" ? ((ou = n.screenX - ws.screenX), (au = n.screenY - ws.screenY)) : (au = ou = 0), (ws = n)), ou);
          },
          movementY: function (n) {
              return "movementY" in n ? n.movementY : au;
          },
      }),
      Dh = Ot(Yo),
      Lw = G({}, Yo, { dataTransfer: 0 }),
      Iw = Ot(Lw),
      jw = G({}, xs, { relatedTarget: 0 }),
      lu = Ot(jw),
      zw = G({}, lr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      Nw = Ot(zw),
      Fw = G({}, lr, {
          clipboardData: function (n) {
              return "clipboardData" in n ? n.clipboardData : window.clipboardData;
          },
      }),
      Vw = Ot(Fw),
      Bw = G({}, lr, { data: 0 }),
      Lh = Ot(Bw),
      $w = {
          Esc: "Escape",
          Spacebar: " ",
          Left: "ArrowLeft",
          Up: "ArrowUp",
          Right: "ArrowRight",
          Down: "ArrowDown",
          Del: "Delete",
          Win: "OS",
          Menu: "ContextMenu",
          Apps: "ContextMenu",
          Scroll: "ScrollLock",
          MozPrintableKey: "Unidentified",
      },
      Uw = {
          8: "Backspace",
          9: "Tab",
          12: "Clear",
          13: "Enter",
          16: "Shift",
          17: "Control",
          18: "Alt",
          19: "Pause",
          20: "CapsLock",
          27: "Escape",
          32: " ",
          33: "PageUp",
          34: "PageDown",
          35: "End",
          36: "Home",
          37: "ArrowLeft",
          38: "ArrowUp",
          39: "ArrowRight",
          40: "ArrowDown",
          45: "Insert",
          46: "Delete",
          112: "F1",
          113: "F2",
          114: "F3",
          115: "F4",
          116: "F5",
          117: "F6",
          118: "F7",
          119: "F8",
          120: "F9",
          121: "F10",
          122: "F11",
          123: "F12",
          144: "NumLock",
          145: "ScrollLock",
          224: "Meta",
      },
      Hw = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ww(n) {
      var r = this.nativeEvent;
      return r.getModifierState ? r.getModifierState(n) : (n = Hw[n]) ? !!r[n] : !1;
  }
  function uu() {
      return Ww;
  }
  var qw = G({}, xs, {
          key: function (n) {
              if (n.key) {
                  var r = $w[n.key] || n.key;
                  if (r !== "Unidentified") return r;
              }
              return n.type === "keypress" ? ((n = Ko(n)), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? Uw[n.keyCode] || "Unidentified" : "";
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: uu,
          charCode: function (n) {
              return n.type === "keypress" ? Ko(n) : 0;
          },
          keyCode: function (n) {
              return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
          },
          which: function (n) {
              return n.type === "keypress" ? Ko(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
          },
      }),
      Kw = Ot(qw),
      Gw = G({}, Yo, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }),
      Ih = Ot(Gw),
      Yw = G({}, xs, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: uu }),
      Qw = Ot(Yw),
      Xw = G({}, lr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
      Zw = Ot(Xw),
      Jw = G({}, Yo, {
          deltaX: function (n) {
              return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
          },
          deltaY: function (n) {
              return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
      }),
      e1 = Ot(Jw),
      t1 = [9, 13, 27, 32],
      cu = c && "CompositionEvent" in window,
      Ss = null;
  c && "documentMode" in document && (Ss = document.documentMode);
  var n1 = c && "TextEvent" in window && !Ss,
      jh = c && (!cu || (Ss && 8 < Ss && 11 >= Ss)),
      zh = " ",
      Nh = !1;
  function Fh(n, r) {
      switch (n) {
          case "keyup":
              return t1.indexOf(r.keyCode) !== -1;
          case "keydown":
              return r.keyCode !== 229;
          case "keypress":
          case "mousedown":
          case "focusout":
              return !0;
          default:
              return !1;
      }
  }
  function Vh(n) {
      return (n = n.detail), typeof n == "object" && "data" in n ? n.data : null;
  }
  var ur = !1;
  function i1(n, r) {
      switch (n) {
          case "compositionend":
              return Vh(r);
          case "keypress":
              return r.which !== 32 ? null : ((Nh = !0), zh);
          case "textInput":
              return (n = r.data), n === zh && Nh ? null : n;
          default:
              return null;
      }
  }
  function r1(n, r) {
      if (ur) return n === "compositionend" || (!cu && Fh(n, r)) ? ((n = Ah()), (qo = ru = Qn = null), (ur = !1), n) : null;
      switch (n) {
          case "paste":
              return null;
          case "keypress":
              if (!(r.ctrlKey || r.altKey || r.metaKey) || (r.ctrlKey && r.altKey)) {
                  if (r.char && 1 < r.char.length) return r.char;
                  if (r.which) return String.fromCharCode(r.which);
              }
              return null;
          case "compositionend":
              return jh && r.locale !== "ko" ? null : r.data;
          default:
              return null;
      }
  }
  var s1 = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Bh(n) {
      var r = n && n.nodeName && n.nodeName.toLowerCase();
      return r === "input" ? !!s1[n.type] : r === "textarea";
  }
  function $h(n, r, a, f) {
      lh(f), (r = ea(r, "onChange")), 0 < r.length && ((a = new su("onChange", "change", null, a, f)), n.push({ event: a, listeners: r }));
  }
  var bs = null,
      Cs = null;
  function o1(n) {
      op(n, 0);
  }
  function Qo(n) {
      var r = pr(n);
      if (Qd(r)) return n;
  }
  function a1(n, r) {
      if (n === "change") return r;
  }
  var Uh = !1;
  if (c) {
      var fu;
      if (c) {
          var du = "oninput" in document;
          if (!du) {
              var Hh = document.createElement("div");
              Hh.setAttribute("oninput", "return;"), (du = typeof Hh.oninput == "function");
          }
          fu = du;
      } else fu = !1;
      Uh = fu && (!document.documentMode || 9 < document.documentMode);
  }
  function Wh() {
      bs && (bs.detachEvent("onpropertychange", qh), (Cs = bs = null));
  }
  function qh(n) {
      if (n.propertyName === "value" && Qo(Cs)) {
          var r = [];
          $h(r, Cs, n, Wl(n)), dh(o1, r);
      }
  }
  function l1(n, r, a) {
      n === "focusin" ? (Wh(), (bs = r), (Cs = a), bs.attachEvent("onpropertychange", qh)) : n === "focusout" && Wh();
  }
  function u1(n) {
      if (n === "selectionchange" || n === "keyup" || n === "keydown") return Qo(Cs);
  }
  function c1(n, r) {
      if (n === "click") return Qo(r);
  }
  function f1(n, r) {
      if (n === "input" || n === "change") return Qo(r);
  }
  function d1(n, r) {
      return (n === r && (n !== 0 || 1 / n === 1 / r)) || (n !== n && r !== r);
  }
  var tn = typeof Object.is == "function" ? Object.is : d1;
  function ks(n, r) {
      if (tn(n, r)) return !0;
      if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
      var a = Object.keys(n),
          f = Object.keys(r);
      if (a.length !== f.length) return !1;
      for (f = 0; f < a.length; f++) {
          var p = a[f];
          if (!d.call(r, p) || !tn(n[p], r[p])) return !1;
      }
      return !0;
  }
  function Kh(n) {
      for (; n && n.firstChild; ) n = n.firstChild;
      return n;
  }
  function Gh(n, r) {
      var a = Kh(n);
      n = 0;
      for (var f; a; ) {
          if (a.nodeType === 3) {
              if (((f = n + a.textContent.length), n <= r && f >= r)) return { node: a, offset: r - n };
              n = f;
          }
          e: {
              for (; a; ) {
                  if (a.nextSibling) {
                      a = a.nextSibling;
                      break e;
                  }
                  a = a.parentNode;
              }
              a = void 0;
          }
          a = Kh(a);
      }
  }
  function Yh(n, r) {
      return n && r ? (n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Yh(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1) : !1;
  }
  function Qh() {
      for (var n = window, r = Do(); r instanceof n.HTMLIFrameElement; ) {
          try {
              var a = typeof r.contentWindow.location.href == "string";
          } catch {
              a = !1;
          }
          if (a) n = r.contentWindow;
          else break;
          r = Do(n.document);
      }
      return r;
  }
  function hu(n) {
      var r = n && n.nodeName && n.nodeName.toLowerCase();
      return r && ((r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password")) || r === "textarea" || n.contentEditable === "true");
  }
  function h1(n) {
      var r = Qh(),
          a = n.focusedElem,
          f = n.selectionRange;
      if (r !== a && a && a.ownerDocument && Yh(a.ownerDocument.documentElement, a)) {
          if (f !== null && hu(a)) {
              if (((r = f.start), (n = f.end), n === void 0 && (n = r), "selectionStart" in a)) (a.selectionStart = r), (a.selectionEnd = Math.min(n, a.value.length));
              else if (((n = ((r = a.ownerDocument || document) && r.defaultView) || window), n.getSelection)) {
                  n = n.getSelection();
                  var p = a.textContent.length,
                      g = Math.min(f.start, p);
                  (f = f.end === void 0 ? g : Math.min(f.end, p)), !n.extend && g > f && ((p = f), (f = g), (g = p)), (p = Gh(a, g));
                  var x = Gh(a, f);
                  p &&
                      x &&
                      (n.rangeCount !== 1 || n.anchorNode !== p.node || n.anchorOffset !== p.offset || n.focusNode !== x.node || n.focusOffset !== x.offset) &&
                      ((r = r.createRange()), r.setStart(p.node, p.offset), n.removeAllRanges(), g > f ? (n.addRange(r), n.extend(x.node, x.offset)) : (r.setEnd(x.node, x.offset), n.addRange(r)));
              }
          }
          for (r = [], n = a; (n = n.parentNode); ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
          for (typeof a.focus == "function" && a.focus(), a = 0; a < r.length; a++) (n = r[a]), (n.element.scrollLeft = n.left), (n.element.scrollTop = n.top);
      }
  }
  var p1 = c && "documentMode" in document && 11 >= document.documentMode,
      cr = null,
      pu = null,
      Ps = null,
      mu = !1;
  function Xh(n, r, a) {
      var f = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      mu ||
          cr == null ||
          cr !== Do(f) ||
          ((f = cr),
          "selectionStart" in f && hu(f)
              ? (f = { start: f.selectionStart, end: f.selectionEnd })
              : ((f = ((f.ownerDocument && f.ownerDocument.defaultView) || window).getSelection()), (f = { anchorNode: f.anchorNode, anchorOffset: f.anchorOffset, focusNode: f.focusNode, focusOffset: f.focusOffset })),
          (Ps && ks(Ps, f)) || ((Ps = f), (f = ea(pu, "onSelect")), 0 < f.length && ((r = new su("onSelect", "select", null, r, a)), n.push({ event: r, listeners: f }), (r.target = cr))));
  }
  function Xo(n, r) {
      var a = {};
      return (a[n.toLowerCase()] = r.toLowerCase()), (a["Webkit" + n] = "webkit" + r), (a["Moz" + n] = "moz" + r), a;
  }
  var fr = { animationend: Xo("Animation", "AnimationEnd"), animationiteration: Xo("Animation", "AnimationIteration"), animationstart: Xo("Animation", "AnimationStart"), transitionend: Xo("Transition", "TransitionEnd") },
      gu = {},
      Zh = {};
  c &&
      ((Zh = document.createElement("div").style),
      "AnimationEvent" in window || (delete fr.animationend.animation, delete fr.animationiteration.animation, delete fr.animationstart.animation),
      "TransitionEvent" in window || delete fr.transitionend.transition);
  function Zo(n) {
      if (gu[n]) return gu[n];
      if (!fr[n]) return n;
      var r = fr[n],
          a;
      for (a in r) if (r.hasOwnProperty(a) && a in Zh) return (gu[n] = r[a]);
      return n;
  }
  var Jh = Zo("animationend"),
      ep = Zo("animationiteration"),
      tp = Zo("animationstart"),
      np = Zo("transitionend"),
      ip = new Map(),
      rp = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
          " "
      );
  function Xn(n, r) {
      ip.set(n, r), l(r, [n]);
  }
  for (var yu = 0; yu < rp.length; yu++) {
      var vu = rp[yu],
          m1 = vu.toLowerCase(),
          g1 = vu[0].toUpperCase() + vu.slice(1);
      Xn(m1, "on" + g1);
  }
  Xn(Jh, "onAnimationEnd"),
      Xn(ep, "onAnimationIteration"),
      Xn(tp, "onAnimationStart"),
      Xn("dblclick", "onDoubleClick"),
      Xn("focusin", "onFocus"),
      Xn("focusout", "onBlur"),
      Xn(np, "onTransitionEnd"),
      u("onMouseEnter", ["mouseout", "mouseover"]),
      u("onMouseLeave", ["mouseout", "mouseover"]),
      u("onPointerEnter", ["pointerout", "pointerover"]),
      u("onPointerLeave", ["pointerout", "pointerover"]),
      l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
      l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
      l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
      l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
      l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
      l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Ts = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
          " "
      ),
      y1 = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ts));
  function sp(n, r, a) {
      var f = n.type || "unknown-event";
      (n.currentTarget = a), mw(f, r, void 0, n), (n.currentTarget = null);
  }
  function op(n, r) {
      r = (r & 4) !== 0;
      for (var a = 0; a < n.length; a++) {
          var f = n[a],
              p = f.event;
          f = f.listeners;
          e: {
              var g = void 0;
              if (r)
                  for (var x = f.length - 1; 0 <= x; x--) {
                      var T = f[x],
                          _ = T.instance,
                          j = T.currentTarget;
                      if (((T = T.listener), _ !== g && p.isPropagationStopped())) break e;
                      sp(p, T, j), (g = _);
                  }
              else
                  for (x = 0; x < f.length; x++) {
                      if (((T = f[x]), (_ = T.instance), (j = T.currentTarget), (T = T.listener), _ !== g && p.isPropagationStopped())) break e;
                      sp(p, T, j), (g = _);
                  }
          }
      }
      if (jo) throw ((n = Yl), (jo = !1), (Yl = null), n);
  }
  function Re(n, r) {
      var a = r[Tu];
      a === void 0 && (a = r[Tu] = new Set());
      var f = n + "__bubble";
      a.has(f) || (ap(r, n, 2, !1), a.add(f));
  }
  function xu(n, r, a) {
      var f = 0;
      r && (f |= 4), ap(a, n, f, r);
  }
  var Jo = "_reactListening" + Math.random().toString(36).slice(2);
  function Es(n) {
      if (!n[Jo]) {
          (n[Jo] = !0),
              s.forEach(function (a) {
                  a !== "selectionchange" && (y1.has(a) || xu(a, !1, n), xu(a, !0, n));
              });
          var r = n.nodeType === 9 ? n : n.ownerDocument;
          r === null || r[Jo] || ((r[Jo] = !0), xu("selectionchange", !1, r));
      }
  }
  function ap(n, r, a, f) {
      switch (Mh(r)) {
          case 1:
              var p = Aw;
              break;
          case 4:
              p = Ow;
              break;
          default:
              p = nu;
      }
      (a = p.bind(null, r, a, n)),
          (p = void 0),
          !Gl || (r !== "touchstart" && r !== "touchmove" && r !== "wheel") || (p = !0),
          f ? (p !== void 0 ? n.addEventListener(r, a, { capture: !0, passive: p }) : n.addEventListener(r, a, !0)) : p !== void 0 ? n.addEventListener(r, a, { passive: p }) : n.addEventListener(r, a, !1);
  }
  function wu(n, r, a, f, p) {
      var g = f;
      if (!(r & 1) && !(r & 2) && f !== null)
          e: for (;;) {
              if (f === null) return;
              var x = f.tag;
              if (x === 3 || x === 4) {
                  var T = f.stateNode.containerInfo;
                  if (T === p || (T.nodeType === 8 && T.parentNode === p)) break;
                  if (x === 4)
                      for (x = f.return; x !== null; ) {
                          var _ = x.tag;
                          if ((_ === 3 || _ === 4) && ((_ = x.stateNode.containerInfo), _ === p || (_.nodeType === 8 && _.parentNode === p))) return;
                          x = x.return;
                      }
                  for (; T !== null; ) {
                      if (((x = Ci(T)), x === null)) return;
                      if (((_ = x.tag), _ === 5 || _ === 6)) {
                          f = g = x;
                          continue e;
                      }
                      T = T.parentNode;
                  }
              }
              f = f.return;
          }
      dh(function () {
          var j = g,
              B = Wl(a),
              $ = [];
          e: {
              var V = ip.get(n);
              if (V !== void 0) {
                  var Y = su,
                      Z = n;
                  switch (n) {
                      case "keypress":
                          if (Ko(a) === 0) break e;
                      case "keydown":
                      case "keyup":
                          Y = Kw;
                          break;
                      case "focusin":
                          (Z = "focus"), (Y = lu);
                          break;
                      case "focusout":
                          (Z = "blur"), (Y = lu);
                          break;
                      case "beforeblur":
                      case "afterblur":
                          Y = lu;
                          break;
                      case "click":
                          if (a.button === 2) break e;
                      case "auxclick":
                      case "dblclick":
                      case "mousedown":
                      case "mousemove":
                      case "mouseup":
                      case "mouseout":
                      case "mouseover":
                      case "contextmenu":
                          Y = Dh;
                          break;
                      case "drag":
                      case "dragend":
                      case "dragenter":
                      case "dragexit":
                      case "dragleave":
                      case "dragover":
                      case "dragstart":
                      case "drop":
                          Y = Iw;
                          break;
                      case "touchcancel":
                      case "touchend":
                      case "touchmove":
                      case "touchstart":
                          Y = Qw;
                          break;
                      case Jh:
                      case ep:
                      case tp:
                          Y = Nw;
                          break;
                      case np:
                          Y = Zw;
                          break;
                      case "scroll":
                          Y = Dw;
                          break;
                      case "wheel":
                          Y = e1;
                          break;
                      case "copy":
                      case "cut":
                      case "paste":
                          Y = Vw;
                          break;
                      case "gotpointercapture":
                      case "lostpointercapture":
                      case "pointercancel":
                      case "pointerdown":
                      case "pointermove":
                      case "pointerout":
                      case "pointerover":
                      case "pointerup":
                          Y = Ih;
                  }
                  var J = (r & 4) !== 0,
                      qe = !J && n === "scroll",
                      O = J ? (V !== null ? V + "Capture" : null) : V;
                  J = [];
                  for (var R = j, L; R !== null; ) {
                      L = R;
                      var H = L.stateNode;
                      if ((L.tag === 5 && H !== null && ((L = H), O !== null && ((H = us(R, O)), H != null && J.push(_s(R, H, L)))), qe)) break;
                      R = R.return;
                  }
                  0 < J.length && ((V = new Y(V, Z, null, a, B)), $.push({ event: V, listeners: J }));
              }
          }
          if (!(r & 7)) {
              e: {
                  if (((V = n === "mouseover" || n === "pointerover"), (Y = n === "mouseout" || n === "pointerout"), V && a !== Hl && (Z = a.relatedTarget || a.fromElement) && (Ci(Z) || Z[Dn]))) break e;
                  if (
                      (Y || V) &&
                      ((V = B.window === B ? B : (V = B.ownerDocument) ? V.defaultView || V.parentWindow : window),
                      Y ? ((Z = a.relatedTarget || a.toElement), (Y = j), (Z = Z ? Ci(Z) : null), Z !== null && ((qe = bi(Z)), Z !== qe || (Z.tag !== 5 && Z.tag !== 6)) && (Z = null)) : ((Y = null), (Z = j)),
                      Y !== Z)
                  ) {
                      if (
                          ((J = Dh),
                          (H = "onMouseLeave"),
                          (O = "onMouseEnter"),
                          (R = "mouse"),
                          (n === "pointerout" || n === "pointerover") && ((J = Ih), (H = "onPointerLeave"), (O = "onPointerEnter"), (R = "pointer")),
                          (qe = Y == null ? V : pr(Y)),
                          (L = Z == null ? V : pr(Z)),
                          (V = new J(H, R + "leave", Y, a, B)),
                          (V.target = qe),
                          (V.relatedTarget = L),
                          (H = null),
                          Ci(B) === j && ((J = new J(O, R + "enter", Z, a, B)), (J.target = L), (J.relatedTarget = qe), (H = J)),
                          (qe = H),
                          Y && Z)
                      )
                          t: {
                              for (J = Y, O = Z, R = 0, L = J; L; L = dr(L)) R++;
                              for (L = 0, H = O; H; H = dr(H)) L++;
                              for (; 0 < R - L; ) (J = dr(J)), R--;
                              for (; 0 < L - R; ) (O = dr(O)), L--;
                              for (; R--; ) {
                                  if (J === O || (O !== null && J === O.alternate)) break t;
                                  (J = dr(J)), (O = dr(O));
                              }
                              J = null;
                          }
                      else J = null;
                      Y !== null && lp($, V, Y, J, !1), Z !== null && qe !== null && lp($, qe, Z, J, !0);
                  }
              }
              e: {
                  if (((V = j ? pr(j) : window), (Y = V.nodeName && V.nodeName.toLowerCase()), Y === "select" || (Y === "input" && V.type === "file"))) var ee = a1;
                  else if (Bh(V))
                      if (Uh) ee = f1;
                      else {
                          ee = u1;
                          var re = l1;
                      }
                  else (Y = V.nodeName) && Y.toLowerCase() === "input" && (V.type === "checkbox" || V.type === "radio") && (ee = c1);
                  if (ee && (ee = ee(n, j))) {
                      $h($, ee, a, B);
                      break e;
                  }
                  re && re(n, V, j), n === "focusout" && (re = V._wrapperState) && re.controlled && V.type === "number" && Fl(V, "number", V.value);
              }
              switch (((re = j ? pr(j) : window), n)) {
                  case "focusin":
                      (Bh(re) || re.contentEditable === "true") && ((cr = re), (pu = j), (Ps = null));
                      break;
                  case "focusout":
                      Ps = pu = cr = null;
                      break;
                  case "mousedown":
                      mu = !0;
                      break;
                  case "contextmenu":
                  case "mouseup":
                  case "dragend":
                      (mu = !1), Xh($, a, B);
                      break;
                  case "selectionchange":
                      if (p1) break;
                  case "keydown":
                  case "keyup":
                      Xh($, a, B);
              }
              var se;
              if (cu)
                  e: {
                      switch (n) {
                          case "compositionstart":
                              var le = "onCompositionStart";
                              break e;
                          case "compositionend":
                              le = "onCompositionEnd";
                              break e;
                          case "compositionupdate":
                              le = "onCompositionUpdate";
                              break e;
                      }
                      le = void 0;
                  }
              else ur ? Fh(n, a) && (le = "onCompositionEnd") : n === "keydown" && a.keyCode === 229 && (le = "onCompositionStart");
              le &&
                  (jh && a.locale !== "ko" && (ur || le !== "onCompositionStart" ? le === "onCompositionEnd" && ur && (se = Ah()) : ((Qn = B), (ru = "value" in Qn ? Qn.value : Qn.textContent), (ur = !0))),
                  (re = ea(j, le)),
                  0 < re.length && ((le = new Lh(le, n, null, a, B)), $.push({ event: le, listeners: re }), se ? (le.data = se) : ((se = Vh(a)), se !== null && (le.data = se)))),
                  (se = n1 ? i1(n, a) : r1(n, a)) && ((j = ea(j, "onBeforeInput")), 0 < j.length && ((B = new Lh("onBeforeInput", "beforeinput", null, a, B)), $.push({ event: B, listeners: j }), (B.data = se)));
          }
          op($, r);
      });
  }
  function _s(n, r, a) {
      return { instance: n, listener: r, currentTarget: a };
  }
  function ea(n, r) {
      for (var a = r + "Capture", f = []; n !== null; ) {
          var p = n,
              g = p.stateNode;
          p.tag === 5 && g !== null && ((p = g), (g = us(n, a)), g != null && f.unshift(_s(n, g, p)), (g = us(n, r)), g != null && f.push(_s(n, g, p))), (n = n.return);
      }
      return f;
  }
  function dr(n) {
      if (n === null) return null;
      do n = n.return;
      while (n && n.tag !== 5);
      return n || null;
  }
  function lp(n, r, a, f, p) {
      for (var g = r._reactName, x = []; a !== null && a !== f; ) {
          var T = a,
              _ = T.alternate,
              j = T.stateNode;
          if (_ !== null && _ === f) break;
          T.tag === 5 && j !== null && ((T = j), p ? ((_ = us(a, g)), _ != null && x.unshift(_s(a, _, T))) : p || ((_ = us(a, g)), _ != null && x.push(_s(a, _, T)))), (a = a.return);
      }
      x.length !== 0 && n.push({ event: r, listeners: x });
  }
  var v1 = /\r\n?/g,
      x1 = /\u0000|\uFFFD/g;
  function up(n) {
      return (typeof n == "string" ? n : "" + n)
          .replace(
              v1,
              `
`
          )
          .replace(x1, "");
  }
  function ta(n, r, a) {
      if (((r = up(r)), up(n) !== r && a)) throw Error(i(425));
  }
  function na() {}
  var Su = null,
      bu = null;
  function Cu(n, r) {
      return (
          n === "textarea" ||
          n === "noscript" ||
          typeof r.children == "string" ||
          typeof r.children == "number" ||
          (typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null)
      );
  }
  var ku = typeof setTimeout == "function" ? setTimeout : void 0,
      w1 = typeof clearTimeout == "function" ? clearTimeout : void 0,
      cp = typeof Promise == "function" ? Promise : void 0,
      S1 =
          typeof queueMicrotask == "function"
              ? queueMicrotask
              : typeof cp < "u"
              ? function (n) {
                    return cp.resolve(null).then(n).catch(b1);
                }
              : ku;
  function b1(n) {
      setTimeout(function () {
          throw n;
      });
  }
  function Pu(n, r) {
      var a = r,
          f = 0;
      do {
          var p = a.nextSibling;
          if ((n.removeChild(a), p && p.nodeType === 8))
              if (((a = p.data), a === "/$")) {
                  if (f === 0) {
                      n.removeChild(p), vs(r);
                      return;
                  }
                  f--;
              } else (a !== "$" && a !== "$?" && a !== "$!") || f++;
          a = p;
      } while (a);
      vs(r);
  }
  function Zn(n) {
      for (; n != null; n = n.nextSibling) {
          var r = n.nodeType;
          if (r === 1 || r === 3) break;
          if (r === 8) {
              if (((r = n.data), r === "$" || r === "$!" || r === "$?")) break;
              if (r === "/$") return null;
          }
      }
      return n;
  }
  function fp(n) {
      n = n.previousSibling;
      for (var r = 0; n; ) {
          if (n.nodeType === 8) {
              var a = n.data;
              if (a === "$" || a === "$!" || a === "$?") {
                  if (r === 0) return n;
                  r--;
              } else a === "/$" && r++;
          }
          n = n.previousSibling;
      }
      return null;
  }
  var hr = Math.random().toString(36).slice(2),
      xn = "__reactFiber$" + hr,
      Rs = "__reactProps$" + hr,
      Dn = "__reactContainer$" + hr,
      Tu = "__reactEvents$" + hr,
      C1 = "__reactListeners$" + hr,
      k1 = "__reactHandles$" + hr;
  function Ci(n) {
      var r = n[xn];
      if (r) return r;
      for (var a = n.parentNode; a; ) {
          if ((r = a[Dn] || a[xn])) {
              if (((a = r.alternate), r.child !== null || (a !== null && a.child !== null)))
                  for (n = fp(n); n !== null; ) {
                      if ((a = n[xn])) return a;
                      n = fp(n);
                  }
              return r;
          }
          (n = a), (a = n.parentNode);
      }
      return null;
  }
  function Ms(n) {
      return (n = n[xn] || n[Dn]), !n || (n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3) ? null : n;
  }
  function pr(n) {
      if (n.tag === 5 || n.tag === 6) return n.stateNode;
      throw Error(i(33));
  }
  function ia(n) {
      return n[Rs] || null;
  }
  var Eu = [],
      mr = -1;
  function Jn(n) {
      return { current: n };
  }
  function Me(n) {
      0 > mr || ((n.current = Eu[mr]), (Eu[mr] = null), mr--);
  }
  function Ee(n, r) {
      mr++, (Eu[mr] = n.current), (n.current = r);
  }
  var ei = {},
      ct = Jn(ei),
      Ct = Jn(!1),
      ki = ei;
  function gr(n, r) {
      var a = n.type.contextTypes;
      if (!a) return ei;
      var f = n.stateNode;
      if (f && f.__reactInternalMemoizedUnmaskedChildContext === r) return f.__reactInternalMemoizedMaskedChildContext;
      var p = {},
          g;
      for (g in a) p[g] = r[g];
      return f && ((n = n.stateNode), (n.__reactInternalMemoizedUnmaskedChildContext = r), (n.__reactInternalMemoizedMaskedChildContext = p)), p;
  }
  function kt(n) {
      return (n = n.childContextTypes), n != null;
  }
  function ra() {
      Me(Ct), Me(ct);
  }
  function dp(n, r, a) {
      if (ct.current !== ei) throw Error(i(168));
      Ee(ct, r), Ee(Ct, a);
  }
  function hp(n, r, a) {
      var f = n.stateNode;
      if (((r = r.childContextTypes), typeof f.getChildContext != "function")) return a;
      f = f.getChildContext();
      for (var p in f) if (!(p in r)) throw Error(i(108, Ce(n) || "Unknown", p));
      return G({}, a, f);
  }
  function sa(n) {
      return (n = ((n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext) || ei), (ki = ct.current), Ee(ct, n), Ee(Ct, Ct.current), !0;
  }
  function pp(n, r, a) {
      var f = n.stateNode;
      if (!f) throw Error(i(169));
      a ? ((n = hp(n, r, ki)), (f.__reactInternalMemoizedMergedChildContext = n), Me(Ct), Me(ct), Ee(ct, n)) : Me(Ct), Ee(Ct, a);
  }
  var Ln = null,
      oa = !1,
      _u = !1;
  function mp(n) {
      Ln === null ? (Ln = [n]) : Ln.push(n);
  }
  function P1(n) {
      (oa = !0), mp(n);
  }
  function ti() {
      if (!_u && Ln !== null) {
          _u = !0;
          var n = 0,
              r = Pe;
          try {
              var a = Ln;
              for (Pe = 1; n < a.length; n++) {
                  var f = a[n];
                  do f = f(!0);
                  while (f !== null);
              }
              (Ln = null), (oa = !1);
          } catch (p) {
              throw (Ln !== null && (Ln = Ln.slice(n + 1)), yh(Ql, ti), p);
          } finally {
              (Pe = r), (_u = !1);
          }
      }
      return null;
  }
  var yr = [],
      vr = 0,
      aa = null,
      la = 0,
      Bt = [],
      $t = 0,
      Pi = null,
      In = 1,
      jn = "";
  function Ti(n, r) {
      (yr[vr++] = la), (yr[vr++] = aa), (aa = n), (la = r);
  }
  function gp(n, r, a) {
      (Bt[$t++] = In), (Bt[$t++] = jn), (Bt[$t++] = Pi), (Pi = n);
      var f = In;
      n = jn;
      var p = 32 - en(f) - 1;
      (f &= ~(1 << p)), (a += 1);
      var g = 32 - en(r) + p;
      if (30 < g) {
          var x = p - (p % 5);
          (g = (f & ((1 << x) - 1)).toString(32)), (f >>= x), (p -= x), (In = (1 << (32 - en(r) + p)) | (a << p) | f), (jn = g + n);
      } else (In = (1 << g) | (a << p) | f), (jn = n);
  }
  function Ru(n) {
      n.return !== null && (Ti(n, 1), gp(n, 1, 0));
  }
  function Mu(n) {
      for (; n === aa; ) (aa = yr[--vr]), (yr[vr] = null), (la = yr[--vr]), (yr[vr] = null);
      for (; n === Pi; ) (Pi = Bt[--$t]), (Bt[$t] = null), (jn = Bt[--$t]), (Bt[$t] = null), (In = Bt[--$t]), (Bt[$t] = null);
  }
  var Dt = null,
      Lt = null,
      De = !1,
      nn = null;
  function yp(n, r) {
      var a = qt(5, null, null, 0);
      (a.elementType = "DELETED"), (a.stateNode = r), (a.return = n), (r = n.deletions), r === null ? ((n.deletions = [a]), (n.flags |= 16)) : r.push(a);
  }
  function vp(n, r) {
      switch (n.tag) {
          case 5:
              var a = n.type;
              return (r = r.nodeType !== 1 || a.toLowerCase() !== r.nodeName.toLowerCase() ? null : r), r !== null ? ((n.stateNode = r), (Dt = n), (Lt = Zn(r.firstChild)), !0) : !1;
          case 6:
              return (r = n.pendingProps === "" || r.nodeType !== 3 ? null : r), r !== null ? ((n.stateNode = r), (Dt = n), (Lt = null), !0) : !1;
          case 13:
              return (
                  (r = r.nodeType !== 8 ? null : r),
                  r !== null
                      ? ((a = Pi !== null ? { id: In, overflow: jn } : null),
                        (n.memoizedState = { dehydrated: r, treeContext: a, retryLane: 1073741824 }),
                        (a = qt(18, null, null, 0)),
                        (a.stateNode = r),
                        (a.return = n),
                        (n.child = a),
                        (Dt = n),
                        (Lt = null),
                        !0)
                      : !1
              );
          default:
              return !1;
      }
  }
  function Au(n) {
      return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Ou(n) {
      if (De) {
          var r = Lt;
          if (r) {
              var a = r;
              if (!vp(n, r)) {
                  if (Au(n)) throw Error(i(418));
                  r = Zn(a.nextSibling);
                  var f = Dt;
                  r && vp(n, r) ? yp(f, a) : ((n.flags = (n.flags & -4097) | 2), (De = !1), (Dt = n));
              }
          } else {
              if (Au(n)) throw Error(i(418));
              (n.flags = (n.flags & -4097) | 2), (De = !1), (Dt = n);
          }
      }
  }
  function xp(n) {
      for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
      Dt = n;
  }
  function ua(n) {
      if (n !== Dt) return !1;
      if (!De) return xp(n), (De = !0), !1;
      var r;
      if (((r = n.tag !== 3) && !(r = n.tag !== 5) && ((r = n.type), (r = r !== "head" && r !== "body" && !Cu(n.type, n.memoizedProps))), r && (r = Lt))) {
          if (Au(n)) throw (wp(), Error(i(418)));
          for (; r; ) yp(n, r), (r = Zn(r.nextSibling));
      }
      if ((xp(n), n.tag === 13)) {
          if (((n = n.memoizedState), (n = n !== null ? n.dehydrated : null), !n)) throw Error(i(317));
          e: {
              for (n = n.nextSibling, r = 0; n; ) {
                  if (n.nodeType === 8) {
                      var a = n.data;
                      if (a === "/$") {
                          if (r === 0) {
                              Lt = Zn(n.nextSibling);
                              break e;
                          }
                          r--;
                      } else (a !== "$" && a !== "$!" && a !== "$?") || r++;
                  }
                  n = n.nextSibling;
              }
              Lt = null;
          }
      } else Lt = Dt ? Zn(n.stateNode.nextSibling) : null;
      return !0;
  }
  function wp() {
      for (var n = Lt; n; ) n = Zn(n.nextSibling);
  }
  function xr() {
      (Lt = Dt = null), (De = !1);
  }
  function Du(n) {
      nn === null ? (nn = [n]) : nn.push(n);
  }
  var T1 = I.ReactCurrentBatchConfig;
  function As(n, r, a) {
      if (((n = a.ref), n !== null && typeof n != "function" && typeof n != "object")) {
          if (a._owner) {
              if (((a = a._owner), a)) {
                  if (a.tag !== 1) throw Error(i(309));
                  var f = a.stateNode;
              }
              if (!f) throw Error(i(147, n));
              var p = f,
                  g = "" + n;
              return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === g
                  ? r.ref
                  : ((r = function (x) {
                        var T = p.refs;
                        x === null ? delete T[g] : (T[g] = x);
                    }),
                    (r._stringRef = g),
                    r);
          }
          if (typeof n != "string") throw Error(i(284));
          if (!a._owner) throw Error(i(290, n));
      }
      return n;
  }
  function ca(n, r) {
      throw ((n = Object.prototype.toString.call(r)), Error(i(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n)));
  }
  function Sp(n) {
      var r = n._init;
      return r(n._payload);
  }
  function bp(n) {
      function r(O, R) {
          if (n) {
              var L = O.deletions;
              L === null ? ((O.deletions = [R]), (O.flags |= 16)) : L.push(R);
          }
      }
      function a(O, R) {
          if (!n) return null;
          for (; R !== null; ) r(O, R), (R = R.sibling);
          return null;
      }
      function f(O, R) {
          for (O = new Map(); R !== null; ) R.key !== null ? O.set(R.key, R) : O.set(R.index, R), (R = R.sibling);
          return O;
      }
      function p(O, R) {
          return (O = ui(O, R)), (O.index = 0), (O.sibling = null), O;
      }
      function g(O, R, L) {
          return (O.index = L), n ? ((L = O.alternate), L !== null ? ((L = L.index), L < R ? ((O.flags |= 2), R) : L) : ((O.flags |= 2), R)) : ((O.flags |= 1048576), R);
      }
      function x(O) {
          return n && O.alternate === null && (O.flags |= 2), O;
      }
      function T(O, R, L, H) {
          return R === null || R.tag !== 6 ? ((R = kc(L, O.mode, H)), (R.return = O), R) : ((R = p(R, L)), (R.return = O), R);
      }
      function _(O, R, L, H) {
          var ee = L.type;
          return ee === Q
              ? B(O, R, L.props.children, H, L.key)
              : R !== null && (R.elementType === ee || (typeof ee == "object" && ee !== null && ee.$$typeof === st && Sp(ee) === R.type))
              ? ((H = p(R, L.props)), (H.ref = As(O, R, L)), (H.return = O), H)
              : ((H = La(L.type, L.key, L.props, null, O.mode, H)), (H.ref = As(O, R, L)), (H.return = O), H);
      }
      function j(O, R, L, H) {
          return R === null || R.tag !== 4 || R.stateNode.containerInfo !== L.containerInfo || R.stateNode.implementation !== L.implementation
              ? ((R = Pc(L, O.mode, H)), (R.return = O), R)
              : ((R = p(R, L.children || [])), (R.return = O), R);
      }
      function B(O, R, L, H, ee) {
          return R === null || R.tag !== 7 ? ((R = Li(L, O.mode, H, ee)), (R.return = O), R) : ((R = p(R, L)), (R.return = O), R);
      }
      function $(O, R, L) {
          if ((typeof R == "string" && R !== "") || typeof R == "number") return (R = kc("" + R, O.mode, L)), (R.return = O), R;
          if (typeof R == "object" && R !== null) {
              switch (R.$$typeof) {
                  case z:
                      return (L = La(R.type, R.key, R.props, null, O.mode, L)), (L.ref = As(O, null, R)), (L.return = O), L;
                  case N:
                      return (R = Pc(R, O.mode, L)), (R.return = O), R;
                  case st:
                      var H = R._init;
                      return $(O, H(R._payload), L);
              }
              if (os(R) || te(R)) return (R = Li(R, O.mode, L, null)), (R.return = O), R;
              ca(O, R);
          }
          return null;
      }
      function V(O, R, L, H) {
          var ee = R !== null ? R.key : null;
          if ((typeof L == "string" && L !== "") || typeof L == "number") return ee !== null ? null : T(O, R, "" + L, H);
          if (typeof L == "object" && L !== null) {
              switch (L.$$typeof) {
                  case z:
                      return L.key === ee ? _(O, R, L, H) : null;
                  case N:
                      return L.key === ee ? j(O, R, L, H) : null;
                  case st:
                      return (ee = L._init), V(O, R, ee(L._payload), H);
              }
              if (os(L) || te(L)) return ee !== null ? null : B(O, R, L, H, null);
              ca(O, L);
          }
          return null;
      }
      function Y(O, R, L, H, ee) {
          if ((typeof H == "string" && H !== "") || typeof H == "number") return (O = O.get(L) || null), T(R, O, "" + H, ee);
          if (typeof H == "object" && H !== null) {
              switch (H.$$typeof) {
                  case z:
                      return (O = O.get(H.key === null ? L : H.key) || null), _(R, O, H, ee);
                  case N:
                      return (O = O.get(H.key === null ? L : H.key) || null), j(R, O, H, ee);
                  case st:
                      var re = H._init;
                      return Y(O, R, L, re(H._payload), ee);
              }
              if (os(H) || te(H)) return (O = O.get(L) || null), B(R, O, H, ee, null);
              ca(R, H);
          }
          return null;
      }
      function Z(O, R, L, H) {
          for (var ee = null, re = null, se = R, le = (R = 0), nt = null; se !== null && le < L.length; le++) {
              se.index > le ? ((nt = se), (se = null)) : (nt = se.sibling);
              var Se = V(O, se, L[le], H);
              if (Se === null) {
                  se === null && (se = nt);
                  break;
              }
              n && se && Se.alternate === null && r(O, se), (R = g(Se, R, le)), re === null ? (ee = Se) : (re.sibling = Se), (re = Se), (se = nt);
          }
          if (le === L.length) return a(O, se), De && Ti(O, le), ee;
          if (se === null) {
              for (; le < L.length; le++) (se = $(O, L[le], H)), se !== null && ((R = g(se, R, le)), re === null ? (ee = se) : (re.sibling = se), (re = se));
              return De && Ti(O, le), ee;
          }
          for (se = f(O, se); le < L.length; le++)
              (nt = Y(se, O, le, L[le], H)), nt !== null && (n && nt.alternate !== null && se.delete(nt.key === null ? le : nt.key), (R = g(nt, R, le)), re === null ? (ee = nt) : (re.sibling = nt), (re = nt));
          return (
              n &&
                  se.forEach(function (ci) {
                      return r(O, ci);
                  }),
              De && Ti(O, le),
              ee
          );
      }
      function J(O, R, L, H) {
          var ee = te(L);
          if (typeof ee != "function") throw Error(i(150));
          if (((L = ee.call(L)), L == null)) throw Error(i(151));
          for (var re = (ee = null), se = R, le = (R = 0), nt = null, Se = L.next(); se !== null && !Se.done; le++, Se = L.next()) {
              se.index > le ? ((nt = se), (se = null)) : (nt = se.sibling);
              var ci = V(O, se, Se.value, H);
              if (ci === null) {
                  se === null && (se = nt);
                  break;
              }
              n && se && ci.alternate === null && r(O, se), (R = g(ci, R, le)), re === null ? (ee = ci) : (re.sibling = ci), (re = ci), (se = nt);
          }
          if (Se.done) return a(O, se), De && Ti(O, le), ee;
          if (se === null) {
              for (; !Se.done; le++, Se = L.next()) (Se = $(O, Se.value, H)), Se !== null && ((R = g(Se, R, le)), re === null ? (ee = Se) : (re.sibling = Se), (re = Se));
              return De && Ti(O, le), ee;
          }
          for (se = f(O, se); !Se.done; le++, Se = L.next())
              (Se = Y(se, O, le, Se.value, H)), Se !== null && (n && Se.alternate !== null && se.delete(Se.key === null ? le : Se.key), (R = g(Se, R, le)), re === null ? (ee = Se) : (re.sibling = Se), (re = Se));
          return (
              n &&
                  se.forEach(function (rS) {
                      return r(O, rS);
                  }),
              De && Ti(O, le),
              ee
          );
      }
      function qe(O, R, L, H) {
          if ((typeof L == "object" && L !== null && L.type === Q && L.key === null && (L = L.props.children), typeof L == "object" && L !== null)) {
              switch (L.$$typeof) {
                  case z:
                      e: {
                          for (var ee = L.key, re = R; re !== null; ) {
                              if (re.key === ee) {
                                  if (((ee = L.type), ee === Q)) {
                                      if (re.tag === 7) {
                                          a(O, re.sibling), (R = p(re, L.props.children)), (R.return = O), (O = R);
                                          break e;
                                      }
                                  } else if (re.elementType === ee || (typeof ee == "object" && ee !== null && ee.$$typeof === st && Sp(ee) === re.type)) {
                                      a(O, re.sibling), (R = p(re, L.props)), (R.ref = As(O, re, L)), (R.return = O), (O = R);
                                      break e;
                                  }
                                  a(O, re);
                                  break;
                              } else r(O, re);
                              re = re.sibling;
                          }
                          L.type === Q ? ((R = Li(L.props.children, O.mode, H, L.key)), (R.return = O), (O = R)) : ((H = La(L.type, L.key, L.props, null, O.mode, H)), (H.ref = As(O, R, L)), (H.return = O), (O = H));
                      }
                      return x(O);
                  case N:
                      e: {
                          for (re = L.key; R !== null; ) {
                              if (R.key === re)
                                  if (R.tag === 4 && R.stateNode.containerInfo === L.containerInfo && R.stateNode.implementation === L.implementation) {
                                      a(O, R.sibling), (R = p(R, L.children || [])), (R.return = O), (O = R);
                                      break e;
                                  } else {
                                      a(O, R);
                                      break;
                                  }
                              else r(O, R);
                              R = R.sibling;
                          }
                          (R = Pc(L, O.mode, H)), (R.return = O), (O = R);
                      }
                      return x(O);
                  case st:
                      return (re = L._init), qe(O, R, re(L._payload), H);
              }
              if (os(L)) return Z(O, R, L, H);
              if (te(L)) return J(O, R, L, H);
              ca(O, L);
          }
          return (typeof L == "string" && L !== "") || typeof L == "number"
              ? ((L = "" + L), R !== null && R.tag === 6 ? (a(O, R.sibling), (R = p(R, L)), (R.return = O), (O = R)) : (a(O, R), (R = kc(L, O.mode, H)), (R.return = O), (O = R)), x(O))
              : a(O, R);
      }
      return qe;
  }
  var wr = bp(!0),
      Cp = bp(!1),
      fa = Jn(null),
      da = null,
      Sr = null,
      Lu = null;
  function Iu() {
      Lu = Sr = da = null;
  }
  function ju(n) {
      var r = fa.current;
      Me(fa), (n._currentValue = r);
  }
  function zu(n, r, a) {
      for (; n !== null; ) {
          var f = n.alternate;
          if (((n.childLanes & r) !== r ? ((n.childLanes |= r), f !== null && (f.childLanes |= r)) : f !== null && (f.childLanes & r) !== r && (f.childLanes |= r), n === a)) break;
          n = n.return;
      }
  }
  function br(n, r) {
      (da = n), (Lu = Sr = null), (n = n.dependencies), n !== null && n.firstContext !== null && (n.lanes & r && (Pt = !0), (n.firstContext = null));
  }
  function Ut(n) {
      var r = n._currentValue;
      if (Lu !== n)
          if (((n = { context: n, memoizedValue: r, next: null }), Sr === null)) {
              if (da === null) throw Error(i(308));
              (Sr = n), (da.dependencies = { lanes: 0, firstContext: n });
          } else Sr = Sr.next = n;
      return r;
  }
  var Ei = null;
  function Nu(n) {
      Ei === null ? (Ei = [n]) : Ei.push(n);
  }
  function kp(n, r, a, f) {
      var p = r.interleaved;
      return p === null ? ((a.next = a), Nu(r)) : ((a.next = p.next), (p.next = a)), (r.interleaved = a), zn(n, f);
  }
  function zn(n, r) {
      n.lanes |= r;
      var a = n.alternate;
      for (a !== null && (a.lanes |= r), a = n, n = n.return; n !== null; ) (n.childLanes |= r), (a = n.alternate), a !== null && (a.childLanes |= r), (a = n), (n = n.return);
      return a.tag === 3 ? a.stateNode : null;
  }
  var ni = !1;
  function Fu(n) {
      n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Pp(n, r) {
      (n = n.updateQueue), r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Nn(n, r) {
      return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function ii(n, r, a) {
      var f = n.updateQueue;
      if (f === null) return null;
      if (((f = f.shared), we & 2)) {
          var p = f.pending;
          return p === null ? (r.next = r) : ((r.next = p.next), (p.next = r)), (f.pending = r), zn(n, a);
      }
      return (p = f.interleaved), p === null ? ((r.next = r), Nu(f)) : ((r.next = p.next), (p.next = r)), (f.interleaved = r), zn(n, a);
  }
  function ha(n, r, a) {
      if (((r = r.updateQueue), r !== null && ((r = r.shared), (a & 4194240) !== 0))) {
          var f = r.lanes;
          (f &= n.pendingLanes), (a |= f), (r.lanes = a), Jl(n, a);
      }
  }
  function Tp(n, r) {
      var a = n.updateQueue,
          f = n.alternate;
      if (f !== null && ((f = f.updateQueue), a === f)) {
          var p = null,
              g = null;
          if (((a = a.firstBaseUpdate), a !== null)) {
              do {
                  var x = { eventTime: a.eventTime, lane: a.lane, tag: a.tag, payload: a.payload, callback: a.callback, next: null };
                  g === null ? (p = g = x) : (g = g.next = x), (a = a.next);
              } while (a !== null);
              g === null ? (p = g = r) : (g = g.next = r);
          } else p = g = r;
          (a = { baseState: f.baseState, firstBaseUpdate: p, lastBaseUpdate: g, shared: f.shared, effects: f.effects }), (n.updateQueue = a);
          return;
      }
      (n = a.lastBaseUpdate), n === null ? (a.firstBaseUpdate = r) : (n.next = r), (a.lastBaseUpdate = r);
  }
  function pa(n, r, a, f) {
      var p = n.updateQueue;
      ni = !1;
      var g = p.firstBaseUpdate,
          x = p.lastBaseUpdate,
          T = p.shared.pending;
      if (T !== null) {
          p.shared.pending = null;
          var _ = T,
              j = _.next;
          (_.next = null), x === null ? (g = j) : (x.next = j), (x = _);
          var B = n.alternate;
          B !== null && ((B = B.updateQueue), (T = B.lastBaseUpdate), T !== x && (T === null ? (B.firstBaseUpdate = j) : (T.next = j), (B.lastBaseUpdate = _)));
      }
      if (g !== null) {
          var $ = p.baseState;
          (x = 0), (B = j = _ = null), (T = g);
          do {
              var V = T.lane,
                  Y = T.eventTime;
              if ((f & V) === V) {
                  B !== null && (B = B.next = { eventTime: Y, lane: 0, tag: T.tag, payload: T.payload, callback: T.callback, next: null });
                  e: {
                      var Z = n,
                          J = T;
                      switch (((V = r), (Y = a), J.tag)) {
                          case 1:
                              if (((Z = J.payload), typeof Z == "function")) {
                                  $ = Z.call(Y, $, V);
                                  break e;
                              }
                              $ = Z;
                              break e;
                          case 3:
                              Z.flags = (Z.flags & -65537) | 128;
                          case 0:
                              if (((Z = J.payload), (V = typeof Z == "function" ? Z.call(Y, $, V) : Z), V == null)) break e;
                              $ = G({}, $, V);
                              break e;
                          case 2:
                              ni = !0;
                      }
                  }
                  T.callback !== null && T.lane !== 0 && ((n.flags |= 64), (V = p.effects), V === null ? (p.effects = [T]) : V.push(T));
              } else (Y = { eventTime: Y, lane: V, tag: T.tag, payload: T.payload, callback: T.callback, next: null }), B === null ? ((j = B = Y), (_ = $)) : (B = B.next = Y), (x |= V);
              if (((T = T.next), T === null)) {
                  if (((T = p.shared.pending), T === null)) break;
                  (V = T), (T = V.next), (V.next = null), (p.lastBaseUpdate = V), (p.shared.pending = null);
              }
          } while (!0);
          if ((B === null && (_ = $), (p.baseState = _), (p.firstBaseUpdate = j), (p.lastBaseUpdate = B), (r = p.shared.interleaved), r !== null)) {
              p = r;
              do (x |= p.lane), (p = p.next);
              while (p !== r);
          } else g === null && (p.shared.lanes = 0);
          (Mi |= x), (n.lanes = x), (n.memoizedState = $);
      }
  }
  function Ep(n, r, a) {
      if (((n = r.effects), (r.effects = null), n !== null))
          for (r = 0; r < n.length; r++) {
              var f = n[r],
                  p = f.callback;
              if (p !== null) {
                  if (((f.callback = null), (f = a), typeof p != "function")) throw Error(i(191, p));
                  p.call(f);
              }
          }
  }
  var Os = {},
      wn = Jn(Os),
      Ds = Jn(Os),
      Ls = Jn(Os);
  function _i(n) {
      if (n === Os) throw Error(i(174));
      return n;
  }
  function Vu(n, r) {
      switch ((Ee(Ls, r), Ee(Ds, n), Ee(wn, Os), (n = r.nodeType), n)) {
          case 9:
          case 11:
              r = (r = r.documentElement) ? r.namespaceURI : Bl(null, "");
              break;
          default:
              (n = n === 8 ? r.parentNode : r), (r = n.namespaceURI || null), (n = n.tagName), (r = Bl(r, n));
      }
      Me(wn), Ee(wn, r);
  }
  function Cr() {
      Me(wn), Me(Ds), Me(Ls);
  }
  function _p(n) {
      _i(Ls.current);
      var r = _i(wn.current),
          a = Bl(r, n.type);
      r !== a && (Ee(Ds, n), Ee(wn, a));
  }
  function Bu(n) {
      Ds.current === n && (Me(wn), Me(Ds));
  }
  var Ne = Jn(0);
  function ma(n) {
      for (var r = n; r !== null; ) {
          if (r.tag === 13) {
              var a = r.memoizedState;
              if (a !== null && ((a = a.dehydrated), a === null || a.data === "$?" || a.data === "$!")) return r;
          } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
              if (r.flags & 128) return r;
          } else if (r.child !== null) {
              (r.child.return = r), (r = r.child);
              continue;
          }
          if (r === n) break;
          for (; r.sibling === null; ) {
              if (r.return === null || r.return === n) return null;
              r = r.return;
          }
          (r.sibling.return = r.return), (r = r.sibling);
      }
      return null;
  }
  var $u = [];
  function Uu() {
      for (var n = 0; n < $u.length; n++) $u[n]._workInProgressVersionPrimary = null;
      $u.length = 0;
  }
  var ga = I.ReactCurrentDispatcher,
      Hu = I.ReactCurrentBatchConfig,
      Ri = 0,
      Fe = null,
      Ze = null,
      et = null,
      ya = !1,
      Is = !1,
      js = 0,
      E1 = 0;
  function ft() {
      throw Error(i(321));
  }
  function Wu(n, r) {
      if (r === null) return !1;
      for (var a = 0; a < r.length && a < n.length; a++) if (!tn(n[a], r[a])) return !1;
      return !0;
  }
  function qu(n, r, a, f, p, g) {
      if (((Ri = g), (Fe = r), (r.memoizedState = null), (r.updateQueue = null), (r.lanes = 0), (ga.current = n === null || n.memoizedState === null ? A1 : O1), (n = a(f, p)), Is)) {
          g = 0;
          do {
              if (((Is = !1), (js = 0), 25 <= g)) throw Error(i(301));
              (g += 1), (et = Ze = null), (r.updateQueue = null), (ga.current = D1), (n = a(f, p));
          } while (Is);
      }
      if (((ga.current = wa), (r = Ze !== null && Ze.next !== null), (Ri = 0), (et = Ze = Fe = null), (ya = !1), r)) throw Error(i(300));
      return n;
  }
  function Ku() {
      var n = js !== 0;
      return (js = 0), n;
  }
  function Sn() {
      var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return et === null ? (Fe.memoizedState = et = n) : (et = et.next = n), et;
  }
  function Ht() {
      if (Ze === null) {
          var n = Fe.alternate;
          n = n !== null ? n.memoizedState : null;
      } else n = Ze.next;
      var r = et === null ? Fe.memoizedState : et.next;
      if (r !== null) (et = r), (Ze = n);
      else {
          if (n === null) throw Error(i(310));
          (Ze = n), (n = { memoizedState: Ze.memoizedState, baseState: Ze.baseState, baseQueue: Ze.baseQueue, queue: Ze.queue, next: null }), et === null ? (Fe.memoizedState = et = n) : (et = et.next = n);
      }
      return et;
  }
  function zs(n, r) {
      return typeof r == "function" ? r(n) : r;
  }
  function Gu(n) {
      var r = Ht(),
          a = r.queue;
      if (a === null) throw Error(i(311));
      a.lastRenderedReducer = n;
      var f = Ze,
          p = f.baseQueue,
          g = a.pending;
      if (g !== null) {
          if (p !== null) {
              var x = p.next;
              (p.next = g.next), (g.next = x);
          }
          (f.baseQueue = p = g), (a.pending = null);
      }
      if (p !== null) {
          (g = p.next), (f = f.baseState);
          var T = (x = null),
              _ = null,
              j = g;
          do {
              var B = j.lane;
              if ((Ri & B) === B) _ !== null && (_ = _.next = { lane: 0, action: j.action, hasEagerState: j.hasEagerState, eagerState: j.eagerState, next: null }), (f = j.hasEagerState ? j.eagerState : n(f, j.action));
              else {
                  var $ = { lane: B, action: j.action, hasEagerState: j.hasEagerState, eagerState: j.eagerState, next: null };
                  _ === null ? ((T = _ = $), (x = f)) : (_ = _.next = $), (Fe.lanes |= B), (Mi |= B);
              }
              j = j.next;
          } while (j !== null && j !== g);
          _ === null ? (x = f) : (_.next = T), tn(f, r.memoizedState) || (Pt = !0), (r.memoizedState = f), (r.baseState = x), (r.baseQueue = _), (a.lastRenderedState = f);
      }
      if (((n = a.interleaved), n !== null)) {
          p = n;
          do (g = p.lane), (Fe.lanes |= g), (Mi |= g), (p = p.next);
          while (p !== n);
      } else p === null && (a.lanes = 0);
      return [r.memoizedState, a.dispatch];
  }
  function Yu(n) {
      var r = Ht(),
          a = r.queue;
      if (a === null) throw Error(i(311));
      a.lastRenderedReducer = n;
      var f = a.dispatch,
          p = a.pending,
          g = r.memoizedState;
      if (p !== null) {
          a.pending = null;
          var x = (p = p.next);
          do (g = n(g, x.action)), (x = x.next);
          while (x !== p);
          tn(g, r.memoizedState) || (Pt = !0), (r.memoizedState = g), r.baseQueue === null && (r.baseState = g), (a.lastRenderedState = g);
      }
      return [g, f];
  }
  function Rp() {}
  function Mp(n, r) {
      var a = Fe,
          f = Ht(),
          p = r(),
          g = !tn(f.memoizedState, p);
      if ((g && ((f.memoizedState = p), (Pt = !0)), (f = f.queue), Qu(Dp.bind(null, a, f, n), [n]), f.getSnapshot !== r || g || (et !== null && et.memoizedState.tag & 1))) {
          if (((a.flags |= 2048), Ns(9, Op.bind(null, a, f, p, r), void 0, null), tt === null)) throw Error(i(349));
          Ri & 30 || Ap(a, r, p);
      }
      return p;
  }
  function Ap(n, r, a) {
      (n.flags |= 16384),
          (n = { getSnapshot: r, value: a }),
          (r = Fe.updateQueue),
          r === null ? ((r = { lastEffect: null, stores: null }), (Fe.updateQueue = r), (r.stores = [n])) : ((a = r.stores), a === null ? (r.stores = [n]) : a.push(n));
  }
  function Op(n, r, a, f) {
      (r.value = a), (r.getSnapshot = f), Lp(r) && Ip(n);
  }
  function Dp(n, r, a) {
      return a(function () {
          Lp(r) && Ip(n);
      });
  }
  function Lp(n) {
      var r = n.getSnapshot;
      n = n.value;
      try {
          var a = r();
          return !tn(n, a);
      } catch {
          return !0;
      }
  }
  function Ip(n) {
      var r = zn(n, 1);
      r !== null && an(r, n, 1, -1);
  }
  function jp(n) {
      var r = Sn();
      return (
          typeof n == "function" && (n = n()),
          (r.memoizedState = r.baseState = n),
          (n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: zs, lastRenderedState: n }),
          (r.queue = n),
          (n = n.dispatch = M1.bind(null, Fe, n)),
          [r.memoizedState, n]
      );
  }
  function Ns(n, r, a, f) {
      return (
          (n = { tag: n, create: r, destroy: a, deps: f, next: null }),
          (r = Fe.updateQueue),
          r === null
              ? ((r = { lastEffect: null, stores: null }), (Fe.updateQueue = r), (r.lastEffect = n.next = n))
              : ((a = r.lastEffect), a === null ? (r.lastEffect = n.next = n) : ((f = a.next), (a.next = n), (n.next = f), (r.lastEffect = n))),
          n
      );
  }
  function zp() {
      return Ht().memoizedState;
  }
  function va(n, r, a, f) {
      var p = Sn();
      (Fe.flags |= n), (p.memoizedState = Ns(1 | r, a, void 0, f === void 0 ? null : f));
  }
  function xa(n, r, a, f) {
      var p = Ht();
      f = f === void 0 ? null : f;
      var g = void 0;
      if (Ze !== null) {
          var x = Ze.memoizedState;
          if (((g = x.destroy), f !== null && Wu(f, x.deps))) {
              p.memoizedState = Ns(r, a, g, f);
              return;
          }
      }
      (Fe.flags |= n), (p.memoizedState = Ns(1 | r, a, g, f));
  }
  function Np(n, r) {
      return va(8390656, 8, n, r);
  }
  function Qu(n, r) {
      return xa(2048, 8, n, r);
  }
  function Fp(n, r) {
      return xa(4, 2, n, r);
  }
  function Vp(n, r) {
      return xa(4, 4, n, r);
  }
  function Bp(n, r) {
      if (typeof r == "function")
          return (
              (n = n()),
              r(n),
              function () {
                  r(null);
              }
          );
      if (r != null)
          return (
              (n = n()),
              (r.current = n),
              function () {
                  r.current = null;
              }
          );
  }
  function $p(n, r, a) {
      return (a = a != null ? a.concat([n]) : null), xa(4, 4, Bp.bind(null, r, n), a);
  }
  function Xu() {}
  function Up(n, r) {
      var a = Ht();
      r = r === void 0 ? null : r;
      var f = a.memoizedState;
      return f !== null && r !== null && Wu(r, f[1]) ? f[0] : ((a.memoizedState = [n, r]), n);
  }
  function Hp(n, r) {
      var a = Ht();
      r = r === void 0 ? null : r;
      var f = a.memoizedState;
      return f !== null && r !== null && Wu(r, f[1]) ? f[0] : ((n = n()), (a.memoizedState = [n, r]), n);
  }
  function Wp(n, r, a) {
      return Ri & 21 ? (tn(a, r) || ((a = Sh()), (Fe.lanes |= a), (Mi |= a), (n.baseState = !0)), r) : (n.baseState && ((n.baseState = !1), (Pt = !0)), (n.memoizedState = a));
  }
  function _1(n, r) {
      var a = Pe;
      (Pe = a !== 0 && 4 > a ? a : 4), n(!0);
      var f = Hu.transition;
      Hu.transition = {};
      try {
          n(!1), r();
      } finally {
          (Pe = a), (Hu.transition = f);
      }
  }
  function qp() {
      return Ht().memoizedState;
  }
  function R1(n, r, a) {
      var f = ai(n);
      if (((a = { lane: f, action: a, hasEagerState: !1, eagerState: null, next: null }), Kp(n))) Gp(r, a);
      else if (((a = kp(n, r, a, f)), a !== null)) {
          var p = wt();
          an(a, n, f, p), Yp(a, r, f);
      }
  }
  function M1(n, r, a) {
      var f = ai(n),
          p = { lane: f, action: a, hasEagerState: !1, eagerState: null, next: null };
      if (Kp(n)) Gp(r, p);
      else {
          var g = n.alternate;
          if (n.lanes === 0 && (g === null || g.lanes === 0) && ((g = r.lastRenderedReducer), g !== null))
              try {
                  var x = r.lastRenderedState,
                      T = g(x, a);
                  if (((p.hasEagerState = !0), (p.eagerState = T), tn(T, x))) {
                      var _ = r.interleaved;
                      _ === null ? ((p.next = p), Nu(r)) : ((p.next = _.next), (_.next = p)), (r.interleaved = p);
                      return;
                  }
              } catch {
              } finally {
              }
          (a = kp(n, r, p, f)), a !== null && ((p = wt()), an(a, n, f, p), Yp(a, r, f));
      }
  }
  function Kp(n) {
      var r = n.alternate;
      return n === Fe || (r !== null && r === Fe);
  }
  function Gp(n, r) {
      Is = ya = !0;
      var a = n.pending;
      a === null ? (r.next = r) : ((r.next = a.next), (a.next = r)), (n.pending = r);
  }
  function Yp(n, r, a) {
      if (a & 4194240) {
          var f = r.lanes;
          (f &= n.pendingLanes), (a |= f), (r.lanes = a), Jl(n, a);
      }
  }
  var wa = {
          readContext: Ut,
          useCallback: ft,
          useContext: ft,
          useEffect: ft,
          useImperativeHandle: ft,
          useInsertionEffect: ft,
          useLayoutEffect: ft,
          useMemo: ft,
          useReducer: ft,
          useRef: ft,
          useState: ft,
          useDebugValue: ft,
          useDeferredValue: ft,
          useTransition: ft,
          useMutableSource: ft,
          useSyncExternalStore: ft,
          useId: ft,
          unstable_isNewReconciler: !1,
      },
      A1 = {
          readContext: Ut,
          useCallback: function (n, r) {
              return (Sn().memoizedState = [n, r === void 0 ? null : r]), n;
          },
          useContext: Ut,
          useEffect: Np,
          useImperativeHandle: function (n, r, a) {
              return (a = a != null ? a.concat([n]) : null), va(4194308, 4, Bp.bind(null, r, n), a);
          },
          useLayoutEffect: function (n, r) {
              return va(4194308, 4, n, r);
          },
          useInsertionEffect: function (n, r) {
              return va(4, 2, n, r);
          },
          useMemo: function (n, r) {
              var a = Sn();
              return (r = r === void 0 ? null : r), (n = n()), (a.memoizedState = [n, r]), n;
          },
          useReducer: function (n, r, a) {
              var f = Sn();
              return (
                  (r = a !== void 0 ? a(r) : r),
                  (f.memoizedState = f.baseState = r),
                  (n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }),
                  (f.queue = n),
                  (n = n.dispatch = R1.bind(null, Fe, n)),
                  [f.memoizedState, n]
              );
          },
          useRef: function (n) {
              var r = Sn();
              return (n = { current: n }), (r.memoizedState = n);
          },
          useState: jp,
          useDebugValue: Xu,
          useDeferredValue: function (n) {
              return (Sn().memoizedState = n);
          },
          useTransition: function () {
              var n = jp(!1),
                  r = n[0];
              return (n = _1.bind(null, n[1])), (Sn().memoizedState = n), [r, n];
          },
          useMutableSource: function () {},
          useSyncExternalStore: function (n, r, a) {
              var f = Fe,
                  p = Sn();
              if (De) {
                  if (a === void 0) throw Error(i(407));
                  a = a();
              } else {
                  if (((a = r()), tt === null)) throw Error(i(349));
                  Ri & 30 || Ap(f, r, a);
              }
              p.memoizedState = a;
              var g = { value: a, getSnapshot: r };
              return (p.queue = g), Np(Dp.bind(null, f, g, n), [n]), (f.flags |= 2048), Ns(9, Op.bind(null, f, g, a, r), void 0, null), a;
          },
          useId: function () {
              var n = Sn(),
                  r = tt.identifierPrefix;
              if (De) {
                  var a = jn,
                      f = In;
                  (a = (f & ~(1 << (32 - en(f) - 1))).toString(32) + a), (r = ":" + r + "R" + a), (a = js++), 0 < a && (r += "H" + a.toString(32)), (r += ":");
              } else (a = E1++), (r = ":" + r + "r" + a.toString(32) + ":");
              return (n.memoizedState = r);
          },
          unstable_isNewReconciler: !1,
      },
      O1 = {
          readContext: Ut,
          useCallback: Up,
          useContext: Ut,
          useEffect: Qu,
          useImperativeHandle: $p,
          useInsertionEffect: Fp,
          useLayoutEffect: Vp,
          useMemo: Hp,
          useReducer: Gu,
          useRef: zp,
          useState: function () {
              return Gu(zs);
          },
          useDebugValue: Xu,
          useDeferredValue: function (n) {
              var r = Ht();
              return Wp(r, Ze.memoizedState, n);
          },
          useTransition: function () {
              var n = Gu(zs)[0],
                  r = Ht().memoizedState;
              return [n, r];
          },
          useMutableSource: Rp,
          useSyncExternalStore: Mp,
          useId: qp,
          unstable_isNewReconciler: !1,
      },
      D1 = {
          readContext: Ut,
          useCallback: Up,
          useContext: Ut,
          useEffect: Qu,
          useImperativeHandle: $p,
          useInsertionEffect: Fp,
          useLayoutEffect: Vp,
          useMemo: Hp,
          useReducer: Yu,
          useRef: zp,
          useState: function () {
              return Yu(zs);
          },
          useDebugValue: Xu,
          useDeferredValue: function (n) {
              var r = Ht();
              return Ze === null ? (r.memoizedState = n) : Wp(r, Ze.memoizedState, n);
          },
          useTransition: function () {
              var n = Yu(zs)[0],
                  r = Ht().memoizedState;
              return [n, r];
          },
          useMutableSource: Rp,
          useSyncExternalStore: Mp,
          useId: qp,
          unstable_isNewReconciler: !1,
      };
  function rn(n, r) {
      if (n && n.defaultProps) {
          (r = G({}, r)), (n = n.defaultProps);
          for (var a in n) r[a] === void 0 && (r[a] = n[a]);
          return r;
      }
      return r;
  }
  function Zu(n, r, a, f) {
      (r = n.memoizedState), (a = a(f, r)), (a = a == null ? r : G({}, r, a)), (n.memoizedState = a), n.lanes === 0 && (n.updateQueue.baseState = a);
  }
  var Sa = {
      isMounted: function (n) {
          return (n = n._reactInternals) ? bi(n) === n : !1;
      },
      enqueueSetState: function (n, r, a) {
          n = n._reactInternals;
          var f = wt(),
              p = ai(n),
              g = Nn(f, p);
          (g.payload = r), a != null && (g.callback = a), (r = ii(n, g, p)), r !== null && (an(r, n, p, f), ha(r, n, p));
      },
      enqueueReplaceState: function (n, r, a) {
          n = n._reactInternals;
          var f = wt(),
              p = ai(n),
              g = Nn(f, p);
          (g.tag = 1), (g.payload = r), a != null && (g.callback = a), (r = ii(n, g, p)), r !== null && (an(r, n, p, f), ha(r, n, p));
      },
      enqueueForceUpdate: function (n, r) {
          n = n._reactInternals;
          var a = wt(),
              f = ai(n),
              p = Nn(a, f);
          (p.tag = 2), r != null && (p.callback = r), (r = ii(n, p, f)), r !== null && (an(r, n, f, a), ha(r, n, f));
      },
  };
  function Qp(n, r, a, f, p, g, x) {
      return (n = n.stateNode), typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(f, g, x) : r.prototype && r.prototype.isPureReactComponent ? !ks(a, f) || !ks(p, g) : !0;
  }
  function Xp(n, r, a) {
      var f = !1,
          p = ei,
          g = r.contextType;
      return (
          typeof g == "object" && g !== null ? (g = Ut(g)) : ((p = kt(r) ? ki : ct.current), (f = r.contextTypes), (g = (f = f != null) ? gr(n, p) : ei)),
          (r = new r(a, g)),
          (n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null),
          (r.updater = Sa),
          (n.stateNode = r),
          (r._reactInternals = n),
          f && ((n = n.stateNode), (n.__reactInternalMemoizedUnmaskedChildContext = p), (n.__reactInternalMemoizedMaskedChildContext = g)),
          r
      );
  }
  function Zp(n, r, a, f) {
      (n = r.state),
          typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(a, f),
          typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(a, f),
          r.state !== n && Sa.enqueueReplaceState(r, r.state, null);
  }
  function Ju(n, r, a, f) {
      var p = n.stateNode;
      (p.props = a), (p.state = n.memoizedState), (p.refs = {}), Fu(n);
      var g = r.contextType;
      typeof g == "object" && g !== null ? (p.context = Ut(g)) : ((g = kt(r) ? ki : ct.current), (p.context = gr(n, g))),
          (p.state = n.memoizedState),
          (g = r.getDerivedStateFromProps),
          typeof g == "function" && (Zu(n, r, g, a), (p.state = n.memoizedState)),
          typeof r.getDerivedStateFromProps == "function" ||
              typeof p.getSnapshotBeforeUpdate == "function" ||
              (typeof p.UNSAFE_componentWillMount != "function" && typeof p.componentWillMount != "function") ||
              ((r = p.state),
              typeof p.componentWillMount == "function" && p.componentWillMount(),
              typeof p.UNSAFE_componentWillMount == "function" && p.UNSAFE_componentWillMount(),
              r !== p.state && Sa.enqueueReplaceState(p, p.state, null),
              pa(n, a, p, f),
              (p.state = n.memoizedState)),
          typeof p.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function kr(n, r) {
      try {
          var a = "",
              f = r;
          do (a += pe(f)), (f = f.return);
          while (f);
          var p = a;
      } catch (g) {
          p =
              `
Error generating stack: ` +
              g.message +
              `
` +
              g.stack;
      }
      return { value: n, source: r, stack: p, digest: null };
  }
  function ec(n, r, a) {
      return { value: n, source: null, stack: a ?? null, digest: r ?? null };
  }
  function tc(n, r) {
      try {
          console.error(r.value);
      } catch (a) {
          setTimeout(function () {
              throw a;
          });
      }
  }
  var L1 = typeof WeakMap == "function" ? WeakMap : Map;
  function Jp(n, r, a) {
      (a = Nn(-1, a)), (a.tag = 3), (a.payload = { element: null });
      var f = r.value;
      return (
          (a.callback = function () {
              _a || ((_a = !0), (gc = f)), tc(n, r);
          }),
          a
      );
  }
  function em(n, r, a) {
      (a = Nn(-1, a)), (a.tag = 3);
      var f = n.type.getDerivedStateFromError;
      if (typeof f == "function") {
          var p = r.value;
          (a.payload = function () {
              return f(p);
          }),
              (a.callback = function () {
                  tc(n, r);
              });
      }
      var g = n.stateNode;
      return (
          g !== null &&
              typeof g.componentDidCatch == "function" &&
              (a.callback = function () {
                  tc(n, r), typeof f != "function" && (si === null ? (si = new Set([this])) : si.add(this));
                  var x = r.stack;
                  this.componentDidCatch(r.value, { componentStack: x !== null ? x : "" });
              }),
          a
      );
  }
  function tm(n, r, a) {
      var f = n.pingCache;
      if (f === null) {
          f = n.pingCache = new L1();
          var p = new Set();
          f.set(r, p);
      } else (p = f.get(r)), p === void 0 && ((p = new Set()), f.set(r, p));
      p.has(a) || (p.add(a), (n = G1.bind(null, n, r, a)), r.then(n, n));
  }
  function nm(n) {
      do {
          var r;
          if (((r = n.tag === 13) && ((r = n.memoizedState), (r = r !== null ? r.dehydrated !== null : !0)), r)) return n;
          n = n.return;
      } while (n !== null);
      return null;
  }
  function im(n, r, a, f, p) {
      return n.mode & 1
          ? ((n.flags |= 65536), (n.lanes = p), n)
          : (n === r ? (n.flags |= 65536) : ((n.flags |= 128), (a.flags |= 131072), (a.flags &= -52805), a.tag === 1 && (a.alternate === null ? (a.tag = 17) : ((r = Nn(-1, 1)), (r.tag = 2), ii(a, r, 1))), (a.lanes |= 1)), n);
  }
  var I1 = I.ReactCurrentOwner,
      Pt = !1;
  function xt(n, r, a, f) {
      r.child = n === null ? Cp(r, null, a, f) : wr(r, n.child, a, f);
  }
  function rm(n, r, a, f, p) {
      a = a.render;
      var g = r.ref;
      return br(r, p), (f = qu(n, r, a, f, g, p)), (a = Ku()), n !== null && !Pt ? ((r.updateQueue = n.updateQueue), (r.flags &= -2053), (n.lanes &= ~p), Fn(n, r, p)) : (De && a && Ru(r), (r.flags |= 1), xt(n, r, f, p), r.child);
  }
  function sm(n, r, a, f, p) {
      if (n === null) {
          var g = a.type;
          return typeof g == "function" && !Cc(g) && g.defaultProps === void 0 && a.compare === null && a.defaultProps === void 0
              ? ((r.tag = 15), (r.type = g), om(n, r, g, f, p))
              : ((n = La(a.type, null, f, r, r.mode, p)), (n.ref = r.ref), (n.return = r), (r.child = n));
      }
      if (((g = n.child), !(n.lanes & p))) {
          var x = g.memoizedProps;
          if (((a = a.compare), (a = a !== null ? a : ks), a(x, f) && n.ref === r.ref)) return Fn(n, r, p);
      }
      return (r.flags |= 1), (n = ui(g, f)), (n.ref = r.ref), (n.return = r), (r.child = n);
  }
  function om(n, r, a, f, p) {
      if (n !== null) {
          var g = n.memoizedProps;
          if (ks(g, f) && n.ref === r.ref)
              if (((Pt = !1), (r.pendingProps = f = g), (n.lanes & p) !== 0)) n.flags & 131072 && (Pt = !0);
              else return (r.lanes = n.lanes), Fn(n, r, p);
      }
      return nc(n, r, a, f, p);
  }
  function am(n, r, a) {
      var f = r.pendingProps,
          p = f.children,
          g = n !== null ? n.memoizedState : null;
      if (f.mode === "hidden")
          if (!(r.mode & 1)) (r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }), Ee(Tr, It), (It |= a);
          else {
              if (!(a & 1073741824))
                  return (n = g !== null ? g.baseLanes | a : a), (r.lanes = r.childLanes = 1073741824), (r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }), (r.updateQueue = null), Ee(Tr, It), (It |= n), null;
              (r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }), (f = g !== null ? g.baseLanes : a), Ee(Tr, It), (It |= f);
          }
      else g !== null ? ((f = g.baseLanes | a), (r.memoizedState = null)) : (f = a), Ee(Tr, It), (It |= f);
      return xt(n, r, p, a), r.child;
  }
  function lm(n, r) {
      var a = r.ref;
      ((n === null && a !== null) || (n !== null && n.ref !== a)) && ((r.flags |= 512), (r.flags |= 2097152));
  }
  function nc(n, r, a, f, p) {
      var g = kt(a) ? ki : ct.current;
      return (
          (g = gr(r, g)),
          br(r, p),
          (a = qu(n, r, a, f, g, p)),
          (f = Ku()),
          n !== null && !Pt ? ((r.updateQueue = n.updateQueue), (r.flags &= -2053), (n.lanes &= ~p), Fn(n, r, p)) : (De && f && Ru(r), (r.flags |= 1), xt(n, r, a, p), r.child)
      );
  }
  function um(n, r, a, f, p) {
      if (kt(a)) {
          var g = !0;
          sa(r);
      } else g = !1;
      if ((br(r, p), r.stateNode === null)) Ca(n, r), Xp(r, a, f), Ju(r, a, f, p), (f = !0);
      else if (n === null) {
          var x = r.stateNode,
              T = r.memoizedProps;
          x.props = T;
          var _ = x.context,
              j = a.contextType;
          typeof j == "object" && j !== null ? (j = Ut(j)) : ((j = kt(a) ? ki : ct.current), (j = gr(r, j)));
          var B = a.getDerivedStateFromProps,
              $ = typeof B == "function" || typeof x.getSnapshotBeforeUpdate == "function";
          $ || (typeof x.UNSAFE_componentWillReceiveProps != "function" && typeof x.componentWillReceiveProps != "function") || ((T !== f || _ !== j) && Zp(r, x, f, j)), (ni = !1);
          var V = r.memoizedState;
          (x.state = V),
              pa(r, f, x, p),
              (_ = r.memoizedState),
              T !== f || V !== _ || Ct.current || ni
                  ? (typeof B == "function" && (Zu(r, a, B, f), (_ = r.memoizedState)),
                    (T = ni || Qp(r, a, T, f, V, _, j))
                        ? ($ ||
                              (typeof x.UNSAFE_componentWillMount != "function" && typeof x.componentWillMount != "function") ||
                              (typeof x.componentWillMount == "function" && x.componentWillMount(), typeof x.UNSAFE_componentWillMount == "function" && x.UNSAFE_componentWillMount()),
                          typeof x.componentDidMount == "function" && (r.flags |= 4194308))
                        : (typeof x.componentDidMount == "function" && (r.flags |= 4194308), (r.memoizedProps = f), (r.memoizedState = _)),
                    (x.props = f),
                    (x.state = _),
                    (x.context = j),
                    (f = T))
                  : (typeof x.componentDidMount == "function" && (r.flags |= 4194308), (f = !1));
      } else {
          (x = r.stateNode),
              Pp(n, r),
              (T = r.memoizedProps),
              (j = r.type === r.elementType ? T : rn(r.type, T)),
              (x.props = j),
              ($ = r.pendingProps),
              (V = x.context),
              (_ = a.contextType),
              typeof _ == "object" && _ !== null ? (_ = Ut(_)) : ((_ = kt(a) ? ki : ct.current), (_ = gr(r, _)));
          var Y = a.getDerivedStateFromProps;
          (B = typeof Y == "function" || typeof x.getSnapshotBeforeUpdate == "function") ||
              (typeof x.UNSAFE_componentWillReceiveProps != "function" && typeof x.componentWillReceiveProps != "function") ||
              ((T !== $ || V !== _) && Zp(r, x, f, _)),
              (ni = !1),
              (V = r.memoizedState),
              (x.state = V),
              pa(r, f, x, p);
          var Z = r.memoizedState;
          T !== $ || V !== Z || Ct.current || ni
              ? (typeof Y == "function" && (Zu(r, a, Y, f), (Z = r.memoizedState)),
                (j = ni || Qp(r, a, j, f, V, Z, _) || !1)
                    ? (B ||
                          (typeof x.UNSAFE_componentWillUpdate != "function" && typeof x.componentWillUpdate != "function") ||
                          (typeof x.componentWillUpdate == "function" && x.componentWillUpdate(f, Z, _), typeof x.UNSAFE_componentWillUpdate == "function" && x.UNSAFE_componentWillUpdate(f, Z, _)),
                      typeof x.componentDidUpdate == "function" && (r.flags |= 4),
                      typeof x.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024))
                    : (typeof x.componentDidUpdate != "function" || (T === n.memoizedProps && V === n.memoizedState) || (r.flags |= 4),
                      typeof x.getSnapshotBeforeUpdate != "function" || (T === n.memoizedProps && V === n.memoizedState) || (r.flags |= 1024),
                      (r.memoizedProps = f),
                      (r.memoizedState = Z)),
                (x.props = f),
                (x.state = Z),
                (x.context = _),
                (f = j))
              : (typeof x.componentDidUpdate != "function" || (T === n.memoizedProps && V === n.memoizedState) || (r.flags |= 4),
                typeof x.getSnapshotBeforeUpdate != "function" || (T === n.memoizedProps && V === n.memoizedState) || (r.flags |= 1024),
                (f = !1));
      }
      return ic(n, r, a, f, g, p);
  }
  function ic(n, r, a, f, p, g) {
      lm(n, r);
      var x = (r.flags & 128) !== 0;
      if (!f && !x) return p && pp(r, a, !1), Fn(n, r, g);
      (f = r.stateNode), (I1.current = r);
      var T = x && typeof a.getDerivedStateFromError != "function" ? null : f.render();
      return (r.flags |= 1), n !== null && x ? ((r.child = wr(r, n.child, null, g)), (r.child = wr(r, null, T, g))) : xt(n, r, T, g), (r.memoizedState = f.state), p && pp(r, a, !0), r.child;
  }
  function cm(n) {
      var r = n.stateNode;
      r.pendingContext ? dp(n, r.pendingContext, r.pendingContext !== r.context) : r.context && dp(n, r.context, !1), Vu(n, r.containerInfo);
  }
  function fm(n, r, a, f, p) {
      return xr(), Du(p), (r.flags |= 256), xt(n, r, a, f), r.child;
  }
  var rc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function sc(n) {
      return { baseLanes: n, cachePool: null, transitions: null };
  }
  function dm(n, r, a) {
      var f = r.pendingProps,
          p = Ne.current,
          g = !1,
          x = (r.flags & 128) !== 0,
          T;
      if (((T = x) || (T = n !== null && n.memoizedState === null ? !1 : (p & 2) !== 0), T ? ((g = !0), (r.flags &= -129)) : (n === null || n.memoizedState !== null) && (p |= 1), Ee(Ne, p & 1), n === null))
          return (
              Ou(r),
              (n = r.memoizedState),
              n !== null && ((n = n.dehydrated), n !== null)
                  ? (r.mode & 1 ? (n.data === "$!" ? (r.lanes = 8) : (r.lanes = 1073741824)) : (r.lanes = 1), null)
                  : ((x = f.children),
                    (n = f.fallback),
                    g
                        ? ((f = r.mode),
                          (g = r.child),
                          (x = { mode: "hidden", children: x }),
                          !(f & 1) && g !== null ? ((g.childLanes = 0), (g.pendingProps = x)) : (g = Ia(x, f, 0, null)),
                          (n = Li(n, f, a, null)),
                          (g.return = r),
                          (n.return = r),
                          (g.sibling = n),
                          (r.child = g),
                          (r.child.memoizedState = sc(a)),
                          (r.memoizedState = rc),
                          n)
                        : oc(r, x))
          );
      if (((p = n.memoizedState), p !== null && ((T = p.dehydrated), T !== null))) return j1(n, r, x, f, T, p, a);
      if (g) {
          (g = f.fallback), (x = r.mode), (p = n.child), (T = p.sibling);
          var _ = { mode: "hidden", children: f.children };
          return (
              !(x & 1) && r.child !== p ? ((f = r.child), (f.childLanes = 0), (f.pendingProps = _), (r.deletions = null)) : ((f = ui(p, _)), (f.subtreeFlags = p.subtreeFlags & 14680064)),
              T !== null ? (g = ui(T, g)) : ((g = Li(g, x, a, null)), (g.flags |= 2)),
              (g.return = r),
              (f.return = r),
              (f.sibling = g),
              (r.child = f),
              (f = g),
              (g = r.child),
              (x = n.child.memoizedState),
              (x = x === null ? sc(a) : { baseLanes: x.baseLanes | a, cachePool: null, transitions: x.transitions }),
              (g.memoizedState = x),
              (g.childLanes = n.childLanes & ~a),
              (r.memoizedState = rc),
              f
          );
      }
      return (
          (g = n.child),
          (n = g.sibling),
          (f = ui(g, { mode: "visible", children: f.children })),
          !(r.mode & 1) && (f.lanes = a),
          (f.return = r),
          (f.sibling = null),
          n !== null && ((a = r.deletions), a === null ? ((r.deletions = [n]), (r.flags |= 16)) : a.push(n)),
          (r.child = f),
          (r.memoizedState = null),
          f
      );
  }
  function oc(n, r) {
      return (r = Ia({ mode: "visible", children: r }, n.mode, 0, null)), (r.return = n), (n.child = r);
  }
  function ba(n, r, a, f) {
      return f !== null && Du(f), wr(r, n.child, null, a), (n = oc(r, r.pendingProps.children)), (n.flags |= 2), (r.memoizedState = null), n;
  }
  function j1(n, r, a, f, p, g, x) {
      if (a)
          return r.flags & 256
              ? ((r.flags &= -257), (f = ec(Error(i(422)))), ba(n, r, x, f))
              : r.memoizedState !== null
              ? ((r.child = n.child), (r.flags |= 128), null)
              : ((g = f.fallback),
                (p = r.mode),
                (f = Ia({ mode: "visible", children: f.children }, p, 0, null)),
                (g = Li(g, p, x, null)),
                (g.flags |= 2),
                (f.return = r),
                (g.return = r),
                (f.sibling = g),
                (r.child = f),
                r.mode & 1 && wr(r, n.child, null, x),
                (r.child.memoizedState = sc(x)),
                (r.memoizedState = rc),
                g);
      if (!(r.mode & 1)) return ba(n, r, x, null);
      if (p.data === "$!") {
          if (((f = p.nextSibling && p.nextSibling.dataset), f)) var T = f.dgst;
          return (f = T), (g = Error(i(419))), (f = ec(g, f, void 0)), ba(n, r, x, f);
      }
      if (((T = (x & n.childLanes) !== 0), Pt || T)) {
          if (((f = tt), f !== null)) {
              switch (x & -x) {
                  case 4:
                      p = 2;
                      break;
                  case 16:
                      p = 8;
                      break;
                  case 64:
                  case 128:
                  case 256:
                  case 512:
                  case 1024:
                  case 2048:
                  case 4096:
                  case 8192:
                  case 16384:
                  case 32768:
                  case 65536:
                  case 131072:
                  case 262144:
                  case 524288:
                  case 1048576:
                  case 2097152:
                  case 4194304:
                  case 8388608:
                  case 16777216:
                  case 33554432:
                  case 67108864:
                      p = 32;
                      break;
                  case 536870912:
                      p = 268435456;
                      break;
                  default:
                      p = 0;
              }
              (p = p & (f.suspendedLanes | x) ? 0 : p), p !== 0 && p !== g.retryLane && ((g.retryLane = p), zn(n, p), an(f, n, p, -1));
          }
          return bc(), (f = ec(Error(i(421)))), ba(n, r, x, f);
      }
      return p.data === "$?"
          ? ((r.flags |= 128), (r.child = n.child), (r = Y1.bind(null, n)), (p._reactRetry = r), null)
          : ((n = g.treeContext),
            (Lt = Zn(p.nextSibling)),
            (Dt = r),
            (De = !0),
            (nn = null),
            n !== null && ((Bt[$t++] = In), (Bt[$t++] = jn), (Bt[$t++] = Pi), (In = n.id), (jn = n.overflow), (Pi = r)),
            (r = oc(r, f.children)),
            (r.flags |= 4096),
            r);
  }
  function hm(n, r, a) {
      n.lanes |= r;
      var f = n.alternate;
      f !== null && (f.lanes |= r), zu(n.return, r, a);
  }
  function ac(n, r, a, f, p) {
      var g = n.memoizedState;
      g === null
          ? (n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: f, tail: a, tailMode: p })
          : ((g.isBackwards = r), (g.rendering = null), (g.renderingStartTime = 0), (g.last = f), (g.tail = a), (g.tailMode = p));
  }
  function pm(n, r, a) {
      var f = r.pendingProps,
          p = f.revealOrder,
          g = f.tail;
      if ((xt(n, r, f.children, a), (f = Ne.current), f & 2)) (f = (f & 1) | 2), (r.flags |= 128);
      else {
          if (n !== null && n.flags & 128)
              e: for (n = r.child; n !== null; ) {
                  if (n.tag === 13) n.memoizedState !== null && hm(n, a, r);
                  else if (n.tag === 19) hm(n, a, r);
                  else if (n.child !== null) {
                      (n.child.return = n), (n = n.child);
                      continue;
                  }
                  if (n === r) break e;
                  for (; n.sibling === null; ) {
                      if (n.return === null || n.return === r) break e;
                      n = n.return;
                  }
                  (n.sibling.return = n.return), (n = n.sibling);
              }
          f &= 1;
      }
      if ((Ee(Ne, f), !(r.mode & 1))) r.memoizedState = null;
      else
          switch (p) {
              case "forwards":
                  for (a = r.child, p = null; a !== null; ) (n = a.alternate), n !== null && ma(n) === null && (p = a), (a = a.sibling);
                  (a = p), a === null ? ((p = r.child), (r.child = null)) : ((p = a.sibling), (a.sibling = null)), ac(r, !1, p, a, g);
                  break;
              case "backwards":
                  for (a = null, p = r.child, r.child = null; p !== null; ) {
                      if (((n = p.alternate), n !== null && ma(n) === null)) {
                          r.child = p;
                          break;
                      }
                      (n = p.sibling), (p.sibling = a), (a = p), (p = n);
                  }
                  ac(r, !0, a, null, g);
                  break;
              case "together":
                  ac(r, !1, null, null, void 0);
                  break;
              default:
                  r.memoizedState = null;
          }
      return r.child;
  }
  function Ca(n, r) {
      !(r.mode & 1) && n !== null && ((n.alternate = null), (r.alternate = null), (r.flags |= 2));
  }
  function Fn(n, r, a) {
      if ((n !== null && (r.dependencies = n.dependencies), (Mi |= r.lanes), !(a & r.childLanes))) return null;
      if (n !== null && r.child !== n.child) throw Error(i(153));
      if (r.child !== null) {
          for (n = r.child, a = ui(n, n.pendingProps), r.child = a, a.return = r; n.sibling !== null; ) (n = n.sibling), (a = a.sibling = ui(n, n.pendingProps)), (a.return = r);
          a.sibling = null;
      }
      return r.child;
  }
  function z1(n, r, a) {
      switch (r.tag) {
          case 3:
              cm(r), xr();
              break;
          case 5:
              _p(r);
              break;
          case 1:
              kt(r.type) && sa(r);
              break;
          case 4:
              Vu(r, r.stateNode.containerInfo);
              break;
          case 10:
              var f = r.type._context,
                  p = r.memoizedProps.value;
              Ee(fa, f._currentValue), (f._currentValue = p);
              break;
          case 13:
              if (((f = r.memoizedState), f !== null))
                  return f.dehydrated !== null ? (Ee(Ne, Ne.current & 1), (r.flags |= 128), null) : a & r.child.childLanes ? dm(n, r, a) : (Ee(Ne, Ne.current & 1), (n = Fn(n, r, a)), n !== null ? n.sibling : null);
              Ee(Ne, Ne.current & 1);
              break;
          case 19:
              if (((f = (a & r.childLanes) !== 0), n.flags & 128)) {
                  if (f) return pm(n, r, a);
                  r.flags |= 128;
              }
              if (((p = r.memoizedState), p !== null && ((p.rendering = null), (p.tail = null), (p.lastEffect = null)), Ee(Ne, Ne.current), f)) break;
              return null;
          case 22:
          case 23:
              return (r.lanes = 0), am(n, r, a);
      }
      return Fn(n, r, a);
  }
  var mm, lc, gm, ym;
  (mm = function (n, r) {
      for (var a = r.child; a !== null; ) {
          if (a.tag === 5 || a.tag === 6) n.appendChild(a.stateNode);
          else if (a.tag !== 4 && a.child !== null) {
              (a.child.return = a), (a = a.child);
              continue;
          }
          if (a === r) break;
          for (; a.sibling === null; ) {
              if (a.return === null || a.return === r) return;
              a = a.return;
          }
          (a.sibling.return = a.return), (a = a.sibling);
      }
  }),
      (lc = function () {}),
      (gm = function (n, r, a, f) {
          var p = n.memoizedProps;
          if (p !== f) {
              (n = r.stateNode), _i(wn.current);
              var g = null;
              switch (a) {
                  case "input":
                      (p = zl(n, p)), (f = zl(n, f)), (g = []);
                      break;
                  case "select":
                      (p = G({}, p, { value: void 0 })), (f = G({}, f, { value: void 0 })), (g = []);
                      break;
                  case "textarea":
                      (p = Vl(n, p)), (f = Vl(n, f)), (g = []);
                      break;
                  default:
                      typeof p.onClick != "function" && typeof f.onClick == "function" && (n.onclick = na);
              }
              $l(a, f);
              var x;
              a = null;
              for (j in p)
                  if (!f.hasOwnProperty(j) && p.hasOwnProperty(j) && p[j] != null)
                      if (j === "style") {
                          var T = p[j];
                          for (x in T) T.hasOwnProperty(x) && (a || (a = {}), (a[x] = ""));
                      } else
                          j !== "dangerouslySetInnerHTML" &&
                              j !== "children" &&
                              j !== "suppressContentEditableWarning" &&
                              j !== "suppressHydrationWarning" &&
                              j !== "autoFocus" &&
                              (o.hasOwnProperty(j) ? g || (g = []) : (g = g || []).push(j, null));
              for (j in f) {
                  var _ = f[j];
                  if (((T = p != null ? p[j] : void 0), f.hasOwnProperty(j) && _ !== T && (_ != null || T != null)))
                      if (j === "style")
                          if (T) {
                              for (x in T) !T.hasOwnProperty(x) || (_ && _.hasOwnProperty(x)) || (a || (a = {}), (a[x] = ""));
                              for (x in _) _.hasOwnProperty(x) && T[x] !== _[x] && (a || (a = {}), (a[x] = _[x]));
                          } else a || (g || (g = []), g.push(j, a)), (a = _);
                      else
                          j === "dangerouslySetInnerHTML"
                              ? ((_ = _ ? _.__html : void 0), (T = T ? T.__html : void 0), _ != null && T !== _ && (g = g || []).push(j, _))
                              : j === "children"
                              ? (typeof _ != "string" && typeof _ != "number") || (g = g || []).push(j, "" + _)
                              : j !== "suppressContentEditableWarning" && j !== "suppressHydrationWarning" && (o.hasOwnProperty(j) ? (_ != null && j === "onScroll" && Re("scroll", n), g || T === _ || (g = [])) : (g = g || []).push(j, _));
              }
              a && (g = g || []).push("style", a);
              var j = g;
              (r.updateQueue = j) && (r.flags |= 4);
          }
      }),
      (ym = function (n, r, a, f) {
          a !== f && (r.flags |= 4);
      });
  function Fs(n, r) {
      if (!De)
          switch (n.tailMode) {
              case "hidden":
                  r = n.tail;
                  for (var a = null; r !== null; ) r.alternate !== null && (a = r), (r = r.sibling);
                  a === null ? (n.tail = null) : (a.sibling = null);
                  break;
              case "collapsed":
                  a = n.tail;
                  for (var f = null; a !== null; ) a.alternate !== null && (f = a), (a = a.sibling);
                  f === null ? (r || n.tail === null ? (n.tail = null) : (n.tail.sibling = null)) : (f.sibling = null);
          }
  }
  function dt(n) {
      var r = n.alternate !== null && n.alternate.child === n.child,
          a = 0,
          f = 0;
      if (r) for (var p = n.child; p !== null; ) (a |= p.lanes | p.childLanes), (f |= p.subtreeFlags & 14680064), (f |= p.flags & 14680064), (p.return = n), (p = p.sibling);
      else for (p = n.child; p !== null; ) (a |= p.lanes | p.childLanes), (f |= p.subtreeFlags), (f |= p.flags), (p.return = n), (p = p.sibling);
      return (n.subtreeFlags |= f), (n.childLanes = a), r;
  }
  function N1(n, r, a) {
      var f = r.pendingProps;
      switch ((Mu(r), r.tag)) {
          case 2:
          case 16:
          case 15:
          case 0:
          case 11:
          case 7:
          case 8:
          case 12:
          case 9:
          case 14:
              return dt(r), null;
          case 1:
              return kt(r.type) && ra(), dt(r), null;
          case 3:
              return (
                  (f = r.stateNode),
                  Cr(),
                  Me(Ct),
                  Me(ct),
                  Uu(),
                  f.pendingContext && ((f.context = f.pendingContext), (f.pendingContext = null)),
                  (n === null || n.child === null) && (ua(r) ? (r.flags |= 4) : n === null || (n.memoizedState.isDehydrated && !(r.flags & 256)) || ((r.flags |= 1024), nn !== null && (xc(nn), (nn = null)))),
                  lc(n, r),
                  dt(r),
                  null
              );
          case 5:
              Bu(r);
              var p = _i(Ls.current);
              if (((a = r.type), n !== null && r.stateNode != null)) gm(n, r, a, f, p), n.ref !== r.ref && ((r.flags |= 512), (r.flags |= 2097152));
              else {
                  if (!f) {
                      if (r.stateNode === null) throw Error(i(166));
                      return dt(r), null;
                  }
                  if (((n = _i(wn.current)), ua(r))) {
                      (f = r.stateNode), (a = r.type);
                      var g = r.memoizedProps;
                      switch (((f[xn] = r), (f[Rs] = g), (n = (r.mode & 1) !== 0), a)) {
                          case "dialog":
                              Re("cancel", f), Re("close", f);
                              break;
                          case "iframe":
                          case "object":
                          case "embed":
                              Re("load", f);
                              break;
                          case "video":
                          case "audio":
                              for (p = 0; p < Ts.length; p++) Re(Ts[p], f);
                              break;
                          case "source":
                              Re("error", f);
                              break;
                          case "img":
                          case "image":
                          case "link":
                              Re("error", f), Re("load", f);
                              break;
                          case "details":
                              Re("toggle", f);
                              break;
                          case "input":
                              Xd(f, g), Re("invalid", f);
                              break;
                          case "select":
                              (f._wrapperState = { wasMultiple: !!g.multiple }), Re("invalid", f);
                              break;
                          case "textarea":
                              eh(f, g), Re("invalid", f);
                      }
                      $l(a, g), (p = null);
                      for (var x in g)
                          if (g.hasOwnProperty(x)) {
                              var T = g[x];
                              x === "children"
                                  ? typeof T == "string"
                                      ? f.textContent !== T && (g.suppressHydrationWarning !== !0 && ta(f.textContent, T, n), (p = ["children", T]))
                                      : typeof T == "number" && f.textContent !== "" + T && (g.suppressHydrationWarning !== !0 && ta(f.textContent, T, n), (p = ["children", "" + T]))
                                  : o.hasOwnProperty(x) && T != null && x === "onScroll" && Re("scroll", f);
                          }
                      switch (a) {
                          case "input":
                              Oo(f), Jd(f, g, !0);
                              break;
                          case "textarea":
                              Oo(f), nh(f);
                              break;
                          case "select":
                          case "option":
                              break;
                          default:
                              typeof g.onClick == "function" && (f.onclick = na);
                      }
                      (f = p), (r.updateQueue = f), f !== null && (r.flags |= 4);
                  } else {
                      (x = p.nodeType === 9 ? p : p.ownerDocument),
                          n === "http://www.w3.org/1999/xhtml" && (n = ih(a)),
                          n === "http://www.w3.org/1999/xhtml"
                              ? a === "script"
                                  ? ((n = x.createElement("div")), (n.innerHTML = "<script></script>"), (n = n.removeChild(n.firstChild)))
                                  : typeof f.is == "string"
                                  ? (n = x.createElement(a, { is: f.is }))
                                  : ((n = x.createElement(a)), a === "select" && ((x = n), f.multiple ? (x.multiple = !0) : f.size && (x.size = f.size)))
                              : (n = x.createElementNS(n, a)),
                          (n[xn] = r),
                          (n[Rs] = f),
                          mm(n, r, !1, !1),
                          (r.stateNode = n);
                      e: {
                          switch (((x = Ul(a, f)), a)) {
                              case "dialog":
                                  Re("cancel", n), Re("close", n), (p = f);
                                  break;
                              case "iframe":
                              case "object":
                              case "embed":
                                  Re("load", n), (p = f);
                                  break;
                              case "video":
                              case "audio":
                                  for (p = 0; p < Ts.length; p++) Re(Ts[p], n);
                                  p = f;
                                  break;
                              case "source":
                                  Re("error", n), (p = f);
                                  break;
                              case "img":
                              case "image":
                              case "link":
                                  Re("error", n), Re("load", n), (p = f);
                                  break;
                              case "details":
                                  Re("toggle", n), (p = f);
                                  break;
                              case "input":
                                  Xd(n, f), (p = zl(n, f)), Re("invalid", n);
                                  break;
                              case "option":
                                  p = f;
                                  break;
                              case "select":
                                  (n._wrapperState = { wasMultiple: !!f.multiple }), (p = G({}, f, { value: void 0 })), Re("invalid", n);
                                  break;
                              case "textarea":
                                  eh(n, f), (p = Vl(n, f)), Re("invalid", n);
                                  break;
                              default:
                                  p = f;
                          }
                          $l(a, p), (T = p);
                          for (g in T)
                              if (T.hasOwnProperty(g)) {
                                  var _ = T[g];
                                  g === "style"
                                      ? oh(n, _)
                                      : g === "dangerouslySetInnerHTML"
                                      ? ((_ = _ ? _.__html : void 0), _ != null && rh(n, _))
                                      : g === "children"
                                      ? typeof _ == "string"
                                          ? (a !== "textarea" || _ !== "") && as(n, _)
                                          : typeof _ == "number" && as(n, "" + _)
                                      : g !== "suppressContentEditableWarning" &&
                                        g !== "suppressHydrationWarning" &&
                                        g !== "autoFocus" &&
                                        (o.hasOwnProperty(g) ? _ != null && g === "onScroll" && Re("scroll", n) : _ != null && D(n, g, _, x));
                              }
                          switch (a) {
                              case "input":
                                  Oo(n), Jd(n, f, !1);
                                  break;
                              case "textarea":
                                  Oo(n), nh(n);
                                  break;
                              case "option":
                                  f.value != null && n.setAttribute("value", "" + xe(f.value));
                                  break;
                              case "select":
                                  (n.multiple = !!f.multiple), (g = f.value), g != null ? rr(n, !!f.multiple, g, !1) : f.defaultValue != null && rr(n, !!f.multiple, f.defaultValue, !0);
                                  break;
                              default:
                                  typeof p.onClick == "function" && (n.onclick = na);
                          }
                          switch (a) {
                              case "button":
                              case "input":
                              case "select":
                              case "textarea":
                                  f = !!f.autoFocus;
                                  break e;
                              case "img":
                                  f = !0;
                                  break e;
                              default:
                                  f = !1;
                          }
                      }
                      f && (r.flags |= 4);
                  }
                  r.ref !== null && ((r.flags |= 512), (r.flags |= 2097152));
              }
              return dt(r), null;
          case 6:
              if (n && r.stateNode != null) ym(n, r, n.memoizedProps, f);
              else {
                  if (typeof f != "string" && r.stateNode === null) throw Error(i(166));
                  if (((a = _i(Ls.current)), _i(wn.current), ua(r))) {
                      if (((f = r.stateNode), (a = r.memoizedProps), (f[xn] = r), (g = f.nodeValue !== a) && ((n = Dt), n !== null)))
                          switch (n.tag) {
                              case 3:
                                  ta(f.nodeValue, a, (n.mode & 1) !== 0);
                                  break;
                              case 5:
                                  n.memoizedProps.suppressHydrationWarning !== !0 && ta(f.nodeValue, a, (n.mode & 1) !== 0);
                          }
                      g && (r.flags |= 4);
                  } else (f = (a.nodeType === 9 ? a : a.ownerDocument).createTextNode(f)), (f[xn] = r), (r.stateNode = f);
              }
              return dt(r), null;
          case 13:
              if ((Me(Ne), (f = r.memoizedState), n === null || (n.memoizedState !== null && n.memoizedState.dehydrated !== null))) {
                  if (De && Lt !== null && r.mode & 1 && !(r.flags & 128)) wp(), xr(), (r.flags |= 98560), (g = !1);
                  else if (((g = ua(r)), f !== null && f.dehydrated !== null)) {
                      if (n === null) {
                          if (!g) throw Error(i(318));
                          if (((g = r.memoizedState), (g = g !== null ? g.dehydrated : null), !g)) throw Error(i(317));
                          g[xn] = r;
                      } else xr(), !(r.flags & 128) && (r.memoizedState = null), (r.flags |= 4);
                      dt(r), (g = !1);
                  } else nn !== null && (xc(nn), (nn = null)), (g = !0);
                  if (!g) return r.flags & 65536 ? r : null;
              }
              return r.flags & 128
                  ? ((r.lanes = a), r)
                  : ((f = f !== null),
                    f !== (n !== null && n.memoizedState !== null) && f && ((r.child.flags |= 8192), r.mode & 1 && (n === null || Ne.current & 1 ? Je === 0 && (Je = 3) : bc())),
                    r.updateQueue !== null && (r.flags |= 4),
                    dt(r),
                    null);
          case 4:
              return Cr(), lc(n, r), n === null && Es(r.stateNode.containerInfo), dt(r), null;
          case 10:
              return ju(r.type._context), dt(r), null;
          case 17:
              return kt(r.type) && ra(), dt(r), null;
          case 19:
              if ((Me(Ne), (g = r.memoizedState), g === null)) return dt(r), null;
              if (((f = (r.flags & 128) !== 0), (x = g.rendering), x === null))
                  if (f) Fs(g, !1);
                  else {
                      if (Je !== 0 || (n !== null && n.flags & 128))
                          for (n = r.child; n !== null; ) {
                              if (((x = ma(n)), x !== null)) {
                                  for (r.flags |= 128, Fs(g, !1), f = x.updateQueue, f !== null && ((r.updateQueue = f), (r.flags |= 4)), r.subtreeFlags = 0, f = a, a = r.child; a !== null; )
                                      (g = a),
                                          (n = f),
                                          (g.flags &= 14680066),
                                          (x = g.alternate),
                                          x === null
                                              ? ((g.childLanes = 0),
                                                (g.lanes = n),
                                                (g.child = null),
                                                (g.subtreeFlags = 0),
                                                (g.memoizedProps = null),
                                                (g.memoizedState = null),
                                                (g.updateQueue = null),
                                                (g.dependencies = null),
                                                (g.stateNode = null))
                                              : ((g.childLanes = x.childLanes),
                                                (g.lanes = x.lanes),
                                                (g.child = x.child),
                                                (g.subtreeFlags = 0),
                                                (g.deletions = null),
                                                (g.memoizedProps = x.memoizedProps),
                                                (g.memoizedState = x.memoizedState),
                                                (g.updateQueue = x.updateQueue),
                                                (g.type = x.type),
                                                (n = x.dependencies),
                                                (g.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext })),
                                          (a = a.sibling);
                                  return Ee(Ne, (Ne.current & 1) | 2), r.child;
                              }
                              n = n.sibling;
                          }
                      g.tail !== null && We() > Er && ((r.flags |= 128), (f = !0), Fs(g, !1), (r.lanes = 4194304));
                  }
              else {
                  if (!f)
                      if (((n = ma(x)), n !== null)) {
                          if (((r.flags |= 128), (f = !0), (a = n.updateQueue), a !== null && ((r.updateQueue = a), (r.flags |= 4)), Fs(g, !0), g.tail === null && g.tailMode === "hidden" && !x.alternate && !De)) return dt(r), null;
                      } else 2 * We() - g.renderingStartTime > Er && a !== 1073741824 && ((r.flags |= 128), (f = !0), Fs(g, !1), (r.lanes = 4194304));
                  g.isBackwards ? ((x.sibling = r.child), (r.child = x)) : ((a = g.last), a !== null ? (a.sibling = x) : (r.child = x), (g.last = x));
              }
              return g.tail !== null ? ((r = g.tail), (g.rendering = r), (g.tail = r.sibling), (g.renderingStartTime = We()), (r.sibling = null), (a = Ne.current), Ee(Ne, f ? (a & 1) | 2 : a & 1), r) : (dt(r), null);
          case 22:
          case 23:
              return Sc(), (f = r.memoizedState !== null), n !== null && (n.memoizedState !== null) !== f && (r.flags |= 8192), f && r.mode & 1 ? It & 1073741824 && (dt(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : dt(r), null;
          case 24:
              return null;
          case 25:
              return null;
      }
      throw Error(i(156, r.tag));
  }
  function F1(n, r) {
      switch ((Mu(r), r.tag)) {
          case 1:
              return kt(r.type) && ra(), (n = r.flags), n & 65536 ? ((r.flags = (n & -65537) | 128), r) : null;
          case 3:
              return Cr(), Me(Ct), Me(ct), Uu(), (n = r.flags), n & 65536 && !(n & 128) ? ((r.flags = (n & -65537) | 128), r) : null;
          case 5:
              return Bu(r), null;
          case 13:
              if ((Me(Ne), (n = r.memoizedState), n !== null && n.dehydrated !== null)) {
                  if (r.alternate === null) throw Error(i(340));
                  xr();
              }
              return (n = r.flags), n & 65536 ? ((r.flags = (n & -65537) | 128), r) : null;
          case 19:
              return Me(Ne), null;
          case 4:
              return Cr(), null;
          case 10:
              return ju(r.type._context), null;
          case 22:
          case 23:
              return Sc(), null;
          case 24:
              return null;
          default:
              return null;
      }
  }
  var ka = !1,
      ht = !1,
      V1 = typeof WeakSet == "function" ? WeakSet : Set,
      X = null;
  function Pr(n, r) {
      var a = n.ref;
      if (a !== null)
          if (typeof a == "function")
              try {
                  a(null);
              } catch (f) {
                  Ve(n, r, f);
              }
          else a.current = null;
  }
  function uc(n, r, a) {
      try {
          a();
      } catch (f) {
          Ve(n, r, f);
      }
  }
  var vm = !1;
  function B1(n, r) {
      if (((Su = Ho), (n = Qh()), hu(n))) {
          if ("selectionStart" in n) var a = { start: n.selectionStart, end: n.selectionEnd };
          else
              e: {
                  a = ((a = n.ownerDocument) && a.defaultView) || window;
                  var f = a.getSelection && a.getSelection();
                  if (f && f.rangeCount !== 0) {
                      a = f.anchorNode;
                      var p = f.anchorOffset,
                          g = f.focusNode;
                      f = f.focusOffset;
                      try {
                          a.nodeType, g.nodeType;
                      } catch {
                          a = null;
                          break e;
                      }
                      var x = 0,
                          T = -1,
                          _ = -1,
                          j = 0,
                          B = 0,
                          $ = n,
                          V = null;
                      t: for (;;) {
                          for (var Y; $ !== a || (p !== 0 && $.nodeType !== 3) || (T = x + p), $ !== g || (f !== 0 && $.nodeType !== 3) || (_ = x + f), $.nodeType === 3 && (x += $.nodeValue.length), (Y = $.firstChild) !== null; )
                              (V = $), ($ = Y);
                          for (;;) {
                              if ($ === n) break t;
                              if ((V === a && ++j === p && (T = x), V === g && ++B === f && (_ = x), (Y = $.nextSibling) !== null)) break;
                              ($ = V), (V = $.parentNode);
                          }
                          $ = Y;
                      }
                      a = T === -1 || _ === -1 ? null : { start: T, end: _ };
                  } else a = null;
              }
          a = a || { start: 0, end: 0 };
      } else a = null;
      for (bu = { focusedElem: n, selectionRange: a }, Ho = !1, X = r; X !== null; )
          if (((r = X), (n = r.child), (r.subtreeFlags & 1028) !== 0 && n !== null)) (n.return = r), (X = n);
          else
              for (; X !== null; ) {
                  r = X;
                  try {
                      var Z = r.alternate;
                      if (r.flags & 1024)
                          switch (r.tag) {
                              case 0:
                              case 11:
                              case 15:
                                  break;
                              case 1:
                                  if (Z !== null) {
                                      var J = Z.memoizedProps,
                                          qe = Z.memoizedState,
                                          O = r.stateNode,
                                          R = O.getSnapshotBeforeUpdate(r.elementType === r.type ? J : rn(r.type, J), qe);
                                      O.__reactInternalSnapshotBeforeUpdate = R;
                                  }
                                  break;
                              case 3:
                                  var L = r.stateNode.containerInfo;
                                  L.nodeType === 1 ? (L.textContent = "") : L.nodeType === 9 && L.documentElement && L.removeChild(L.documentElement);
                                  break;
                              case 5:
                              case 6:
                              case 4:
                              case 17:
                                  break;
                              default:
                                  throw Error(i(163));
                          }
                  } catch (H) {
                      Ve(r, r.return, H);
                  }
                  if (((n = r.sibling), n !== null)) {
                      (n.return = r.return), (X = n);
                      break;
                  }
                  X = r.return;
              }
      return (Z = vm), (vm = !1), Z;
  }
  function Vs(n, r, a) {
      var f = r.updateQueue;
      if (((f = f !== null ? f.lastEffect : null), f !== null)) {
          var p = (f = f.next);
          do {
              if ((p.tag & n) === n) {
                  var g = p.destroy;
                  (p.destroy = void 0), g !== void 0 && uc(r, a, g);
              }
              p = p.next;
          } while (p !== f);
      }
  }
  function Pa(n, r) {
      if (((r = r.updateQueue), (r = r !== null ? r.lastEffect : null), r !== null)) {
          var a = (r = r.next);
          do {
              if ((a.tag & n) === n) {
                  var f = a.create;
                  a.destroy = f();
              }
              a = a.next;
          } while (a !== r);
      }
  }
  function cc(n) {
      var r = n.ref;
      if (r !== null) {
          var a = n.stateNode;
          switch (n.tag) {
              case 5:
                  n = a;
                  break;
              default:
                  n = a;
          }
          typeof r == "function" ? r(n) : (r.current = n);
      }
  }
  function xm(n) {
      var r = n.alternate;
      r !== null && ((n.alternate = null), xm(r)),
          (n.child = null),
          (n.deletions = null),
          (n.sibling = null),
          n.tag === 5 && ((r = n.stateNode), r !== null && (delete r[xn], delete r[Rs], delete r[Tu], delete r[C1], delete r[k1])),
          (n.stateNode = null),
          (n.return = null),
          (n.dependencies = null),
          (n.memoizedProps = null),
          (n.memoizedState = null),
          (n.pendingProps = null),
          (n.stateNode = null),
          (n.updateQueue = null);
  }
  function wm(n) {
      return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Sm(n) {
      e: for (;;) {
          for (; n.sibling === null; ) {
              if (n.return === null || wm(n.return)) return null;
              n = n.return;
          }
          for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
              if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
              (n.child.return = n), (n = n.child);
          }
          if (!(n.flags & 2)) return n.stateNode;
      }
  }
  function fc(n, r, a) {
      var f = n.tag;
      if (f === 5 || f === 6)
          (n = n.stateNode),
              r
                  ? a.nodeType === 8
                      ? a.parentNode.insertBefore(n, r)
                      : a.insertBefore(n, r)
                  : (a.nodeType === 8 ? ((r = a.parentNode), r.insertBefore(n, a)) : ((r = a), r.appendChild(n)), (a = a._reactRootContainer), a != null || r.onclick !== null || (r.onclick = na));
      else if (f !== 4 && ((n = n.child), n !== null)) for (fc(n, r, a), n = n.sibling; n !== null; ) fc(n, r, a), (n = n.sibling);
  }
  function dc(n, r, a) {
      var f = n.tag;
      if (f === 5 || f === 6) (n = n.stateNode), r ? a.insertBefore(n, r) : a.appendChild(n);
      else if (f !== 4 && ((n = n.child), n !== null)) for (dc(n, r, a), n = n.sibling; n !== null; ) dc(n, r, a), (n = n.sibling);
  }
  var ot = null,
      sn = !1;
  function ri(n, r, a) {
      for (a = a.child; a !== null; ) bm(n, r, a), (a = a.sibling);
  }
  function bm(n, r, a) {
      if (vn && typeof vn.onCommitFiberUnmount == "function")
          try {
              vn.onCommitFiberUnmount(No, a);
          } catch {}
      switch (a.tag) {
          case 5:
              ht || Pr(a, r);
          case 6:
              var f = ot,
                  p = sn;
              (ot = null), ri(n, r, a), (ot = f), (sn = p), ot !== null && (sn ? ((n = ot), (a = a.stateNode), n.nodeType === 8 ? n.parentNode.removeChild(a) : n.removeChild(a)) : ot.removeChild(a.stateNode));
              break;
          case 18:
              ot !== null && (sn ? ((n = ot), (a = a.stateNode), n.nodeType === 8 ? Pu(n.parentNode, a) : n.nodeType === 1 && Pu(n, a), vs(n)) : Pu(ot, a.stateNode));
              break;
          case 4:
              (f = ot), (p = sn), (ot = a.stateNode.containerInfo), (sn = !0), ri(n, r, a), (ot = f), (sn = p);
              break;
          case 0:
          case 11:
          case 14:
          case 15:
              if (!ht && ((f = a.updateQueue), f !== null && ((f = f.lastEffect), f !== null))) {
                  p = f = f.next;
                  do {
                      var g = p,
                          x = g.destroy;
                      (g = g.tag), x !== void 0 && (g & 2 || g & 4) && uc(a, r, x), (p = p.next);
                  } while (p !== f);
              }
              ri(n, r, a);
              break;
          case 1:
              if (!ht && (Pr(a, r), (f = a.stateNode), typeof f.componentWillUnmount == "function"))
                  try {
                      (f.props = a.memoizedProps), (f.state = a.memoizedState), f.componentWillUnmount();
                  } catch (T) {
                      Ve(a, r, T);
                  }
              ri(n, r, a);
              break;
          case 21:
              ri(n, r, a);
              break;
          case 22:
              a.mode & 1 ? ((ht = (f = ht) || a.memoizedState !== null), ri(n, r, a), (ht = f)) : ri(n, r, a);
              break;
          default:
              ri(n, r, a);
      }
  }
  function Cm(n) {
      var r = n.updateQueue;
      if (r !== null) {
          n.updateQueue = null;
          var a = n.stateNode;
          a === null && (a = n.stateNode = new V1()),
              r.forEach(function (f) {
                  var p = Q1.bind(null, n, f);
                  a.has(f) || (a.add(f), f.then(p, p));
              });
      }
  }
  function on(n, r) {
      var a = r.deletions;
      if (a !== null)
          for (var f = 0; f < a.length; f++) {
              var p = a[f];
              try {
                  var g = n,
                      x = r,
                      T = x;
                  e: for (; T !== null; ) {
                      switch (T.tag) {
                          case 5:
                              (ot = T.stateNode), (sn = !1);
                              break e;
                          case 3:
                              (ot = T.stateNode.containerInfo), (sn = !0);
                              break e;
                          case 4:
                              (ot = T.stateNode.containerInfo), (sn = !0);
                              break e;
                      }
                      T = T.return;
                  }
                  if (ot === null) throw Error(i(160));
                  bm(g, x, p), (ot = null), (sn = !1);
                  var _ = p.alternate;
                  _ !== null && (_.return = null), (p.return = null);
              } catch (j) {
                  Ve(p, r, j);
              }
          }
      if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) km(r, n), (r = r.sibling);
  }
  function km(n, r) {
      var a = n.alternate,
          f = n.flags;
      switch (n.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
              if ((on(r, n), bn(n), f & 4)) {
                  try {
                      Vs(3, n, n.return), Pa(3, n);
                  } catch (J) {
                      Ve(n, n.return, J);
                  }
                  try {
                      Vs(5, n, n.return);
                  } catch (J) {
                      Ve(n, n.return, J);
                  }
              }
              break;
          case 1:
              on(r, n), bn(n), f & 512 && a !== null && Pr(a, a.return);
              break;
          case 5:
              if ((on(r, n), bn(n), f & 512 && a !== null && Pr(a, a.return), n.flags & 32)) {
                  var p = n.stateNode;
                  try {
                      as(p, "");
                  } catch (J) {
                      Ve(n, n.return, J);
                  }
              }
              if (f & 4 && ((p = n.stateNode), p != null)) {
                  var g = n.memoizedProps,
                      x = a !== null ? a.memoizedProps : g,
                      T = n.type,
                      _ = n.updateQueue;
                  if (((n.updateQueue = null), _ !== null))
                      try {
                          T === "input" && g.type === "radio" && g.name != null && Zd(p, g), Ul(T, x);
                          var j = Ul(T, g);
                          for (x = 0; x < _.length; x += 2) {
                              var B = _[x],
                                  $ = _[x + 1];
                              B === "style" ? oh(p, $) : B === "dangerouslySetInnerHTML" ? rh(p, $) : B === "children" ? as(p, $) : D(p, B, $, j);
                          }
                          switch (T) {
                              case "input":
                                  Nl(p, g);
                                  break;
                              case "textarea":
                                  th(p, g);
                                  break;
                              case "select":
                                  var V = p._wrapperState.wasMultiple;
                                  p._wrapperState.wasMultiple = !!g.multiple;
                                  var Y = g.value;
                                  Y != null ? rr(p, !!g.multiple, Y, !1) : V !== !!g.multiple && (g.defaultValue != null ? rr(p, !!g.multiple, g.defaultValue, !0) : rr(p, !!g.multiple, g.multiple ? [] : "", !1));
                          }
                          p[Rs] = g;
                      } catch (J) {
                          Ve(n, n.return, J);
                      }
              }
              break;
          case 6:
              if ((on(r, n), bn(n), f & 4)) {
                  if (n.stateNode === null) throw Error(i(162));
                  (p = n.stateNode), (g = n.memoizedProps);
                  try {
                      p.nodeValue = g;
                  } catch (J) {
                      Ve(n, n.return, J);
                  }
              }
              break;
          case 3:
              if ((on(r, n), bn(n), f & 4 && a !== null && a.memoizedState.isDehydrated))
                  try {
                      vs(r.containerInfo);
                  } catch (J) {
                      Ve(n, n.return, J);
                  }
              break;
          case 4:
              on(r, n), bn(n);
              break;
          case 13:
              on(r, n), bn(n), (p = n.child), p.flags & 8192 && ((g = p.memoizedState !== null), (p.stateNode.isHidden = g), !g || (p.alternate !== null && p.alternate.memoizedState !== null) || (mc = We())), f & 4 && Cm(n);
              break;
          case 22:
              if (((B = a !== null && a.memoizedState !== null), n.mode & 1 ? ((ht = (j = ht) || B), on(r, n), (ht = j)) : on(r, n), bn(n), f & 8192)) {
                  if (((j = n.memoizedState !== null), (n.stateNode.isHidden = j) && !B && n.mode & 1))
                      for (X = n, B = n.child; B !== null; ) {
                          for ($ = X = B; X !== null; ) {
                              switch (((V = X), (Y = V.child), V.tag)) {
                                  case 0:
                                  case 11:
                                  case 14:
                                  case 15:
                                      Vs(4, V, V.return);
                                      break;
                                  case 1:
                                      Pr(V, V.return);
                                      var Z = V.stateNode;
                                      if (typeof Z.componentWillUnmount == "function") {
                                          (f = V), (a = V.return);
                                          try {
                                              (r = f), (Z.props = r.memoizedProps), (Z.state = r.memoizedState), Z.componentWillUnmount();
                                          } catch (J) {
                                              Ve(f, a, J);
                                          }
                                      }
                                      break;
                                  case 5:
                                      Pr(V, V.return);
                                      break;
                                  case 22:
                                      if (V.memoizedState !== null) {
                                          Em($);
                                          continue;
                                      }
                              }
                              Y !== null ? ((Y.return = V), (X = Y)) : Em($);
                          }
                          B = B.sibling;
                      }
                  e: for (B = null, $ = n; ; ) {
                      if ($.tag === 5) {
                          if (B === null) {
                              B = $;
                              try {
                                  (p = $.stateNode),
                                      j
                                          ? ((g = p.style), typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : (g.display = "none"))
                                          : ((T = $.stateNode), (_ = $.memoizedProps.style), (x = _ != null && _.hasOwnProperty("display") ? _.display : null), (T.style.display = sh("display", x)));
                              } catch (J) {
                                  Ve(n, n.return, J);
                              }
                          }
                      } else if ($.tag === 6) {
                          if (B === null)
                              try {
                                  $.stateNode.nodeValue = j ? "" : $.memoizedProps;
                              } catch (J) {
                                  Ve(n, n.return, J);
                              }
                      } else if ((($.tag !== 22 && $.tag !== 23) || $.memoizedState === null || $ === n) && $.child !== null) {
                          ($.child.return = $), ($ = $.child);
                          continue;
                      }
                      if ($ === n) break e;
                      for (; $.sibling === null; ) {
                          if ($.return === null || $.return === n) break e;
                          B === $ && (B = null), ($ = $.return);
                      }
                      B === $ && (B = null), ($.sibling.return = $.return), ($ = $.sibling);
                  }
              }
              break;
          case 19:
              on(r, n), bn(n), f & 4 && Cm(n);
              break;
          case 21:
              break;
          default:
              on(r, n), bn(n);
      }
  }
  function bn(n) {
      var r = n.flags;
      if (r & 2) {
          try {
              e: {
                  for (var a = n.return; a !== null; ) {
                      if (wm(a)) {
                          var f = a;
                          break e;
                      }
                      a = a.return;
                  }
                  throw Error(i(160));
              }
              switch (f.tag) {
                  case 5:
                      var p = f.stateNode;
                      f.flags & 32 && (as(p, ""), (f.flags &= -33));
                      var g = Sm(n);
                      dc(n, g, p);
                      break;
                  case 3:
                  case 4:
                      var x = f.stateNode.containerInfo,
                          T = Sm(n);
                      fc(n, T, x);
                      break;
                  default:
                      throw Error(i(161));
              }
          } catch (_) {
              Ve(n, n.return, _);
          }
          n.flags &= -3;
      }
      r & 4096 && (n.flags &= -4097);
  }
  function $1(n, r, a) {
      (X = n), Pm(n);
  }
  function Pm(n, r, a) {
      for (var f = (n.mode & 1) !== 0; X !== null; ) {
          var p = X,
              g = p.child;
          if (p.tag === 22 && f) {
              var x = p.memoizedState !== null || ka;
              if (!x) {
                  var T = p.alternate,
                      _ = (T !== null && T.memoizedState !== null) || ht;
                  T = ka;
                  var j = ht;
                  if (((ka = x), (ht = _) && !j)) for (X = p; X !== null; ) (x = X), (_ = x.child), x.tag === 22 && x.memoizedState !== null ? _m(p) : _ !== null ? ((_.return = x), (X = _)) : _m(p);
                  for (; g !== null; ) (X = g), Pm(g), (g = g.sibling);
                  (X = p), (ka = T), (ht = j);
              }
              Tm(n);
          } else p.subtreeFlags & 8772 && g !== null ? ((g.return = p), (X = g)) : Tm(n);
      }
  }
  function Tm(n) {
      for (; X !== null; ) {
          var r = X;
          if (r.flags & 8772) {
              var a = r.alternate;
              try {
                  if (r.flags & 8772)
                      switch (r.tag) {
                          case 0:
                          case 11:
                          case 15:
                              ht || Pa(5, r);
                              break;
                          case 1:
                              var f = r.stateNode;
                              if (r.flags & 4 && !ht)
                                  if (a === null) f.componentDidMount();
                                  else {
                                      var p = r.elementType === r.type ? a.memoizedProps : rn(r.type, a.memoizedProps);
                                      f.componentDidUpdate(p, a.memoizedState, f.__reactInternalSnapshotBeforeUpdate);
                                  }
                              var g = r.updateQueue;
                              g !== null && Ep(r, g, f);
                              break;
                          case 3:
                              var x = r.updateQueue;
                              if (x !== null) {
                                  if (((a = null), r.child !== null))
                                      switch (r.child.tag) {
                                          case 5:
                                              a = r.child.stateNode;
                                              break;
                                          case 1:
                                              a = r.child.stateNode;
                                      }
                                  Ep(r, x, a);
                              }
                              break;
                          case 5:
                              var T = r.stateNode;
                              if (a === null && r.flags & 4) {
                                  a = T;
                                  var _ = r.memoizedProps;
                                  switch (r.type) {
                                      case "button":
                                      case "input":
                                      case "select":
                                      case "textarea":
                                          _.autoFocus && a.focus();
                                          break;
                                      case "img":
                                          _.src && (a.src = _.src);
                                  }
                              }
                              break;
                          case 6:
                              break;
                          case 4:
                              break;
                          case 12:
                              break;
                          case 13:
                              if (r.memoizedState === null) {
                                  var j = r.alternate;
                                  if (j !== null) {
                                      var B = j.memoizedState;
                                      if (B !== null) {
                                          var $ = B.dehydrated;
                                          $ !== null && vs($);
                                      }
                                  }
                              }
                              break;
                          case 19:
                          case 17:
                          case 21:
                          case 22:
                          case 23:
                          case 25:
                              break;
                          default:
                              throw Error(i(163));
                      }
                  ht || (r.flags & 512 && cc(r));
              } catch (V) {
                  Ve(r, r.return, V);
              }
          }
          if (r === n) {
              X = null;
              break;
          }
          if (((a = r.sibling), a !== null)) {
              (a.return = r.return), (X = a);
              break;
          }
          X = r.return;
      }
  }
  function Em(n) {
      for (; X !== null; ) {
          var r = X;
          if (r === n) {
              X = null;
              break;
          }
          var a = r.sibling;
          if (a !== null) {
              (a.return = r.return), (X = a);
              break;
          }
          X = r.return;
      }
  }
  function _m(n) {
      for (; X !== null; ) {
          var r = X;
          try {
              switch (r.tag) {
                  case 0:
                  case 11:
                  case 15:
                      var a = r.return;
                      try {
                          Pa(4, r);
                      } catch (_) {
                          Ve(r, a, _);
                      }
                      break;
                  case 1:
                      var f = r.stateNode;
                      if (typeof f.componentDidMount == "function") {
                          var p = r.return;
                          try {
                              f.componentDidMount();
                          } catch (_) {
                              Ve(r, p, _);
                          }
                      }
                      var g = r.return;
                      try {
                          cc(r);
                      } catch (_) {
                          Ve(r, g, _);
                      }
                      break;
                  case 5:
                      var x = r.return;
                      try {
                          cc(r);
                      } catch (_) {
                          Ve(r, x, _);
                      }
              }
          } catch (_) {
              Ve(r, r.return, _);
          }
          if (r === n) {
              X = null;
              break;
          }
          var T = r.sibling;
          if (T !== null) {
              (T.return = r.return), (X = T);
              break;
          }
          X = r.return;
      }
  }
  var U1 = Math.ceil,
      Ta = I.ReactCurrentDispatcher,
      hc = I.ReactCurrentOwner,
      Wt = I.ReactCurrentBatchConfig,
      we = 0,
      tt = null,
      Ye = null,
      at = 0,
      It = 0,
      Tr = Jn(0),
      Je = 0,
      Bs = null,
      Mi = 0,
      Ea = 0,
      pc = 0,
      $s = null,
      Tt = null,
      mc = 0,
      Er = 1 / 0,
      Vn = null,
      _a = !1,
      gc = null,
      si = null,
      Ra = !1,
      oi = null,
      Ma = 0,
      Us = 0,
      yc = null,
      Aa = -1,
      Oa = 0;
  function wt() {
      return we & 6 ? We() : Aa !== -1 ? Aa : (Aa = We());
  }
  function ai(n) {
      return n.mode & 1 ? (we & 2 && at !== 0 ? at & -at : T1.transition !== null ? (Oa === 0 && (Oa = Sh()), Oa) : ((n = Pe), n !== 0 || ((n = window.event), (n = n === void 0 ? 16 : Mh(n.type))), n)) : 1;
  }
  function an(n, r, a, f) {
      if (50 < Us) throw ((Us = 0), (yc = null), Error(i(185)));
      hs(n, a, f), (!(we & 2) || n !== tt) && (n === tt && (!(we & 2) && (Ea |= a), Je === 4 && li(n, at)), Et(n, f), a === 1 && we === 0 && !(r.mode & 1) && ((Er = We() + 500), oa && ti()));
  }
  function Et(n, r) {
      var a = n.callbackNode;
      Tw(n, r);
      var f = Bo(n, n === tt ? at : 0);
      if (f === 0) a !== null && vh(a), (n.callbackNode = null), (n.callbackPriority = 0);
      else if (((r = f & -f), n.callbackPriority !== r)) {
          if ((a != null && vh(a), r === 1))
              n.tag === 0 ? P1(Mm.bind(null, n)) : mp(Mm.bind(null, n)),
                  S1(function () {
                      !(we & 6) && ti();
                  }),
                  (a = null);
          else {
              switch (bh(f)) {
                  case 1:
                      a = Ql;
                      break;
                  case 4:
                      a = xh;
                      break;
                  case 16:
                      a = zo;
                      break;
                  case 536870912:
                      a = wh;
                      break;
                  default:
                      a = zo;
              }
              a = Nm(a, Rm.bind(null, n));
          }
          (n.callbackPriority = r), (n.callbackNode = a);
      }
  }
  function Rm(n, r) {
      if (((Aa = -1), (Oa = 0), we & 6)) throw Error(i(327));
      var a = n.callbackNode;
      if (_r() && n.callbackNode !== a) return null;
      var f = Bo(n, n === tt ? at : 0);
      if (f === 0) return null;
      if (f & 30 || f & n.expiredLanes || r) r = Da(n, f);
      else {
          r = f;
          var p = we;
          we |= 2;
          var g = Om();
          (tt !== n || at !== r) && ((Vn = null), (Er = We() + 500), Oi(n, r));
          do
              try {
                  q1();
                  break;
              } catch (T) {
                  Am(n, T);
              }
          while (!0);
          Iu(), (Ta.current = g), (we = p), Ye !== null ? (r = 0) : ((tt = null), (at = 0), (r = Je));
      }
      if (r !== 0) {
          if ((r === 2 && ((p = Xl(n)), p !== 0 && ((f = p), (r = vc(n, p)))), r === 1)) throw ((a = Bs), Oi(n, 0), li(n, f), Et(n, We()), a);
          if (r === 6) li(n, f);
          else {
              if (((p = n.current.alternate), !(f & 30) && !H1(p) && ((r = Da(n, f)), r === 2 && ((g = Xl(n)), g !== 0 && ((f = g), (r = vc(n, g)))), r === 1))) throw ((a = Bs), Oi(n, 0), li(n, f), Et(n, We()), a);
              switch (((n.finishedWork = p), (n.finishedLanes = f), r)) {
                  case 0:
                  case 1:
                      throw Error(i(345));
                  case 2:
                      Di(n, Tt, Vn);
                      break;
                  case 3:
                      if ((li(n, f), (f & 130023424) === f && ((r = mc + 500 - We()), 10 < r))) {
                          if (Bo(n, 0) !== 0) break;
                          if (((p = n.suspendedLanes), (p & f) !== f)) {
                              wt(), (n.pingedLanes |= n.suspendedLanes & p);
                              break;
                          }
                          n.timeoutHandle = ku(Di.bind(null, n, Tt, Vn), r);
                          break;
                      }
                      Di(n, Tt, Vn);
                      break;
                  case 4:
                      if ((li(n, f), (f & 4194240) === f)) break;
                      for (r = n.eventTimes, p = -1; 0 < f; ) {
                          var x = 31 - en(f);
                          (g = 1 << x), (x = r[x]), x > p && (p = x), (f &= ~g);
                      }
                      if (((f = p), (f = We() - f), (f = (120 > f ? 120 : 480 > f ? 480 : 1080 > f ? 1080 : 1920 > f ? 1920 : 3e3 > f ? 3e3 : 4320 > f ? 4320 : 1960 * U1(f / 1960)) - f), 10 < f)) {
                          n.timeoutHandle = ku(Di.bind(null, n, Tt, Vn), f);
                          break;
                      }
                      Di(n, Tt, Vn);
                      break;
                  case 5:
                      Di(n, Tt, Vn);
                      break;
                  default:
                      throw Error(i(329));
              }
          }
      }
      return Et(n, We()), n.callbackNode === a ? Rm.bind(null, n) : null;
  }
  function vc(n, r) {
      var a = $s;
      return n.current.memoizedState.isDehydrated && (Oi(n, r).flags |= 256), (n = Da(n, r)), n !== 2 && ((r = Tt), (Tt = a), r !== null && xc(r)), n;
  }
  function xc(n) {
      Tt === null ? (Tt = n) : Tt.push.apply(Tt, n);
  }
  function H1(n) {
      for (var r = n; ; ) {
          if (r.flags & 16384) {
              var a = r.updateQueue;
              if (a !== null && ((a = a.stores), a !== null))
                  for (var f = 0; f < a.length; f++) {
                      var p = a[f],
                          g = p.getSnapshot;
                      p = p.value;
                      try {
                          if (!tn(g(), p)) return !1;
                      } catch {
                          return !1;
                      }
                  }
          }
          if (((a = r.child), r.subtreeFlags & 16384 && a !== null)) (a.return = r), (r = a);
          else {
              if (r === n) break;
              for (; r.sibling === null; ) {
                  if (r.return === null || r.return === n) return !0;
                  r = r.return;
              }
              (r.sibling.return = r.return), (r = r.sibling);
          }
      }
      return !0;
  }
  function li(n, r) {
      for (r &= ~pc, r &= ~Ea, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
          var a = 31 - en(r),
              f = 1 << a;
          (n[a] = -1), (r &= ~f);
      }
  }
  function Mm(n) {
      if (we & 6) throw Error(i(327));
      _r();
      var r = Bo(n, 0);
      if (!(r & 1)) return Et(n, We()), null;
      var a = Da(n, r);
      if (n.tag !== 0 && a === 2) {
          var f = Xl(n);
          f !== 0 && ((r = f), (a = vc(n, f)));
      }
      if (a === 1) throw ((a = Bs), Oi(n, 0), li(n, r), Et(n, We()), a);
      if (a === 6) throw Error(i(345));
      return (n.finishedWork = n.current.alternate), (n.finishedLanes = r), Di(n, Tt, Vn), Et(n, We()), null;
  }
  function wc(n, r) {
      var a = we;
      we |= 1;
      try {
          return n(r);
      } finally {
          (we = a), we === 0 && ((Er = We() + 500), oa && ti());
      }
  }
  function Ai(n) {
      oi !== null && oi.tag === 0 && !(we & 6) && _r();
      var r = we;
      we |= 1;
      var a = Wt.transition,
          f = Pe;
      try {
          if (((Wt.transition = null), (Pe = 1), n)) return n();
      } finally {
          (Pe = f), (Wt.transition = a), (we = r), !(we & 6) && ti();
      }
  }
  function Sc() {
      (It = Tr.current), Me(Tr);
  }
  function Oi(n, r) {
      (n.finishedWork = null), (n.finishedLanes = 0);
      var a = n.timeoutHandle;
      if ((a !== -1 && ((n.timeoutHandle = -1), w1(a)), Ye !== null))
          for (a = Ye.return; a !== null; ) {
              var f = a;
              switch ((Mu(f), f.tag)) {
                  case 1:
                      (f = f.type.childContextTypes), f != null && ra();
                      break;
                  case 3:
                      Cr(), Me(Ct), Me(ct), Uu();
                      break;
                  case 5:
                      Bu(f);
                      break;
                  case 4:
                      Cr();
                      break;
                  case 13:
                      Me(Ne);
                      break;
                  case 19:
                      Me(Ne);
                      break;
                  case 10:
                      ju(f.type._context);
                      break;
                  case 22:
                  case 23:
                      Sc();
              }
              a = a.return;
          }
      if (((tt = n), (Ye = n = ui(n.current, null)), (at = It = r), (Je = 0), (Bs = null), (pc = Ea = Mi = 0), (Tt = $s = null), Ei !== null)) {
          for (r = 0; r < Ei.length; r++)
              if (((a = Ei[r]), (f = a.interleaved), f !== null)) {
                  a.interleaved = null;
                  var p = f.next,
                      g = a.pending;
                  if (g !== null) {
                      var x = g.next;
                      (g.next = p), (f.next = x);
                  }
                  a.pending = f;
              }
          Ei = null;
      }
      return n;
  }
  function Am(n, r) {
      do {
          var a = Ye;
          try {
              if ((Iu(), (ga.current = wa), ya)) {
                  for (var f = Fe.memoizedState; f !== null; ) {
                      var p = f.queue;
                      p !== null && (p.pending = null), (f = f.next);
                  }
                  ya = !1;
              }
              if (((Ri = 0), (et = Ze = Fe = null), (Is = !1), (js = 0), (hc.current = null), a === null || a.return === null)) {
                  (Je = 1), (Bs = r), (Ye = null);
                  break;
              }
              e: {
                  var g = n,
                      x = a.return,
                      T = a,
                      _ = r;
                  if (((r = at), (T.flags |= 32768), _ !== null && typeof _ == "object" && typeof _.then == "function")) {
                      var j = _,
                          B = T,
                          $ = B.tag;
                      if (!(B.mode & 1) && ($ === 0 || $ === 11 || $ === 15)) {
                          var V = B.alternate;
                          V ? ((B.updateQueue = V.updateQueue), (B.memoizedState = V.memoizedState), (B.lanes = V.lanes)) : ((B.updateQueue = null), (B.memoizedState = null));
                      }
                      var Y = nm(x);
                      if (Y !== null) {
                          (Y.flags &= -257), im(Y, x, T, g, r), Y.mode & 1 && tm(g, j, r), (r = Y), (_ = j);
                          var Z = r.updateQueue;
                          if (Z === null) {
                              var J = new Set();
                              J.add(_), (r.updateQueue = J);
                          } else Z.add(_);
                          break e;
                      } else {
                          if (!(r & 1)) {
                              tm(g, j, r), bc();
                              break e;
                          }
                          _ = Error(i(426));
                      }
                  } else if (De && T.mode & 1) {
                      var qe = nm(x);
                      if (qe !== null) {
                          !(qe.flags & 65536) && (qe.flags |= 256), im(qe, x, T, g, r), Du(kr(_, T));
                          break e;
                      }
                  }
                  (g = _ = kr(_, T)), Je !== 4 && (Je = 2), $s === null ? ($s = [g]) : $s.push(g), (g = x);
                  do {
                      switch (g.tag) {
                          case 3:
                              (g.flags |= 65536), (r &= -r), (g.lanes |= r);
                              var O = Jp(g, _, r);
                              Tp(g, O);
                              break e;
                          case 1:
                              T = _;
                              var R = g.type,
                                  L = g.stateNode;
                              if (!(g.flags & 128) && (typeof R.getDerivedStateFromError == "function" || (L !== null && typeof L.componentDidCatch == "function" && (si === null || !si.has(L))))) {
                                  (g.flags |= 65536), (r &= -r), (g.lanes |= r);
                                  var H = em(g, T, r);
                                  Tp(g, H);
                                  break e;
                              }
                      }
                      g = g.return;
                  } while (g !== null);
              }
              Lm(a);
          } catch (ee) {
              (r = ee), Ye === a && a !== null && (Ye = a = a.return);
              continue;
          }
          break;
      } while (!0);
  }
  function Om() {
      var n = Ta.current;
      return (Ta.current = wa), n === null ? wa : n;
  }
  function bc() {
      (Je === 0 || Je === 3 || Je === 2) && (Je = 4), tt === null || (!(Mi & 268435455) && !(Ea & 268435455)) || li(tt, at);
  }
  function Da(n, r) {
      var a = we;
      we |= 2;
      var f = Om();
      (tt !== n || at !== r) && ((Vn = null), Oi(n, r));
      do
          try {
              W1();
              break;
          } catch (p) {
              Am(n, p);
          }
      while (!0);
      if ((Iu(), (we = a), (Ta.current = f), Ye !== null)) throw Error(i(261));
      return (tt = null), (at = 0), Je;
  }
  function W1() {
      for (; Ye !== null; ) Dm(Ye);
  }
  function q1() {
      for (; Ye !== null && !yw(); ) Dm(Ye);
  }
  function Dm(n) {
      var r = zm(n.alternate, n, It);
      (n.memoizedProps = n.pendingProps), r === null ? Lm(n) : (Ye = r), (hc.current = null);
  }
  function Lm(n) {
      var r = n;
      do {
          var a = r.alternate;
          if (((n = r.return), r.flags & 32768)) {
              if (((a = F1(a, r)), a !== null)) {
                  (a.flags &= 32767), (Ye = a);
                  return;
              }
              if (n !== null) (n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null);
              else {
                  (Je = 6), (Ye = null);
                  return;
              }
          } else if (((a = N1(a, r, It)), a !== null)) {
              Ye = a;
              return;
          }
          if (((r = r.sibling), r !== null)) {
              Ye = r;
              return;
          }
          Ye = r = n;
      } while (r !== null);
      Je === 0 && (Je = 5);
  }
  function Di(n, r, a) {
      var f = Pe,
          p = Wt.transition;
      try {
          (Wt.transition = null), (Pe = 1), K1(n, r, a, f);
      } finally {
          (Wt.transition = p), (Pe = f);
      }
      return null;
  }
  function K1(n, r, a, f) {
      do _r();
      while (oi !== null);
      if (we & 6) throw Error(i(327));
      a = n.finishedWork;
      var p = n.finishedLanes;
      if (a === null) return null;
      if (((n.finishedWork = null), (n.finishedLanes = 0), a === n.current)) throw Error(i(177));
      (n.callbackNode = null), (n.callbackPriority = 0);
      var g = a.lanes | a.childLanes;
      if (
          (Ew(n, g),
          n === tt && ((Ye = tt = null), (at = 0)),
          (!(a.subtreeFlags & 2064) && !(a.flags & 2064)) ||
              Ra ||
              ((Ra = !0),
              Nm(zo, function () {
                  return _r(), null;
              })),
          (g = (a.flags & 15990) !== 0),
          a.subtreeFlags & 15990 || g)
      ) {
          (g = Wt.transition), (Wt.transition = null);
          var x = Pe;
          Pe = 1;
          var T = we;
          (we |= 4), (hc.current = null), B1(n, a), km(a, n), h1(bu), (Ho = !!Su), (bu = Su = null), (n.current = a), $1(a), vw(), (we = T), (Pe = x), (Wt.transition = g);
      } else n.current = a;
      if ((Ra && ((Ra = !1), (oi = n), (Ma = p)), (g = n.pendingLanes), g === 0 && (si = null), Sw(a.stateNode), Et(n, We()), r !== null))
          for (f = n.onRecoverableError, a = 0; a < r.length; a++) (p = r[a]), f(p.value, { componentStack: p.stack, digest: p.digest });
      if (_a) throw ((_a = !1), (n = gc), (gc = null), n);
      return Ma & 1 && n.tag !== 0 && _r(), (g = n.pendingLanes), g & 1 ? (n === yc ? Us++ : ((Us = 0), (yc = n))) : (Us = 0), ti(), null;
  }
  function _r() {
      if (oi !== null) {
          var n = bh(Ma),
              r = Wt.transition,
              a = Pe;
          try {
              if (((Wt.transition = null), (Pe = 16 > n ? 16 : n), oi === null)) var f = !1;
              else {
                  if (((n = oi), (oi = null), (Ma = 0), we & 6)) throw Error(i(331));
                  var p = we;
                  for (we |= 4, X = n.current; X !== null; ) {
                      var g = X,
                          x = g.child;
                      if (X.flags & 16) {
                          var T = g.deletions;
                          if (T !== null) {
                              for (var _ = 0; _ < T.length; _++) {
                                  var j = T[_];
                                  for (X = j; X !== null; ) {
                                      var B = X;
                                      switch (B.tag) {
                                          case 0:
                                          case 11:
                                          case 15:
                                              Vs(8, B, g);
                                      }
                                      var $ = B.child;
                                      if ($ !== null) ($.return = B), (X = $);
                                      else
                                          for (; X !== null; ) {
                                              B = X;
                                              var V = B.sibling,
                                                  Y = B.return;
                                              if ((xm(B), B === j)) {
                                                  X = null;
                                                  break;
                                              }
                                              if (V !== null) {
                                                  (V.return = Y), (X = V);
                                                  break;
                                              }
                                              X = Y;
                                          }
                                  }
                              }
                              var Z = g.alternate;
                              if (Z !== null) {
                                  var J = Z.child;
                                  if (J !== null) {
                                      Z.child = null;
                                      do {
                                          var qe = J.sibling;
                                          (J.sibling = null), (J = qe);
                                      } while (J !== null);
                                  }
                              }
                              X = g;
                          }
                      }
                      if (g.subtreeFlags & 2064 && x !== null) (x.return = g), (X = x);
                      else
                          e: for (; X !== null; ) {
                              if (((g = X), g.flags & 2048))
                                  switch (g.tag) {
                                      case 0:
                                      case 11:
                                      case 15:
                                          Vs(9, g, g.return);
                                  }
                              var O = g.sibling;
                              if (O !== null) {
                                  (O.return = g.return), (X = O);
                                  break e;
                              }
                              X = g.return;
                          }
                  }
                  var R = n.current;
                  for (X = R; X !== null; ) {
                      x = X;
                      var L = x.child;
                      if (x.subtreeFlags & 2064 && L !== null) (L.return = x), (X = L);
                      else
                          e: for (x = R; X !== null; ) {
                              if (((T = X), T.flags & 2048))
                                  try {
                                      switch (T.tag) {
                                          case 0:
                                          case 11:
                                          case 15:
                                              Pa(9, T);
                                      }
                                  } catch (ee) {
                                      Ve(T, T.return, ee);
                                  }
                              if (T === x) {
                                  X = null;
                                  break e;
                              }
                              var H = T.sibling;
                              if (H !== null) {
                                  (H.return = T.return), (X = H);
                                  break e;
                              }
                              X = T.return;
                          }
                  }
                  if (((we = p), ti(), vn && typeof vn.onPostCommitFiberRoot == "function"))
                      try {
                          vn.onPostCommitFiberRoot(No, n);
                      } catch {}
                  f = !0;
              }
              return f;
          } finally {
              (Pe = a), (Wt.transition = r);
          }
      }
      return !1;
  }
  function Im(n, r, a) {
      (r = kr(a, r)), (r = Jp(n, r, 1)), (n = ii(n, r, 1)), (r = wt()), n !== null && (hs(n, 1, r), Et(n, r));
  }
  function Ve(n, r, a) {
      if (n.tag === 3) Im(n, n, a);
      else
          for (; r !== null; ) {
              if (r.tag === 3) {
                  Im(r, n, a);
                  break;
              } else if (r.tag === 1) {
                  var f = r.stateNode;
                  if (typeof r.type.getDerivedStateFromError == "function" || (typeof f.componentDidCatch == "function" && (si === null || !si.has(f)))) {
                      (n = kr(a, n)), (n = em(r, n, 1)), (r = ii(r, n, 1)), (n = wt()), r !== null && (hs(r, 1, n), Et(r, n));
                      break;
                  }
              }
              r = r.return;
          }
  }
  function G1(n, r, a) {
      var f = n.pingCache;
      f !== null && f.delete(r), (r = wt()), (n.pingedLanes |= n.suspendedLanes & a), tt === n && (at & a) === a && (Je === 4 || (Je === 3 && (at & 130023424) === at && 500 > We() - mc) ? Oi(n, 0) : (pc |= a)), Et(n, r);
  }
  function jm(n, r) {
      r === 0 && (n.mode & 1 ? ((r = Vo), (Vo <<= 1), !(Vo & 130023424) && (Vo = 4194304)) : (r = 1));
      var a = wt();
      (n = zn(n, r)), n !== null && (hs(n, r, a), Et(n, a));
  }
  function Y1(n) {
      var r = n.memoizedState,
          a = 0;
      r !== null && (a = r.retryLane), jm(n, a);
  }
  function Q1(n, r) {
      var a = 0;
      switch (n.tag) {
          case 13:
              var f = n.stateNode,
                  p = n.memoizedState;
              p !== null && (a = p.retryLane);
              break;
          case 19:
              f = n.stateNode;
              break;
          default:
              throw Error(i(314));
      }
      f !== null && f.delete(r), jm(n, a);
  }
  var zm;
  zm = function (n, r, a) {
      if (n !== null)
          if (n.memoizedProps !== r.pendingProps || Ct.current) Pt = !0;
          else {
              if (!(n.lanes & a) && !(r.flags & 128)) return (Pt = !1), z1(n, r, a);
              Pt = !!(n.flags & 131072);
          }
      else (Pt = !1), De && r.flags & 1048576 && gp(r, la, r.index);
      switch (((r.lanes = 0), r.tag)) {
          case 2:
              var f = r.type;
              Ca(n, r), (n = r.pendingProps);
              var p = gr(r, ct.current);
              br(r, a), (p = qu(null, r, f, n, p, a));
              var g = Ku();
              return (
                  (r.flags |= 1),
                  typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
                      ? ((r.tag = 1),
                        (r.memoizedState = null),
                        (r.updateQueue = null),
                        kt(f) ? ((g = !0), sa(r)) : (g = !1),
                        (r.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null),
                        Fu(r),
                        (p.updater = Sa),
                        (r.stateNode = p),
                        (p._reactInternals = r),
                        Ju(r, f, n, a),
                        (r = ic(null, r, f, !0, g, a)))
                      : ((r.tag = 0), De && g && Ru(r), xt(null, r, p, a), (r = r.child)),
                  r
              );
          case 16:
              f = r.elementType;
              e: {
                  switch ((Ca(n, r), (n = r.pendingProps), (p = f._init), (f = p(f._payload)), (r.type = f), (p = r.tag = Z1(f)), (n = rn(f, n)), p)) {
                      case 0:
                          r = nc(null, r, f, n, a);
                          break e;
                      case 1:
                          r = um(null, r, f, n, a);
                          break e;
                      case 11:
                          r = rm(null, r, f, n, a);
                          break e;
                      case 14:
                          r = sm(null, r, f, rn(f.type, n), a);
                          break e;
                  }
                  throw Error(i(306, f, ""));
              }
              return r;
          case 0:
              return (f = r.type), (p = r.pendingProps), (p = r.elementType === f ? p : rn(f, p)), nc(n, r, f, p, a);
          case 1:
              return (f = r.type), (p = r.pendingProps), (p = r.elementType === f ? p : rn(f, p)), um(n, r, f, p, a);
          case 3:
              e: {
                  if ((cm(r), n === null)) throw Error(i(387));
                  (f = r.pendingProps), (g = r.memoizedState), (p = g.element), Pp(n, r), pa(r, f, null, a);
                  var x = r.memoizedState;
                  if (((f = x.element), g.isDehydrated))
                      if (((g = { element: f, isDehydrated: !1, cache: x.cache, pendingSuspenseBoundaries: x.pendingSuspenseBoundaries, transitions: x.transitions }), (r.updateQueue.baseState = g), (r.memoizedState = g), r.flags & 256)) {
                          (p = kr(Error(i(423)), r)), (r = fm(n, r, f, a, p));
                          break e;
                      } else if (f !== p) {
                          (p = kr(Error(i(424)), r)), (r = fm(n, r, f, a, p));
                          break e;
                      } else for (Lt = Zn(r.stateNode.containerInfo.firstChild), Dt = r, De = !0, nn = null, a = Cp(r, null, f, a), r.child = a; a; ) (a.flags = (a.flags & -3) | 4096), (a = a.sibling);
                  else {
                      if ((xr(), f === p)) {
                          r = Fn(n, r, a);
                          break e;
                      }
                      xt(n, r, f, a);
                  }
                  r = r.child;
              }
              return r;
          case 5:
              return (
                  _p(r),
                  n === null && Ou(r),
                  (f = r.type),
                  (p = r.pendingProps),
                  (g = n !== null ? n.memoizedProps : null),
                  (x = p.children),
                  Cu(f, p) ? (x = null) : g !== null && Cu(f, g) && (r.flags |= 32),
                  lm(n, r),
                  xt(n, r, x, a),
                  r.child
              );
          case 6:
              return n === null && Ou(r), null;
          case 13:
              return dm(n, r, a);
          case 4:
              return Vu(r, r.stateNode.containerInfo), (f = r.pendingProps), n === null ? (r.child = wr(r, null, f, a)) : xt(n, r, f, a), r.child;
          case 11:
              return (f = r.type), (p = r.pendingProps), (p = r.elementType === f ? p : rn(f, p)), rm(n, r, f, p, a);
          case 7:
              return xt(n, r, r.pendingProps, a), r.child;
          case 8:
              return xt(n, r, r.pendingProps.children, a), r.child;
          case 12:
              return xt(n, r, r.pendingProps.children, a), r.child;
          case 10:
              e: {
                  if (((f = r.type._context), (p = r.pendingProps), (g = r.memoizedProps), (x = p.value), Ee(fa, f._currentValue), (f._currentValue = x), g !== null))
                      if (tn(g.value, x)) {
                          if (g.children === p.children && !Ct.current) {
                              r = Fn(n, r, a);
                              break e;
                          }
                      } else
                          for (g = r.child, g !== null && (g.return = r); g !== null; ) {
                              var T = g.dependencies;
                              if (T !== null) {
                                  x = g.child;
                                  for (var _ = T.firstContext; _ !== null; ) {
                                      if (_.context === f) {
                                          if (g.tag === 1) {
                                              (_ = Nn(-1, a & -a)), (_.tag = 2);
                                              var j = g.updateQueue;
                                              if (j !== null) {
                                                  j = j.shared;
                                                  var B = j.pending;
                                                  B === null ? (_.next = _) : ((_.next = B.next), (B.next = _)), (j.pending = _);
                                              }
                                          }
                                          (g.lanes |= a), (_ = g.alternate), _ !== null && (_.lanes |= a), zu(g.return, a, r), (T.lanes |= a);
                                          break;
                                      }
                                      _ = _.next;
                                  }
                              } else if (g.tag === 10) x = g.type === r.type ? null : g.child;
                              else if (g.tag === 18) {
                                  if (((x = g.return), x === null)) throw Error(i(341));
                                  (x.lanes |= a), (T = x.alternate), T !== null && (T.lanes |= a), zu(x, a, r), (x = g.sibling);
                              } else x = g.child;
                              if (x !== null) x.return = g;
                              else
                                  for (x = g; x !== null; ) {
                                      if (x === r) {
                                          x = null;
                                          break;
                                      }
                                      if (((g = x.sibling), g !== null)) {
                                          (g.return = x.return), (x = g);
                                          break;
                                      }
                                      x = x.return;
                                  }
                              g = x;
                          }
                  xt(n, r, p.children, a), (r = r.child);
              }
              return r;
          case 9:
              return (p = r.type), (f = r.pendingProps.children), br(r, a), (p = Ut(p)), (f = f(p)), (r.flags |= 1), xt(n, r, f, a), r.child;
          case 14:
              return (f = r.type), (p = rn(f, r.pendingProps)), (p = rn(f.type, p)), sm(n, r, f, p, a);
          case 15:
              return om(n, r, r.type, r.pendingProps, a);
          case 17:
              return (f = r.type), (p = r.pendingProps), (p = r.elementType === f ? p : rn(f, p)), Ca(n, r), (r.tag = 1), kt(f) ? ((n = !0), sa(r)) : (n = !1), br(r, a), Xp(r, f, p), Ju(r, f, p, a), ic(null, r, f, !0, n, a);
          case 19:
              return pm(n, r, a);
          case 22:
              return am(n, r, a);
      }
      throw Error(i(156, r.tag));
  };
  function Nm(n, r) {
      return yh(n, r);
  }
  function X1(n, r, a, f) {
      (this.tag = n),
          (this.key = a),
          (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
          (this.index = 0),
          (this.ref = null),
          (this.pendingProps = r),
          (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
          (this.mode = f),
          (this.subtreeFlags = this.flags = 0),
          (this.deletions = null),
          (this.childLanes = this.lanes = 0),
          (this.alternate = null);
  }
  function qt(n, r, a, f) {
      return new X1(n, r, a, f);
  }
  function Cc(n) {
      return (n = n.prototype), !(!n || !n.isReactComponent);
  }
  function Z1(n) {
      if (typeof n == "function") return Cc(n) ? 1 : 0;
      if (n != null) {
          if (((n = n.$$typeof), n === _e)) return 11;
          if (n === Ge) return 14;
      }
      return 2;
  }
  function ui(n, r) {
      var a = n.alternate;
      return (
          a === null
              ? ((a = qt(n.tag, r, n.key, n.mode)), (a.elementType = n.elementType), (a.type = n.type), (a.stateNode = n.stateNode), (a.alternate = n), (n.alternate = a))
              : ((a.pendingProps = r), (a.type = n.type), (a.flags = 0), (a.subtreeFlags = 0), (a.deletions = null)),
          (a.flags = n.flags & 14680064),
          (a.childLanes = n.childLanes),
          (a.lanes = n.lanes),
          (a.child = n.child),
          (a.memoizedProps = n.memoizedProps),
          (a.memoizedState = n.memoizedState),
          (a.updateQueue = n.updateQueue),
          (r = n.dependencies),
          (a.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }),
          (a.sibling = n.sibling),
          (a.index = n.index),
          (a.ref = n.ref),
          a
      );
  }
  function La(n, r, a, f, p, g) {
      var x = 2;
      if (((f = n), typeof n == "function")) Cc(n) && (x = 1);
      else if (typeof n == "string") x = 5;
      else
          e: switch (n) {
              case Q:
                  return Li(a.children, p, g, r);
              case q:
                  (x = 8), (p |= 8);
                  break;
              case K:
                  return (n = qt(12, a, r, p | 2)), (n.elementType = K), (n.lanes = g), n;
              case Te:
                  return (n = qt(13, a, r, p)), (n.elementType = Te), (n.lanes = g), n;
              case he:
                  return (n = qt(19, a, r, p)), (n.elementType = he), (n.lanes = g), n;
              case ae:
                  return Ia(a, p, g, r);
              default:
                  if (typeof n == "object" && n !== null)
                      switch (n.$$typeof) {
                          case ie:
                              x = 10;
                              break e;
                          case ue:
                              x = 9;
                              break e;
                          case _e:
                              x = 11;
                              break e;
                          case Ge:
                              x = 14;
                              break e;
                          case st:
                              (x = 16), (f = null);
                              break e;
                      }
                  throw Error(i(130, n == null ? n : typeof n, ""));
          }
      return (r = qt(x, a, r, p)), (r.elementType = n), (r.type = f), (r.lanes = g), r;
  }
  function Li(n, r, a, f) {
      return (n = qt(7, n, f, r)), (n.lanes = a), n;
  }
  function Ia(n, r, a, f) {
      return (n = qt(22, n, f, r)), (n.elementType = ae), (n.lanes = a), (n.stateNode = { isHidden: !1 }), n;
  }
  function kc(n, r, a) {
      return (n = qt(6, n, null, r)), (n.lanes = a), n;
  }
  function Pc(n, r, a) {
      return (r = qt(4, n.children !== null ? n.children : [], n.key, r)), (r.lanes = a), (r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }), r;
  }
  function J1(n, r, a, f, p) {
      (this.tag = r),
          (this.containerInfo = n),
          (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
          (this.timeoutHandle = -1),
          (this.callbackNode = this.pendingContext = this.context = null),
          (this.callbackPriority = 0),
          (this.eventTimes = Zl(0)),
          (this.expirationTimes = Zl(-1)),
          (this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0),
          (this.entanglements = Zl(0)),
          (this.identifierPrefix = f),
          (this.onRecoverableError = p),
          (this.mutableSourceEagerHydrationData = null);
  }
  function Tc(n, r, a, f, p, g, x, T, _) {
      return (
          (n = new J1(n, r, a, T, _)),
          r === 1 ? ((r = 1), g === !0 && (r |= 8)) : (r = 0),
          (g = qt(3, null, null, r)),
          (n.current = g),
          (g.stateNode = n),
          (g.memoizedState = { element: f, isDehydrated: a, cache: null, transitions: null, pendingSuspenseBoundaries: null }),
          Fu(g),
          n
      );
  }
  function eS(n, r, a) {
      var f = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return { $$typeof: N, key: f == null ? null : "" + f, children: n, containerInfo: r, implementation: a };
  }
  function Fm(n) {
      if (!n) return ei;
      n = n._reactInternals;
      e: {
          if (bi(n) !== n || n.tag !== 1) throw Error(i(170));
          var r = n;
          do {
              switch (r.tag) {
                  case 3:
                      r = r.stateNode.context;
                      break e;
                  case 1:
                      if (kt(r.type)) {
                          r = r.stateNode.__reactInternalMemoizedMergedChildContext;
                          break e;
                      }
              }
              r = r.return;
          } while (r !== null);
          throw Error(i(171));
      }
      if (n.tag === 1) {
          var a = n.type;
          if (kt(a)) return hp(n, a, r);
      }
      return r;
  }
  function Vm(n, r, a, f, p, g, x, T, _) {
      return (n = Tc(a, f, !0, n, p, g, x, T, _)), (n.context = Fm(null)), (a = n.current), (f = wt()), (p = ai(a)), (g = Nn(f, p)), (g.callback = r ?? null), ii(a, g, p), (n.current.lanes = p), hs(n, p, f), Et(n, f), n;
  }
  function ja(n, r, a, f) {
      var p = r.current,
          g = wt(),
          x = ai(p);
      return (
          (a = Fm(a)),
          r.context === null ? (r.context = a) : (r.pendingContext = a),
          (r = Nn(g, x)),
          (r.payload = { element: n }),
          (f = f === void 0 ? null : f),
          f !== null && (r.callback = f),
          (n = ii(p, r, x)),
          n !== null && (an(n, p, x, g), ha(n, p, x)),
          x
      );
  }
  function za(n) {
      if (((n = n.current), !n.child)) return null;
      switch (n.child.tag) {
          case 5:
              return n.child.stateNode;
          default:
              return n.child.stateNode;
      }
  }
  function Bm(n, r) {
      if (((n = n.memoizedState), n !== null && n.dehydrated !== null)) {
          var a = n.retryLane;
          n.retryLane = a !== 0 && a < r ? a : r;
      }
  }
  function Ec(n, r) {
      Bm(n, r), (n = n.alternate) && Bm(n, r);
  }
  var $m =
      typeof reportError == "function"
          ? reportError
          : function (n) {
                console.error(n);
            };
  function _c(n) {
      this._internalRoot = n;
  }
  (Na.prototype.render = _c.prototype.render = function (n) {
      var r = this._internalRoot;
      if (r === null) throw Error(i(409));
      ja(n, r, null, null);
  }),
      (Na.prototype.unmount = _c.prototype.unmount = function () {
          var n = this._internalRoot;
          if (n !== null) {
              this._internalRoot = null;
              var r = n.containerInfo;
              Ai(function () {
                  ja(null, n, null, null);
              }),
                  (r[Dn] = null);
          }
      });
  function Na(n) {
      this._internalRoot = n;
  }
  Na.prototype.unstable_scheduleHydration = function (n) {
      if (n) {
          var r = Ph();
          n = { blockedOn: null, target: n, priority: r };
          for (var a = 0; a < Yn.length && r !== 0 && r < Yn[a].priority; a++);
          Yn.splice(a, 0, n), a === 0 && _h(n);
      }
  };
  function Rc(n) {
      return !(!n || (n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11));
  }
  function Fa(n) {
      return !(!n || (n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable ")));
  }
  function Um() {}
  function tS(n, r, a, f, p) {
      if (p) {
          if (typeof f == "function") {
              var g = f;
              f = function () {
                  var j = za(x);
                  g.call(j);
              };
          }
          var x = Vm(r, f, n, 0, null, !1, !1, "", Um);
          return (n._reactRootContainer = x), (n[Dn] = x.current), Es(n.nodeType === 8 ? n.parentNode : n), Ai(), x;
      }
      for (; (p = n.lastChild); ) n.removeChild(p);
      if (typeof f == "function") {
          var T = f;
          f = function () {
              var j = za(_);
              T.call(j);
          };
      }
      var _ = Tc(n, 0, !1, null, null, !1, !1, "", Um);
      return (
          (n._reactRootContainer = _),
          (n[Dn] = _.current),
          Es(n.nodeType === 8 ? n.parentNode : n),
          Ai(function () {
              ja(r, _, a, f);
          }),
          _
      );
  }
  function Va(n, r, a, f, p) {
      var g = a._reactRootContainer;
      if (g) {
          var x = g;
          if (typeof p == "function") {
              var T = p;
              p = function () {
                  var _ = za(x);
                  T.call(_);
              };
          }
          ja(r, x, n, p);
      } else x = tS(a, r, n, p, f);
      return za(x);
  }
  (Ch = function (n) {
      switch (n.tag) {
          case 3:
              var r = n.stateNode;
              if (r.current.memoizedState.isDehydrated) {
                  var a = ds(r.pendingLanes);
                  a !== 0 && (Jl(r, a | 1), Et(r, We()), !(we & 6) && ((Er = We() + 500), ti()));
              }
              break;
          case 13:
              Ai(function () {
                  var f = zn(n, 1);
                  if (f !== null) {
                      var p = wt();
                      an(f, n, 1, p);
                  }
              }),
                  Ec(n, 1);
      }
  }),
      (eu = function (n) {
          if (n.tag === 13) {
              var r = zn(n, 134217728);
              if (r !== null) {
                  var a = wt();
                  an(r, n, 134217728, a);
              }
              Ec(n, 134217728);
          }
      }),
      (kh = function (n) {
          if (n.tag === 13) {
              var r = ai(n),
                  a = zn(n, r);
              if (a !== null) {
                  var f = wt();
                  an(a, n, r, f);
              }
              Ec(n, r);
          }
      }),
      (Ph = function () {
          return Pe;
      }),
      (Th = function (n, r) {
          var a = Pe;
          try {
              return (Pe = n), r();
          } finally {
              Pe = a;
          }
      }),
      (ql = function (n, r, a) {
          switch (r) {
              case "input":
                  if ((Nl(n, a), (r = a.name), a.type === "radio" && r != null)) {
                      for (a = n; a.parentNode; ) a = a.parentNode;
                      for (a = a.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < a.length; r++) {
                          var f = a[r];
                          if (f !== n && f.form === n.form) {
                              var p = ia(f);
                              if (!p) throw Error(i(90));
                              Qd(f), Nl(f, p);
                          }
                      }
                  }
                  break;
              case "textarea":
                  th(n, a);
                  break;
              case "select":
                  (r = a.value), r != null && rr(n, !!a.multiple, r, !1);
          }
      }),
      (ch = wc),
      (fh = Ai);
  var nS = { usingClientEntryPoint: !1, Events: [Ms, pr, ia, lh, uh, wc] },
      Hs = { findFiberByHostInstance: Ci, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" },
      iS = {
          bundleType: Hs.bundleType,
          version: Hs.version,
          rendererPackageName: Hs.rendererPackageName,
          rendererConfig: Hs.rendererConfig,
          overrideHookState: null,
          overrideHookStateDeletePath: null,
          overrideHookStateRenamePath: null,
          overrideProps: null,
          overridePropsDeletePath: null,
          overridePropsRenamePath: null,
          setErrorHandler: null,
          setSuspenseHandler: null,
          scheduleUpdate: null,
          currentDispatcherRef: I.ReactCurrentDispatcher,
          findHostInstanceByFiber: function (n) {
              return (n = mh(n)), n === null ? null : n.stateNode;
          },
          findFiberByHostInstance: Hs.findFiberByHostInstance,
          findHostInstancesForRefresh: null,
          scheduleRefresh: null,
          scheduleRoot: null,
          setRefreshHandler: null,
          getCurrentFiber: null,
          reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
      };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var Ba = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Ba.isDisabled && Ba.supportsFiber)
          try {
              (No = Ba.inject(iS)), (vn = Ba);
          } catch {}
  }
  return (
      (_t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = nS),
      (_t.createPortal = function (n, r) {
          var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
          if (!Rc(r)) throw Error(i(200));
          return eS(n, r, null, a);
      }),
      (_t.createRoot = function (n, r) {
          if (!Rc(n)) throw Error(i(299));
          var a = !1,
              f = "",
              p = $m;
          return (
              r != null && (r.unstable_strictMode === !0 && (a = !0), r.identifierPrefix !== void 0 && (f = r.identifierPrefix), r.onRecoverableError !== void 0 && (p = r.onRecoverableError)),
              (r = Tc(n, 1, !1, null, null, a, !1, f, p)),
              (n[Dn] = r.current),
              Es(n.nodeType === 8 ? n.parentNode : n),
              new _c(r)
          );
      }),
      (_t.findDOMNode = function (n) {
          if (n == null) return null;
          if (n.nodeType === 1) return n;
          var r = n._reactInternals;
          if (r === void 0) throw typeof n.render == "function" ? Error(i(188)) : ((n = Object.keys(n).join(",")), Error(i(268, n)));
          return (n = mh(r)), (n = n === null ? null : n.stateNode), n;
      }),
      (_t.flushSync = function (n) {
          return Ai(n);
      }),
      (_t.hydrate = function (n, r, a) {
          if (!Fa(r)) throw Error(i(200));
          return Va(null, n, r, !0, a);
      }),
      (_t.hydrateRoot = function (n, r, a) {
          if (!Rc(n)) throw Error(i(405));
          var f = (a != null && a.hydratedSources) || null,
              p = !1,
              g = "",
              x = $m;
          if (
              (a != null && (a.unstable_strictMode === !0 && (p = !0), a.identifierPrefix !== void 0 && (g = a.identifierPrefix), a.onRecoverableError !== void 0 && (x = a.onRecoverableError)),
              (r = Vm(r, null, n, 1, a ?? null, p, !1, g, x)),
              (n[Dn] = r.current),
              Es(n),
              f)
          )
              for (n = 0; n < f.length; n++) (a = f[n]), (p = a._getVersion), (p = p(a._source)), r.mutableSourceEagerHydrationData == null ? (r.mutableSourceEagerHydrationData = [a, p]) : r.mutableSourceEagerHydrationData.push(a, p);
          return new Na(r);
      }),
      (_t.render = function (n, r, a) {
          if (!Fa(r)) throw Error(i(200));
          return Va(null, n, r, !1, a);
      }),
      (_t.unmountComponentAtNode = function (n) {
          if (!Fa(n)) throw Error(i(40));
          return n._reactRootContainer
              ? (Ai(function () {
                    Va(null, null, n, !1, function () {
                        (n._reactRootContainer = null), (n[Dn] = null);
                    });
                }),
                !0)
              : !1;
      }),
      (_t.unstable_batchedUpdates = wc),
      (_t.unstable_renderSubtreeIntoContainer = function (n, r, a, f) {
          if (!Fa(a)) throw Error(i(200));
          if (n == null || n._reactInternals === void 0) throw Error(i(38));
          return Va(n, r, a, !1, f);
      }),
      (_t.version = "18.3.1-next-f1338f8080-20240426"),
      _t
  );
}
var Xm;
function fS() {
  if (Xm) return Oc.exports;
  Xm = 1;
  function t() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
          try {
              __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t);
          } catch (e) {
              console.error(e);
          }
  }
  return t(), (Oc.exports = cS()), Oc.exports;
}
var Zm;
function dS() {
  if (Zm) return $a;
  Zm = 1;
  var t = fS();
  return ($a.createRoot = t.createRoot), ($a.hydrateRoot = t.hydrateRoot), $a;
}
var hS = dS(),
  qs = {},
  Jm;
function pS() {
  if (Jm) return qs;
  (Jm = 1), Object.defineProperty(qs, "__esModule", { value: !0 }), (qs.parse = u), (qs.serialize = h);
  const t = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/,
      e = /^[\u0021-\u003A\u003C-\u007E]*$/,
      i = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i,
      s = /^[\u0020-\u003A\u003D-\u007E]*$/,
      o = Object.prototype.toString,
      l = (() => {
          const v = function () {};
          return (v.prototype = Object.create(null)), v;
      })();
  function u(v, w) {
      const S = new l(),
          b = v.length;
      if (b < 2) return S;
      const C = (w == null ? void 0 : w.decode) || m;
      let P = 0;
      do {
          const E = v.indexOf("=", P);
          if (E === -1) break;
          const D = v.indexOf(";", P),
              I = D === -1 ? b : D;
          if (E > I) {
              P = v.lastIndexOf(";", E - 1) + 1;
              continue;
          }
          const z = c(v, P, E),
              N = d(v, E, z),
              Q = v.slice(z, N);
          if (S[Q] === void 0) {
              let q = c(v, E + 1, I),
                  K = d(v, I, q);
              const ie = C(v.slice(q, K));
              S[Q] = ie;
          }
          P = I + 1;
      } while (P < b);
      return S;
  }
  function c(v, w, S) {
      do {
          const b = v.charCodeAt(w);
          if (b !== 32 && b !== 9) return w;
      } while (++w < S);
      return S;
  }
  function d(v, w, S) {
      for (; w > S; ) {
          const b = v.charCodeAt(--w);
          if (b !== 32 && b !== 9) return w + 1;
      }
      return S;
  }
  function h(v, w, S) {
      const b = (S == null ? void 0 : S.encode) || encodeURIComponent;
      if (!t.test(v)) throw new TypeError(`argument name is invalid: ${v}`);
      const C = b(w);
      if (!e.test(C)) throw new TypeError(`argument val is invalid: ${w}`);
      let P = v + "=" + C;
      if (!S) return P;
      if (S.maxAge !== void 0) {
          if (!Number.isInteger(S.maxAge)) throw new TypeError(`option maxAge is invalid: ${S.maxAge}`);
          P += "; Max-Age=" + S.maxAge;
      }
      if (S.domain) {
          if (!i.test(S.domain)) throw new TypeError(`option domain is invalid: ${S.domain}`);
          P += "; Domain=" + S.domain;
      }
      if (S.path) {
          if (!s.test(S.path)) throw new TypeError(`option path is invalid: ${S.path}`);
          P += "; Path=" + S.path;
      }
      if (S.expires) {
          if (!y(S.expires) || !Number.isFinite(S.expires.valueOf())) throw new TypeError(`option expires is invalid: ${S.expires}`);
          P += "; Expires=" + S.expires.toUTCString();
      }
      if ((S.httpOnly && (P += "; HttpOnly"), S.secure && (P += "; Secure"), S.partitioned && (P += "; Partitioned"), S.priority))
          switch (typeof S.priority == "string" ? S.priority.toLowerCase() : void 0) {
              case "low":
                  P += "; Priority=Low";
                  break;
              case "medium":
                  P += "; Priority=Medium";
                  break;
              case "high":
                  P += "; Priority=High";
                  break;
              default:
                  throw new TypeError(`option priority is invalid: ${S.priority}`);
          }
      if (S.sameSite)
          switch (typeof S.sameSite == "string" ? S.sameSite.toLowerCase() : S.sameSite) {
              case !0:
              case "strict":
                  P += "; SameSite=Strict";
                  break;
              case "lax":
                  P += "; SameSite=Lax";
                  break;
              case "none":
                  P += "; SameSite=None";
                  break;
              default:
                  throw new TypeError(`option sameSite is invalid: ${S.sameSite}`);
          }
      return P;
  }
  function m(v) {
      if (v.indexOf("%") === -1) return v;
      try {
          return decodeURIComponent(v);
      } catch {
          return v;
      }
  }
  function y(v) {
      return o.call(v) === "[object Date]";
  }
  return qs;
}
pS();
/**
* react-router v7.1.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/ var eg = "popstate";
function mS(t = {}) {
  function e(s, o) {
      let { pathname: l, search: u, hash: c } = s.location;
      return Sf("", { pathname: l, search: u, hash: c }, (o.state && o.state.usr) || null, (o.state && o.state.key) || "default");
  }
  function i(s, o) {
      return typeof o == "string" ? o : co(o);
  }
  return yS(e, i, null, t);
}
function ze(t, e) {
  if (t === !1 || t === null || typeof t > "u") throw new Error(e);
}
function mn(t, e) {
  if (!t) {
      typeof console < "u" && console.warn(e);
      try {
          throw new Error(e);
      } catch {}
  }
}
function gS() {
  return Math.random().toString(36).substring(2, 10);
}
function tg(t, e) {
  return { usr: t.state, key: t.key, idx: e };
}
function Sf(t, e, i = null, s) {
  return { pathname: typeof t == "string" ? t : t.pathname, search: "", hash: "", ...(typeof e == "string" ? ts(e) : e), state: i, key: (e && e.key) || s || gS() };
}
function co({ pathname: t = "/", search: e = "", hash: i = "" }) {
  return e && e !== "?" && (t += e.charAt(0) === "?" ? e : "?" + e), i && i !== "#" && (t += i.charAt(0) === "#" ? i : "#" + i), t;
}
function ts(t) {
  let e = {};
  if (t) {
      let i = t.indexOf("#");
      i >= 0 && ((e.hash = t.substring(i)), (t = t.substring(0, i)));
      let s = t.indexOf("?");
      s >= 0 && ((e.search = t.substring(s)), (t = t.substring(0, s))), t && (e.pathname = t);
  }
  return e;
}
function yS(t, e, i, s = {}) {
  let { window: o = document.defaultView, v5Compat: l = !1 } = s,
      u = o.history,
      c = "POP",
      d = null,
      h = m();
  h == null && ((h = 0), u.replaceState({ ...u.state, idx: h }, ""));
  function m() {
      return (u.state || { idx: null }).idx;
  }
  function y() {
      c = "POP";
      let C = m(),
          P = C == null ? null : C - h;
      (h = C), d && d({ action: c, location: b.location, delta: P });
  }
  function v(C, P) {
      c = "PUSH";
      let E = Sf(b.location, C, P);
      h = m() + 1;
      let D = tg(E, h),
          I = b.createHref(E);
      try {
          u.pushState(D, "", I);
      } catch (z) {
          if (z instanceof DOMException && z.name === "DataCloneError") throw z;
          o.location.assign(I);
      }
      l && d && d({ action: c, location: b.location, delta: 1 });
  }
  function w(C, P) {
      c = "REPLACE";
      let E = Sf(b.location, C, P);
      h = m();
      let D = tg(E, h),
          I = b.createHref(E);
      u.replaceState(D, "", I), l && d && d({ action: c, location: b.location, delta: 0 });
  }
  function S(C) {
      let P = o.location.origin !== "null" ? o.location.origin : o.location.href,
          E = typeof C == "string" ? C : co(C);
      return (E = E.replace(/ $/, "%20")), ze(P, `No window.location.(origin|href) available to create URL for href: ${E}`), new URL(E, P);
  }
  let b = {
      get action() {
          return c;
      },
      get location() {
          return t(o, u);
      },
      listen(C) {
          if (d) throw new Error("A history only accepts one active listener");
          return (
              o.addEventListener(eg, y),
              (d = C),
              () => {
                  o.removeEventListener(eg, y), (d = null);
              }
          );
      },
      createHref(C) {
          return e(o, C);
      },
      createURL: S,
      encodeLocation(C) {
          let P = S(C);
          return { pathname: P.pathname, search: P.search, hash: P.hash };
      },
      push: v,
      replace: w,
      go(C) {
          return u.go(C);
      },
  };
  return b;
}
function _v(t, e, i = "/") {
  return vS(t, e, i, !1);
}
function vS(t, e, i, s) {
  let o = typeof e == "string" ? ts(e) : e,
      l = mi(o.pathname || "/", i);
  if (l == null) return null;
  let u = Rv(t);
  xS(u);
  let c = null;
  for (let d = 0; c == null && d < u.length; ++d) {
      let h = MS(l);
      c = _S(u[d], h, s);
  }
  return c;
}
function Rv(t, e = [], i = [], s = "") {
  let o = (l, u, c) => {
      let d = { relativePath: c === void 0 ? l.path || "" : c, caseSensitive: l.caseSensitive === !0, childrenIndex: u, route: l };
      d.relativePath.startsWith("/") &&
          (ze(d.relativePath.startsWith(s), `Absolute route path "${d.relativePath}" nested under path "${s}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),
          (d.relativePath = d.relativePath.slice(s.length)));
      let h = Un([s, d.relativePath]),
          m = i.concat(d);
      l.children && l.children.length > 0 && (ze(l.index !== !0, `Index routes must not have child routes. Please remove all child routes from route path "${h}".`), Rv(l.children, e, m, h)),
          !(l.path == null && !l.index) && e.push({ path: h, score: TS(h, l.index), routesMeta: m });
  };
  return (
      t.forEach((l, u) => {
          var c;
          if (l.path === "" || !((c = l.path) != null && c.includes("?"))) o(l, u);
          else for (let d of Mv(l.path)) o(l, u, d);
      }),
      e
  );
}
function Mv(t) {
  let e = t.split("/");
  if (e.length === 0) return [];
  let [i, ...s] = e,
      o = i.endsWith("?"),
      l = i.replace(/\?$/, "");
  if (s.length === 0) return o ? [l, ""] : [l];
  let u = Mv(s.join("/")),
      c = [];
  return c.push(...u.map((d) => (d === "" ? l : [l, d].join("/")))), o && c.push(...u), c.map((d) => (t.startsWith("/") && d === "" ? "/" : d));
}
function xS(t) {
  t.sort((e, i) =>
      e.score !== i.score
          ? i.score - e.score
          : ES(
                e.routesMeta.map((s) => s.childrenIndex),
                i.routesMeta.map((s) => s.childrenIndex)
            )
  );
}
var wS = /^:[\w-]+$/,
  SS = 3,
  bS = 2,
  CS = 1,
  kS = 10,
  PS = -2,
  ng = (t) => t === "*";
function TS(t, e) {
  let i = t.split("/"),
      s = i.length;
  return i.some(ng) && (s += PS), e && (s += bS), i.filter((o) => !ng(o)).reduce((o, l) => o + (wS.test(l) ? SS : l === "" ? CS : kS), s);
}
function ES(t, e) {
  return t.length === e.length && t.slice(0, -1).every((s, o) => s === e[o]) ? t[t.length - 1] - e[e.length - 1] : 0;
}
function _S(t, e, i = !1) {
  let { routesMeta: s } = t,
      o = {},
      l = "/",
      u = [];
  for (let c = 0; c < s.length; ++c) {
      let d = s[c],
          h = c === s.length - 1,
          m = l === "/" ? e : e.slice(l.length) || "/",
          y = fl({ path: d.relativePath, caseSensitive: d.caseSensitive, end: h }, m),
          v = d.route;
      if ((!y && h && i && !s[s.length - 1].route.index && (y = fl({ path: d.relativePath, caseSensitive: d.caseSensitive, end: !1 }, m)), !y)) return null;
      Object.assign(o, y.params), u.push({ params: o, pathname: Un([l, y.pathname]), pathnameBase: LS(Un([l, y.pathnameBase])), route: v }), y.pathnameBase !== "/" && (l = Un([l, y.pathnameBase]));
  }
  return u;
}
function fl(t, e) {
  typeof t == "string" && (t = { path: t, caseSensitive: !1, end: !0 });
  let [i, s] = RS(t.path, t.caseSensitive, t.end),
      o = e.match(i);
  if (!o) return null;
  let l = o[0],
      u = l.replace(/(.)\/+$/, "$1"),
      c = o.slice(1);
  return {
      params: s.reduce((h, { paramName: m, isOptional: y }, v) => {
          if (m === "*") {
              let S = c[v] || "";
              u = l.slice(0, l.length - S.length).replace(/(.)\/+$/, "$1");
          }
          const w = c[v];
          return y && !w ? (h[m] = void 0) : (h[m] = (w || "").replace(/%2F/g, "/")), h;
      }, {}),
      pathname: l,
      pathnameBase: u,
      pattern: t,
  };
}
function RS(t, e = !1, i = !0) {
  mn(
      t === "*" || !t.endsWith("*") || t.endsWith("/*"),
      `Route path "${t}" will be treated as if it were "${t.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${t.replace(
          /\*$/,
          "/*"
      )}".`
  );
  let s = [],
      o =
          "^" +
          t
              .replace(/\/*\*?$/, "")
              .replace(/^\/*/, "/")
              .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
              .replace(/\/:([\w-]+)(\?)?/g, (u, c, d) => (s.push({ paramName: c, isOptional: d != null }), d ? "/?([^\\/]+)?" : "/([^\\/]+)"));
  return t.endsWith("*") ? (s.push({ paramName: "*" }), (o += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$")) : i ? (o += "\\/*$") : t !== "" && t !== "/" && (o += "(?:(?=\\/|$))"), [new RegExp(o, e ? void 0 : "i"), s];
}
function MS(t) {
  try {
      return t
          .split("/")
          .map((e) => decodeURIComponent(e).replace(/\//g, "%2F"))
          .join("/");
  } catch (e) {
      return mn(!1, `The URL path "${t}" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding (${e}).`), t;
  }
}
function mi(t, e) {
  if (e === "/") return t;
  if (!t.toLowerCase().startsWith(e.toLowerCase())) return null;
  let i = e.endsWith("/") ? e.length - 1 : e.length,
      s = t.charAt(i);
  return s && s !== "/" ? null : t.slice(i) || "/";
}
function AS(t, e = "/") {
  let { pathname: i, search: s = "", hash: o = "" } = typeof t == "string" ? ts(t) : t;
  return { pathname: i ? (i.startsWith("/") ? i : OS(i, e)) : e, search: IS(s), hash: jS(o) };
}
function OS(t, e) {
  let i = e.replace(/\/+$/, "").split("/");
  return (
      t.split("/").forEach((o) => {
          o === ".." ? i.length > 1 && i.pop() : o !== "." && i.push(o);
      }),
      i.length > 1 ? i.join("/") : "/"
  );
}
function Ic(t, e, i, s) {
  return `Cannot include a '${t}' character in a manually specified \`to.${e}\` field [${JSON.stringify(
      s
  )}].  Please separate it out to the \`to.${i}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function DS(t) {
  return t.filter((e, i) => i === 0 || (e.route.path && e.route.path.length > 0));
}
function Zf(t) {
  let e = DS(t);
  return e.map((i, s) => (s === e.length - 1 ? i.pathname : i.pathnameBase));
}
function Jf(t, e, i, s = !1) {
  let o;
  typeof t == "string"
      ? (o = ts(t))
      : ((o = { ...t }),
        ze(!o.pathname || !o.pathname.includes("?"), Ic("?", "pathname", "search", o)),
        ze(!o.pathname || !o.pathname.includes("#"), Ic("#", "pathname", "hash", o)),
        ze(!o.search || !o.search.includes("#"), Ic("#", "search", "hash", o)));
  let l = t === "" || o.pathname === "",
      u = l ? "/" : o.pathname,
      c;
  if (u == null) c = i;
  else {
      let y = e.length - 1;
      if (!s && u.startsWith("..")) {
          let v = u.split("/");
          for (; v[0] === ".."; ) v.shift(), (y -= 1);
          o.pathname = v.join("/");
      }
      c = y >= 0 ? e[y] : "/";
  }
  let d = AS(o, c),
      h = u && u !== "/" && u.endsWith("/"),
      m = (l || u === ".") && i.endsWith("/");
  return !d.pathname.endsWith("/") && (h || m) && (d.pathname += "/"), d;
}
var Un = (t) => t.join("/").replace(/\/\/+/g, "/"),
  LS = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"),
  IS = (t) => (!t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t),
  jS = (t) => (!t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t);
function zS(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.internal == "boolean" && "data" in t;
}
var Av = ["POST", "PUT", "PATCH", "DELETE"];
new Set(Av);
var NS = ["GET", ...Av];
new Set(NS);
var ns = A.createContext(null);
ns.displayName = "DataRouter";
var Pl = A.createContext(null);
Pl.displayName = "DataRouterState";
var Ov = A.createContext({ isTransitioning: !1 });
Ov.displayName = "ViewTransition";
var FS = A.createContext(new Map());
FS.displayName = "Fetchers";
var VS = A.createContext(null);
VS.displayName = "Await";
var yn = A.createContext(null);
yn.displayName = "Navigation";
var ko = A.createContext(null);
ko.displayName = "Location";
var Mn = A.createContext({ outlet: null, matches: [], isDataRoute: !1 });
Mn.displayName = "Route";
var ed = A.createContext(null);
ed.displayName = "RouteError";
function BS(t, { relative: e } = {}) {
  ze(is(), "useHref() may be used only in the context of a <Router> component.");
  let { basename: i, navigator: s } = A.useContext(yn),
      { hash: o, pathname: l, search: u } = Po(t, { relative: e }),
      c = l;
  return i !== "/" && (c = l === "/" ? i : Un([i, l])), s.createHref({ pathname: c, search: u, hash: o });
}
function is() {
  return A.useContext(ko) != null;
}
function wi() {
  return ze(is(), "useLocation() may be used only in the context of a <Router> component."), A.useContext(ko).location;
}
var Dv = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Lv(t) {
  A.useContext(yn).static || A.useLayoutEffect(t);
}
function Iv() {
  let { isDataRoute: t } = A.useContext(Mn);
  return t ? eb() : $S();
}
function $S() {
  ze(is(), "useNavigate() may be used only in the context of a <Router> component.");
  let t = A.useContext(ns),
      { basename: e, navigator: i } = A.useContext(yn),
      { matches: s } = A.useContext(Mn),
      { pathname: o } = wi(),
      l = JSON.stringify(Zf(s)),
      u = A.useRef(!1);
  return (
      Lv(() => {
          u.current = !0;
      }),
      A.useCallback(
          (d, h = {}) => {
              if ((mn(u.current, Dv), !u.current)) return;
              if (typeof d == "number") {
                  i.go(d);
                  return;
              }
              let m = Jf(d, JSON.parse(l), o, h.relative === "path");
              t == null && e !== "/" && (m.pathname = m.pathname === "/" ? e : Un([e, m.pathname])), (h.replace ? i.replace : i.push)(m, h.state, h);
          },
          [e, i, l, o, t]
      )
  );
}
A.createContext(null);
function Po(t, { relative: e } = {}) {
  let { matches: i } = A.useContext(Mn),
      { pathname: s } = wi(),
      o = JSON.stringify(Zf(i));
  return A.useMemo(() => Jf(t, JSON.parse(o), s, e === "path"), [t, o, s, e]);
}
function US(t, e) {
  return jv(t, e);
}
function jv(t, e, i, s) {
  var P;
  ze(is(), "useRoutes() may be used only in the context of a <Router> component.");
  let { navigator: o } = A.useContext(yn),
      { matches: l } = A.useContext(Mn),
      u = l[l.length - 1],
      c = u ? u.params : {},
      d = u ? u.pathname : "/",
      h = u ? u.pathnameBase : "/",
      m = u && u.route;
  {
      let E = (m && m.path) || "";
      zv(
          d,
          !m || E.endsWith("*") || E.endsWith("*?"),
          `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${d}" (under <Route path="${E}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${E}"> to <Route path="${E === "/" ? "*" : `${E}/*`}">.`
      );
  }
  let y = wi(),
      v;
  if (e) {
      let E = typeof e == "string" ? ts(e) : e;
      ze(
          h === "/" || ((P = E.pathname) == null ? void 0 : P.startsWith(h)),
          `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${h}" but pathname "${E.pathname}" was given in the \`location\` prop.`
      ),
          (v = E);
  } else v = y;
  let w = v.pathname || "/",
      S = w;
  if (h !== "/") {
      let E = h.replace(/^\//, "").split("/");
      S = "/" + w.replace(/^\//, "").split("/").slice(E.length).join("/");
  }
  let b = _v(t, { pathname: S });
  mn(m || b != null, `No routes matched location "${v.pathname}${v.search}${v.hash}" `),
      mn(
          b == null || b[b.length - 1].route.element !== void 0 || b[b.length - 1].route.Component !== void 0 || b[b.length - 1].route.lazy !== void 0,
          `Matched leaf route at location "${v.pathname}${v.search}${v.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
      );
  let C = GS(
      b &&
          b.map((E) =>
              Object.assign({}, E, {
                  params: Object.assign({}, c, E.params),
                  pathname: Un([h, o.encodeLocation ? o.encodeLocation(E.pathname).pathname : E.pathname]),
                  pathnameBase: E.pathnameBase === "/" ? h : Un([h, o.encodeLocation ? o.encodeLocation(E.pathnameBase).pathname : E.pathnameBase]),
              })
          ),
      l,
      i,
      s
  );
  return e && C ? A.createElement(ko.Provider, { value: { location: { pathname: "/", search: "", hash: "", state: null, key: "default", ...v }, navigationType: "POP" } }, C) : C;
}
function HS() {
  let t = JS(),
      e = zS(t) ? `${t.status} ${t.statusText}` : t instanceof Error ? t.message : JSON.stringify(t),
      i = t instanceof Error ? t.stack : null,
      s = "rgba(200,200,200, 0.5)",
      o = { padding: "0.5rem", backgroundColor: s },
      l = { padding: "2px 4px", backgroundColor: s },
      u = null;
  return (
      console.error("Error handled by React Router default ErrorBoundary:", t),
      (u = A.createElement(
          A.Fragment,
          null,
          A.createElement("p", null, "💿 Hey developer 👋"),
          A.createElement(
              "p",
              null,
              "You can provide a way better UX than this when your app throws errors by providing your own ",
              A.createElement("code", { style: l }, "ErrorBoundary"),
              " or",
              " ",
              A.createElement("code", { style: l }, "errorElement"),
              " prop on your route."
          )
      )),
      A.createElement(A.Fragment, null, A.createElement("h2", null, "Unexpected Application Error!"), A.createElement("h3", { style: { fontStyle: "italic" } }, e), i ? A.createElement("pre", { style: o }, i) : null, u)
  );
}
var WS = A.createElement(HS, null),
  qS = class extends A.Component {
      constructor(t) {
          super(t), (this.state = { location: t.location, revalidation: t.revalidation, error: t.error });
      }
      static getDerivedStateFromError(t) {
          return { error: t };
      }
      static getDerivedStateFromProps(t, e) {
          return e.location !== t.location || (e.revalidation !== "idle" && t.revalidation === "idle")
              ? { error: t.error, location: t.location, revalidation: t.revalidation }
              : { error: t.error !== void 0 ? t.error : e.error, location: e.location, revalidation: t.revalidation || e.revalidation };
      }
      componentDidCatch(t, e) {
          console.error("React Router caught the following error during render", t, e);
      }
      render() {
          return this.state.error !== void 0 ? A.createElement(Mn.Provider, { value: this.props.routeContext }, A.createElement(ed.Provider, { value: this.state.error, children: this.props.component })) : this.props.children;
      }
  };
function KS({ routeContext: t, match: e, children: i }) {
  let s = A.useContext(ns);
  return s && s.static && s.staticContext && (e.route.errorElement || e.route.ErrorBoundary) && (s.staticContext._deepestRenderedBoundaryId = e.route.id), A.createElement(Mn.Provider, { value: t }, i);
}
function GS(t, e = [], i = null, s = null) {
  if (t == null) {
      if (!i) return null;
      if (i.errors) t = i.matches;
      else if (e.length === 0 && !i.initialized && i.matches.length > 0) t = i.matches;
      else return null;
  }
  let o = t,
      l = i == null ? void 0 : i.errors;
  if (l != null) {
      let d = o.findIndex((h) => h.route.id && (l == null ? void 0 : l[h.route.id]) !== void 0);
      ze(d >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(l).join(",")}`), (o = o.slice(0, Math.min(o.length, d + 1)));
  }
  let u = !1,
      c = -1;
  if (i)
      for (let d = 0; d < o.length; d++) {
          let h = o[d];
          if (((h.route.HydrateFallback || h.route.hydrateFallbackElement) && (c = d), h.route.id)) {
              let { loaderData: m, errors: y } = i,
                  v = h.route.loader && !m.hasOwnProperty(h.route.id) && (!y || y[h.route.id] === void 0);
              if (h.route.lazy || v) {
                  (u = !0), c >= 0 ? (o = o.slice(0, c + 1)) : (o = [o[0]]);
                  break;
              }
          }
      }
  return o.reduceRight((d, h, m) => {
      let y,
          v = !1,
          w = null,
          S = null;
      i &&
          ((y = l && h.route.id ? l[h.route.id] : void 0),
          (w = h.route.errorElement || WS),
          u && (c < 0 && m === 0 ? (zv("route-fallback", !1, "No `HydrateFallback` element provided to render during initial hydration"), (v = !0), (S = null)) : c === m && ((v = !0), (S = h.route.hydrateFallbackElement || null))));
      let b = e.concat(o.slice(0, m + 1)),
          C = () => {
              let P;
              return (
                  y ? (P = w) : v ? (P = S) : h.route.Component ? (P = A.createElement(h.route.Component, null)) : h.route.element ? (P = h.route.element) : (P = d),
                  A.createElement(KS, { match: h, routeContext: { outlet: d, matches: b, isDataRoute: i != null }, children: P })
              );
          };
      return i && (h.route.ErrorBoundary || h.route.errorElement || m === 0)
          ? A.createElement(qS, { location: i.location, revalidation: i.revalidation, component: w, error: y, children: C(), routeContext: { outlet: null, matches: b, isDataRoute: !0 } })
          : C();
  }, null);
}
function td(t) {
  return `${t} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function YS(t) {
  let e = A.useContext(ns);
  return ze(e, td(t)), e;
}
function QS(t) {
  let e = A.useContext(Pl);
  return ze(e, td(t)), e;
}
function XS(t) {
  let e = A.useContext(Mn);
  return ze(e, td(t)), e;
}
function nd(t) {
  let e = XS(t),
      i = e.matches[e.matches.length - 1];
  return ze(i.route.id, `${t} can only be used on routes that contain a unique "id"`), i.route.id;
}
function ZS() {
  return nd("useRouteId");
}
function JS() {
  var s;
  let t = A.useContext(ed),
      e = QS("useRouteError"),
      i = nd("useRouteError");
  return t !== void 0 ? t : (s = e.errors) == null ? void 0 : s[i];
}
function eb() {
  let { router: t } = YS("useNavigate"),
      e = nd("useNavigate"),
      i = A.useRef(!1);
  return (
      Lv(() => {
          i.current = !0;
      }),
      A.useCallback(
          async (o, l = {}) => {
              mn(i.current, Dv), i.current && (typeof o == "number" ? t.navigate(o) : await t.navigate(o, { fromRouteId: e, ...l }));
          },
          [t, e]
      )
  );
}
var ig = {};
function zv(t, e, i) {
  !e && !ig[t] && ((ig[t] = !0), mn(!1, i));
}
A.memo(tb);
function tb({ routes: t, future: e, state: i }) {
  return jv(t, void 0, i, e);
}
function nb({ to: t, replace: e, state: i, relative: s }) {
  ze(is(), "<Navigate> may be used only in the context of a <Router> component.");
  let { static: o } = A.useContext(yn);
  mn(!o, "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");
  let { matches: l } = A.useContext(Mn),
      { pathname: u } = wi(),
      c = Iv(),
      d = Jf(t, Zf(l), u, s === "path"),
      h = JSON.stringify(d);
  return (
      A.useEffect(() => {
          c(JSON.parse(h), { replace: e, state: i, relative: s });
      }, [c, h, s, e, i]),
      null
  );
}
function eo(t) {
  ze(!1, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.");
}
function ib({ basename: t = "/", children: e = null, location: i, navigationType: s = "POP", navigator: o, static: l = !1 }) {
  ze(!is(), "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");
  let u = t.replace(/^\/*/, "/"),
      c = A.useMemo(() => ({ basename: u, navigator: o, static: l, future: {} }), [u, o, l]);
  typeof i == "string" && (i = ts(i));
  let { pathname: d = "/", search: h = "", hash: m = "", state: y = null, key: v = "default" } = i,
      w = A.useMemo(() => {
          let S = mi(d, u);
          return S == null ? null : { location: { pathname: S, search: h, hash: m, state: y, key: v }, navigationType: s };
      }, [u, d, h, m, y, v, s]);
  return (
      mn(w != null, `<Router basename="${u}"> is not able to match the URL "${d}${h}${m}" because it does not start with the basename, so the <Router> won't render anything.`),
      w == null ? null : A.createElement(yn.Provider, { value: c }, A.createElement(ko.Provider, { children: e, value: w }))
  );
}
function rb({ children: t, location: e }) {
  return US(bf(t), e);
}
function bf(t, e = []) {
  let i = [];
  return (
      A.Children.forEach(t, (s, o) => {
          if (!A.isValidElement(s)) return;
          let l = [...e, o];
          if (s.type === A.Fragment) {
              i.push.apply(i, bf(s.props.children, l));
              return;
          }
          ze(s.type === eo, `[${typeof s.type == "string" ? s.type : s.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),
              ze(!s.props.index || !s.props.children, "An index route cannot have child routes.");
          let u = {
              id: s.props.id || l.join("-"),
              caseSensitive: s.props.caseSensitive,
              element: s.props.element,
              Component: s.props.Component,
              index: s.props.index,
              path: s.props.path,
              loader: s.props.loader,
              action: s.props.action,
              hydrateFallbackElement: s.props.hydrateFallbackElement,
              HydrateFallback: s.props.HydrateFallback,
              errorElement: s.props.errorElement,
              ErrorBoundary: s.props.ErrorBoundary,
              hasErrorBoundary: s.props.hasErrorBoundary === !0 || s.props.ErrorBoundary != null || s.props.errorElement != null,
              shouldRevalidate: s.props.shouldRevalidate,
              handle: s.props.handle,
              lazy: s.props.lazy,
          };
          s.props.children && (u.children = bf(s.props.children, l)), i.push(u);
      }),
      i
  );
}
var rl = "get",
  sl = "application/x-www-form-urlencoded";
function Tl(t) {
  return t != null && typeof t.tagName == "string";
}
function sb(t) {
  return Tl(t) && t.tagName.toLowerCase() === "button";
}
function ob(t) {
  return Tl(t) && t.tagName.toLowerCase() === "form";
}
function ab(t) {
  return Tl(t) && t.tagName.toLowerCase() === "input";
}
function lb(t) {
  return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
}
function ub(t, e) {
  return t.button === 0 && (!e || e === "_self") && !lb(t);
}
var Ua = null;
function cb() {
  if (Ua === null)
      try {
          new FormData(document.createElement("form"), 0), (Ua = !1);
      } catch {
          Ua = !0;
      }
  return Ua;
}
var fb = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function jc(t) {
  return t != null && !fb.has(t) ? (mn(!1, `"${t}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${sl}"`), null) : t;
}
function db(t, e) {
  let i, s, o, l, u;
  if (ob(t)) {
      let c = t.getAttribute("action");
      (s = c ? mi(c, e) : null), (i = t.getAttribute("method") || rl), (o = jc(t.getAttribute("enctype")) || sl), (l = new FormData(t));
  } else if (sb(t) || (ab(t) && (t.type === "submit" || t.type === "image"))) {
      let c = t.form;
      if (c == null) throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
      let d = t.getAttribute("formaction") || c.getAttribute("action");
      if (((s = d ? mi(d, e) : null), (i = t.getAttribute("formmethod") || c.getAttribute("method") || rl), (o = jc(t.getAttribute("formenctype")) || jc(c.getAttribute("enctype")) || sl), (l = new FormData(c, t)), !cb())) {
          let { name: h, type: m, value: y } = t;
          if (m === "image") {
              let v = h ? `${h}.` : "";
              l.append(`${v}x`, "0"), l.append(`${v}y`, "0");
          } else h && l.append(h, y);
      }
  } else {
      if (Tl(t)) throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
      (i = rl), (s = null), (o = sl), (u = t);
  }
  return l && o === "text/plain" && ((u = l), (l = void 0)), { action: s, method: i.toLowerCase(), encType: o, formData: l, body: u };
}
function id(t, e) {
  if (t === !1 || t === null || typeof t > "u") throw new Error(e);
}
async function hb(t, e) {
  if (t.id in e) return e[t.id];
  try {
      let i = await import(t.module);
      return (e[t.id] = i), i;
  } catch (i) {
      return console.error(`Error loading route module \`${t.module}\`, reloading page...`), console.error(i), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {});
  }
}
function pb(t) {
  return t == null ? !1 : t.href == null ? t.rel === "preload" && typeof t.imageSrcSet == "string" && typeof t.imageSizes == "string" : typeof t.rel == "string" && typeof t.href == "string";
}
async function mb(t, e, i) {
  let s = await Promise.all(
      t.map(async (o) => {
          let l = e.routes[o.route.id];
          if (l) {
              let u = await hb(l, i);
              return u.links ? u.links() : [];
          }
          return [];
      })
  );
  return xb(
      s
          .flat(1)
          .filter(pb)
          .filter((o) => o.rel === "stylesheet" || o.rel === "preload")
          .map((o) => (o.rel === "stylesheet" ? { ...o, rel: "prefetch", as: "style" } : { ...o, rel: "prefetch" }))
  );
}
function rg(t, e, i, s, o, l) {
  let u = (d, h) => (i[h] ? d.route.id !== i[h].route.id : !0),
      c = (d, h) => {
          var m;
          return i[h].pathname !== d.pathname || (((m = i[h].route.path) == null ? void 0 : m.endsWith("*")) && i[h].params["*"] !== d.params["*"]);
      };
  return l === "assets"
      ? e.filter((d, h) => u(d, h) || c(d, h))
      : l === "data"
      ? e.filter((d, h) => {
            var y;
            let m = s.routes[d.route.id];
            if (!m || !m.hasLoader) return !1;
            if (u(d, h) || c(d, h)) return !0;
            if (d.route.shouldRevalidate) {
                let v = d.route.shouldRevalidate({
                    currentUrl: new URL(o.pathname + o.search + o.hash, window.origin),
                    currentParams: ((y = i[0]) == null ? void 0 : y.params) || {},
                    nextUrl: new URL(t, window.origin),
                    nextParams: d.params,
                    defaultShouldRevalidate: !0,
                });
                if (typeof v == "boolean") return v;
            }
            return !0;
        })
      : [];
}
function gb(t, e) {
  return yb(
      t
          .map((i) => {
              let s = e.routes[i.route.id];
              if (!s) return [];
              let o = [s.module];
              return s.imports && (o = o.concat(s.imports)), o;
          })
          .flat(1)
  );
}
function yb(t) {
  return [...new Set(t)];
}
function vb(t) {
  let e = {},
      i = Object.keys(t).sort();
  for (let s of i) e[s] = t[s];
  return e;
}
function xb(t, e) {
  let i = new Set();
  return (
      new Set(e),
      t.reduce((s, o) => {
          let l = JSON.stringify(vb(o));
          return i.has(l) || (i.add(l), s.push({ key: l, link: o })), s;
      }, [])
  );
}
function wb(t) {
  let e = typeof t == "string" ? new URL(t, typeof window > "u" ? "server://singlefetch/" : window.location.origin) : t;
  return e.pathname === "/" ? (e.pathname = "_root.data") : (e.pathname = `${e.pathname.replace(/\/$/, "")}.data`), e;
}
function Sb() {
  let t = A.useContext(ns);
  return id(t, "You must render this element inside a <DataRouterContext.Provider> element"), t;
}
function bb() {
  let t = A.useContext(Pl);
  return id(t, "You must render this element inside a <DataRouterStateContext.Provider> element"), t;
}
var rd = A.createContext(void 0);
rd.displayName = "FrameworkContext";
function Nv() {
  let t = A.useContext(rd);
  return id(t, "You must render this element inside a <HydratedRouter> element"), t;
}
function Cb(t, e) {
  let i = A.useContext(rd),
      [s, o] = A.useState(!1),
      [l, u] = A.useState(!1),
      { onFocus: c, onBlur: d, onMouseEnter: h, onMouseLeave: m, onTouchStart: y } = e,
      v = A.useRef(null);
  A.useEffect(() => {
      if ((t === "render" && u(!0), t === "viewport")) {
          let b = (P) => {
                  P.forEach((E) => {
                      u(E.isIntersecting);
                  });
              },
              C = new IntersectionObserver(b, { threshold: 0.5 });
          return (
              v.current && C.observe(v.current),
              () => {
                  C.disconnect();
              }
          );
      }
  }, [t]),
      A.useEffect(() => {
          if (s) {
              let b = setTimeout(() => {
                  u(!0);
              }, 100);
              return () => {
                  clearTimeout(b);
              };
          }
      }, [s]);
  let w = () => {
          o(!0);
      },
      S = () => {
          o(!1), u(!1);
      };
  return i ? (t !== "intent" ? [l, v, {}] : [l, v, { onFocus: Ks(c, w), onBlur: Ks(d, S), onMouseEnter: Ks(h, w), onMouseLeave: Ks(m, S), onTouchStart: Ks(y, w) }]) : [!1, v, {}];
}
function Ks(t, e) {
  return (i) => {
      t && t(i), i.defaultPrevented || e(i);
  };
}
function kb({ page: t, ...e }) {
  let { router: i } = Sb(),
      s = A.useMemo(() => _v(i.routes, t, i.basename), [i.routes, t, i.basename]);
  return s ? A.createElement(Tb, { page: t, matches: s, ...e }) : null;
}
function Pb(t) {
  let { manifest: e, routeModules: i } = Nv(),
      [s, o] = A.useState([]);
  return (
      A.useEffect(() => {
          let l = !1;
          return (
              mb(t, e, i).then((u) => {
                  l || o(u);
              }),
              () => {
                  l = !0;
              }
          );
      }, [t, e, i]),
      s
  );
}
function Tb({ page: t, matches: e, ...i }) {
  let s = wi(),
      { manifest: o, routeModules: l } = Nv(),
      { loaderData: u, matches: c } = bb(),
      d = A.useMemo(() => rg(t, e, c, o, s, "data"), [t, e, c, o, s]),
      h = A.useMemo(() => rg(t, e, c, o, s, "assets"), [t, e, c, o, s]),
      m = A.useMemo(() => {
          if (t === s.pathname + s.search + s.hash) return [];
          let w = new Set(),
              S = !1;
          if (
              (e.forEach((C) => {
                  var E;
                  let P = o.routes[C.route.id];
                  !P || !P.hasLoader || ((!d.some((D) => D.route.id === C.route.id) && C.route.id in u && (E = l[C.route.id]) != null && E.shouldRevalidate) || P.hasClientLoader ? (S = !0) : w.add(C.route.id));
              }),
              w.size === 0)
          )
              return [];
          let b = wb(t);
          return (
              S &&
                  w.size > 0 &&
                  b.searchParams.set(
                      "_routes",
                      e
                          .filter((C) => w.has(C.route.id))
                          .map((C) => C.route.id)
                          .join(",")
                  ),
              [b.pathname + b.search]
          );
      }, [u, s, o, d, e, t, l]),
      y = A.useMemo(() => gb(h, o), [h, o]),
      v = Pb(h);
  return A.createElement(
      A.Fragment,
      null,
      m.map((w) => A.createElement("link", { key: w, rel: "prefetch", as: "fetch", href: w, ...i })),
      y.map((w) => A.createElement("link", { key: w, rel: "modulepreload", href: w, ...i })),
      v.map(({ key: w, link: S }) => A.createElement("link", { key: w, ...S }))
  );
}
function Eb(...t) {
  return (e) => {
      t.forEach((i) => {
          typeof i == "function" ? i(e) : i != null && (i.current = e);
      });
  };
}
var Fv = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Fv && (window.__reactRouterVersion = "7.1.0");
} catch {}
function _b({ basename: t, children: e, window: i }) {
  let s = A.useRef();
  s.current == null && (s.current = mS({ window: i, v5Compat: !0 }));
  let o = s.current,
      [l, u] = A.useState({ action: o.action, location: o.location }),
      c = A.useCallback(
          (d) => {
              A.startTransition(() => u(d));
          },
          [u]
      );
  return A.useLayoutEffect(() => o.listen(c), [o, c]), A.createElement(ib, { basename: t, children: e, location: l.location, navigationType: l.action, navigator: o });
}
var Vv = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Bv = A.forwardRef(function ({ onClick: e, discover: i = "render", prefetch: s = "none", relative: o, reloadDocument: l, replace: u, state: c, target: d, to: h, preventScrollReset: m, viewTransition: y, ...v }, w) {
      let { basename: S } = A.useContext(yn),
          b = typeof h == "string" && Vv.test(h),
          C,
          P = !1;
      if (typeof h == "string" && b && ((C = h), Fv))
          try {
              let K = new URL(window.location.href),
                  ie = h.startsWith("//") ? new URL(K.protocol + h) : new URL(h),
                  ue = mi(ie.pathname, S);
              ie.origin === K.origin && ue != null ? (h = ue + ie.search + ie.hash) : (P = !0);
          } catch {
              mn(!1, `<Link to="${h}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`);
          }
      let E = BS(h, { relative: o }),
          [D, I, z] = Cb(s, v),
          N = Ob(h, { replace: u, state: c, target: d, preventScrollReset: m, relative: o, viewTransition: y });
      function Q(K) {
          e && e(K), K.defaultPrevented || N(K);
      }
      let q = A.createElement("a", { ...v, ...z, href: C || E, onClick: P || l ? e : Q, ref: Eb(w, I), target: d, "data-discover": !b && i === "render" ? "true" : void 0 });
      return D && !b ? A.createElement(A.Fragment, null, q, A.createElement(kb, { page: E })) : q;
  });
Bv.displayName = "Link";
var Rb = A.forwardRef(function ({ "aria-current": e = "page", caseSensitive: i = !1, className: s = "", end: o = !1, style: l, to: u, viewTransition: c, children: d, ...h }, m) {
  let y = Po(u, { relative: h.relative }),
      v = wi(),
      w = A.useContext(Pl),
      { navigator: S, basename: b } = A.useContext(yn),
      C = w != null && zb(y) && c === !0,
      P = S.encodeLocation ? S.encodeLocation(y).pathname : y.pathname,
      E = v.pathname,
      D = w && w.navigation && w.navigation.location ? w.navigation.location.pathname : null;
  i || ((E = E.toLowerCase()), (D = D ? D.toLowerCase() : null), (P = P.toLowerCase())), D && b && (D = mi(D, b) || D);
  const I = P !== "/" && P.endsWith("/") ? P.length - 1 : P.length;
  let z = E === P || (!o && E.startsWith(P) && E.charAt(I) === "/"),
      N = D != null && (D === P || (!o && D.startsWith(P) && D.charAt(P.length) === "/")),
      Q = { isActive: z, isPending: N, isTransitioning: C },
      q = z ? e : void 0,
      K;
  typeof s == "function" ? (K = s(Q)) : (K = [s, z ? "active" : null, N ? "pending" : null, C ? "transitioning" : null].filter(Boolean).join(" "));
  let ie = typeof l == "function" ? l(Q) : l;
  return A.createElement(Bv, { ...h, "aria-current": q, className: K, ref: m, style: ie, to: u, viewTransition: c }, typeof d == "function" ? d(Q) : d);
});
Rb.displayName = "NavLink";
var Mb = A.forwardRef(({ discover: t = "render", fetcherKey: e, navigate: i, reloadDocument: s, replace: o, state: l, method: u = rl, action: c, onSubmit: d, relative: h, preventScrollReset: m, viewTransition: y, ...v }, w) => {
  let S = Ib(),
      b = jb(c, { relative: h }),
      C = u.toLowerCase() === "get" ? "get" : "post",
      P = typeof c == "string" && Vv.test(c),
      E = (D) => {
          if ((d && d(D), D.defaultPrevented)) return;
          D.preventDefault();
          let I = D.nativeEvent.submitter,
              z = (I == null ? void 0 : I.getAttribute("formmethod")) || u;
          S(I || D.currentTarget, { fetcherKey: e, method: z, navigate: i, replace: o, state: l, relative: h, preventScrollReset: m, viewTransition: y });
      };
  return A.createElement("form", { ref: w, method: C, action: b, onSubmit: s ? d : E, ...v, "data-discover": !P && t === "render" ? "true" : void 0 });
});
Mb.displayName = "Form";
function Ab(t) {
  return `${t} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function $v(t) {
  let e = A.useContext(ns);
  return ze(e, Ab(t)), e;
}
function Ob(t, { target: e, replace: i, state: s, preventScrollReset: o, relative: l, viewTransition: u } = {}) {
  let c = Iv(),
      d = wi(),
      h = Po(t, { relative: l });
  return A.useCallback(
      (m) => {
          if (ub(m, e)) {
              m.preventDefault();
              let y = i !== void 0 ? i : co(d) === co(h);
              c(t, { replace: y, state: s, preventScrollReset: o, relative: l, viewTransition: u });
          }
      },
      [d, c, h, i, s, e, t, o, l, u]
  );
}
var Db = 0,
  Lb = () => `__${String(++Db)}__`;
function Ib() {
  let { router: t } = $v("useSubmit"),
      { basename: e } = A.useContext(yn),
      i = ZS();
  return A.useCallback(
      async (s, o = {}) => {
          let { action: l, method: u, encType: c, formData: d, body: h } = db(s, e);
          if (o.navigate === !1) {
              let m = o.fetcherKey || Lb();
              await t.fetch(m, i, o.action || l, { preventScrollReset: o.preventScrollReset, formData: d, body: h, formMethod: o.method || u, formEncType: o.encType || c, flushSync: o.flushSync });
          } else
              await t.navigate(o.action || l, {
                  preventScrollReset: o.preventScrollReset,
                  formData: d,
                  body: h,
                  formMethod: o.method || u,
                  formEncType: o.encType || c,
                  replace: o.replace,
                  state: o.state,
                  fromRouteId: i,
                  flushSync: o.flushSync,
                  viewTransition: o.viewTransition,
              });
      },
      [t, e, i]
  );
}
function jb(t, { relative: e } = {}) {
  let { basename: i } = A.useContext(yn),
      s = A.useContext(Mn);
  ze(s, "useFormAction must be used inside a RouteContext");
  let [o] = s.matches.slice(-1),
      l = { ...Po(t || ".", { relative: e }) },
      u = wi();
  if (t == null) {
      l.search = u.search;
      let c = new URLSearchParams(l.search),
          d = c.getAll("index");
      if (d.some((m) => m === "")) {
          c.delete("index"), d.filter((y) => y).forEach((y) => c.append("index", y));
          let m = c.toString();
          l.search = m ? `?${m}` : "";
      }
  }
  return (!t || t === ".") && o.route.index && (l.search = l.search ? l.search.replace(/^\?/, "?index&") : "?index"), i !== "/" && (l.pathname = l.pathname === "/" ? i : Un([i, l.pathname])), co(l);
}
function zb(t, e = {}) {
  let i = A.useContext(Ov);
  ze(i != null, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");
  let { basename: s } = $v("useViewTransitionState"),
      o = Po(t, { relative: e.relative });
  if (!i.isTransitioning) return !1;
  let l = mi(i.currentLocation.pathname, s) || i.currentLocation.pathname,
      u = mi(i.nextLocation.pathname, s) || i.nextLocation.pathname;
  return fl(o.pathname, u) != null || fl(o.pathname, l) != null;
}
new TextEncoder();
const to = (t, e = 0) => {
      const i = document.getElementById(t);
      if (i) {
          const s = i.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: s - e, behavior: "smooth" });
      }
  },
  sd = He.memo(() =>
      k.jsx(k.Fragment, {
          children: k.jsxs("header", {
              className: "flex flex-row py-4 justify-between items-center self-stretch z-50 bg-[#08101777] px-12 sticky md:top-0 backdrop-blur-md",
              children: [
                  k.jsxs("div", {
                      className: "flex flex-row items-center gap-4 md:gap-12 w-full md:w-auto",
                      children: [
                          k.jsxs("a", {
                              href: "/",
                              className: "flex h-12 items-center gap-2",
                              children: [
                                  k.jsx("img", { src: "/static/image/logo.svg", alt: "Atomic Shield", className: "h-7" }),
                                  k.jsx("div", { className: "text-[1.5rem] md:text-[1.75rem] font-jakartasans font-bold text-blue-theme tracking-[-0.07rem] leading-[100%]", children: "Atomic Shield" }),
                              ],
                          }),
                          k.jsx("div", {
                              className: "hidden md:flex items-start gap-4 md:gap-8",
                              children: ["Home", "Features", "Pricing", "Contact"].map((t, e) =>
                                  k.jsx(
                                      "div",
                                      {
                                          className:
                                              "text-white-gray text-sm md:text-base font-semibold font-jakartasans leading-5 transition duration-300 ease-in-out cursor-pointer hover:text-blue-theme hover:drop-shadow-[0rem_0rem_1rem_#00A7FD]",
                                          onClick: () => {
                                              t === "Home" ? to("top", 70) : t === "Features" ? to("features", 70) : t === "Pricing" ? to("pricing", 70) : t === "Contact" && to("contact", 70);
                                          },
                                          children: t,
                                      },
                                      e
                                  )
                              ),
                          }),
                      ],
                  }),
                  k.jsxs("div", {
                      className: "flex flex-row items-center gap-4 md:gap-8 mt-0",
                      children: [
                          k.jsx("a", {
                              href: "/auth/signin",
                              className:
                                  "text-white-gray hidden md:flex text-s md:text-base font-semibold font-jakartasans leading-5 transition duration-300 ease-in-out cursor-pointer hover:text-blue-theme hover:drop-shadow-[0rem_0rem_1rem_#00A7FD]",
                              children: "Sign In",
                          }),
                          k.jsx("a", {
                              href: "",
                              className:
                                  "py-2 px-4 flex items-center justify-center bg-blue-theme text-sm md:text-base text-background-theme rounded-full font-semibold font-jakartasans leading-5 border border-transparent hover:bg-transparent hover:border-blue-theme hover:drop-shadow-[0rem_0rem_1rem_#00A7FD] hover:text-white-gray transition-all duration-300",
                              children: "Dashboard",
                          }),
                      ],
                  }),
              ],
          }),
      })
  ),
  Ui = "generated",
  Nb = "pointerdown",
  Fb = "pointerup",
  Cf = "pointerleave",
  Vb = "pointerout",
  Xi = "pointermove",
  Bb = "touchstart",
  sg = "touchend",
  $b = "touchmove",
  Ub = "touchcancel",
  Hb = "resize",
  Wb = "visibilitychange",
  Xt = "tsParticles - Error",
  hi = 100,
  og = 0.5,
  mt = 1e3;
var ut;
(function (t) {
  (t.bottom = "bottom"),
      (t.bottomLeft = "bottom-left"),
      (t.bottomRight = "bottom-right"),
      (t.left = "left"),
      (t.none = "none"),
      (t.right = "right"),
      (t.top = "top"),
      (t.topLeft = "top-left"),
      (t.topRight = "top-right"),
      (t.outside = "outside"),
      (t.inside = "inside");
})(ut || (ut = {}));
function Uv(t) {
  return typeof t == "boolean";
}
function gi(t) {
  return typeof t == "string";
}
function yi(t) {
  return typeof t == "number";
}
function Dr(t) {
  return typeof t == "object" && t !== null;
}
function An(t) {
  return Array.isArray(t);
}
function W(t) {
  return t == null;
}
const kn = { x: 0, y: 0, z: 0 },
  ag = 2,
  qb = 1;
class jt {
  constructor(e, i, s) {
      if (
          ((this._updateFromAngle = (o, l) => {
              (this.x = Math.cos(o) * l), (this.y = Math.sin(o) * l);
          }),
          !yi(e) && e)
      ) {
          (this.x = e.x), (this.y = e.y);
          const o = e;
          this.z = o.z ? o.z : kn.z;
      } else if (e !== void 0 && i !== void 0) (this.x = e), (this.y = i), (this.z = s ?? kn.z);
      else throw new Error(`${Xt} Vector3d not initialized correctly`);
  }
  static get origin() {
      return jt.create(kn.x, kn.y, kn.z);
  }
  get angle() {
      return Math.atan2(this.y, this.x);
  }
  set angle(e) {
      this._updateFromAngle(e, this.length);
  }
  get length() {
      return Math.sqrt(this.getLengthSq());
  }
  set length(e) {
      this._updateFromAngle(this.angle, e);
  }
  static clone(e) {
      return jt.create(e.x, e.y, e.z);
  }
  static create(e, i, s) {
      return new jt(e, i, s);
  }
  add(e) {
      return jt.create(this.x + e.x, this.y + e.y, this.z + e.z);
  }
  addTo(e) {
      (this.x += e.x), (this.y += e.y), (this.z += e.z);
  }
  copy() {
      return jt.clone(this);
  }
  distanceTo(e) {
      return this.sub(e).length;
  }
  distanceToSq(e) {
      return this.sub(e).getLengthSq();
  }
  div(e) {
      return jt.create(this.x / e, this.y / e, this.z / e);
  }
  divTo(e) {
      (this.x /= e), (this.y /= e), (this.z /= e);
  }
  getLengthSq() {
      return this.x ** ag + this.y ** ag;
  }
  mult(e) {
      return jt.create(this.x * e, this.y * e, this.z * e);
  }
  multTo(e) {
      (this.x *= e), (this.y *= e), (this.z *= e);
  }
  normalize() {
      const e = this.length;
      e != 0 && this.multTo(qb / e);
  }
  rotate(e) {
      return jt.create(this.x * Math.cos(e) - this.y * Math.sin(e), this.x * Math.sin(e) + this.y * Math.cos(e), kn.z);
  }
  setTo(e) {
      (this.x = e.x), (this.y = e.y);
      const i = e;
      this.z = i.z ? i.z : kn.z;
  }
  sub(e) {
      return jt.create(this.x - e.x, this.y - e.y, this.z - e.z);
  }
  subFrom(e) {
      (this.x -= e.x), (this.y -= e.y), (this.z -= e.z);
  }
}
class rt extends jt {
  constructor(e, i) {
      super(e, i, kn.z);
  }
  static get origin() {
      return rt.create(kn.x, kn.y);
  }
  static clone(e) {
      return rt.create(e.x, e.y);
  }
  static create(e, i) {
      return new rt(e, i);
  }
}
let Kb = Math.random;
const Hv = { nextFrame: (t) => requestAnimationFrame(t), cancel: (t) => cancelAnimationFrame(t) },
  Gb = 2,
  Yb = Math.PI * Gb;
function Ae() {
  return Zt(Kb(), 0, 1 - Number.EPSILON);
}
function Qb(t) {
  return Hv.nextFrame(t);
}
function Xb(t) {
  Hv.cancel(t);
}
function Zt(t, e, i) {
  return Math.min(Math.max(t, e), i);
}
function zc(t, e, i, s) {
  return Math.floor((t * i + e * s) / (i + s));
}
function zt(t) {
  const e = Pn(t),
      i = 0;
  let s = El(t);
  return e === s && (s = i), Ae() * (e - s) + s;
}
function ne(t) {
  return yi(t) ? t : zt(t);
}
function El(t) {
  return yi(t) ? t : t.min;
}
function Pn(t) {
  return yi(t) ? t : t.max;
}
function be(t, e) {
  if (t === e || (e === void 0 && yi(t))) return t;
  const i = El(t),
      s = Pn(t);
  return e !== void 0 ? { min: Math.min(i, e), max: Math.max(s, e) } : be(i, s);
}
function bt(t, e) {
  const i = t.x - e.x,
      s = t.y - e.y,
      o = 2;
  return { dx: i, dy: s, distance: Math.sqrt(i ** o + s ** o) };
}
function Nt(t, e) {
  return bt(t, e).distance;
}
function pi(t) {
  return (t * Math.PI) / 180;
}
function Zb(t, e, i) {
  if (yi(t)) return pi(t);
  const s = 0,
      o = 0.5,
      l = 0.25,
      u = o + l;
  switch (t) {
      case ut.top:
          return -Math.PI * o;
      case ut.topRight:
          return -Math.PI * l;
      case ut.right:
          return s;
      case ut.bottomRight:
          return Math.PI * l;
      case ut.bottom:
          return Math.PI * o;
      case ut.bottomLeft:
          return Math.PI * u;
      case ut.left:
          return Math.PI;
      case ut.topLeft:
          return -Math.PI * u;
      case ut.inside:
          return Math.atan2(i.y - e.y, i.x - e.x);
      case ut.outside:
          return Math.atan2(e.y - i.y, e.x - i.x);
      default:
          return Ae() * Yb;
  }
}
function Jb(t) {
  const e = rt.origin;
  return (e.length = 1), (e.angle = t), e;
}
function lg(t, e, i, s) {
  return rt.create((t.x * (i - s)) / (i + s) + (e.x * 2 * s) / (i + s), t.y);
}
function eC(t) {
  var e, i;
  return { x: ((e = t.position) == null ? void 0 : e.x) ?? Ae() * t.size.width, y: ((i = t.position) == null ? void 0 : i.y) ?? Ae() * t.size.height };
}
function Wv(t) {
  return t ? (t.endsWith("%") ? parseFloat(t) / hi : parseFloat(t)) : 1;
}
var Hi;
(function (t) {
  (t.auto = "auto"), (t.increase = "increase"), (t.decrease = "decrease"), (t.random = "random");
})(Hi || (Hi = {}));
var Qe;
(function (t) {
  (t.increasing = "increasing"), (t.decreasing = "decreasing");
})(Qe || (Qe = {}));
var Zi;
(function (t) {
  (t.none = "none"), (t.max = "max"), (t.min = "min");
})(Zi || (Zi = {}));
var ve;
(function (t) {
  (t.bottom = "bottom"), (t.left = "left"), (t.right = "right"), (t.top = "top");
})(ve || (ve = {}));
var Kr;
(function (t) {
  (t.precise = "precise"), (t.percent = "percent");
})(Kr || (Kr = {}));
var Br;
(function (t) {
  (t.max = "max"), (t.min = "min"), (t.random = "random");
})(Br || (Br = {}));
const tC = { debug: console.debug, error: console.error, info: console.info, log: console.log, verbose: console.log, warning: console.warn };
function Ji() {
  return tC;
}
function ug(t) {
  const e = { bounced: !1 },
      { pSide: i, pOtherSide: s, rectSide: o, rectOtherSide: l, velocity: u, factor: c } = t,
      d = 0.5,
      h = 0;
  return (
      s.min < l.min ||
          s.min > l.max ||
          s.max < l.min ||
          s.max > l.max ||
          (((i.max >= o.min && i.max <= (o.max + o.min) * d && u > h) || (i.min <= o.max && i.min > (o.max + o.min) * d && u < h)) && ((e.velocity = u * -c), (e.bounced = !0))),
      e
  );
}
function nC(t, e) {
  const i = Jt(e, (s) => t.matches(s));
  return An(i) ? i.some((s) => s) : i;
}
function er() {
  return typeof window > "u" || !window || typeof window.document > "u" || !window.document;
}
function iC() {
  return !er() && typeof matchMedia < "u";
}
function qv(t) {
  if (iC()) return matchMedia(t);
}
function rC(t) {
  if (!(er() || typeof IntersectionObserver > "u")) return new IntersectionObserver(t);
}
function sC(t) {
  if (!(er() || typeof MutationObserver > "u")) return new MutationObserver(t);
}
function Ke(t, e) {
  return t === e || (An(e) && e.indexOf(t) > -1);
}
async function cg(t, e) {
  try {
      await document.fonts.load(`${e ?? "400"} 36px '${t ?? "Verdana"}'`);
  } catch {}
}
function oC(t) {
  return Math.floor(Ae() * t.length);
}
function _l(t, e, i = !0) {
  return t[e !== void 0 && i ? e % t.length : oC(t)];
}
function od(t, e, i, s, o) {
  return aC(To(t, s ?? 0), e, i, o);
}
function aC(t, e, i, s) {
  let o = !0;
  return (!s || s === ve.bottom) && (o = t.top < e.height + i.x), o && (!s || s === ve.left) && (o = t.right > i.x), o && (!s || s === ve.right) && (o = t.left < e.width + i.y), o && (!s || s === ve.top) && (o = t.bottom > i.y), o;
}
function To(t, e) {
  return { bottom: t.y + e, left: t.x - e, right: t.x + e, top: t.y - e };
}
function yt(t, ...e) {
  for (const i of e) {
      if (i == null) continue;
      if (!Dr(i)) {
          t = i;
          continue;
      }
      const s = Array.isArray(i);
      s && (Dr(t) || !t || !Array.isArray(t)) ? (t = []) : !s && (Dr(t) || !t || Array.isArray(t)) && (t = {});
      for (const o in i) {
          if (o === "__proto__") continue;
          const l = i,
              u = l[o],
              c = t;
          c[o] = Dr(u) && Array.isArray(u) ? u.map((d) => yt(c[o], d)) : yt(c[o], u);
      }
  }
  return t;
}
function ad(t, e) {
  return !!Yv(e, (i) => i.enable && Ke(t, i.mode));
}
function ld(t, e, i) {
  Jt(e, (s) => {
      const o = s.mode;
      s.enable && Ke(t, o) && lC(s, i);
  });
}
function lC(t, e) {
  const i = t.selectors;
  Jt(i, (s) => {
      e(s, t);
  });
}
function Kv(t, e) {
  if (!(!e || !t)) return Yv(t, (i) => nC(e, i.selectors));
}
function kf(t) {
  return { position: t.getPosition(), radius: t.getRadius(), mass: t.getMass(), velocity: t.velocity, factor: rt.create(ne(t.options.bounce.horizontal.value), ne(t.options.bounce.vertical.value)) };
}
function Gv(t, e) {
  const { x: i, y: s } = t.velocity.sub(e.velocity),
      [o, l] = [t.position, e.position],
      { dx: u, dy: c } = bt(l, o);
  if (i * u + s * c < 0) return;
  const h = -Math.atan2(c, u),
      m = t.mass,
      y = e.mass,
      v = t.velocity.rotate(h),
      w = e.velocity.rotate(h),
      S = lg(v, w, m, y),
      b = lg(w, v, m, y),
      C = S.rotate(-h),
      P = b.rotate(-h);
  (t.velocity.x = C.x * t.factor.x), (t.velocity.y = C.y * t.factor.y), (e.velocity.x = P.x * e.factor.x), (e.velocity.y = P.y * e.factor.y);
}
function uC(t, e) {
  const i = t.getPosition(),
      s = t.getRadius(),
      o = To(i, s),
      l = t.options.bounce,
      u = ug({
          pSide: { min: o.left, max: o.right },
          pOtherSide: { min: o.top, max: o.bottom },
          rectSide: { min: e.left, max: e.right },
          rectOtherSide: { min: e.top, max: e.bottom },
          velocity: t.velocity.x,
          factor: ne(l.horizontal.value),
      });
  u.bounced && (u.velocity !== void 0 && (t.velocity.x = u.velocity), u.position !== void 0 && (t.position.x = u.position));
  const c = ug({
      pSide: { min: o.top, max: o.bottom },
      pOtherSide: { min: o.left, max: o.right },
      rectSide: { min: e.top, max: e.bottom },
      rectOtherSide: { min: e.left, max: e.right },
      velocity: t.velocity.y,
      factor: ne(l.vertical.value),
  });
  c.bounced && (c.velocity !== void 0 && (t.velocity.y = c.velocity), c.position !== void 0 && (t.position.y = c.position));
}
function Jt(t, e) {
  return An(t) ? t.map((s, o) => e(s, o)) : e(t, 0);
}
function cn(t, e, i) {
  return An(t) ? _l(t, e, i) : t;
}
function Yv(t, e) {
  return An(t) ? t.find((s, o) => e(s, o)) : e(t, 0) ? t : void 0;
}
function Qv(t, e) {
  const i = t.value,
      s = t.animation,
      o = { delayTime: ne(s.delay) * mt, enable: s.enable, value: ne(t.value) * e, max: Pn(i) * e, min: El(i) * e, loops: 0, maxLoops: ne(s.count), time: 0 },
      l = 1;
  if (s.enable) {
      switch (((o.decay = l - ne(s.decay)), s.mode)) {
          case Hi.increase:
              o.status = Qe.increasing;
              break;
          case Hi.decrease:
              o.status = Qe.decreasing;
              break;
          case Hi.random:
              o.status = Ae() >= og ? Qe.increasing : Qe.decreasing;
              break;
      }
      const u = s.mode === Hi.auto;
      switch (s.startValue) {
          case Br.min:
              (o.value = o.min), u && (o.status = Qe.increasing);
              break;
          case Br.max:
              (o.value = o.max), u && (o.status = Qe.decreasing);
              break;
          case Br.random:
          default:
              (o.value = zt(o)), u && (o.status = Ae() >= og ? Qe.increasing : Qe.decreasing);
              break;
      }
  }
  return (o.initialValue = o.value), o;
}
function cC(t, e) {
  if (!(t.mode === Kr.percent)) {
      const { mode: o, ...l } = t;
      return l;
  }
  return "x" in t ? { x: (t.x / hi) * e.width, y: (t.y / hi) * e.height } : { width: (t.width / hi) * e.width, height: (t.height / hi) * e.height };
}
function Xv(t, e) {
  return cC(t, e);
}
function fC(t, e, i, s, o) {
  switch (e) {
      case Zi.max:
          i >= o && t.destroy();
          break;
      case Zi.min:
          i <= s && t.destroy();
          break;
  }
}
function ud(t, e, i, s, o) {
  if (t.destroyed || !e || !e.enable || ((e.maxLoops ?? 0) > 0 && (e.loops ?? 0) > (e.maxLoops ?? 0))) return;
  const m = (e.velocity ?? 0) * o.factor,
      y = e.min,
      v = e.max,
      w = e.decay ?? 1;
  if ((e.time || (e.time = 0), (e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0) && (e.time += o.value), !((e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0)))) {
      switch (e.status) {
          case Qe.increasing:
              e.value >= v ? (i ? (e.status = Qe.decreasing) : (e.value -= v), e.loops || (e.loops = 0), e.loops++) : (e.value += m);
              break;
          case Qe.decreasing:
              e.value <= y ? (i ? (e.status = Qe.increasing) : (e.value += v), e.loops || (e.loops = 0), e.loops++) : (e.value -= m);
      }
      e.velocity && w !== 1 && (e.velocity *= w), fC(t, s, e.value, y, v), t.destroyed || (e.value = Zt(e.value, y, v));
  }
}
function ye(t, e) {
  if (t.version !== e) throw new Error(`The tsParticles version is different from the loaded plugins version. Engine version: ${t.version}. Plugins version: ${e}`);
}
var Pf;
(function (t) {
  (t.darken = "darken"), (t.enlighten = "enlighten");
})(Pf || (Pf = {}));
const dl = "random",
  ol = "mid";
function dC(t, e) {
  if (e) {
      for (const i of t.colorManagers.values()) if (e.startsWith(i.stringPrefix)) return i.parseString(e);
  }
}
function hn(t, e, i, s = !0) {
  if (!e) return;
  const o = gi(e) ? { value: e } : e;
  if (gi(o.value)) return Zv(t, o.value, i, s);
  if (An(o.value)) return hn(t, { value: _l(o.value, i, s) });
  for (const l of t.colorManagers.values()) {
      const u = l.handleRangeColor(o);
      if (u) return u;
  }
}
function Zv(t, e, i, s = !0) {
  if (!e) return;
  const o = gi(e) ? { value: e } : e;
  if (gi(o.value)) return o.value === dl ? e0() : hC(t, o.value);
  if (An(o.value)) return Zv(t, { value: _l(o.value, i, s) });
  for (const l of t.colorManagers.values()) {
      const u = l.handleColor(o);
      if (u) return u;
  }
}
function fo(t, e, i, s = !0) {
  const o = hn(t, e, i, s);
  return o ? Jv(o) : void 0;
}
function Jv(t) {
  const m = t.r / 255,
      y = t.g / 255,
      v = t.b / 255,
      w = Math.max(m, y, v),
      S = Math.min(m, y, v),
      b = { h: 0, l: (w + S) * 0.5, s: 0 };
  return (
      w !== S && ((b.s = b.l < 0.5 ? (w - S) / (w + S) : (w - S) / (2 - w - S)), (b.h = m === w ? (y - v) / (w - S) : (b.h = y === w ? 2 + (v - m) / (w - S) : 2 * 2 + (m - y) / (w - S)))),
      (b.l *= 100),
      (b.s *= 100),
      (b.h *= 60),
      b.h < 0 && (b.h += 360),
      b.h >= 360 && (b.h -= 360),
      b
  );
}
function hC(t, e) {
  return dC(t, e);
}
function Gr(t) {
  const u = ((t.h % 360) + 360) % 360,
      c = Math.max(0, Math.min(100, t.s)),
      d = Math.max(0, Math.min(100, t.l)),
      h = u / 360,
      m = c / 100,
      y = d / 100,
      v = 255,
      w = 3;
  if (c === 0) {
      const K = Math.round(y * v);
      return { r: K, g: K, b: K };
  }
  const S = 0.5,
      b = 2,
      C = (K, ie, ue) => {
          if ((ue < 0 && ue++, ue > 1 && ue--, ue * 6 < 1)) return K + (ie - K) * 6 * ue;
          if (ue * b < 1) return ie;
          if (ue * w < 1 * b) {
              const Ge = b / w;
              return K + (ie - K) * (Ge - ue) * 6;
          }
          return K;
      },
      P = 1,
      E = y < S ? y * (P + m) : y + m - y * m,
      D = b * y - E,
      I = 1,
      z = I / w,
      N = Math.min(v, v * C(D, E, h + z)),
      Q = Math.min(v, v * C(D, E, h)),
      q = Math.min(v, v * C(D, E, h - z));
  return { r: Math.round(N), g: Math.round(Q), b: Math.round(q) };
}
function pC(t) {
  const e = Gr(t);
  return { a: t.a, b: e.b, g: e.g, r: e.r };
}
function e0(t) {
  return { b: Math.floor(zt(be(0, 256))), g: Math.floor(zt(be(0, 256))), r: Math.floor(zt(be(0, 256))) };
}
function Hn(t, e) {
  return `rgba(${t.r}, ${t.g}, ${t.b}, ${e ?? 1})`;
}
function ho(t, e) {
  return `hsla(${t.h}, ${t.s}%, ${t.l}%, ${e ?? 1})`;
}
function cd(t, e, i, s) {
  let o = t,
      l = e;
  return o.r === void 0 && (o = Gr(t)), l.r === void 0 && (l = Gr(e)), { b: zc(o.b, l.b, i, s), g: zc(o.g, l.g, i, s), r: zc(o.r, l.r, i, s) };
}
function Tf(t, e, i) {
  if (i === dl) return e0();
  if (i === ol) {
      const s = t.getFillColor() ?? t.getStrokeColor(),
          o = (e == null ? void 0 : e.getFillColor()) ?? (e == null ? void 0 : e.getStrokeColor());
      if (s && o && e) return cd(s, o, t.getRadius(), e.getRadius());
      {
          const l = s ?? o;
          if (l) return Gr(l);
      }
  } else return i;
}
function t0(t, e, i, s) {
  const o = gi(e) ? e : e.value;
  return o === dl ? (s ? hn(t, { value: o }) : i ? dl : ol) : o === ol ? ol : hn(t, { value: o });
}
function fg(t) {
  return t !== void 0 ? { h: t.h.value, s: t.s.value, l: t.l.value } : void 0;
}
function n0(t, e, i) {
  const s = { h: { enable: !1, value: t.h }, s: { enable: !1, value: t.s }, l: { enable: !1, value: t.l } };
  return e && (Nc(s.h, e.h, i), Nc(s.s, e.s, i), Nc(s.l, e.l, i)), s;
}
function Nc(t, e, i) {
  t.enable = e.enable;
  const s = 0,
      o = 1,
      l = 0,
      u = 0;
  t.enable
      ? ((t.velocity = (ne(e.speed) / hi) * i),
        (t.decay = o - ne(e.decay)),
        (t.status = Qe.increasing),
        (t.loops = l),
        (t.maxLoops = ne(e.count)),
        (t.time = u),
        (t.delayTime = ne(e.delay) * mt),
        e.sync || ((t.velocity *= Ae()), (t.value *= Ae())),
        (t.initialValue = t.value),
        (t.offset = be(e.offset)))
      : (t.velocity = s);
}
function Fc(t, e, i, s) {
  if (
      !t ||
      !t.enable ||
      ((t.maxLoops ?? 0) > 0 && (t.loops ?? 0) > (t.maxLoops ?? 0)) ||
      (t.time || (t.time = 0), (t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0) && (t.time += s.value), (t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0))
  )
      return;
  const m = t.offset ? zt(t.offset) : 0,
      y = (t.velocity ?? 0) * s.factor + m * 3.6,
      v = t.decay ?? 1,
      w = Pn(e),
      S = El(e);
  !i || t.status === Qe.increasing
      ? ((t.value += y), t.value > w && (t.loops || (t.loops = 0), t.loops++, i ? (t.status = Qe.decreasing) : (t.value -= w)))
      : ((t.value -= y), t.value < 0 && (t.loops || (t.loops = 0), t.loops++, (t.status = Qe.increasing))),
      t.velocity && v !== 1 && (t.velocity *= v),
      (t.value = Zt(t.value, S, w));
}
function i0(t, e) {
  if (!t) return;
  const { h: i, s, l: o } = t,
      l = { h: { min: 0, max: 360 }, s: { min: 0, max: 100 }, l: { min: 0, max: 100 } };
  i && Fc(i, l.h, !1, e), s && Fc(s, l.s, !0, e), o && Fc(o, l.l, !0, e);
}
const Yr = { x: 0, y: 0 },
  Ha = { a: 1, b: 0, c: 0, d: 1 };
function so(t, e, i) {
  t.beginPath(), t.moveTo(e.x, e.y), t.lineTo(i.x, i.y), t.closePath();
}
function mC(t, e, i) {
  (t.fillStyle = i ?? "rgba(0,0,0,0)"), t.fillRect(Yr.x, Yr.y, e.width, e.height);
}
function gC(t, e, i, s) {
  i && ((t.globalAlpha = s), t.drawImage(i, Yr.x, Yr.y, e.width, e.height), (t.globalAlpha = 1));
}
function Vc(t, e) {
  t.clearRect(Yr.x, Yr.y, e.width, e.height);
}
function yC(t) {
  const { container: e, context: i, particle: s, delta: o, colorStyles: l, backgroundMask: u, composite: c, radius: d, opacity: h, shadow: m, transform: y } = t,
      v = s.getPosition(),
      w = 0,
      S = s.rotation + (s.pathRotation ? s.velocity.angle : w),
      b = { sin: Math.sin(S), cos: Math.cos(S) },
      C = !!S,
      P = 1,
      E = { a: b.cos * (y.a ?? Ha.a), b: C ? b.sin * (y.b ?? P) : y.b ?? Ha.b, c: C ? -b.sin * (y.c ?? P) : y.c ?? Ha.c, d: b.cos * (y.d ?? Ha.d) };
  i.setTransform(E.a, E.b, E.c, E.d, v.x, v.y), u && (i.globalCompositeOperation = c);
  const D = s.shadowColor;
  m.enable && D && ((i.shadowBlur = m.blur), (i.shadowColor = Hn(D)), (i.shadowOffsetX = m.offset.x), (i.shadowOffsetY = m.offset.y)), l.fill && (i.fillStyle = l.fill);
  const I = 0,
      z = s.strokeWidth ?? I;
  (i.lineWidth = z), l.stroke && (i.strokeStyle = l.stroke);
  const N = { container: e, context: i, particle: s, radius: d, opacity: h, delta: o, transformData: E, strokeWidth: z };
  xC(N), wC(N), vC(N), (i.globalCompositeOperation = "source-over"), i.resetTransform();
}
function vC(t) {
  const { container: e, context: i, particle: s, radius: o, opacity: l, delta: u, transformData: c } = t;
  if (!s.effect) return;
  const d = e.effectDrawers.get(s.effect);
  d && d.draw({ context: i, particle: s, radius: o, opacity: l, delta: u, pixelRatio: e.retina.pixelRatio, transformData: { ...c } });
}
function xC(t) {
  const { container: e, context: i, particle: s, radius: o, opacity: l, delta: u, strokeWidth: c, transformData: d } = t,
      h = 0;
  if (!s.shape) return;
  const m = e.shapeDrawers.get(s.shape);
  m && (i.beginPath(), m.draw({ context: i, particle: s, radius: o, opacity: l, delta: u, pixelRatio: e.retina.pixelRatio, transformData: { ...d } }), s.shapeClose && i.closePath(), c > h && i.stroke(), s.shapeFill && i.fill());
}
function wC(t) {
  const { container: e, context: i, particle: s, radius: o, opacity: l, delta: u, transformData: c } = t;
  if (!s.shape) return;
  const d = e.shapeDrawers.get(s.shape);
  d != null && d.afterDraw && d.afterDraw({ context: i, particle: s, radius: o, opacity: l, delta: u, pixelRatio: e.retina.pixelRatio, transformData: { ...c } });
}
function SC(t, e, i) {
  e.draw && e.draw(t, i);
}
function bC(t, e, i, s) {
  e.drawParticle && e.drawParticle(t, i, s);
}
function CC(t, e, i) {
  return { h: t.h, s: t.s, l: t.l + (e === Pf.darken ? -1 : 1) * i };
}
function kC(t, e, i) {
  const s = e[i],
      o = 1;
  s !== void 0 && (t[i] = (t[i] ?? o) * s);
}
function dg(t, e, i = !1) {
  if (!e) return;
  const s = t;
  if (!s) return;
  const o = s.style;
  if (o)
      for (const l in e) {
          const u = e[l];
          o.setProperty(l, u, i ? "important" : "");
      }
}
class PC {
  constructor(e, i) {
      (this.container = e),
          (this._applyPostDrawUpdaters = (l) => {
              var u;
              for (const c of this._postDrawUpdaters) (u = c.afterDraw) == null || u.call(c, l);
          }),
          (this._applyPreDrawUpdaters = (l, u, c, d, h, m) => {
              var y;
              for (const v of this._preDrawUpdaters) {
                  if (v.getColorStyles) {
                      const { fill: w, stroke: S } = v.getColorStyles(u, l, c, d);
                      w && (h.fill = w), S && (h.stroke = S);
                  }
                  if (v.getTransformValues) {
                      const w = v.getTransformValues(u);
                      for (const S in w) kC(m, w, S);
                  }
                  (y = v.beforeDraw) == null || y.call(v, u);
              }
          }),
          (this._applyResizePlugins = () => {
              var l;
              for (const u of this._resizePlugins) (l = u.resize) == null || l.call(u);
          }),
          (this._getPluginParticleColors = (l) => {
              let u, c;
              for (const d of this._colorPlugins) if ((!u && d.particleFillColor && (u = fo(this._engine, d.particleFillColor(l))), !c && d.particleStrokeColor && (c = fo(this._engine, d.particleStrokeColor(l))), u && c)) break;
              return [u, c];
          }),
          (this._initCover = async () => {
              const l = this.container.actualOptions,
                  u = l.backgroundMask.cover,
                  c = u.color;
              if (c) {
                  const d = hn(this._engine, c);
                  if (d) {
                      const h = { ...d, a: u.opacity };
                      this._coverColorStyle = Hn(h, h.a);
                  }
              } else
                  await new Promise((d, h) => {
                      if (!u.image) return;
                      const m = document.createElement("img");
                      m.addEventListener("load", () => {
                          (this._coverImage = { image: m, opacity: u.opacity }), d();
                      }),
                          m.addEventListener("error", (y) => {
                              h(y.error);
                          }),
                          (m.src = u.image);
                  });
          }),
          (this._initStyle = () => {
              const l = this.element,
                  u = this.container.actualOptions;
              if (l) {
                  this._fullScreen ? ((this._originalStyle = yt({}, l.style)), this._setFullScreenStyle()) : this._resetOriginalStyle();
                  for (const c in u.style) {
                      if (!c || !u.style) continue;
                      const d = u.style[c];
                      d && l.style.setProperty(c, d, "important");
                  }
              }
          }),
          (this._initTrail = async () => {
              const l = this.container.actualOptions,
                  u = l.particles.move.trail,
                  c = u.fill;
              if (!u.enable) return;
              const d = 1,
                  h = d / u.length;
              if (c.color) {
                  const m = hn(this._engine, c.color);
                  if (!m) return;
                  this._trailFill = { color: { ...m }, opacity: h };
              } else
                  await new Promise((m, y) => {
                      if (!c.image) return;
                      const v = document.createElement("img");
                      v.addEventListener("load", () => {
                          (this._trailFill = { image: v, opacity: h }), m();
                      }),
                          v.addEventListener("error", (w) => {
                              y(w.error);
                          }),
                          (v.src = c.image);
                  });
          }),
          (this._paintBase = (l) => {
              this.draw((u) => mC(u, this.size, l));
          }),
          (this._paintImage = (l, u) => {
              this.draw((c) => gC(c, this.size, l, u));
          }),
          (this._repairStyle = () => {
              const l = this.element;
              l &&
                  (this._safeMutationObserver((u) => u.disconnect()),
                  this._initStyle(),
                  this.initBackground(),
                  this._safeMutationObserver((u) => {
                      !l || !(l instanceof Node) || u.observe(l, { attributes: !0 });
                  }));
          }),
          (this._resetOriginalStyle = () => {
              const l = this.element,
                  u = this._originalStyle;
              l && u && dg(l, u);
          }),
          (this._safeMutationObserver = (l) => {
              this._mutationObserver && l(this._mutationObserver);
          }),
          (this._setFullScreenStyle = () => {
              const l = this.element;
              if (!l) return;
              const u = 10,
                  c = this.container.actualOptions.fullScreen.zIndex.toString(u);
              dg(l, { position: "fixed", "z-index": c, zIndex: c, top: "0", left: "0", width: "100%", height: "100%" }, !0);
          }),
          (this._engine = i),
          (this._standardSize = { height: 0, width: 0 });
      const s = e.retina.pixelRatio,
          o = this._standardSize;
      (this.size = { height: o.height * s, width: o.width * s }), (this._context = null), (this._generated = !1), (this._preDrawUpdaters = []), (this._postDrawUpdaters = []), (this._resizePlugins = []), (this._colorPlugins = []);
  }
  get _fullScreen() {
      return this.container.actualOptions.fullScreen.enable;
  }
  clear() {
      const e = this.container.actualOptions,
          i = e.particles.move.trail,
          s = this._trailFill;
      e.backgroundMask.enable
          ? this.paint()
          : i.enable && i.length > 0 && s
          ? s.color
              ? this._paintBase(Hn(s.color, s.opacity))
              : s.image && this._paintImage(s.image, s.opacity)
          : e.clear &&
            this.draw((l) => {
                Vc(l, this.size);
            });
  }
  destroy() {
      if ((this.stop(), this._generated)) {
          const e = this.element;
          e == null || e.remove();
      } else this._resetOriginalStyle();
      (this._preDrawUpdaters = []), (this._postDrawUpdaters = []), (this._resizePlugins = []), (this._colorPlugins = []);
  }
  draw(e) {
      const i = this._context;
      if (i) return e(i);
  }
  drawAsync(e) {
      const i = this._context;
      if (i) return e(i);
  }
  drawParticle(e, i) {
      if (e.spawning || e.destroyed) return;
      const s = e.getRadius();
      if (s <= 0) return;
      const l = e.getFillColor(),
          u = e.getStrokeColor() ?? l;
      let [c, d] = this._getPluginParticleColors(e);
      c || (c = l),
          d || (d = u),
          !(!c && !d) &&
              this.draw((h) => {
                  var Q;
                  const m = this.container,
                      y = m.actualOptions,
                      v = e.options.zIndex,
                      w = 1,
                      S = w - e.zIndexFactor,
                      b = S ** v.opacityRate,
                      C = 1,
                      P = e.bubble.opacity ?? ((Q = e.opacity) == null ? void 0 : Q.value) ?? C,
                      E = e.strokeOpacity ?? P,
                      D = P * b,
                      I = E * b,
                      z = {},
                      N = { fill: c ? ho(c, D) : void 0 };
                  (N.stroke = d ? ho(d, I) : N.fill),
                      this._applyPreDrawUpdaters(h, e, s, D, N, z),
                      yC({
                          container: m,
                          context: h,
                          particle: e,
                          delta: i,
                          colorStyles: N,
                          backgroundMask: y.backgroundMask.enable,
                          composite: y.backgroundMask.composite,
                          radius: s * S ** v.sizeRate,
                          opacity: D,
                          shadow: e.options.shadow,
                          transform: z,
                      }),
                      this._applyPostDrawUpdaters(e);
              });
  }
  drawParticlePlugin(e, i, s) {
      this.draw((o) => bC(o, e, i, s));
  }
  drawPlugin(e, i) {
      this.draw((s) => SC(s, e, i));
  }
  async init() {
      this._safeMutationObserver((e) => e.disconnect()),
          (this._mutationObserver = sC((e) => {
              for (const i of e) i.type === "attributes" && i.attributeName === "style" && this._repairStyle();
          })),
          this.resize(),
          this._initStyle(),
          await this._initCover();
      try {
          await this._initTrail();
      } catch (e) {
          Ji().error(e);
      }
      this.initBackground(),
          this._safeMutationObserver((e) => {
              !this.element || !(this.element instanceof Node) || e.observe(this.element, { attributes: !0 });
          }),
          this.initUpdaters(),
          this.initPlugins(),
          this.paint();
  }
  initBackground() {
      const e = this.container.actualOptions,
          i = e.background,
          s = this.element;
      if (!s) return;
      const o = s.style;
      if (o) {
          if (i.color) {
              const l = hn(this._engine, i.color);
              o.backgroundColor = l ? Hn(l, i.opacity) : "";
          } else o.backgroundColor = "";
          (o.backgroundImage = i.image || ""), (o.backgroundPosition = i.position || ""), (o.backgroundRepeat = i.repeat || ""), (o.backgroundSize = i.size || "");
      }
  }
  initPlugins() {
      this._resizePlugins = [];
      for (const e of this.container.plugins.values()) e.resize && this._resizePlugins.push(e), (e.particleFillColor ?? e.particleStrokeColor) && this._colorPlugins.push(e);
  }
  initUpdaters() {
      (this._preDrawUpdaters = []), (this._postDrawUpdaters = []);
      for (const e of this.container.particles.updaters) e.afterDraw && this._postDrawUpdaters.push(e), (e.getColorStyles ?? e.getTransformValues ?? e.beforeDraw) && this._preDrawUpdaters.push(e);
  }
  loadCanvas(e) {
      this._generated && this.element && this.element.remove(),
          (this._generated = e.dataset && Ui in e.dataset ? e.dataset[Ui] === "true" : this._generated),
          (this.element = e),
          (this.element.ariaHidden = "true"),
          (this._originalStyle = yt({}, this.element.style));
      const i = this._standardSize;
      (i.height = e.offsetHeight), (i.width = e.offsetWidth);
      const s = this.container.retina.pixelRatio,
          o = this.size;
      (e.height = o.height = i.height * s),
          (e.width = o.width = i.width * s),
          (this._context = this.element.getContext("2d")),
          this._safeMutationObserver((l) => {
              !this.element || !(this.element instanceof Node) || l.observe(this.element, { attributes: !0 });
          }),
          this.container.retina.init(),
          this.initBackground();
  }
  paint() {
      const e = this.container.actualOptions;
      this.draw((i) => {
          e.backgroundMask.enable && e.backgroundMask.cover
              ? (Vc(i, this.size), this._coverImage ? this._paintImage(this._coverImage.image, this._coverImage.opacity) : this._coverColorStyle ? this._paintBase(this._coverColorStyle) : this._paintBase())
              : this._paintBase();
      });
  }
  resize() {
      if (!this.element) return !1;
      const e = this.container,
          i = e.canvas._standardSize,
          s = { width: this.element.offsetWidth, height: this.element.offsetHeight },
          o = e.retina.pixelRatio,
          l = { width: s.width * o, height: s.height * o };
      if (s.height === i.height && s.width === i.width && l.height === this.element.height && l.width === this.element.width) return !1;
      const u = { ...i };
      (i.height = s.height), (i.width = s.width);
      const c = this.size;
      return (this.element.width = c.width = l.width), (this.element.height = c.height = l.height), this.container.started && e.particles.setResizeFactor({ width: i.width / u.width, height: i.height / u.height }), !0;
  }
  stop() {
      this._safeMutationObserver((e) => e.disconnect()), (this._mutationObserver = void 0), this.draw((e) => Vc(e, this.size));
  }
  async windowResize() {
      if (!this.element || !this.resize()) return;
      const e = this.container,
          i = e.updateActualOptions();
      e.particles.setDensity(), this._applyResizePlugins(), i && (await e.refresh());
  }
}
var $r;
(function (t) {
  (t.canvas = "canvas"), (t.parent = "parent"), (t.window = "window");
})($r || ($r = {}));
const hg = 2;
function Kt(t, e, i, s, o) {
  if (s) {
      let l = { passive: !0 };
      Uv(o) ? (l.capture = o) : o !== void 0 && (l = o), t.addEventListener(e, i, l);
  } else {
      const l = o;
      t.removeEventListener(e, i, l);
  }
}
class TC {
  constructor(e) {
      (this.container = e),
          (this._doMouseTouchClick = (i) => {
              const s = this.container,
                  o = s.actualOptions;
              if (this._canPush) {
                  const l = s.interactivity.mouse,
                      u = l.position;
                  if (!u) return;
                  (l.clickPosition = { ...u }), (l.clickTime = new Date().getTime());
                  const c = o.interactivity.events.onClick;
                  Jt(c.mode, (d) => this.container.handleClickMode(d));
              }
              i.type === "touchend" && setTimeout(() => this._mouseTouchFinish(), 500);
          }),
          (this._handleThemeChange = (i) => {
              const s = i,
                  o = this.container,
                  l = o.options,
                  u = l.defaultThemes,
                  c = s.matches ? u.dark : u.light,
                  d = l.themes.find((h) => h.name === c);
              d != null && d.default.auto && o.loadTheme(c);
          }),
          (this._handleVisibilityChange = () => {
              const i = this.container,
                  s = i.actualOptions;
              this._mouseTouchFinish(), s.pauseOnBlur && (document != null && document.hidden ? ((i.pageHidden = !0), i.pause()) : ((i.pageHidden = !1), i.animationStatus ? i.play(!0) : i.draw(!0)));
          }),
          (this._handleWindowResize = () => {
              this._resizeTimeout && (clearTimeout(this._resizeTimeout), delete this._resizeTimeout);
              const i = async () => {
                  const s = this.container.canvas;
                  await (s == null ? void 0 : s.windowResize());
              };
              this._resizeTimeout = setTimeout(() => void i(), this.container.actualOptions.interactivity.events.resize.delay * mt);
          }),
          (this._manageInteractivityListeners = (i, s) => {
              const o = this._handlers,
                  l = this.container,
                  u = l.actualOptions,
                  c = l.interactivity.element;
              if (!c) return;
              const d = c,
                  h = l.canvas.element;
              h && (h.style.pointerEvents = d === h ? "initial" : "none"),
                  (u.interactivity.events.onHover.enable || u.interactivity.events.onClick.enable) &&
                      (Kt(c, Xi, o.mouseMove, s),
                      Kt(c, Bb, o.touchStart, s),
                      Kt(c, $b, o.touchMove, s),
                      u.interactivity.events.onClick.enable ? (Kt(c, sg, o.touchEndClick, s), Kt(c, Fb, o.mouseUp, s), Kt(c, Nb, o.mouseDown, s)) : Kt(c, sg, o.touchEnd, s),
                      Kt(c, i, o.mouseLeave, s),
                      Kt(c, Ub, o.touchCancel, s));
          }),
          (this._manageListeners = (i) => {
              const s = this._handlers,
                  o = this.container,
                  l = o.actualOptions,
                  u = l.interactivity.detectsOn,
                  c = o.canvas.element;
              let d = Cf;
              u === $r.window ? ((o.interactivity.element = window), (d = Vb)) : u === $r.parent && c ? (o.interactivity.element = c.parentElement ?? c.parentNode) : (o.interactivity.element = c),
                  this._manageMediaMatch(i),
                  this._manageResize(i),
                  this._manageInteractivityListeners(d, i),
                  document && Kt(document, Wb, s.visibilityChange, i, !1);
          }),
          (this._manageMediaMatch = (i) => {
              const s = this._handlers,
                  o = qv("(prefers-color-scheme: dark)");
              if (o) {
                  if (o.addEventListener !== void 0) {
                      Kt(o, "change", s.themeChange, i);
                      return;
                  }
                  o.addListener !== void 0 && (i ? o.addListener(s.oldThemeChange) : o.removeListener(s.oldThemeChange));
              }
          }),
          (this._manageResize = (i) => {
              const s = this._handlers,
                  o = this.container;
              if (!o.actualOptions.interactivity.events.resize) return;
              if (typeof ResizeObserver > "u") {
                  Kt(window, Hb, s.resize, i);
                  return;
              }
              const u = o.canvas.element;
              this._resizeObserver && !i
                  ? (u && this._resizeObserver.unobserve(u), this._resizeObserver.disconnect(), delete this._resizeObserver)
                  : !this._resizeObserver &&
                    i &&
                    u &&
                    ((this._resizeObserver = new ResizeObserver((c) => {
                        c.find((h) => h.target === u) && this._handleWindowResize();
                    })),
                    this._resizeObserver.observe(u));
          }),
          (this._mouseDown = () => {
              const { interactivity: i } = this.container;
              if (!i) return;
              const { mouse: s } = i;
              (s.clicking = !0), (s.downPosition = s.position);
          }),
          (this._mouseTouchClick = (i) => {
              const s = this.container,
                  o = s.actualOptions,
                  { mouse: l } = s.interactivity;
              l.inside = !0;
              let u = !1;
              const c = l.position;
              if (!(!c || !o.interactivity.events.onClick.enable)) {
                  for (const d of s.plugins.values()) if (d.clickPositionValid && ((u = d.clickPositionValid(c)), u)) break;
                  u || this._doMouseTouchClick(i), (l.clicking = !1);
              }
          }),
          (this._mouseTouchFinish = () => {
              const i = this.container.interactivity;
              if (!i) return;
              const s = i.mouse;
              delete s.position, delete s.clickPosition, delete s.downPosition, (i.status = Cf), (s.inside = !1), (s.clicking = !1);
          }),
          (this._mouseTouchMove = (i) => {
              const s = this.container,
                  o = s.actualOptions,
                  l = s.interactivity,
                  u = s.canvas.element;
              if (!(l != null && l.element)) return;
              l.mouse.inside = !0;
              let c;
              if (i.type.startsWith("pointer")) {
                  this._canPush = !0;
                  const h = i;
                  if (l.element === window) {
                      if (u) {
                          const m = u.getBoundingClientRect();
                          c = { x: h.clientX - m.left, y: h.clientY - m.top };
                      }
                  } else if (o.interactivity.detectsOn === $r.parent) {
                      const m = h.target,
                          y = h.currentTarget;
                      if (m && y && u) {
                          const v = m.getBoundingClientRect(),
                              w = y.getBoundingClientRect(),
                              S = u.getBoundingClientRect();
                          c = { x: h.offsetX + hg * v.left - (w.left + S.left), y: h.offsetY + hg * v.top - (w.top + S.top) };
                      } else c = { x: h.offsetX ?? h.clientX, y: h.offsetY ?? h.clientY };
                  } else h.target === u && (c = { x: h.offsetX ?? h.clientX, y: h.offsetY ?? h.clientY });
              } else if (((this._canPush = i.type !== "touchmove"), u)) {
                  const h = i,
                      m = 1,
                      y = h.touches[h.touches.length - m],
                      v = u.getBoundingClientRect(),
                      w = 0;
                  c = { x: y.clientX - (v.left ?? w), y: y.clientY - (v.top ?? w) };
              }
              const d = s.retina.pixelRatio;
              c && ((c.x *= d), (c.y *= d)), (l.mouse.position = c), (l.status = Xi);
          }),
          (this._touchEnd = (i) => {
              const s = i,
                  o = Array.from(s.changedTouches);
              for (const l of o) this._touches.delete(l.identifier);
              this._mouseTouchFinish();
          }),
          (this._touchEndClick = (i) => {
              const s = i,
                  o = Array.from(s.changedTouches);
              for (const l of o) this._touches.delete(l.identifier);
              this._mouseTouchClick(i);
          }),
          (this._touchStart = (i) => {
              const s = i,
                  o = Array.from(s.changedTouches);
              for (const l of o) this._touches.set(l.identifier, performance.now());
              this._mouseTouchMove(i);
          }),
          (this._canPush = !0),
          (this._touches = new Map()),
          (this._handlers = {
              mouseDown: () => this._mouseDown(),
              mouseLeave: () => this._mouseTouchFinish(),
              mouseMove: (i) => this._mouseTouchMove(i),
              mouseUp: (i) => this._mouseTouchClick(i),
              touchStart: (i) => this._touchStart(i),
              touchMove: (i) => this._mouseTouchMove(i),
              touchEnd: (i) => this._touchEnd(i),
              touchCancel: (i) => this._touchEnd(i),
              touchEndClick: (i) => this._touchEndClick(i),
              visibilityChange: () => this._handleVisibilityChange(),
              themeChange: (i) => this._handleThemeChange(i),
              oldThemeChange: (i) => this._handleThemeChange(i),
              resize: () => {
                  this._handleWindowResize();
              },
          });
  }
  addListeners() {
      this._manageListeners(!0);
  }
  removeListeners() {
      this._manageListeners(!1);
  }
}
var St;
(function (t) {
  (t.configAdded = "configAdded"),
      (t.containerInit = "containerInit"),
      (t.particlesSetup = "particlesSetup"),
      (t.containerStarted = "containerStarted"),
      (t.containerStopped = "containerStopped"),
      (t.containerDestroyed = "containerDestroyed"),
      (t.containerPaused = "containerPaused"),
      (t.containerPlay = "containerPlay"),
      (t.containerBuilt = "containerBuilt"),
      (t.particleAdded = "particleAdded"),
      (t.particleDestroyed = "particleDestroyed"),
      (t.particleRemoved = "particleRemoved");
})(St || (St = {}));
class vt {
  constructor() {
      this.value = "";
  }
  static create(e, i) {
      const s = new vt();
      return s.load(e), i !== void 0 && (gi(i) || An(i) ? s.load({ value: i }) : s.load(i)), s;
  }
  load(e) {
      W(e) || W(e.value) || (this.value = e.value);
  }
}
class EC {
  constructor() {
      (this.color = new vt()), (this.color.value = ""), (this.image = ""), (this.position = ""), (this.repeat = ""), (this.size = ""), (this.opacity = 1);
  }
  load(e) {
      W(e) ||
          (e.color !== void 0 && (this.color = vt.create(this.color, e.color)),
          e.image !== void 0 && (this.image = e.image),
          e.position !== void 0 && (this.position = e.position),
          e.repeat !== void 0 && (this.repeat = e.repeat),
          e.size !== void 0 && (this.size = e.size),
          e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class _C {
  constructor() {
      this.opacity = 1;
  }
  load(e) {
      W(e) || (e.color !== void 0 && (this.color = vt.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image), e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class RC {
  constructor() {
      (this.composite = "destination-out"), (this.cover = new _C()), (this.enable = !1);
  }
  load(e) {
      if (!W(e)) {
          if ((e.composite !== void 0 && (this.composite = e.composite), e.cover !== void 0)) {
              const i = e.cover,
                  s = gi(e.cover) ? { color: e.cover } : e.cover;
              this.cover.load(i.color !== void 0 || i.image !== void 0 ? i : { color: s });
          }
          e.enable !== void 0 && (this.enable = e.enable);
      }
  }
}
class MC {
  constructor() {
      (this.enable = !0), (this.zIndex = 0);
  }
  load(e) {
      W(e) || (e.enable !== void 0 && (this.enable = e.enable), e.zIndex !== void 0 && (this.zIndex = e.zIndex));
  }
}
class AC {
  constructor() {
      (this.enable = !1), (this.mode = []);
  }
  load(e) {
      W(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode));
  }
}
var Qr;
(function (t) {
  (t.circle = "circle"), (t.rectangle = "rectangle");
})(Qr || (Qr = {}));
class pg {
  constructor() {
      (this.selectors = []), (this.enable = !1), (this.mode = []), (this.type = Qr.circle);
  }
  load(e) {
      W(e) || (e.selectors !== void 0 && (this.selectors = e.selectors), e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), e.type !== void 0 && (this.type = e.type));
  }
}
class OC {
  constructor() {
      (this.enable = !1), (this.force = 2), (this.smooth = 10);
  }
  load(e) {
      W(e) || (e.enable !== void 0 && (this.enable = e.enable), e.force !== void 0 && (this.force = e.force), e.smooth !== void 0 && (this.smooth = e.smooth));
  }
}
class DC {
  constructor() {
      (this.enable = !1), (this.mode = []), (this.parallax = new OC());
  }
  load(e) {
      W(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), this.parallax.load(e.parallax));
  }
}
class LC {
  constructor() {
      (this.delay = 0.5), (this.enable = !0);
  }
  load(e) {
      W(e) || (e.delay !== void 0 && (this.delay = e.delay), e.enable !== void 0 && (this.enable = e.enable));
  }
}
class IC {
  constructor() {
      (this.onClick = new AC()), (this.onDiv = new pg()), (this.onHover = new DC()), (this.resize = new LC());
  }
  load(e) {
      if (W(e)) return;
      this.onClick.load(e.onClick);
      const i = e.onDiv;
      i !== void 0 &&
          (this.onDiv = Jt(i, (s) => {
              const o = new pg();
              return o.load(s), o;
          })),
          this.onHover.load(e.onHover),
          this.resize.load(e.resize);
  }
}
class jC {
  constructor(e, i) {
      (this._engine = e), (this._container = i);
  }
  load(e) {
      if (W(e) || !this._container) return;
      const i = this._engine.interactors.get(this._container);
      if (i) for (const s of i) s.loadModeOptions && s.loadModeOptions(this, e);
  }
}
class r0 {
  constructor(e, i) {
      (this.detectsOn = $r.window), (this.events = new IC()), (this.modes = new jC(e, i));
  }
  load(e) {
      if (W(e)) return;
      const i = e.detectsOn;
      i !== void 0 && (this.detectsOn = i), this.events.load(e.events), this.modes.load(e.modes);
  }
}
const mg = 50;
class zC {
  load(e) {
      W(e) || (e.position && (this.position = { x: e.position.x ?? mg, y: e.position.y ?? mg, mode: e.position.mode ?? Kr.percent }), e.options && (this.options = yt({}, e.options)));
  }
}
var Wi;
(function (t) {
  (t.screen = "screen"), (t.canvas = "canvas");
})(Wi || (Wi = {}));
class NC {
  constructor() {
      (this.maxWidth = 1 / 0), (this.options = {}), (this.mode = Wi.canvas);
  }
  load(e) {
      W(e) || (W(e.maxWidth) || (this.maxWidth = e.maxWidth), W(e.mode) || (e.mode === Wi.screen ? (this.mode = Wi.screen) : (this.mode = Wi.canvas)), W(e.options) || (this.options = yt({}, e.options)));
  }
}
var di;
(function (t) {
  (t.any = "any"), (t.dark = "dark"), (t.light = "light");
})(di || (di = {}));
class FC {
  constructor() {
      (this.auto = !1), (this.mode = di.any), (this.value = !1);
  }
  load(e) {
      W(e) || (e.auto !== void 0 && (this.auto = e.auto), e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
  }
}
class VC {
  constructor() {
      (this.name = ""), (this.default = new FC());
  }
  load(e) {
      W(e) || (e.name !== void 0 && (this.name = e.name), this.default.load(e.default), e.options !== void 0 && (this.options = yt({}, e.options)));
  }
}
class fd {
  constructor() {
      (this.count = 0), (this.enable = !1), (this.speed = 1), (this.decay = 0), (this.delay = 0), (this.sync = !1);
  }
  load(e) {
      W(e) ||
          (e.count !== void 0 && (this.count = be(e.count)),
          e.enable !== void 0 && (this.enable = e.enable),
          e.speed !== void 0 && (this.speed = be(e.speed)),
          e.decay !== void 0 && (this.decay = be(e.decay)),
          e.delay !== void 0 && (this.delay = be(e.delay)),
          e.sync !== void 0 && (this.sync = e.sync));
  }
}
class dd extends fd {
  constructor() {
      super(), (this.mode = Hi.auto), (this.startValue = Br.random);
  }
  load(e) {
      super.load(e), !W(e) && (e.mode !== void 0 && (this.mode = e.mode), e.startValue !== void 0 && (this.startValue = e.startValue));
  }
}
class Bc extends fd {
  constructor() {
      super(), (this.offset = 0), (this.sync = !0);
  }
  load(e) {
      super.load(e), !W(e) && e.offset !== void 0 && (this.offset = be(e.offset));
  }
}
class BC {
  constructor() {
      (this.h = new Bc()), (this.s = new Bc()), (this.l = new Bc());
  }
  load(e) {
      W(e) || (this.h.load(e.h), this.s.load(e.s), this.l.load(e.l));
  }
}
class po extends vt {
  constructor() {
      super(), (this.animation = new BC());
  }
  static create(e, i) {
      const s = new po();
      return s.load(e), i !== void 0 && (gi(i) || An(i) ? s.load({ value: i }) : s.load(i)), s;
  }
  load(e) {
      if ((super.load(e), W(e))) return;
      const i = e.animation;
      i !== void 0 && (i.enable !== void 0 ? this.animation.h.load(i) : this.animation.load(e.animation));
  }
}
var Ur;
(function (t) {
  (t.absorb = "absorb"), (t.bounce = "bounce"), (t.destroy = "destroy");
})(Ur || (Ur = {}));
class $C {
  constructor() {
      this.speed = 2;
  }
  load(e) {
      W(e) || (e.speed !== void 0 && (this.speed = e.speed));
  }
}
class UC {
  constructor() {
      (this.enable = !0), (this.retries = 0);
  }
  load(e) {
      W(e) || (e.enable !== void 0 && (this.enable = e.enable), e.retries !== void 0 && (this.retries = e.retries));
  }
}
class nr {
  constructor() {
      this.value = 0;
  }
  load(e) {
      W(e) || W(e.value) || (this.value = be(e.value));
  }
}
class HC extends nr {
  constructor() {
      super(), (this.animation = new fd());
  }
  load(e) {
      if ((super.load(e), W(e))) return;
      const i = e.animation;
      i !== void 0 && this.animation.load(i);
  }
}
class s0 extends HC {
  constructor() {
      super(), (this.animation = new dd());
  }
  load(e) {
      super.load(e);
  }
}
class gg extends nr {
  constructor() {
      super(), (this.value = 1);
  }
}
class o0 {
  constructor() {
      (this.horizontal = new gg()), (this.vertical = new gg());
  }
  load(e) {
      W(e) || (this.horizontal.load(e.horizontal), this.vertical.load(e.vertical));
  }
}
class WC {
  constructor() {
      (this.absorb = new $C()), (this.bounce = new o0()), (this.enable = !1), (this.maxSpeed = 50), (this.mode = Ur.bounce), (this.overlap = new UC());
  }
  load(e) {
      W(e) ||
          (this.absorb.load(e.absorb),
          this.bounce.load(e.bounce),
          e.enable !== void 0 && (this.enable = e.enable),
          e.maxSpeed !== void 0 && (this.maxSpeed = be(e.maxSpeed)),
          e.mode !== void 0 && (this.mode = e.mode),
          this.overlap.load(e.overlap));
  }
}
class qC {
  constructor() {
      (this.close = !0), (this.fill = !0), (this.options = {}), (this.type = []);
  }
  load(e) {
      if (W(e)) return;
      const i = e.options;
      if (i !== void 0)
          for (const s in i) {
              const o = i[s];
              o && (this.options[s] = yt(this.options[s] ?? {}, o));
          }
      e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
  }
}
class KC {
  constructor() {
      (this.offset = 0), (this.value = 90);
  }
  load(e) {
      W(e) || (e.offset !== void 0 && (this.offset = be(e.offset)), e.value !== void 0 && (this.value = be(e.value)));
  }
}
class GC {
  constructor() {
      (this.distance = 200), (this.enable = !1), (this.rotate = { x: 3e3, y: 3e3 });
  }
  load(e) {
      if (!W(e) && (e.distance !== void 0 && (this.distance = be(e.distance)), e.enable !== void 0 && (this.enable = e.enable), e.rotate)) {
          const i = e.rotate.x;
          i !== void 0 && (this.rotate.x = i);
          const s = e.rotate.y;
          s !== void 0 && (this.rotate.y = s);
      }
  }
}
class YC {
  constructor() {
      (this.x = 50), (this.y = 50), (this.mode = Kr.percent), (this.radius = 0);
  }
  load(e) {
      W(e) || (e.x !== void 0 && (this.x = e.x), e.y !== void 0 && (this.y = e.y), e.mode !== void 0 && (this.mode = e.mode), e.radius !== void 0 && (this.radius = e.radius));
  }
}
class QC {
  constructor() {
      (this.acceleration = 9.81), (this.enable = !1), (this.inverse = !1), (this.maxSpeed = 50);
  }
  load(e) {
      W(e) ||
          (e.acceleration !== void 0 && (this.acceleration = be(e.acceleration)),
          e.enable !== void 0 && (this.enable = e.enable),
          e.inverse !== void 0 && (this.inverse = e.inverse),
          e.maxSpeed !== void 0 && (this.maxSpeed = be(e.maxSpeed)));
  }
}
class XC {
  constructor() {
      (this.clamp = !0), (this.delay = new nr()), (this.enable = !1), (this.options = {});
  }
  load(e) {
      W(e) || (e.clamp !== void 0 && (this.clamp = e.clamp), this.delay.load(e.delay), e.enable !== void 0 && (this.enable = e.enable), (this.generator = e.generator), e.options && (this.options = yt(this.options, e.options)));
  }
}
class ZC {
  load(e) {
      W(e) || (e.color !== void 0 && (this.color = vt.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image));
  }
}
class JC {
  constructor() {
      (this.enable = !1), (this.length = 10), (this.fill = new ZC());
  }
  load(e) {
      W(e) || (e.enable !== void 0 && (this.enable = e.enable), e.fill !== void 0 && this.fill.load(e.fill), e.length !== void 0 && (this.length = e.length));
  }
}
var Xe;
(function (t) {
  (t.bounce = "bounce"), (t.none = "none"), (t.out = "out"), (t.destroy = "destroy"), (t.split = "split");
})(Xe || (Xe = {}));
class ek {
  constructor() {
      this.default = Xe.out;
  }
  load(e) {
      W(e) || (e.default !== void 0 && (this.default = e.default), (this.bottom = e.bottom ?? e.default), (this.left = e.left ?? e.default), (this.right = e.right ?? e.default), (this.top = e.top ?? e.default));
  }
}
class tk {
  constructor() {
      (this.acceleration = 0), (this.enable = !1);
  }
  load(e) {
      W(e) || (e.acceleration !== void 0 && (this.acceleration = be(e.acceleration)), e.enable !== void 0 && (this.enable = e.enable), e.position && (this.position = yt({}, e.position)));
  }
}
class nk {
  constructor() {
      (this.angle = new KC()),
          (this.attract = new GC()),
          (this.center = new YC()),
          (this.decay = 0),
          (this.distance = {}),
          (this.direction = ut.none),
          (this.drift = 0),
          (this.enable = !1),
          (this.gravity = new QC()),
          (this.path = new XC()),
          (this.outModes = new ek()),
          (this.random = !1),
          (this.size = !1),
          (this.speed = 2),
          (this.spin = new tk()),
          (this.straight = !1),
          (this.trail = new JC()),
          (this.vibrate = !1),
          (this.warp = !1);
  }
  load(e) {
      if (W(e)) return;
      this.angle.load(yi(e.angle) ? { value: e.angle } : e.angle),
          this.attract.load(e.attract),
          this.center.load(e.center),
          e.decay !== void 0 && (this.decay = be(e.decay)),
          e.direction !== void 0 && (this.direction = e.direction),
          e.distance !== void 0 && (this.distance = yi(e.distance) ? { horizontal: e.distance, vertical: e.distance } : { ...e.distance }),
          e.drift !== void 0 && (this.drift = be(e.drift)),
          e.enable !== void 0 && (this.enable = e.enable),
          this.gravity.load(e.gravity);
      const i = e.outModes;
      i !== void 0 && (Dr(i) ? this.outModes.load(i) : this.outModes.load({ default: i })),
          this.path.load(e.path),
          e.random !== void 0 && (this.random = e.random),
          e.size !== void 0 && (this.size = e.size),
          e.speed !== void 0 && (this.speed = be(e.speed)),
          this.spin.load(e.spin),
          e.straight !== void 0 && (this.straight = e.straight),
          this.trail.load(e.trail),
          e.vibrate !== void 0 && (this.vibrate = e.vibrate),
          e.warp !== void 0 && (this.warp = e.warp);
  }
}
class ik extends dd {
  constructor() {
      super(), (this.destroy = Zi.none), (this.speed = 2);
  }
  load(e) {
      super.load(e), !W(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
  }
}
class rk extends s0 {
  constructor() {
      super(), (this.animation = new ik()), (this.value = 1);
  }
  load(e) {
      if (W(e)) return;
      super.load(e);
      const i = e.animation;
      i !== void 0 && this.animation.load(i);
  }
}
class sk {
  constructor() {
      (this.enable = !1), (this.width = 1920), (this.height = 1080);
  }
  load(e) {
      if (W(e)) return;
      e.enable !== void 0 && (this.enable = e.enable);
      const i = e.width;
      i !== void 0 && (this.width = i);
      const s = e.height;
      s !== void 0 && (this.height = s);
  }
}
var mo;
(function (t) {
  (t.delete = "delete"), (t.wait = "wait");
})(mo || (mo = {}));
class ok {
  constructor() {
      (this.mode = mo.delete), (this.value = 0);
  }
  load(e) {
      W(e) || (e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
  }
}
class ak {
  constructor() {
      (this.density = new sk()), (this.limit = new ok()), (this.value = 0);
  }
  load(e) {
      W(e) || (this.density.load(e.density), this.limit.load(e.limit), e.value !== void 0 && (this.value = e.value));
  }
}
class lk {
  constructor() {
      (this.blur = 0), (this.color = new vt()), (this.enable = !1), (this.offset = { x: 0, y: 0 }), (this.color.value = "#000");
  }
  load(e) {
      W(e) ||
          (e.blur !== void 0 && (this.blur = e.blur),
          (this.color = vt.create(this.color, e.color)),
          e.enable !== void 0 && (this.enable = e.enable),
          e.offset !== void 0 && (e.offset.x !== void 0 && (this.offset.x = e.offset.x), e.offset.y !== void 0 && (this.offset.y = e.offset.y)));
  }
}
class uk {
  constructor() {
      (this.close = !0), (this.fill = !0), (this.options = {}), (this.type = "circle");
  }
  load(e) {
      if (W(e)) return;
      const i = e.options;
      if (i !== void 0)
          for (const s in i) {
              const o = i[s];
              o && (this.options[s] = yt(this.options[s] ?? {}, o));
          }
      e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
  }
}
class ck extends dd {
  constructor() {
      super(), (this.destroy = Zi.none), (this.speed = 5);
  }
  load(e) {
      super.load(e), !W(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
  }
}
class fk extends s0 {
  constructor() {
      super(), (this.animation = new ck()), (this.value = 3);
  }
  load(e) {
      if ((super.load(e), W(e))) return;
      const i = e.animation;
      i !== void 0 && this.animation.load(i);
  }
}
class yg {
  constructor() {
      this.width = 0;
  }
  load(e) {
      W(e) || (e.color !== void 0 && (this.color = po.create(this.color, e.color)), e.width !== void 0 && (this.width = be(e.width)), e.opacity !== void 0 && (this.opacity = be(e.opacity)));
  }
}
class dk extends nr {
  constructor() {
      super(), (this.opacityRate = 1), (this.sizeRate = 1), (this.velocityRate = 1);
  }
  load(e) {
      super.load(e), !W(e) && (e.opacityRate !== void 0 && (this.opacityRate = e.opacityRate), e.sizeRate !== void 0 && (this.sizeRate = e.sizeRate), e.velocityRate !== void 0 && (this.velocityRate = e.velocityRate));
  }
}
class hk {
  constructor(e, i) {
      (this._engine = e),
          (this._container = i),
          (this.bounce = new o0()),
          (this.collisions = new WC()),
          (this.color = new po()),
          (this.color.value = "#fff"),
          (this.effect = new qC()),
          (this.groups = {}),
          (this.move = new nk()),
          (this.number = new ak()),
          (this.opacity = new rk()),
          (this.reduceDuplicates = !1),
          (this.shadow = new lk()),
          (this.shape = new uk()),
          (this.size = new fk()),
          (this.stroke = new yg()),
          (this.zIndex = new dk());
  }
  load(e) {
      if (W(e)) return;
      if (e.groups !== void 0)
          for (const s of Object.keys(e.groups)) {
              if (!Object.hasOwn(e.groups, s)) continue;
              const o = e.groups[s];
              o !== void 0 && (this.groups[s] = yt(this.groups[s] ?? {}, o));
          }
      e.reduceDuplicates !== void 0 && (this.reduceDuplicates = e.reduceDuplicates),
          this.bounce.load(e.bounce),
          this.color.load(po.create(this.color, e.color)),
          this.effect.load(e.effect),
          this.move.load(e.move),
          this.number.load(e.number),
          this.opacity.load(e.opacity),
          this.shape.load(e.shape),
          this.size.load(e.size),
          this.shadow.load(e.shadow),
          this.zIndex.load(e.zIndex),
          this.collisions.load(e.collisions),
          e.interactivity !== void 0 && (this.interactivity = yt({}, e.interactivity));
      const i = e.stroke;
      if (
          (i &&
              (this.stroke = Jt(i, (s) => {
                  const o = new yg();
                  return o.load(s), o;
              })),
          this._container)
      ) {
          const s = this._engine.updaters.get(this._container);
          if (s) for (const l of s) l.loadOptions && l.loadOptions(this, e);
          const o = this._engine.interactors.get(this._container);
          if (o) for (const l of o) l.loadParticlesOptions && l.loadParticlesOptions(this, e);
      }
  }
}
function a0(t, ...e) {
  for (const i of e) t.load(i);
}
function l0(t, e, ...i) {
  const s = new hk(t, e);
  return a0(s, ...i), s;
}
class pk {
  constructor(e, i) {
      (this._findDefaultTheme = (s) => this.themes.find((o) => o.default.value && o.default.mode === s) ?? this.themes.find((o) => o.default.value && o.default.mode === di.any)),
          (this._importPreset = (s) => {
              this.load(this._engine.getPreset(s));
          }),
          (this._engine = e),
          (this._container = i),
          (this.autoPlay = !0),
          (this.background = new EC()),
          (this.backgroundMask = new RC()),
          (this.clear = !0),
          (this.defaultThemes = {}),
          (this.delay = 0),
          (this.fullScreen = new MC()),
          (this.detectRetina = !0),
          (this.duration = 0),
          (this.fpsLimit = 120),
          (this.interactivity = new r0(e, i)),
          (this.manualParticles = []),
          (this.particles = l0(this._engine, this._container)),
          (this.pauseOnBlur = !0),
          (this.pauseOnOutsideViewport = !0),
          (this.responsive = []),
          (this.smooth = !1),
          (this.style = {}),
          (this.themes = []),
          (this.zLayers = 100);
  }
  load(e) {
      var u, c;
      if (W(e)) return;
      e.preset !== void 0 && Jt(e.preset, (d) => this._importPreset(d)),
          e.autoPlay !== void 0 && (this.autoPlay = e.autoPlay),
          e.clear !== void 0 && (this.clear = e.clear),
          e.key !== void 0 && (this.key = e.key),
          e.name !== void 0 && (this.name = e.name),
          e.delay !== void 0 && (this.delay = be(e.delay));
      const i = e.detectRetina;
      i !== void 0 && (this.detectRetina = i), e.duration !== void 0 && (this.duration = be(e.duration));
      const s = e.fpsLimit;
      s !== void 0 && (this.fpsLimit = s),
          e.pauseOnBlur !== void 0 && (this.pauseOnBlur = e.pauseOnBlur),
          e.pauseOnOutsideViewport !== void 0 && (this.pauseOnOutsideViewport = e.pauseOnOutsideViewport),
          e.zLayers !== void 0 && (this.zLayers = e.zLayers),
          this.background.load(e.background);
      const o = e.fullScreen;
      Uv(o) ? (this.fullScreen.enable = o) : this.fullScreen.load(o),
          this.backgroundMask.load(e.backgroundMask),
          this.interactivity.load(e.interactivity),
          e.manualParticles &&
              (this.manualParticles = e.manualParticles.map((d) => {
                  const h = new zC();
                  return h.load(d), h;
              })),
          this.particles.load(e.particles),
          (this.style = yt(this.style, e.style)),
          this._engine.loadOptions(this, e),
          e.smooth !== void 0 && (this.smooth = e.smooth);
      const l = this._engine.interactors.get(this._container);
      if (l) for (const d of l) d.loadOptions && d.loadOptions(this, e);
      if (e.responsive !== void 0)
          for (const d of e.responsive) {
              const h = new NC();
              h.load(d), this.responsive.push(h);
          }
      if ((this.responsive.sort((d, h) => d.maxWidth - h.maxWidth), e.themes !== void 0))
          for (const d of e.themes) {
              const h = this.themes.find((m) => m.name === d.name);
              if (h) h.load(d);
              else {
                  const m = new VC();
                  m.load(d), this.themes.push(m);
              }
          }
      (this.defaultThemes.dark = (u = this._findDefaultTheme(di.dark)) == null ? void 0 : u.name), (this.defaultThemes.light = (c = this._findDefaultTheme(di.light)) == null ? void 0 : c.name);
  }
  setResponsive(e, i, s) {
      this.load(s);
      const o = this.responsive.find((l) => (l.mode === Wi.screen && screen ? l.maxWidth > screen.availWidth : l.maxWidth * i > e));
      return this.load(o == null ? void 0 : o.options), o == null ? void 0 : o.maxWidth;
  }
  setTheme(e) {
      if (e) {
          const i = this.themes.find((s) => s.name === e);
          i && this.load(i.options);
      } else {
          const i = qv("(prefers-color-scheme: dark)"),
              s = i == null ? void 0 : i.matches,
              o = this._findDefaultTheme(s ? di.dark : di.light);
          o && this.load(o.options);
      }
  }
}
var Xr;
(function (t) {
  (t.external = "external"), (t.particles = "particles");
})(Xr || (Xr = {}));
class mk {
  constructor(e, i) {
      (this.container = i), (this._engine = e), (this._interactors = []), (this._externalInteractors = []), (this._particleInteractors = []);
  }
  externalInteract(e) {
      for (const i of this._externalInteractors) i.isEnabled() && i.interact(e);
  }
  handleClickMode(e) {
      var i;
      for (const s of this._externalInteractors) (i = s.handleClickMode) == null || i.call(s, e);
  }
  async init() {
      (this._interactors = await this._engine.getInteractors(this.container, !0)), (this._externalInteractors = []), (this._particleInteractors = []);
      for (const e of this._interactors) {
          switch (e.type) {
              case Xr.external:
                  this._externalInteractors.push(e);
                  break;
              case Xr.particles:
                  this._particleInteractors.push(e);
                  break;
          }
          e.init();
      }
  }
  particlesInteract(e, i) {
      for (const s of this._externalInteractors) s.clear(e, i);
      for (const s of this._particleInteractors) s.isEnabled(e) && s.interact(e, i);
  }
  reset(e) {
      for (const i of this._externalInteractors) i.isEnabled() && i.reset(e);
      for (const i of this._particleInteractors) i.isEnabled(e) && i.reset(e);
  }
}
var pn;
(function (t) {
  (t.normal = "normal"), (t.inside = "inside"), (t.outside = "outside");
})(pn || (pn = {}));
const vg = 0,
  Ef = 2,
  Wa = 0.5,
  gk = 2,
  xg = "random";
function yk(t, e, i, s) {
  const o = e.options[t];
  if (o) return yt({ close: e.close, fill: e.fill }, cn(o, i, s));
}
function vk(t, e, i, s) {
  const o = e.options[t];
  if (o) return yt({ close: e.close, fill: e.fill }, cn(o, i, s));
}
function wg(t) {
  if (!Ke(t.outMode, t.checkModes)) return;
  const e = t.radius * Ef;
  t.coord > t.maxCoord - e ? t.setCb(-t.radius) : t.coord < e && t.setCb(t.radius);
}
class xk {
  constructor(e, i) {
      (this.container = i),
          (this._calcPosition = (s, o, l, u = vg) => {
              for (const S of s.plugins.values()) {
                  const b = S.particlePosition !== void 0 ? S.particlePosition(o, this) : void 0;
                  if (b) return jt.create(b.x, b.y, l);
              }
              const c = s.canvas.size,
                  d = eC({ size: c, position: o }),
                  h = jt.create(d.x, d.y, l),
                  m = this.getRadius(),
                  y = this.options.move.outModes,
                  v = (S) => {
                      wg({ outMode: S, checkModes: [Xe.bounce], coord: h.x, maxCoord: s.canvas.size.width, setCb: (b) => (h.x += b), radius: m });
                  },
                  w = (S) => {
                      wg({ outMode: S, checkModes: [Xe.bounce], coord: h.y, maxCoord: s.canvas.size.height, setCb: (b) => (h.y += b), radius: m });
                  };
              return v(y.left ?? y.default), v(y.right ?? y.default), w(y.top ?? y.default), w(y.bottom ?? y.default), this._checkOverlap(h, u) ? this._calcPosition(s, void 0, l, u + 1) : h;
          }),
          (this._calculateVelocity = () => {
              const s = Jb(this.direction),
                  o = s.copy(),
                  l = this.options.move;
              if (l.direction === ut.inside || l.direction === ut.outside) return o;
              const u = pi(ne(l.angle.value)),
                  c = pi(ne(l.angle.offset)),
                  d = { left: c - u * Wa, right: c + u * Wa };
              return l.straight || (o.angle += zt(be(d.left, d.right))), l.random && typeof l.speed == "number" && (o.length *= Ae()), o;
          }),
          (this._checkOverlap = (s, o = vg) => {
              const l = this.options.collisions,
                  u = this.getRadius();
              if (!l.enable) return !1;
              const c = l.overlap;
              if (c.enable) return !1;
              const d = c.retries;
              if (d >= 0 && o > d) throw new Error(`${Xt} particle is overlapping and can't be placed`);
              return !!this.container.particles.find((m) => Nt(s, m.position) < u + m.getRadius());
          }),
          (this._getRollColor = (s) => {
              if (!s || !this.roll || (!this.backColor && !this.roll.alter)) return s;
              const o = 1,
                  l = 0,
                  u = this.roll.horizontal && this.roll.vertical ? Ef * o : o,
                  c = this.roll.horizontal ? Math.PI * Wa : l;
              return Math.floor(((this.roll.angle ?? l) + c) / (Math.PI / u)) % Ef ? (this.backColor ? this.backColor : this.roll.alter ? CC(s, this.roll.alter.type, this.roll.alter.value) : s) : s;
          }),
          (this._initPosition = (s) => {
              const o = this.container,
                  l = ne(this.options.zIndex.value),
                  u = 0;
              (this.position = this._calcPosition(o, s, Zt(l, u, o.zLayers))), (this.initialPosition = this.position.copy());
              const c = o.canvas.size,
                  d = 0;
              switch (
                  ((this.moveCenter = { ...Xv(this.options.move.center, c), radius: this.options.move.center.radius ?? d, mode: this.options.move.center.mode ?? Kr.percent }),
                  (this.direction = Zb(this.options.move.direction, this.position, this.moveCenter)),
                  this.options.move.direction)
              ) {
                  case ut.inside:
                      this.outType = pn.inside;
                      break;
                  case ut.outside:
                      this.outType = pn.outside;
                      break;
              }
              this.offset = rt.origin;
          }),
          (this._engine = e);
  }
  destroy(e) {
      var l, u, c;
      if (this.unbreakable || this.destroyed) return;
      (this.destroyed = !0), (this.bubble.inRange = !1), (this.slow.inRange = !1);
      const i = this.container,
          s = this.pathGenerator,
          o = i.shapeDrawers.get(this.shape);
      (l = o == null ? void 0 : o.particleDestroy) == null || l.call(o, this);
      for (const d of i.plugins.values()) (u = d.particleDestroyed) == null || u.call(d, this, e);
      for (const d of i.particles.updaters) (c = d.particleDestroyed) == null || c.call(d, this, e);
      s == null || s.reset(this), this._engine.dispatchEvent(St.particleDestroyed, { container: this.container, data: { particle: this } });
  }
  draw(e) {
      const i = this.container,
          s = i.canvas;
      for (const o of i.plugins.values()) s.drawParticlePlugin(o, this, e);
      s.drawParticle(this, e);
  }
  getFillColor() {
      return this._getRollColor(this.bubble.color ?? fg(this.color));
  }
  getMass() {
      return this.getRadius() ** gk * Math.PI * Wa;
  }
  getPosition() {
      return { x: this.position.x + this.offset.x, y: this.position.y + this.offset.y, z: this.position.z };
  }
  getRadius() {
      return this.bubble.radius ?? this.size.value;
  }
  getStrokeColor() {
      return this._getRollColor(this.bubble.color ?? fg(this.strokeColor));
  }
  init(e, i, s, o) {
      var q, K, ie, ue, _e, Te;
      const l = this.container,
          u = this._engine;
      (this.id = e),
          (this.group = o),
          (this.effectClose = !0),
          (this.effectFill = !0),
          (this.shapeClose = !0),
          (this.shapeFill = !0),
          (this.pathRotation = !1),
          (this.lastPathTime = 0),
          (this.destroyed = !1),
          (this.unbreakable = !1),
          (this.isRotating = !1),
          (this.rotation = 0),
          (this.misplaced = !1),
          (this.retina = { maxDistance: {} }),
          (this.outType = pn.normal),
          (this.ignoresResizeRatio = !0);
      const c = l.retina.pixelRatio,
          d = l.actualOptions,
          h = l0(this._engine, l, d.particles),
          { reduceDuplicates: m } = h,
          y = h.effect.type,
          v = h.shape.type;
      (this.effect = cn(y, this.id, m)), (this.shape = cn(v, this.id, m));
      const w = h.effect,
          S = h.shape;
      if (s) {
          if ((q = s.effect) != null && q.type) {
              const he = s.effect.type,
                  Ge = cn(he, this.id, m);
              Ge && ((this.effect = Ge), w.load(s.effect));
          }
          if ((K = s.shape) != null && K.type) {
              const he = s.shape.type,
                  Ge = cn(he, this.id, m);
              Ge && ((this.shape = Ge), S.load(s.shape));
          }
      }
      if (this.effect === xg) {
          const he = [...this.container.effectDrawers.keys()];
          this.effect = he[Math.floor(Math.random() * he.length)];
      }
      if (this.shape === xg) {
          const he = [...this.container.shapeDrawers.keys()];
          this.shape = he[Math.floor(Math.random() * he.length)];
      }
      (this.effectData = yk(this.effect, w, this.id, m)), (this.shapeData = vk(this.shape, S, this.id, m)), h.load(s);
      const b = this.effectData;
      b && h.load(b.particles);
      const C = this.shapeData;
      C && h.load(C.particles);
      const P = new r0(u, l);
      P.load(l.actualOptions.interactivity),
          P.load(h.interactivity),
          (this.interactivity = P),
          (this.effectFill = (b == null ? void 0 : b.fill) ?? h.effect.fill),
          (this.effectClose = (b == null ? void 0 : b.close) ?? h.effect.close),
          (this.shapeFill = (C == null ? void 0 : C.fill) ?? h.shape.fill),
          (this.shapeClose = (C == null ? void 0 : C.close) ?? h.shape.close),
          (this.options = h);
      const E = this.options.move.path;
      (this.pathDelay = ne(E.delay.value) * mt),
          E.generator && ((this.pathGenerator = this._engine.getPathGenerator(E.generator)), this.pathGenerator && l.addPath(E.generator, this.pathGenerator) && this.pathGenerator.init(l)),
          l.retina.initParticle(this),
          (this.size = Qv(this.options.size, c)),
          (this.bubble = { inRange: !1 }),
          (this.slow = { inRange: !1, factor: 1 }),
          this._initPosition(i),
          (this.initialVelocity = this._calculateVelocity()),
          (this.velocity = this.initialVelocity.copy());
      const D = 1;
      this.moveDecay = D - ne(this.options.move.decay);
      const I = l.particles;
      I.setLastZIndex(this.position.z), (this.zIndexFactor = this.position.z / l.zLayers), (this.sides = 24);
      let z = l.effectDrawers.get(this.effect);
      z || ((z = this._engine.getEffectDrawer(this.effect)), z && l.effectDrawers.set(this.effect, z)), z != null && z.loadEffect && z.loadEffect(this);
      let N = l.shapeDrawers.get(this.shape);
      N || ((N = this._engine.getShapeDrawer(this.shape)), N && l.shapeDrawers.set(this.shape, N)), N != null && N.loadShape && N.loadShape(this);
      const Q = N == null ? void 0 : N.getSidesCount;
      Q && (this.sides = Q(this)), (this.spawning = !1), (this.shadowColor = hn(this._engine, this.options.shadow.color));
      for (const he of I.updaters) he.init(this);
      for (const he of I.movers) (ie = he.init) == null || ie.call(he, this);
      (ue = z == null ? void 0 : z.particleInit) == null || ue.call(z, l, this), (_e = N == null ? void 0 : N.particleInit) == null || _e.call(N, l, this);
      for (const he of l.plugins.values()) (Te = he.particleCreated) == null || Te.call(he, this);
  }
  isInsideCanvas() {
      const e = this.getRadius(),
          i = this.container.canvas.size,
          s = this.position;
      return s.x >= -e && s.y >= -e && s.y <= i.height + e && s.x <= i.width + e;
  }
  isVisible() {
      return !this.destroyed && !this.spawning && this.isInsideCanvas();
  }
  reset() {
      var e;
      for (const i of this.container.particles.updaters) (e = i.reset) == null || e.call(i, this);
  }
}
class wk {
  constructor(e, i) {
      (this.position = e), (this.particle = i);
  }
}
var Hr;
(function (t) {
  (t.circle = "circle"), (t.rectangle = "rectangle");
})(Hr || (Hr = {}));
const Gs = 2;
class u0 {
  constructor(e, i, s) {
      (this.position = { x: e, y: i }), (this.type = s);
  }
}
class gt extends u0 {
  constructor(e, i, s) {
      super(e, i, Hr.circle), (this.radius = s);
  }
  contains(e) {
      return Nt(e, this.position) <= this.radius;
  }
  intersects(e) {
      const i = this.position,
          s = e.position,
          o = { x: Math.abs(s.x - i.x), y: Math.abs(s.y - i.y) },
          l = this.radius;
      if (e instanceof gt || e.type === Hr.circle) {
          const u = e,
              c = l + u.radius,
              d = Math.sqrt(o.x ** Gs + o.y ** Gs);
          return c > d;
      } else if (e instanceof gn || e.type === Hr.rectangle) {
          const u = e,
              { width: c, height: d } = u.size;
          return Math.pow(o.x - c, Gs) + Math.pow(o.y - d, Gs) <= l ** Gs || (o.x <= l + c && o.y <= l + d) || o.x <= c || o.y <= d;
      }
      return !1;
  }
}
class gn extends u0 {
  constructor(e, i, s, o) {
      super(e, i, Hr.rectangle), (this.size = { height: o, width: s });
  }
  contains(e) {
      const i = this.size.width,
          s = this.size.height,
          o = this.position;
      return e.x >= o.x && e.x <= o.x + i && e.y >= o.y && e.y <= o.y + s;
  }
  intersects(e) {
      if (e instanceof gt) return e.intersects(this);
      const i = this.size.width,
          s = this.size.height,
          o = this.position,
          l = e.position,
          u = e instanceof gn ? e.size : { width: 0, height: 0 },
          c = u.width,
          d = u.height;
      return l.x < o.x + i && l.x + c > o.x && l.y < o.y + s && l.y + d > o.y;
  }
}
const Ys = 0.5,
  Sk = 2,
  bk = 4;
class hl {
  constructor(e, i) {
      (this.rectangle = e),
          (this.capacity = i),
          (this._subdivide = () => {
              const { x: s, y: o } = this.rectangle.position,
                  { width: l, height: u } = this.rectangle.size,
                  { capacity: c } = this;
              for (let d = 0; d < bk; d++) {
                  const h = d % Sk;
                  this._subs.push(new hl(new gn(s + l * Ys * h, o + u * Ys * (Math.round(d * Ys) - h), l * Ys, u * Ys), c));
              }
              this._divided = !0;
          }),
          (this._points = []),
          (this._divided = !1),
          (this._subs = []);
  }
  insert(e) {
      return this.rectangle.contains(e.position) ? (this._points.length < this.capacity ? (this._points.push(e), !0) : (this._divided || this._subdivide(), this._subs.some((i) => i.insert(e)))) : !1;
  }
  query(e, i) {
      const s = [];
      if (!e.intersects(this.rectangle)) return [];
      for (const o of this._points) (!e.contains(o.position) && Nt(e.position, o.position) > o.particle.getRadius() && (!i || i(o.particle))) || s.push(o.particle);
      if (this._divided) for (const o of this._subs) s.push(...o.query(e, i));
      return s;
  }
  queryCircle(e, i, s) {
      return this.query(new gt(e.x, e.y, i), s);
  }
  queryRectangle(e, i, s) {
      return this.query(new gn(e.x, e.y, i.width, i.height), s);
  }
}
const Sg = 4,
  Ck = 2,
  kk = 1,
  bg = (t) => {
      const { height: e, width: i } = t,
          s = -0.25,
          o = 1.5;
      return new gn(s * i, s * e, o * i, o * e);
  };
class Pk {
  constructor(e, i) {
      (this._addToPool = (...o) => {
          this._pool.push(...o);
      }),
          (this._applyDensity = (o, l, u) => {
              var S;
              const c = o.number;
              if (!((S = o.number.density) != null && S.enable)) {
                  u === void 0 ? (this._limit = c.limit.value) : c.limit && this._groupLimits.set(u, c.limit.value);
                  return;
              }
              const d = this._initDensityFactor(c.density),
                  h = c.value,
                  m = 0,
                  y = c.limit.value > m ? c.limit.value : h,
                  v = Math.min(h, y) * d + l,
                  w = Math.min(this.count, this.filter((b) => b.group === u).length);
              u === void 0 ? (this._limit = c.limit.value * d) : this._groupLimits.set(u, c.limit.value * d), w < v ? this.push(Math.abs(v - w), void 0, o, u) : w > v && this.removeQuantity(w - v, u);
          }),
          (this._initDensityFactor = (o) => {
              const l = this._container,
                  u = 1;
              if (!l.canvas.element || !o.enable) return u;
              const c = l.canvas.element,
                  d = l.retina.pixelRatio;
              return (c.width * c.height) / (o.height * o.width * d ** Ck);
          }),
          (this._pushParticle = (o, l, u, c) => {
              try {
                  let d = this._pool.pop();
                  d || (d = new xk(this._engine, this._container)), d.init(this._nextId, o, l, u);
                  let h = !0;
                  return c && (h = c(d)), h ? (this._array.push(d), this._zArray.push(d), this._nextId++, this._engine.dispatchEvent(St.particleAdded, { container: this._container, data: { particle: d } }), d) : void 0;
              } catch (d) {
                  Ji().warning(`${Xt} adding particle: ${d}`);
              }
          }),
          (this._removeParticle = (o, l, u) => {
              const c = this._array[o];
              if (!c || c.group !== l) return !1;
              const d = this._zArray.indexOf(c),
                  h = 1;
              return this._array.splice(o, h), this._zArray.splice(d, h), c.destroy(u), this._engine.dispatchEvent(St.particleRemoved, { container: this._container, data: { particle: c } }), this._addToPool(c), !0;
          }),
          (this._engine = e),
          (this._container = i),
          (this._nextId = 0),
          (this._array = []),
          (this._zArray = []),
          (this._pool = []),
          (this._limit = 0),
          (this._groupLimits = new Map()),
          (this._needsSort = !1),
          (this._lastZIndex = 0),
          (this._interactionManager = new mk(e, i)),
          (this._pluginsInitialized = !1);
      const s = i.canvas.size;
      (this.quadTree = new hl(bg(s), Sg)), (this.movers = []), (this.updaters = []);
  }
  get count() {
      return this._array.length;
  }
  addManualParticles() {
      const e = this._container;
      e.actualOptions.manualParticles.forEach((s) => this.addParticle(s.position ? Xv(s.position, e.canvas.size) : void 0, s.options));
  }
  addParticle(e, i, s, o) {
      const l = this._container.actualOptions.particles.number.limit.mode,
          u = s === void 0 ? this._limit : this._groupLimits.get(s) ?? this._limit,
          c = this.count;
      if (u > 0)
          switch (l) {
              case mo.delete: {
                  const y = c + 1 - u;
                  y > 0 && this.removeQuantity(y);
                  break;
              }
              case mo.wait:
                  if (c >= u) return;
                  break;
          }
      return this._pushParticle(e, i, s, o);
  }
  clear() {
      (this._array = []), (this._zArray = []), (this._pluginsInitialized = !1);
  }
  destroy() {
      (this._array = []), (this._zArray = []), (this.movers = []), (this.updaters = []);
  }
  draw(e) {
      const i = this._container,
          s = i.canvas;
      s.clear(), this.update(e);
      for (const o of i.plugins.values()) s.drawPlugin(o, e);
      for (const o of this._zArray) o.draw(e);
  }
  filter(e) {
      return this._array.filter(e);
  }
  find(e) {
      return this._array.find(e);
  }
  get(e) {
      return this._array[e];
  }
  handleClickMode(e) {
      this._interactionManager.handleClickMode(e);
  }
  async init() {
      var o, l;
      const e = this._container,
          i = e.actualOptions;
      (this._lastZIndex = 0), (this._needsSort = !1), await this.initPlugins();
      let s = !1;
      for (const u of e.plugins.values()) if (((s = ((o = u.particlesInitialization) == null ? void 0 : o.call(u)) ?? s), s)) break;
      if ((this.addManualParticles(), !s)) {
          const u = i.particles,
              c = u.groups;
          for (const d in c) {
              const h = c[d];
              for (let m = this.count, y = 0; y < ((l = h.number) == null ? void 0 : l.value) && m < u.number.value; m++, y++) this.addParticle(void 0, h, d);
          }
          for (let d = this.count; d < u.number.value; d++) this.addParticle();
      }
  }
  async initPlugins() {
      if (this._pluginsInitialized) return;
      const e = this._container;
      (this.movers = await this._engine.getMovers(e, !0)), (this.updaters = await this._engine.getUpdaters(e, !0)), await this._interactionManager.init();
      for (const i of e.pathGenerators.values()) i.init(e);
  }
  push(e, i, s, o) {
      for (let l = 0; l < e; l++) this.addParticle(i == null ? void 0 : i.position, s, o);
  }
  async redraw() {
      this.clear(), await this.init(), this.draw({ value: 0, factor: 0 });
  }
  remove(e, i, s) {
      this.removeAt(this._array.indexOf(e), void 0, i, s);
  }
  removeAt(e, i = kk, s, o) {
      if (e < 0 || e > this.count) return;
      let u = 0;
      for (let c = e; u < i && c < this.count; c++) this._removeParticle(c, s, o) && (c--, u++);
  }
  removeQuantity(e, i) {
      this.removeAt(0, e, i);
  }
  setDensity() {
      const e = this._container.actualOptions,
          i = e.particles.groups,
          s = 0;
      for (const o in i) this._applyDensity(i[o], s, o);
      this._applyDensity(e.particles, e.manualParticles.length);
  }
  setLastZIndex(e) {
      (this._lastZIndex = e), (this._needsSort = this._needsSort || this._lastZIndex < e);
  }
  setResizeFactor(e) {
      this._resizeFactor = e;
  }
  update(e) {
      var l, u;
      const i = this._container,
          s = new Set();
      this.quadTree = new hl(bg(i.canvas.size), Sg);
      for (const c of i.pathGenerators.values()) c.update();
      for (const c of i.plugins.values()) (l = c.update) == null || l.call(c, e);
      const o = this._resizeFactor;
      for (const c of this._array) {
          o && !c.ignoresResizeRatio && ((c.position.x *= o.width), (c.position.y *= o.height), (c.initialPosition.x *= o.width), (c.initialPosition.y *= o.height)), (c.ignoresResizeRatio = !1), this._interactionManager.reset(c);
          for (const d of this._container.plugins.values()) {
              if (c.destroyed) break;
              (u = d.particleUpdate) == null || u.call(d, c, e);
          }
          for (const d of this.movers) d.isEnabled(c) && d.move(c, e);
          if (c.destroyed) {
              s.add(c);
              continue;
          }
          this.quadTree.insert(new wk(c.getPosition(), c));
      }
      if (s.size) {
          const c = (d) => !s.has(d);
          (this._array = this.filter(c)), (this._zArray = this._zArray.filter(c));
          for (const d of s) this._engine.dispatchEvent(St.particleRemoved, { container: this._container, data: { particle: d } });
          this._addToPool(...s);
      }
      this._interactionManager.externalInteract(e);
      for (const c of this._array) {
          for (const d of this.updaters) d.update(c, e);
          !c.destroyed && !c.spawning && this._interactionManager.particlesInteract(c, e);
      }
      if ((delete this._resizeFactor, this._needsSort)) {
          const c = this._zArray;
          c.sort((h, m) => m.position.z - h.position.z || h.id - m.id);
          const d = 1;
          (this._lastZIndex = c[c.length - d].position.z), (this._needsSort = !1);
      }
  }
}
const Cg = 1,
  kg = 1;
class Tk {
  constructor(e) {
      (this.container = e), (this.pixelRatio = Cg), (this.reduceFactor = kg);
  }
  init() {
      const e = this.container,
          i = e.actualOptions;
      (this.pixelRatio = !i.detectRetina || er() ? Cg : window.devicePixelRatio), (this.reduceFactor = kg);
      const s = this.pixelRatio,
          o = e.canvas;
      if (o.element) {
          const c = o.element;
          (o.size.width = c.offsetWidth * s), (o.size.height = c.offsetHeight * s);
      }
      const l = i.particles,
          u = l.move;
      (this.maxSpeed = ne(u.gravity.maxSpeed) * s), (this.sizeAnimationSpeed = ne(l.size.animation.speed) * s);
  }
  initParticle(e) {
      const i = e.options,
          s = this.pixelRatio,
          o = i.move,
          l = o.distance,
          u = e.retina;
      (u.moveDrift = ne(o.drift) * s), (u.moveSpeed = ne(o.speed) * s), (u.sizeAnimationSpeed = ne(i.size.animation.speed) * s);
      const c = u.maxDistance;
      (c.horizontal = l.horizontal !== void 0 ? l.horizontal * s : void 0), (c.vertical = l.vertical !== void 0 ? l.vertical * s : void 0), (u.maxSpeed = ne(o.gravity.maxSpeed) * s);
  }
}
function Be(t) {
  return t && !t.destroyed;
}
const $c = 60;
function Ek(t, e = $c, i = !1) {
  return { value: t, factor: i ? $c / e : ($c * t) / mt };
}
function Rr(t, e, ...i) {
  const s = new pk(t, e);
  return a0(s, ...i), s;
}
class _k {
  constructor(e, i, s) {
      (this._intersectionManager = (o) => {
          if (!(!Be(this) || !this.actualOptions.pauseOnOutsideViewport)) for (const l of o) l.target === this.interactivity.element && (l.isIntersecting ? this.play() : this.pause());
      }),
          (this._nextFrame = (o) => {
              try {
                  if (!this._smooth && this._lastFrameTime !== void 0 && o < this._lastFrameTime + mt / this.fpsLimit) {
                      this.draw(!1);
                      return;
                  }
                  this._lastFrameTime ?? (this._lastFrameTime = o);
                  const l = Ek(o - this._lastFrameTime, this.fpsLimit, this._smooth);
                  if ((this.addLifeTime(l.value), (this._lastFrameTime = o), l.value > mt)) {
                      this.draw(!1);
                      return;
                  }
                  if ((this.particles.draw(l), !this.alive())) {
                      this.destroy();
                      return;
                  }
                  this.animationStatus && this.draw(!1);
              } catch (l) {
                  Ji().error(`${Xt} in animation loop`, l);
              }
          }),
          (this._engine = e),
          (this.id = Symbol(i)),
          (this.fpsLimit = 120),
          (this._smooth = !1),
          (this._delay = 0),
          (this._duration = 0),
          (this._lifeTime = 0),
          (this._firstStart = !0),
          (this.started = !1),
          (this.destroyed = !1),
          (this._paused = !0),
          (this._lastFrameTime = 0),
          (this.zLayers = 100),
          (this.pageHidden = !1),
          (this._clickHandlers = new Map()),
          (this._sourceOptions = s),
          (this._initialSourceOptions = s),
          (this.retina = new Tk(this)),
          (this.canvas = new PC(this, this._engine)),
          (this.particles = new Pk(this._engine, this)),
          (this.pathGenerators = new Map()),
          (this.interactivity = { mouse: { clicking: !1, inside: !1 } }),
          (this.plugins = new Map()),
          (this.effectDrawers = new Map()),
          (this.shapeDrawers = new Map()),
          (this._options = Rr(this._engine, this)),
          (this.actualOptions = Rr(this._engine, this)),
          (this._eventListeners = new TC(this)),
          (this._intersectionObserver = rC((o) => this._intersectionManager(o))),
          this._engine.dispatchEvent(St.containerBuilt, { container: this });
  }
  get animationStatus() {
      return !this._paused && !this.pageHidden && Be(this);
  }
  get options() {
      return this._options;
  }
  get sourceOptions() {
      return this._sourceOptions;
  }
  addClickHandler(e) {
      if (!Be(this)) return;
      const i = this.interactivity.element;
      if (!i) return;
      const s = (y, v, w) => {
              if (!Be(this)) return;
              const S = this.retina.pixelRatio,
                  b = { x: v.x * S, y: v.y * S },
                  C = this.particles.quadTree.queryCircle(b, w * S);
              e(y, C);
          },
          o = (y) => {
              if (!Be(this)) return;
              const v = y,
                  w = { x: v.offsetX || v.clientX, y: v.offsetY || v.clientY };
              s(y, w, 1);
          },
          l = () => {
              Be(this) && ((h = !0), (m = !1));
          },
          u = () => {
              Be(this) && (m = !0);
          },
          c = (y) => {
              if (Be(this)) {
                  if (h && !m) {
                      const v = y,
                          w = 1;
                      let S = v.touches[v.touches.length - w];
                      if (!S && ((S = v.changedTouches[v.changedTouches.length - w]), !S)) return;
                      const b = this.canvas.element,
                          C = b ? b.getBoundingClientRect() : void 0,
                          P = 0,
                          E = { x: S.clientX - (C ? C.left : P), y: S.clientY - (C ? C.top : P) };
                      s(y, E, Math.max(S.radiusX, S.radiusY));
                  }
                  (h = !1), (m = !1);
              }
          },
          d = () => {
              Be(this) && ((h = !1), (m = !1));
          };
      let h = !1,
          m = !1;
      this._clickHandlers.set("click", o), this._clickHandlers.set("touchstart", l), this._clickHandlers.set("touchmove", u), this._clickHandlers.set("touchend", c), this._clickHandlers.set("touchcancel", d);
      for (const [y, v] of this._clickHandlers) i.addEventListener(y, v);
  }
  addLifeTime(e) {
      this._lifeTime += e;
  }
  addPath(e, i, s = !1) {
      return !Be(this) || (!s && this.pathGenerators.has(e)) ? !1 : (this.pathGenerators.set(e, i), !0);
  }
  alive() {
      return !this._duration || this._lifeTime <= this._duration;
  }
  clearClickHandlers() {
      var e;
      if (Be(this)) {
          for (const [i, s] of this._clickHandlers) (e = this.interactivity.element) == null || e.removeEventListener(i, s);
          this._clickHandlers.clear();
      }
  }
  destroy(e = !0) {
      var i, s;
      if (Be(this)) {
          this.stop(), this.clearClickHandlers(), this.particles.destroy(), this.canvas.destroy();
          for (const o of this.effectDrawers.values()) (i = o.destroy) == null || i.call(o, this);
          for (const o of this.shapeDrawers.values()) (s = o.destroy) == null || s.call(o, this);
          for (const o of this.effectDrawers.keys()) this.effectDrawers.delete(o);
          for (const o of this.shapeDrawers.keys()) this.shapeDrawers.delete(o);
          if ((this._engine.clearPlugins(this), (this.destroyed = !0), e)) {
              const o = this._engine.items,
                  l = o.findIndex((c) => c === this);
              l >= 0 && o.splice(l, 1);
          }
          this._engine.dispatchEvent(St.containerDestroyed, { container: this });
      }
  }
  draw(e) {
      if (!Be(this)) return;
      let i = e;
      const s = (o) => {
          i && ((this._lastFrameTime = void 0), (i = !1)), this._nextFrame(o);
      };
      this._drawAnimationFrame = Qb((o) => s(o));
  }
  async export(e, i = {}) {
      for (const s of this.plugins.values()) {
          if (!s.export) continue;
          const o = await s.export(e, i);
          if (o.supported) return o.blob;
      }
      Ji().error(`${Xt} - Export plugin with type ${e} not found`);
  }
  handleClickMode(e) {
      var i;
      if (Be(this)) {
          this.particles.handleClickMode(e);
          for (const s of this.plugins.values()) (i = s.handleClickMode) == null || i.call(s, e);
      }
  }
  async init() {
      var y, v, w, S;
      if (!Be(this)) return;
      const e = this._engine.getSupportedEffects();
      for (const b of e) {
          const C = this._engine.getEffectDrawer(b);
          C && this.effectDrawers.set(b, C);
      }
      const i = this._engine.getSupportedShapes();
      for (const b of i) {
          const C = this._engine.getShapeDrawer(b);
          C && this.shapeDrawers.set(b, C);
      }
      await this.particles.initPlugins(), (this._options = Rr(this._engine, this, this._initialSourceOptions, this.sourceOptions)), (this.actualOptions = Rr(this._engine, this, this._options));
      const s = await this._engine.getAvailablePlugins(this);
      for (const [b, C] of s) this.plugins.set(b, C);
      this.retina.init(), await this.canvas.init(), this.updateActualOptions(), this.canvas.initBackground(), this.canvas.resize();
      const { zLayers: o, duration: l, delay: u, fpsLimit: c, smooth: d } = this.actualOptions;
      (this.zLayers = o), (this._duration = ne(l) * mt), (this._delay = ne(u) * mt), (this._lifeTime = 0);
      const h = 120,
          m = 0;
      (this.fpsLimit = c > m ? c : h), (this._smooth = d);
      for (const b of this.effectDrawers.values()) await ((y = b.init) == null ? void 0 : y.call(b, this));
      for (const b of this.shapeDrawers.values()) await ((v = b.init) == null ? void 0 : v.call(b, this));
      for (const b of this.plugins.values()) await ((w = b.init) == null ? void 0 : w.call(b));
      this._engine.dispatchEvent(St.containerInit, { container: this }), await this.particles.init(), this.particles.setDensity();
      for (const b of this.plugins.values()) (S = b.particlesSetup) == null || S.call(b);
      this._engine.dispatchEvent(St.particlesSetup, { container: this });
  }
  async loadTheme(e) {
      Be(this) && ((this._currentTheme = e), await this.refresh());
  }
  pause() {
      var e;
      if (Be(this) && (this._drawAnimationFrame !== void 0 && (Xb(this._drawAnimationFrame), delete this._drawAnimationFrame), !this._paused)) {
          for (const i of this.plugins.values()) (e = i.pause) == null || e.call(i);
          this.pageHidden || (this._paused = !0), this._engine.dispatchEvent(St.containerPaused, { container: this });
      }
  }
  play(e) {
      if (!Be(this)) return;
      const i = this._paused || e;
      if (this._firstStart && !this.actualOptions.autoPlay) {
          this._firstStart = !1;
          return;
      }
      if ((this._paused && (this._paused = !1), i)) for (const s of this.plugins.values()) s.play && s.play();
      this._engine.dispatchEvent(St.containerPlay, { container: this }), this.draw(i ?? !1);
  }
  async refresh() {
      if (Be(this)) return this.stop(), this.start();
  }
  async reset(e) {
      if (Be(this))
          return (
              (this._initialSourceOptions = e),
              (this._sourceOptions = e),
              (this._options = Rr(this._engine, this, this._initialSourceOptions, this.sourceOptions)),
              (this.actualOptions = Rr(this._engine, this, this._options)),
              this.refresh()
          );
  }
  async start() {
      !Be(this) ||
          this.started ||
          (await this.init(),
          (this.started = !0),
          await new Promise((e) => {
              const i = async () => {
                  var s;
                  this._eventListeners.addListeners(), this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.observe(this.interactivity.element);
                  for (const o of this.plugins.values()) await ((s = o.start) == null ? void 0 : s.call(o));
                  this._engine.dispatchEvent(St.containerStarted, { container: this }), this.play(), e();
              };
              this._delayTimeout = setTimeout(() => void i(), this._delay);
          }));
  }
  stop() {
      var e;
      if (!(!Be(this) || !this.started)) {
          this._delayTimeout && (clearTimeout(this._delayTimeout), delete this._delayTimeout),
              (this._firstStart = !0),
              (this.started = !1),
              this._eventListeners.removeListeners(),
              this.pause(),
              this.particles.clear(),
              this.canvas.stop(),
              this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.unobserve(this.interactivity.element);
          for (const i of this.plugins.values()) (e = i.stop) == null || e.call(i);
          for (const i of this.plugins.keys()) this.plugins.delete(i);
          (this._sourceOptions = this._options), this._engine.dispatchEvent(St.containerStopped, { container: this });
      }
  }
  updateActualOptions() {
      this.actualOptions.responsive = [];
      const e = this.actualOptions.setResponsive(this.canvas.size.width, this.retina.pixelRatio, this._options);
      return this.actualOptions.setTheme(this._currentTheme), this._responsiveMaxWidth === e ? !1 : ((this._responsiveMaxWidth = e), !0);
  }
}
class Rk {
  constructor() {
      this._listeners = new Map();
  }
  addEventListener(e, i) {
      this.removeEventListener(e, i);
      let s = this._listeners.get(e);
      s || ((s = []), this._listeners.set(e, s)), s.push(i);
  }
  dispatchEvent(e, i) {
      const s = this._listeners.get(e);
      s == null || s.forEach((o) => o(i));
  }
  hasEventListener(e) {
      return !!this._listeners.get(e);
  }
  removeAllEventListeners(e) {
      e ? this._listeners.delete(e) : (this._listeners = new Map());
  }
  removeEventListener(e, i) {
      const s = this._listeners.get(e);
      if (!s) return;
      const o = s.length,
          l = s.indexOf(i);
      if (l < 0) return;
      const c = 1;
      o === c ? this._listeners.delete(e) : s.splice(l, c);
  }
}
async function Uc(t, e, i, s = !1) {
  let o = e.get(t);
  return (!o || s) && ((o = await Promise.all([...i.values()].map((l) => l(t)))), e.set(t, o)), o;
}
async function Mk(t) {
  const e = cn(t.url, t.index);
  if (!e) return t.fallback;
  const i = await fetch(e);
  return i.ok ? await i.json() : (Ji().error(`${Xt} ${i.status} while retrieving config file`), t.fallback);
}
const c0 = "true",
  Pg = "false",
  Hc = "canvas",
  Ak = (t) => {
      let e;
      if (t instanceof HTMLCanvasElement || t.tagName.toLowerCase() === Hc) (e = t), e.dataset[Ui] || (e.dataset[Ui] = Pg);
      else {
          const s = t.getElementsByTagName(Hc);
          s.length ? ((e = s[0]), (e.dataset[Ui] = Pg)) : ((e = document.createElement(Hc)), (e.dataset[Ui] = c0), t.appendChild(e));
      }
      const i = "100%";
      return e.style.width || (e.style.width = i), e.style.height || (e.style.height = i), e;
  },
  Ok = (t, e) => {
      let i = e ?? document.getElementById(t);
      return i || ((i = document.createElement("div")), (i.id = t), (i.dataset[Ui] = c0), document.body.append(i), i);
  };
class Dk {
  constructor() {
      (this._configs = new Map()),
          (this._domArray = []),
          (this._eventDispatcher = new Rk()),
          (this._initialized = !1),
          (this.plugins = []),
          (this.colorManagers = new Map()),
          (this.easingFunctions = new Map()),
          (this._initializers = { interactors: new Map(), movers: new Map(), updaters: new Map() }),
          (this.interactors = new Map()),
          (this.movers = new Map()),
          (this.updaters = new Map()),
          (this.presets = new Map()),
          (this.effectDrawers = new Map()),
          (this.shapeDrawers = new Map()),
          (this.pathGenerators = new Map());
  }
  get configs() {
      const e = {};
      for (const [i, s] of this._configs) e[i] = s;
      return e;
  }
  get items() {
      return this._domArray;
  }
  get version() {
      return "3.7.1";
  }
  async addColorManager(e, i = !0) {
      this.colorManagers.set(e.key, e), await this.refresh(i);
  }
  addConfig(e) {
      const i = e.key ?? e.name ?? "default";
      this._configs.set(i, e), this._eventDispatcher.dispatchEvent(St.configAdded, { data: { name: i, config: e } });
  }
  async addEasing(e, i, s = !0) {
      this.getEasing(e) || (this.easingFunctions.set(e, i), await this.refresh(s));
  }
  async addEffect(e, i, s = !0) {
      Jt(e, (o) => {
          this.getEffectDrawer(o) || this.effectDrawers.set(o, i);
      }),
          await this.refresh(s);
  }
  addEventListener(e, i) {
      this._eventDispatcher.addEventListener(e, i);
  }
  async addInteractor(e, i, s = !0) {
      this._initializers.interactors.set(e, i), await this.refresh(s);
  }
  async addMover(e, i, s = !0) {
      this._initializers.movers.set(e, i), await this.refresh(s);
  }
  async addParticleUpdater(e, i, s = !0) {
      this._initializers.updaters.set(e, i), await this.refresh(s);
  }
  async addPathGenerator(e, i, s = !0) {
      this.getPathGenerator(e) || this.pathGenerators.set(e, i), await this.refresh(s);
  }
  async addPlugin(e, i = !0) {
      this.getPlugin(e.id) || this.plugins.push(e), await this.refresh(i);
  }
  async addPreset(e, i, s = !1, o = !0) {
      (s || !this.getPreset(e)) && this.presets.set(e, i), await this.refresh(o);
  }
  async addShape(e, i = !0) {
      for (const s of e.validTypes) this.getShapeDrawer(s) || this.shapeDrawers.set(s, e);
      await this.refresh(i);
  }
  clearPlugins(e) {
      this.updaters.delete(e), this.movers.delete(e), this.interactors.delete(e);
  }
  dispatchEvent(e, i) {
      this._eventDispatcher.dispatchEvent(e, i);
  }
  dom() {
      return this.items;
  }
  domItem(e) {
      return this.item(e);
  }
  async getAvailablePlugins(e) {
      const i = new Map();
      for (const s of this.plugins) s.needsPlugin(e.actualOptions) && i.set(s.id, await s.getPlugin(e));
      return i;
  }
  getEasing(e) {
      return this.easingFunctions.get(e) ?? ((i) => i);
  }
  getEffectDrawer(e) {
      return this.effectDrawers.get(e);
  }
  async getInteractors(e, i = !1) {
      return Uc(e, this.interactors, this._initializers.interactors, i);
  }
  async getMovers(e, i = !1) {
      return Uc(e, this.movers, this._initializers.movers, i);
  }
  getPathGenerator(e) {
      return this.pathGenerators.get(e);
  }
  getPlugin(e) {
      return this.plugins.find((i) => i.id === e);
  }
  getPreset(e) {
      return this.presets.get(e);
  }
  getShapeDrawer(e) {
      return this.shapeDrawers.get(e);
  }
  getSupportedEffects() {
      return this.effectDrawers.keys();
  }
  getSupportedShapes() {
      return this.shapeDrawers.keys();
  }
  async getUpdaters(e, i = !1) {
      return Uc(e, this.updaters, this._initializers.updaters, i);
  }
  init() {
      this._initialized || (this._initialized = !0);
  }
  item(e) {
      const { items: i } = this,
          s = i[e];
      if (!s || s.destroyed) {
          i.splice(e, 1);
          return;
      }
      return s;
  }
  async load(e) {
      var S;
      const s = e.id ?? ((S = e.element) == null ? void 0 : S.id) ?? `tsparticles${Math.floor(Ae() * 1e4)}`,
          { index: o, url: l } = e,
          u = l ? await Mk({ fallback: e.options, url: l, index: o }) : e.options,
          c = cn(u, o),
          { items: d } = this,
          h = d.findIndex((b) => b.id.description === s),
          m = 0,
          y = new _k(this, s, c);
      if (h >= m) {
          const b = this.item(h),
              C = 1,
              P = 0,
              E = b ? C : P;
          b && !b.destroyed && b.destroy(!1), d.splice(h, E, y);
      } else d.push(y);
      const v = Ok(s, e.element),
          w = Ak(v);
      return y.canvas.loadCanvas(w), await y.start(), y;
  }
  loadOptions(e, i) {
      this.plugins.forEach((s) => {
          var o;
          return (o = s.loadOptions) == null ? void 0 : o.call(s, e, i);
      });
  }
  loadParticlesOptions(e, i, ...s) {
      const o = this.updaters.get(e);
      o &&
          o.forEach((l) => {
              var u;
              return (u = l.loadOptions) == null ? void 0 : u.call(l, i, ...s);
          });
  }
  async refresh(e = !0) {
      e && (await Promise.all(this.items.map((i) => i.refresh())));
  }
  removeEventListener(e, i) {
      this._eventDispatcher.removeEventListener(e, i);
  }
  setOnClickHandler(e) {
      const { items: i } = this;
      if (!i.length) throw new Error(`${Xt} can only set click handlers after calling tsParticles.load()`);
      i.forEach((s) => s.addClickHandler(e));
  }
}
function Lk() {
  const t = new Dk();
  return t.init(), t;
}
class On {
  constructor(e) {
      (this.type = Xr.external), (this.container = e);
  }
}
class hd {
  constructor(e) {
      (this.type = Xr.particles), (this.container = e);
  }
}
var Qt;
(function (t) {
  (t.clockwise = "clockwise"), (t.counterClockwise = "counter-clockwise"), (t.random = "random");
})(Qt || (Qt = {}));
var Tg;
(function (t) {
  (t.linear = "linear"), (t.radial = "radial"), (t.random = "random");
})(Tg || (Tg = {}));
var Gi;
(function (t) {
  (t.easeInBack = "ease-in-back"),
      (t.easeInCirc = "ease-in-circ"),
      (t.easeInCubic = "ease-in-cubic"),
      (t.easeInLinear = "ease-in-linear"),
      (t.easeInQuad = "ease-in-quad"),
      (t.easeInQuart = "ease-in-quart"),
      (t.easeInQuint = "ease-in-quint"),
      (t.easeInExpo = "ease-in-expo"),
      (t.easeInSine = "ease-in-sine"),
      (t.easeOutBack = "ease-out-back"),
      (t.easeOutCirc = "ease-out-circ"),
      (t.easeOutCubic = "ease-out-cubic"),
      (t.easeOutLinear = "ease-out-linear"),
      (t.easeOutQuad = "ease-out-quad"),
      (t.easeOutQuart = "ease-out-quart"),
      (t.easeOutQuint = "ease-out-quint"),
      (t.easeOutExpo = "ease-out-expo"),
      (t.easeOutSine = "ease-out-sine"),
      (t.easeInOutBack = "ease-in-out-back"),
      (t.easeInOutCirc = "ease-in-out-circ"),
      (t.easeInOutCubic = "ease-in-out-cubic"),
      (t.easeInOutLinear = "ease-in-out-linear"),
      (t.easeInOutQuad = "ease-in-out-quad"),
      (t.easeInOutQuart = "ease-in-out-quart"),
      (t.easeInOutQuint = "ease-in-out-quint"),
      (t.easeInOutExpo = "ease-in-out-expo"),
      (t.easeInOutSine = "ease-in-out-sine");
})(Gi || (Gi = {}));
const pd = Lk();
er() || (window.tsParticles = pd);
const Ik = (t) => {
  const e = t.id ?? "tsparticles";
  return (
      A.useEffect(() => {
          let i;
          return (
              pd.load({ id: e, url: t.url, options: t.options }).then((s) => {
                  var o;
                  (i = s), (o = t.particlesLoaded) == null || o.call(t, s);
              }),
              () => {
                  i == null || i.destroy();
              }
          );
      }, [e, t, t.url, t.options]),
      k.jsx("div", { id: e, className: t.className })
  );
};
async function jk(t) {
  await t(pd);
}
const _f = 0.5,
  qi = 0,
  fn = 1,
  Eg = 60,
  _g = 0,
  zk = 0.01;
function Nk(t) {
  const e = t.initialPosition,
      { dx: i, dy: s } = bt(e, t.position),
      o = Math.abs(i),
      l = Math.abs(s),
      { maxDistance: u } = t.retina,
      c = u.horizontal,
      d = u.vertical;
  if (!c && !d) return;
  const h = (c && o >= c) ?? !1,
      m = (d && l >= d) ?? !1;
  if ((h || m) && !t.misplaced) (t.misplaced = (!!c && o > c) || (!!d && l > d)), c && (t.velocity.x = t.velocity.y * _f - t.velocity.x), d && (t.velocity.y = t.velocity.x * _f - t.velocity.y);
  else if ((!c || o < c) && (!d || l < d) && t.misplaced) t.misplaced = !1;
  else if (t.misplaced) {
      const y = t.position,
          v = t.velocity;
      c && ((y.x < e.x && v.x < qi) || (y.x > e.x && v.x > qi)) && (v.x *= -Ae()), d && ((y.y < e.y && v.y < qi) || (y.y > e.y && v.y > qi)) && (v.y *= -Ae());
  }
}
function Fk(t, e, i, s, o, l) {
  Bk(t, l);
  const u = t.gravity,
      c = u != null && u.enable && u.inverse ? -fn : fn;
  o && i && (t.velocity.x += (o * l.factor) / (Eg * i)), u != null && u.enable && i && (t.velocity.y += (c * (u.acceleration * l.factor)) / (Eg * i));
  const d = t.moveDecay;
  t.velocity.multTo(d);
  const h = t.velocity.mult(i);
  u != null && u.enable && s > qi && ((!u.inverse && h.y >= qi && h.y >= s) || (u.inverse && h.y <= qi && h.y <= -s)) && ((h.y = c * s), i && (t.velocity.y = h.y / i));
  const m = t.options.zIndex,
      y = (fn - t.zIndexFactor) ** m.velocityRate;
  h.multTo(y);
  const { position: v } = t;
  v.addTo(h), e.vibrate && ((v.x += Math.sin(v.x * Math.cos(v.y))), (v.y += Math.cos(v.y * Math.sin(v.x))));
}
function Vk(t, e) {
  const i = t.container;
  if (!t.spin) return;
  const s = { x: t.spin.direction === Qt.clockwise ? Math.cos : Math.sin, y: t.spin.direction === Qt.clockwise ? Math.sin : Math.cos };
  (t.position.x = t.spin.center.x + t.spin.radius * s.x(t.spin.angle)), (t.position.y = t.spin.center.y + t.spin.radius * s.y(t.spin.angle)), (t.spin.radius += t.spin.acceleration);
  const o = Math.max(i.canvas.size.width, i.canvas.size.height),
      l = o * _f;
  t.spin.radius > l ? ((t.spin.radius = l), (t.spin.acceleration *= -fn)) : t.spin.radius < _g && ((t.spin.radius = _g), (t.spin.acceleration *= -fn)), (t.spin.angle += e * zk * (fn - t.spin.radius / o));
}
function Bk(t, e) {
  var u;
  const i = t.options,
      s = i.move.path;
  if (!s.enable) return;
  if (t.lastPathTime <= t.pathDelay) {
      t.lastPathTime += e.value;
      return;
  }
  const l = (u = t.pathGenerator) == null ? void 0 : u.generate(t, e);
  l && t.velocity.addTo(l), s.clamp && ((t.velocity.x = Zt(t.velocity.x, -fn, fn)), (t.velocity.y = Zt(t.velocity.y, -fn, fn))), (t.lastPathTime -= t.pathDelay);
}
function $k(t) {
  return t.slow.inRange ? t.slow.factor : fn;
}
function Uk(t) {
  const e = t.container,
      i = t.options,
      s = i.move.spin;
  if (!s.enable) return;
  const o = s.position ?? { x: 50, y: 50 },
      l = 0.01,
      u = { x: o.x * l * e.canvas.size.width, y: o.y * l * e.canvas.size.height },
      c = t.getPosition(),
      d = Nt(c, u),
      h = ne(s.acceleration);
  t.retina.spinAcceleration = h * e.retina.pixelRatio;
  const m = 0;
  t.spin = { center: u, direction: t.velocity.x >= m ? Qt.clockwise : Qt.counterClockwise, angle: t.velocity.angle, radius: d, acceleration: t.retina.spinAcceleration };
}
const Hk = 2,
  Wk = 1,
  qk = 1;
class Kk {
  init(e) {
      const i = e.options,
          s = i.move.gravity;
      (e.gravity = { enable: s.enable, acceleration: ne(s.acceleration), inverse: s.inverse }), Uk(e);
  }
  isEnabled(e) {
      return !e.destroyed && e.options.move.enable;
  }
  move(e, i) {
      var b, C;
      const s = e.options,
          o = s.move;
      if (!o.enable) return;
      const l = e.container,
          u = l.retina.pixelRatio;
      (b = e.retina).moveSpeed ?? (b.moveSpeed = ne(o.speed) * u), (C = e.retina).moveDrift ?? (C.moveDrift = ne(e.options.move.drift) * u);
      const c = $k(e),
          d = e.retina.moveSpeed * l.retina.reduceFactor,
          h = e.retina.moveDrift,
          m = Pn(s.size.value) * u,
          y = o.size ? e.getRadius() / m : Wk,
          v = i.factor || qk,
          w = (d * y * c * v) / Hk,
          S = e.retina.maxSpeed ?? l.retina.maxSpeed;
      o.spin.enable ? Vk(e, w) : Fk(e, o, w, S, h, i), Nk(e);
  }
}
async function Gk(t, e = !0) {
  ye(t, "3.7.1"), await t.addMover("base", () => Promise.resolve(new Kk()), e);
}
const Yk = 2,
  Qk = Math.PI * Yk,
  Xk = 0,
  Rg = { x: 0, y: 0 };
function Zk(t) {
  const { context: e, particle: i, radius: s } = t;
  i.circleRange || (i.circleRange = { min: Xk, max: Qk });
  const o = i.circleRange;
  e.arc(Rg.x, Rg.y, s, o.min, o.max, !1);
}
const Jk = 12,
  eP = 360,
  Mg = 0;
class tP {
  constructor() {
      this.validTypes = ["circle"];
  }
  draw(e) {
      Zk(e);
  }
  getSidesCount() {
      return Jk;
  }
  particleInit(e, i) {
      const s = i.shapeData,
          o = (s == null ? void 0 : s.angle) ?? { max: eP, min: Mg };
      i.circleRange = Dr(o) ? { min: pi(o.min), max: pi(o.max) } : { min: Mg, max: pi(o) };
  }
}
async function nP(t, e = !0) {
  ye(t, "3.7.1"), await t.addShape(new tP(), e);
}
class iP {
  constructor(e, i) {
      (this._container = e), (this._engine = i);
  }
  init(e) {
      const i = fo(this._engine, e.options.color, e.id, e.options.reduceDuplicates);
      i && (e.color = n0(i, e.options.color.animation, this._container.retina.reduceFactor));
  }
  isEnabled(e) {
      const { h: i, s, l: o } = e.options.color.animation,
          { color: l } = e;
      return !e.destroyed && !e.spawning && (((l == null ? void 0 : l.h.value) !== void 0 && i.enable) || ((l == null ? void 0 : l.s.value) !== void 0 && s.enable) || ((l == null ? void 0 : l.l.value) !== void 0 && o.enable));
  }
  update(e, i) {
      i0(e.color, i);
  }
}
async function rP(t, e = !0) {
  ye(t, "3.7.1"), await t.addParticleUpdater("color", (i) => Promise.resolve(new iP(i, t)), e);
}
var $i;
(function (t) {
  (t[(t.r = 1)] = "r"), (t[(t.g = 2)] = "g"), (t[(t.b = 3)] = "b"), (t[(t.a = 4)] = "a");
})($i || ($i = {}));
const sP = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i,
  oP = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i,
  qa = 16,
  aP = 1,
  lP = 255;
class uP {
  constructor() {
      (this.key = "hex"), (this.stringPrefix = "#");
  }
  handleColor(e) {
      return this._parseString(e.value);
  }
  handleRangeColor(e) {
      return this._parseString(e.value);
  }
  parseString(e) {
      return this._parseString(e);
  }
  _parseString(e) {
      if (typeof e != "string" || !(e != null && e.startsWith(this.stringPrefix))) return;
      const i = e.replace(sP, (o, l, u, c, d) => l + l + u + u + c + c + (d !== void 0 ? d + d : "")),
          s = oP.exec(i);
      return s ? { a: s[$i.a] !== void 0 ? parseInt(s[$i.a], qa) / lP : aP, b: parseInt(s[$i.b], qa), g: parseInt(s[$i.g], qa), r: parseInt(s[$i.r], qa) } : void 0;
  }
}
async function cP(t, e = !0) {
  ye(t, "3.7.1"), await t.addColorManager(new uP(), e);
}
var Lr;
(function (t) {
  (t[(t.h = 1)] = "h"), (t[(t.s = 2)] = "s"), (t[(t.l = 3)] = "l"), (t[(t.a = 5)] = "a");
})(Lr || (Lr = {}));
class fP {
  constructor() {
      (this.key = "hsl"), (this.stringPrefix = "hsl");
  }
  handleColor(e) {
      const i = e.value,
          s = i.hsl ?? e.value;
      if (s.h !== void 0 && s.s !== void 0 && s.l !== void 0) return Gr(s);
  }
  handleRangeColor(e) {
      const i = e.value,
          s = i.hsl ?? e.value;
      if (s.h !== void 0 && s.l !== void 0) return Gr({ h: ne(s.h), l: ne(s.l), s: ne(s.s) });
  }
  parseString(e) {
      if (!e.startsWith("hsl")) return;
      const i = /hsla?\(\s*(\d+)\s*[\s,]\s*(\d+)%\s*[\s,]\s*(\d+)%\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i,
          s = i.exec(e),
          o = 4,
          l = 1,
          u = 10;
      return s ? pC({ a: s.length > o ? Wv(s[Lr.a]) : l, h: parseInt(s[Lr.h], u), l: parseInt(s[Lr.l], u), s: parseInt(s[Lr.s], u) }) : void 0;
  }
}
async function dP(t, e = !0) {
  ye(t, "3.7.1"), await t.addColorManager(new fP(), e);
}
class hP {
  constructor(e) {
      this.container = e;
  }
  init(e) {
      const i = e.options.opacity,
          s = 1;
      e.opacity = Qv(i, s);
      const o = i.animation;
      o.enable && ((e.opacity.velocity = (ne(o.speed) / hi) * this.container.retina.reduceFactor), o.sync || (e.opacity.velocity *= Ae()));
  }
  isEnabled(e) {
      return !e.destroyed && !e.spawning && !!e.opacity && e.opacity.enable && ((e.opacity.maxLoops ?? 0) <= 0 || ((e.opacity.maxLoops ?? 0) > 0 && (e.opacity.loops ?? 0) < (e.opacity.maxLoops ?? 0)));
  }
  reset(e) {
      e.opacity && ((e.opacity.time = 0), (e.opacity.loops = 0));
  }
  update(e, i) {
      !this.isEnabled(e) || !e.opacity || ud(e, e.opacity, !0, e.options.opacity.animation.destroy, i);
  }
}
async function pP(t, e = !0) {
  ye(t, "3.7.1"), await t.addParticleUpdater("opacity", (i) => Promise.resolve(new hP(i)), e);
}
const pl = 0,
  Wr = 0;
function mP(t) {
  if ((t.outMode !== Xe.bounce && t.outMode !== Xe.split) || (t.direction !== ve.left && t.direction !== ve.right)) return;
  t.bounds.right < Wr && t.direction === ve.left ? (t.particle.position.x = t.size + t.offset.x) : t.bounds.left > t.canvasSize.width && t.direction === ve.right && (t.particle.position.x = t.canvasSize.width - t.size - t.offset.x);
  const e = t.particle.velocity.x;
  let i = !1;
  if ((t.direction === ve.right && t.bounds.right >= t.canvasSize.width && e > pl) || (t.direction === ve.left && t.bounds.left <= Wr && e < pl)) {
      const o = ne(t.particle.options.bounce.horizontal.value);
      (t.particle.velocity.x *= -o), (i = !0);
  }
  if (!i) return;
  const s = t.offset.x + t.size;
  t.bounds.right >= t.canvasSize.width && t.direction === ve.right ? (t.particle.position.x = t.canvasSize.width - s) : t.bounds.left <= Wr && t.direction === ve.left && (t.particle.position.x = s),
      t.outMode === Xe.split && t.particle.destroy();
}
function gP(t) {
  if ((t.outMode !== Xe.bounce && t.outMode !== Xe.split) || (t.direction !== ve.bottom && t.direction !== ve.top)) return;
  t.bounds.bottom < Wr && t.direction === ve.top ? (t.particle.position.y = t.size + t.offset.y) : t.bounds.top > t.canvasSize.height && t.direction === ve.bottom && (t.particle.position.y = t.canvasSize.height - t.size - t.offset.y);
  const e = t.particle.velocity.y;
  let i = !1;
  if ((t.direction === ve.bottom && t.bounds.bottom >= t.canvasSize.height && e > pl) || (t.direction === ve.top && t.bounds.top <= Wr && e < pl)) {
      const o = ne(t.particle.options.bounce.vertical.value);
      (t.particle.velocity.y *= -o), (i = !0);
  }
  if (!i) return;
  const s = t.offset.y + t.size;
  t.bounds.bottom >= t.canvasSize.height && t.direction === ve.bottom ? (t.particle.position.y = t.canvasSize.height - s) : t.bounds.top <= Wr && t.direction === ve.top && (t.particle.position.y = s),
      t.outMode === Xe.split && t.particle.destroy();
}
class yP {
  constructor(e) {
      (this.container = e), (this.modes = [Xe.bounce, Xe.split]);
  }
  update(e, i, s, o) {
      if (!this.modes.includes(o)) return;
      const l = this.container;
      let u = !1;
      for (const v of l.plugins.values()) if ((v.particleBounce !== void 0 && (u = v.particleBounce(e, s, i)), u)) break;
      if (u) return;
      const c = e.getPosition(),
          d = e.offset,
          h = e.getRadius(),
          m = To(c, h),
          y = l.canvas.size;
      mP({ particle: e, outMode: o, direction: i, bounds: m, canvasSize: y, offset: d, size: h }), gP({ particle: e, outMode: o, direction: i, bounds: m, canvasSize: y, offset: d, size: h });
  }
}
const Ka = 0;
class vP {
  constructor(e) {
      (this.container = e), (this.modes = [Xe.destroy]);
  }
  update(e, i, s, o) {
      if (!this.modes.includes(o)) return;
      const l = this.container;
      switch (e.outType) {
          case pn.normal:
          case pn.outside:
              if (od(e.position, l.canvas.size, rt.origin, e.getRadius(), i)) return;
              break;
          case pn.inside: {
              const { dx: u, dy: c } = bt(e.position, e.moveCenter),
                  { x: d, y: h } = e.velocity;
              if ((d < Ka && u > e.moveCenter.radius) || (h < Ka && c > e.moveCenter.radius) || (d >= Ka && u < -e.moveCenter.radius) || (h >= Ka && c < -e.moveCenter.radius)) return;
              break;
          }
      }
      l.particles.remove(e, e.group, !0);
  }
}
const Ga = 0;
class xP {
  constructor(e) {
      (this.container = e), (this.modes = [Xe.none]);
  }
  update(e, i, s, o) {
      if (!this.modes.includes(o) || ((e.options.move.distance.horizontal && (i === ve.left || i === ve.right)) ?? (e.options.move.distance.vertical && (i === ve.top || i === ve.bottom)))) return;
      const l = e.options.move.gravity,
          u = this.container,
          c = u.canvas.size,
          d = e.getRadius();
      if (l.enable) {
          const h = e.position;
          ((!l.inverse && h.y > c.height + d && i === ve.bottom) || (l.inverse && h.y < -d && i === ve.top)) && u.particles.remove(e);
      } else {
          if ((e.velocity.y > Ga && e.position.y <= c.height + d) || (e.velocity.y < Ga && e.position.y >= -d) || (e.velocity.x > Ga && e.position.x <= c.width + d) || (e.velocity.x < Ga && e.position.x >= -d)) return;
          od(e.position, u.canvas.size, rt.origin, d, i) || u.particles.remove(e);
      }
  }
}
const Ya = 0,
  Qa = 0;
class wP {
  constructor(e) {
      (this.container = e), (this.modes = [Xe.out]);
  }
  update(e, i, s, o) {
      if (!this.modes.includes(o)) return;
      const l = this.container;
      switch (e.outType) {
          case pn.inside: {
              const { x: u, y: c } = e.velocity,
                  d = rt.origin;
              (d.length = e.moveCenter.radius), (d.angle = e.velocity.angle + Math.PI), d.addTo(rt.create(e.moveCenter));
              const { dx: h, dy: m } = bt(e.position, d);
              if ((u <= Ya && h >= Qa) || (c <= Ya && m >= Qa) || (u >= Ya && h <= Qa) || (c >= Ya && m <= Qa)) return;
              (e.position.x = Math.floor(zt({ min: 0, max: l.canvas.size.width }))), (e.position.y = Math.floor(zt({ min: 0, max: l.canvas.size.height })));
              const { dx: y, dy: v } = bt(e.position, e.moveCenter);
              (e.direction = Math.atan2(-v, -y)), (e.velocity.angle = e.direction);
              break;
          }
          default: {
              if (od(e.position, l.canvas.size, rt.origin, e.getRadius(), i)) return;
              switch (e.outType) {
                  case pn.outside: {
                      (e.position.x = Math.floor(zt({ min: -e.moveCenter.radius, max: e.moveCenter.radius })) + e.moveCenter.x), (e.position.y = Math.floor(zt({ min: -e.moveCenter.radius, max: e.moveCenter.radius })) + e.moveCenter.y);
                      const { dx: u, dy: c } = bt(e.position, e.moveCenter);
                      e.moveCenter.radius && ((e.direction = Math.atan2(c, u)), (e.velocity.angle = e.direction));
                      break;
                  }
                  case pn.normal: {
                      const u = e.options.move.warp,
                          c = l.canvas.size,
                          d = { bottom: c.height + e.getRadius() + e.offset.y, left: -e.getRadius() - e.offset.x, right: c.width + e.getRadius() + e.offset.x, top: -e.getRadius() - e.offset.y },
                          h = e.getRadius(),
                          m = To(e.position, h);
                      i === ve.right && m.left > c.width + e.offset.x
                          ? ((e.position.x = d.left), (e.initialPosition.x = e.position.x), u || ((e.position.y = Ae() * c.height), (e.initialPosition.y = e.position.y)))
                          : i === ve.left && m.right < -e.offset.x && ((e.position.x = d.right), (e.initialPosition.x = e.position.x), u || ((e.position.y = Ae() * c.height), (e.initialPosition.y = e.position.y))),
                          i === ve.bottom && m.top > c.height + e.offset.y
                              ? (u || ((e.position.x = Ae() * c.width), (e.initialPosition.x = e.position.x)), (e.position.y = d.top), (e.initialPosition.y = e.position.y))
                              : i === ve.top && m.bottom < -e.offset.y && (u || ((e.position.x = Ae() * c.width), (e.initialPosition.x = e.position.x)), (e.position.y = d.bottom), (e.initialPosition.y = e.position.y));
                      break;
                  }
              }
              break;
          }
      }
  }
}
const SP = (t, e) => t.default === e || t.bottom === e || t.left === e || t.right === e || t.top === e;
class bP {
  constructor(e) {
      (this._addUpdaterIfMissing = (i, s, o) => {
          const l = i.options.move.outModes;
          !this.updaters.has(s) && SP(l, s) && this.updaters.set(s, o(this.container));
      }),
          (this._updateOutMode = (i, s, o, l) => {
              for (const u of this.updaters.values()) u.update(i, l, s, o);
          }),
          (this.container = e),
          (this.updaters = new Map());
  }
  init(e) {
      this._addUpdaterIfMissing(e, Xe.bounce, (i) => new yP(i)), this._addUpdaterIfMissing(e, Xe.out, (i) => new wP(i)), this._addUpdaterIfMissing(e, Xe.destroy, (i) => new vP(i)), this._addUpdaterIfMissing(e, Xe.none, (i) => new xP(i));
  }
  isEnabled(e) {
      return !e.destroyed && !e.spawning;
  }
  update(e, i) {
      const s = e.options.move.outModes;
      this._updateOutMode(e, i, s.bottom ?? s.default, ve.bottom), this._updateOutMode(e, i, s.left ?? s.default, ve.left), this._updateOutMode(e, i, s.right ?? s.default, ve.right), this._updateOutMode(e, i, s.top ?? s.default, ve.top);
  }
}
async function CP(t, e = !0) {
  ye(t, "3.7.1"), await t.addParticleUpdater("outModes", (i) => Promise.resolve(new bP(i)), e);
}
var Ir;
(function (t) {
  (t[(t.r = 1)] = "r"), (t[(t.g = 2)] = "g"), (t[(t.b = 3)] = "b"), (t[(t.a = 5)] = "a");
})(Ir || (Ir = {}));
class kP {
  constructor() {
      (this.key = "rgb"), (this.stringPrefix = "rgb");
  }
  handleColor(e) {
      const i = e.value,
          s = i.rgb ?? e.value;
      if (s.r !== void 0) return s;
  }
  handleRangeColor(e) {
      const i = e.value,
          s = i.rgb ?? e.value;
      if (s.r !== void 0) return { r: ne(s.r), g: ne(s.g), b: ne(s.b) };
  }
  parseString(e) {
      if (!e.startsWith(this.stringPrefix)) return;
      const i = /rgba?\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i,
          s = i.exec(e),
          o = 10;
      return s ? { a: s.length > 4 ? Wv(s[Ir.a]) : 1, b: parseInt(s[Ir.b], o), g: parseInt(s[Ir.g], o), r: parseInt(s[Ir.r], o) } : void 0;
  }
}
async function PP(t, e = !0) {
  ye(t, "3.7.1"), await t.addColorManager(new kP(), e);
}
const Ii = 0;
class TP {
  init(e) {
      const i = e.container,
          s = e.options.size,
          o = s.animation;
      o.enable && ((e.size.velocity = ((e.retina.sizeAnimationSpeed ?? i.retina.sizeAnimationSpeed) / hi) * i.retina.reduceFactor), o.sync || (e.size.velocity *= Ae()));
  }
  isEnabled(e) {
      return !e.destroyed && !e.spawning && e.size.enable && ((e.size.maxLoops ?? Ii) <= Ii || ((e.size.maxLoops ?? Ii) > Ii && (e.size.loops ?? Ii) < (e.size.maxLoops ?? Ii)));
  }
  reset(e) {
      e.size.loops = Ii;
  }
  update(e, i) {
      this.isEnabled(e) && ud(e, e.size, !0, e.options.size.animation.destroy, i);
  }
}
async function EP(t, e = !0) {
  ye(t, "3.7.1"), await t.addParticleUpdater("size", () => Promise.resolve(new TP()), e);
}
async function _P(t, e = !0) {
  ye(t, "3.7.1"), await cP(t, !1), await dP(t, !1), await PP(t, !1), await Gk(t, !1), await nP(t, !1), await rP(t, !1), await pP(t, !1), await CP(t, !1), await EP(t, !1), await t.refresh(e);
}
async function RP(t, e = !0) {
  ye(t, "3.7.1"),
      await t.addEasing(Gi.easeInQuad, (i) => i ** 2, !1),
      await t.addEasing(Gi.easeOutQuad, (i) => 1 - (1 - i) ** 2, !1),
      await t.addEasing(Gi.easeInOutQuad, (i) => (i < 0.5 ? 2 * i ** 2 : 1 - (-2 * i + 2) ** 2 / 2), !1),
      await t.refresh(e);
}
function MP(t, e) {
  const { context: i, opacity: s } = t,
      o = 0.5,
      l = i.globalAlpha;
  if (!e) return;
  const u = e.width,
      c = u * o;
  (i.globalAlpha = s), i.drawImage(e, -c, -c, u, u), (i.globalAlpha = l);
}
const Wc = '"Twemoji Mozilla", Apple Color Emoji, "Segoe UI Emoji", "Noto Color Emoji", "EmojiOne Color"',
  Ag = 0;
class AP {
  constructor() {
      (this.validTypes = ["emoji"]), (this._emojiShapeDict = new Map());
  }
  destroy() {
      for (const [e, i] of this._emojiShapeDict) i instanceof ImageBitmap && (i == null || i.close()), this._emojiShapeDict.delete(e);
  }
  draw(e) {
      const i = e.particle.emojiDataKey;
      if (!i) return;
      const s = this._emojiShapeDict.get(i);
      s && MP(e, s);
  }
  async init(e) {
      const i = e.actualOptions,
          { validTypes: s } = this;
      if (!s.find((u) => Ke(u, i.particles.shape.type))) return;
      const o = [cg(Wc)],
          l = s.map((u) => i.particles.shape.options[u]).find((u) => !!u);
      l &&
          Jt(l, (u) => {
              u.font && o.push(cg(u.font));
          }),
          await Promise.all(o);
  }
  particleDestroy(e) {
      e.emojiDataKey = void 0;
  }
  particleInit(e, i) {
      const o = i.shapeData;
      if (!(o != null && o.value)) return;
      const l = cn(o.value, i.randomIndexData);
      if (!l) return;
      const u = typeof l == "string" ? { font: o.font ?? Wc, padding: o.padding ?? Ag, value: l } : { font: Wc, padding: Ag, ...o, ...l },
          c = u.font,
          d = u.value,
          h = `${d}_${c}`;
      if (this._emojiShapeDict.has(h)) {
          i.emojiDataKey = h;
          return;
      }
      const m = u.padding * 2,
          y = Pn(i.size.value),
          v = y + m,
          w = v * 2;
      let S;
      if (typeof OffscreenCanvas < "u") {
          const b = new OffscreenCanvas(w, w),
              C = b.getContext("2d");
          if (!C) return;
          (C.font = `400 ${y * 2}px ${c}`), (C.textBaseline = "middle"), (C.textAlign = "center"), C.fillText(d, v, v), (S = b.transferToImageBitmap());
      } else {
          const b = document.createElement("canvas");
          (b.width = w), (b.height = w);
          const C = b.getContext("2d");
          if (!C) return;
          (C.font = `400 ${y * 2}px ${c}`), (C.textBaseline = "middle"), (C.textAlign = "center"), C.fillText(d, v, v), (S = b);
      }
      this._emojiShapeDict.set(h, S), (i.emojiDataKey = h);
  }
}
async function OP(t, e = !0) {
  ye(t, "3.7.1"), await t.addShape(new AP(), e);
}
const DP = 1,
  LP = 1,
  f0 = 0;
function d0(t, e, i, s, o, l) {
  const u = e.actualOptions.interactivity.modes.attract;
  if (!u) return;
  const c = e.particles.quadTree.query(o, l);
  for (const d of c) {
      const { dx: h, dy: m, distance: y } = bt(d.position, i),
          v = u.speed * u.factor,
          w = Zt(t.getEasing(u.easing)(LP - y / s) * v, DP, u.maxSpeed),
          S = rt.create(y ? (h / y) * w : v, y ? (m / y) * w : v);
      d.position.subFrom(S);
  }
}
function IP(t, e, i) {
  e.attract || (e.attract = { particles: [] });
  const { attract: s } = e;
  if ((s.finish || (s.count || (s.count = 0), s.count++, s.count === e.particles.count && (s.finish = !0)), s.clicking)) {
      const o = e.interactivity.mouse.clickPosition,
          l = e.retina.attractModeDistance;
      if (!l || l < f0 || !o) return;
      d0(t, e, o, l, new gt(o.x, o.y, l), (u) => i(u));
  } else s.clicking === !1 && (s.particles = []);
}
function jP(t, e, i) {
  const s = e.interactivity.mouse.position,
      o = e.retina.attractModeDistance;
  !o || o < f0 || !s || d0(t, e, s, o, new gt(s.x, s.y, o), (l) => i(l));
}
class zP {
  constructor() {
      (this.distance = 200), (this.duration = 0.4), (this.easing = Gi.easeOutQuad), (this.factor = 1), (this.maxSpeed = 50), (this.speed = 1);
  }
  load(e) {
      W(e) ||
          (e.distance !== void 0 && (this.distance = e.distance),
          e.duration !== void 0 && (this.duration = e.duration),
          e.easing !== void 0 && (this.easing = e.easing),
          e.factor !== void 0 && (this.factor = e.factor),
          e.maxSpeed !== void 0 && (this.maxSpeed = e.maxSpeed),
          e.speed !== void 0 && (this.speed = e.speed));
  }
}
const Qs = "attract";
let NP = class extends On {
  constructor(e, i) {
      super(i),
          (this._engine = e),
          i.attract || (i.attract = { particles: [] }),
          (this.handleClickMode = (s) => {
              const o = this.container.actualOptions,
                  l = o.interactivity.modes.attract;
              if (!(!l || s !== Qs)) {
                  i.attract || (i.attract = { particles: [] }), (i.attract.clicking = !0), (i.attract.count = 0);
                  for (const u of i.attract.particles) this.isEnabled(u) && u.velocity.setTo(u.initialVelocity);
                  (i.attract.particles = []),
                      (i.attract.finish = !1),
                      setTimeout(() => {
                          i.destroyed || (i.attract || (i.attract = { particles: [] }), (i.attract.clicking = !1));
                      }, l.duration * mt);
              }
          });
  }
  clear() {}
  init() {
      const e = this.container,
          i = e.actualOptions.interactivity.modes.attract;
      i && (e.retina.attractModeDistance = i.distance * e.retina.pixelRatio);
  }
  interact() {
      const e = this.container,
          i = e.actualOptions,
          s = e.interactivity.status === Xi,
          o = i.interactivity.events,
          { enable: l, mode: u } = o.onHover,
          { enable: c, mode: d } = o.onClick;
      s && l && Ke(Qs, u) ? jP(this._engine, this.container, (h) => this.isEnabled(h)) : c && Ke(Qs, d) && IP(this._engine, this.container, (h) => this.isEnabled(h));
  }
  isEnabled(e) {
      const i = this.container,
          s = i.actualOptions,
          o = i.interactivity.mouse,
          l = ((e == null ? void 0 : e.interactivity) ?? s.interactivity).events;
      if ((!o.position || !l.onHover.enable) && (!o.clickPosition || !l.onClick.enable)) return !1;
      const u = l.onHover.mode,
          c = l.onClick.mode;
      return Ke(Qs, u) || Ke(Qs, c);
  }
  loadModeOptions(e, ...i) {
      e.attract || (e.attract = new zP());
      for (const s of i) e.attract.load(s == null ? void 0 : s.attract);
  }
  reset() {}
};
async function FP(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalAttract", (i) => Promise.resolve(new NP(t, i)), e);
}
const VP = 2,
  al = 0.5,
  BP = Math.PI * al,
  Og = 2,
  h0 = 10,
  $P = 0;
function p0(t, e, i, s, o) {
  const l = t.particles.quadTree.query(s, o);
  for (const u of l) s instanceof gt ? Gv(kf(u), { position: e, radius: i, mass: i ** VP * BP, velocity: rt.origin, factor: rt.origin }) : s instanceof gn && uC(u, To(e, i));
}
function UP(t, e, i, s) {
  const o = document.querySelectorAll(e);
  o.length &&
      o.forEach((l) => {
          const u = l,
              c = t.retina.pixelRatio,
              d = { x: (u.offsetLeft + u.offsetWidth * al) * c, y: (u.offsetTop + u.offsetHeight * al) * c },
              h = u.offsetWidth * al * c,
              m = h0 * c,
              y = i.type === Qr.circle ? new gt(d.x, d.y, h + m) : new gn(u.offsetLeft * c - m, u.offsetTop * c - m, u.offsetWidth * c + m * Og, u.offsetHeight * c + m * Og);
          s(d, h, y);
      });
}
function HP(t, e, i, s) {
  ld(i, e, (o, l) => UP(t, o, l, (u, c, d) => p0(t, u, c, d, s)));
}
function WP(t, e) {
  const i = t.retina.pixelRatio,
      s = h0 * i,
      o = t.interactivity.mouse.position,
      l = t.retina.bounceModeDistance;
  !l || l < $P || !o || p0(t, o, l, new gt(o.x, o.y, l + s), e);
}
class qP {
  constructor() {
      this.distance = 200;
  }
  load(e) {
      W(e) || (e.distance !== void 0 && (this.distance = e.distance));
  }
}
const Xa = "bounce";
class KP extends On {
  constructor(e) {
      super(e);
  }
  clear() {}
  init() {
      const e = this.container,
          i = e.actualOptions.interactivity.modes.bounce;
      i && (e.retina.bounceModeDistance = i.distance * e.retina.pixelRatio);
  }
  interact() {
      const e = this.container,
          i = e.actualOptions,
          s = i.interactivity.events,
          o = e.interactivity.status === Xi,
          l = s.onHover.enable,
          u = s.onHover.mode,
          c = s.onDiv;
      o && l && Ke(Xa, u) ? WP(this.container, (d) => this.isEnabled(d)) : HP(this.container, c, Xa, (d) => this.isEnabled(d));
  }
  isEnabled(e) {
      const i = this.container,
          s = i.actualOptions,
          o = i.interactivity.mouse,
          l = ((e == null ? void 0 : e.interactivity) ?? s.interactivity).events,
          u = l.onDiv;
      return (!!o.position && l.onHover.enable && Ke(Xa, l.onHover.mode)) || ad(Xa, u);
  }
  loadModeOptions(e, ...i) {
      e.bounce || (e.bounce = new qP());
      for (const s of i) e.bounce.load(s == null ? void 0 : s.bounce);
  }
  reset() {}
}
async function GP(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalBounce", (i) => Promise.resolve(new KP(i)), e);
}
class m0 {
  constructor() {
      (this.distance = 200), (this.duration = 0.4), (this.mix = !1);
  }
  load(e) {
      if (!W(e)) {
          if (
              (e.distance !== void 0 && (this.distance = e.distance), e.duration !== void 0 && (this.duration = e.duration), e.mix !== void 0 && (this.mix = e.mix), e.opacity !== void 0 && (this.opacity = e.opacity), e.color !== void 0)
          ) {
              const i = An(this.color) ? void 0 : this.color;
              this.color = Jt(e.color, (s) => vt.create(i, s));
          }
          e.size !== void 0 && (this.size = e.size);
      }
  }
}
class YP extends m0 {
  constructor() {
      super(), (this.selectors = []);
  }
  load(e) {
      super.load(e), !W(e) && e.selectors !== void 0 && (this.selectors = e.selectors);
  }
}
class QP extends m0 {
  load(e) {
      super.load(e),
          !W(e) &&
              (this.divs = Jt(e.divs, (i) => {
                  const s = new YP();
                  return s.load(i), s;
              }));
  }
}
var Cn;
(function (t) {
  (t.color = "color"), (t.opacity = "opacity"), (t.size = "size");
})(Cn || (Cn = {}));
function Dg(t, e, i, s) {
  if (e >= i) {
      const o = t + (e - i) * s;
      return Zt(o, t, e);
  } else if (e < i) {
      const o = t - (i - e) * s;
      return Zt(o, e, t);
  }
}
const ji = "bubble",
  qc = 0,
  XP = 0,
  ZP = 2,
  Lg = 1,
  Ig = 1,
  JP = 0,
  eT = 0,
  Kc = 0.5,
  Gc = 1;
class tT extends On {
  constructor(e, i) {
      super(e),
          (this._clickBubble = () => {
              var m;
              const s = this.container,
                  o = s.actualOptions,
                  l = s.interactivity.mouse.clickPosition,
                  u = o.interactivity.modes.bubble;
              if (!u || !l) return;
              s.bubble || (s.bubble = {});
              const c = s.retina.bubbleModeDistance;
              if (!c || c < qc) return;
              const d = s.particles.quadTree.queryCircle(l, c, (y) => this.isEnabled(y)),
                  { bubble: h } = s;
              for (const y of d) {
                  if (!h.clicking) continue;
                  y.bubble.inRange = !h.durationEnd;
                  const v = y.getPosition(),
                      w = Nt(v, l),
                      S = (new Date().getTime() - (s.interactivity.mouse.clickTime ?? XP)) / mt;
                  S > u.duration && (h.durationEnd = !0), S > u.duration * ZP && ((h.clicking = !1), (h.durationEnd = !1));
                  const b = { bubbleObj: { optValue: s.retina.bubbleModeSize, value: y.bubble.radius }, particlesObj: { optValue: Pn(y.options.size.value) * s.retina.pixelRatio, value: y.size.value }, type: Cn.size };
                  this._process(y, w, S, b);
                  const C = { bubbleObj: { optValue: u.opacity, value: y.bubble.opacity }, particlesObj: { optValue: Pn(y.options.opacity.value), value: ((m = y.opacity) == null ? void 0 : m.value) ?? Lg }, type: Cn.opacity };
                  this._process(y, w, S, C), !h.durationEnd && w <= c ? this._hoverBubbleColor(y, w) : delete y.bubble.color;
              }
          }),
          (this._hoverBubble = () => {
              const s = this.container,
                  o = s.interactivity.mouse.position,
                  l = s.retina.bubbleModeDistance;
              if (!l || l < qc || !o) return;
              const u = s.particles.quadTree.queryCircle(o, l, (c) => this.isEnabled(c));
              for (const c of u) {
                  c.bubble.inRange = !0;
                  const d = c.getPosition(),
                      h = Nt(d, o),
                      m = Ig - h / l;
                  h <= l ? m >= eT && s.interactivity.status === Xi && (this._hoverBubbleSize(c, m), this._hoverBubbleOpacity(c, m), this._hoverBubbleColor(c, m)) : this.reset(c), s.interactivity.status === Cf && this.reset(c);
              }
          }),
          (this._hoverBubbleColor = (s, o, l) => {
              const u = this.container.actualOptions,
                  c = l ?? u.interactivity.modes.bubble;
              if (c) {
                  if (!s.bubble.finalColor) {
                      const d = c.color;
                      if (!d) return;
                      const h = cn(d);
                      s.bubble.finalColor = fo(this._engine, h);
                  }
                  if (s.bubble.finalColor)
                      if (c.mix) {
                          s.bubble.color = void 0;
                          const d = s.getFillColor();
                          s.bubble.color = d ? Jv(cd(d, s.bubble.finalColor, Ig - o, o)) : s.bubble.finalColor;
                      } else s.bubble.color = s.bubble.finalColor;
              }
          }),
          (this._hoverBubbleOpacity = (s, o, l) => {
              var v, w;
              const u = this.container,
                  c = u.actualOptions,
                  d = (l == null ? void 0 : l.opacity) ?? ((v = c.interactivity.modes.bubble) == null ? void 0 : v.opacity);
              if (!d) return;
              const h = s.options.opacity.value,
                  m = ((w = s.opacity) == null ? void 0 : w.value) ?? Lg,
                  y = Dg(m, d, Pn(h), o);
              y !== void 0 && (s.bubble.opacity = y);
          }),
          (this._hoverBubbleSize = (s, o, l) => {
              const u = this.container,
                  c = l != null && l.size ? l.size * u.retina.pixelRatio : u.retina.bubbleModeSize;
              if (c === void 0) return;
              const d = Pn(s.options.size.value) * u.retina.pixelRatio,
                  h = s.size.value,
                  m = Dg(h, c, d, o);
              m !== void 0 && (s.bubble.radius = m);
          }),
          (this._process = (s, o, l, u) => {
              const c = this.container,
                  d = u.bubbleObj.optValue,
                  h = c.actualOptions,
                  m = h.interactivity.modes.bubble;
              if (!m || d === void 0) return;
              const y = m.duration,
                  v = c.retina.bubbleModeDistance,
                  w = u.particlesObj.optValue,
                  S = u.bubbleObj.value,
                  b = u.particlesObj.value ?? JP,
                  C = u.type;
              if (!(!v || v < qc || d === w))
                  if ((c.bubble || (c.bubble = {}), c.bubble.durationEnd)) S && (C === Cn.size && delete s.bubble.radius, C === Cn.opacity && delete s.bubble.opacity);
                  else if (o <= v) {
                      if ((S ?? b) !== d) {
                          const E = b - (l * (b - d)) / y;
                          C === Cn.size && (s.bubble.radius = E), C === Cn.opacity && (s.bubble.opacity = E);
                      }
                  } else C === Cn.size && delete s.bubble.radius, C === Cn.opacity && delete s.bubble.opacity;
          }),
          (this._singleSelectorHover = (s, o, l) => {
              const u = this.container,
                  c = document.querySelectorAll(o),
                  d = u.actualOptions.interactivity.modes.bubble;
              !d ||
                  !c.length ||
                  c.forEach((h) => {
                      const m = h,
                          y = u.retina.pixelRatio,
                          v = { x: (m.offsetLeft + m.offsetWidth * Kc) * y, y: (m.offsetTop + m.offsetHeight * Kc) * y },
                          w = m.offsetWidth * Kc * y,
                          S = l.type === Qr.circle ? new gt(v.x, v.y, w) : new gn(m.offsetLeft * y, m.offsetTop * y, m.offsetWidth * y, m.offsetHeight * y),
                          b = u.particles.quadTree.query(S, (C) => this.isEnabled(C));
                      for (const C of b) {
                          if (!S.contains(C.getPosition())) continue;
                          C.bubble.inRange = !0;
                          const P = d.divs,
                              E = Kv(P, m);
                          (!C.bubble.div || C.bubble.div !== m) && (this.clear(C, s, !0), (C.bubble.div = m)), this._hoverBubbleSize(C, Gc, E), this._hoverBubbleOpacity(C, Gc, E), this._hoverBubbleColor(C, Gc, E);
                      }
                  });
          }),
          (this._engine = i),
          e.bubble || (e.bubble = {}),
          (this.handleClickMode = (s) => {
              s === ji && (e.bubble || (e.bubble = {}), (e.bubble.clicking = !0));
          });
  }
  clear(e, i, s) {
      (e.bubble.inRange && !s) || (delete e.bubble.div, delete e.bubble.opacity, delete e.bubble.radius, delete e.bubble.color);
  }
  init() {
      const e = this.container,
          i = e.actualOptions.interactivity.modes.bubble;
      i && ((e.retina.bubbleModeDistance = i.distance * e.retina.pixelRatio), i.size !== void 0 && (e.retina.bubbleModeSize = i.size * e.retina.pixelRatio));
  }
  interact(e) {
      const i = this.container.actualOptions,
          s = i.interactivity.events,
          o = s.onHover,
          l = s.onClick,
          u = o.enable,
          c = o.mode,
          d = l.enable,
          h = l.mode,
          m = s.onDiv;
      u && Ke(ji, c) ? this._hoverBubble() : d && Ke(ji, h) ? this._clickBubble() : ld(ji, m, (y, v) => this._singleSelectorHover(e, y, v));
  }
  isEnabled(e) {
      const i = this.container,
          s = i.actualOptions,
          o = i.interactivity.mouse,
          l = ((e == null ? void 0 : e.interactivity) ?? s.interactivity).events,
          { onClick: u, onDiv: c, onHover: d } = l,
          h = ad(ji, c);
      return h || (d.enable && o.position) || (u.enable && o.clickPosition) ? Ke(ji, d.mode) || Ke(ji, u.mode) || h : !1;
  }
  loadModeOptions(e, ...i) {
      e.bubble || (e.bubble = new QP());
      for (const s of i) e.bubble.load(s == null ? void 0 : s.bubble);
  }
  reset(e) {
      e.bubble.inRange = !1;
  }
}
async function nT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalBubble", (i) => Promise.resolve(new tT(i, t)), e);
}
class iT {
  constructor() {
      this.opacity = 0.5;
  }
  load(e) {
      W(e) || (e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class rT {
  constructor() {
      (this.distance = 80), (this.links = new iT()), (this.radius = 60);
  }
  load(e) {
      W(e) || (e.distance !== void 0 && (this.distance = e.distance), this.links.load(e.links), e.radius !== void 0 && (this.radius = e.radius));
  }
}
const jg = 0,
  zg = 1,
  sT = 0;
function oT(t, e, i, s) {
  const o = Math.floor(i.getRadius() / e.getRadius()),
      l = e.getFillColor(),
      u = i.getFillColor();
  if (!l || !u) return;
  const c = e.getPosition(),
      d = i.getPosition(),
      h = cd(l, u, e.getRadius(), i.getRadius()),
      m = t.createLinearGradient(c.x, c.y, d.x, d.y);
  return m.addColorStop(jg, ho(l, s)), m.addColorStop(Zt(o, jg, zg), Hn(h, s)), m.addColorStop(zg, ho(u, s)), m;
}
function aT(t, e, i, s, o) {
  so(t, s, o), (t.lineWidth = e), (t.strokeStyle = i), t.stroke();
}
function lT(t, e, i, s) {
  const o = t.actualOptions,
      l = o.interactivity.modes.connect;
  if (l) return oT(e, i, s, l.links.opacity);
}
function uT(t, e, i) {
  t.canvas.draw((s) => {
      const o = lT(t, s, e, i);
      if (!o) return;
      const l = e.getPosition(),
          u = i.getPosition();
      aT(s, e.retina.linksWidth ?? sT, o, l, u);
  });
}
const cT = "connect",
  Ng = 0;
class fT extends On {
  constructor(e) {
      super(e);
  }
  clear() {}
  init() {
      const e = this.container,
          i = e.actualOptions.interactivity.modes.connect;
      i && ((e.retina.connectModeDistance = i.distance * e.retina.pixelRatio), (e.retina.connectModeRadius = i.radius * e.retina.pixelRatio));
  }
  interact() {
      const e = this.container;
      if (e.actualOptions.interactivity.events.onHover.enable && e.interactivity.status === "pointermove") {
          const s = e.interactivity.mouse.position,
              { connectModeDistance: o, connectModeRadius: l } = e.retina;
          if (!o || o < Ng || !l || l < Ng || !s) return;
          const u = Math.abs(l),
              c = e.particles.quadTree.queryCircle(s, u, (d) => this.isEnabled(d));
          c.forEach((d, h) => {
              const m = d.getPosition(),
                  y = 1;
              for (const v of c.slice(h + y)) {
                  const w = v.getPosition(),
                      S = Math.abs(o),
                      b = Math.abs(m.x - w.x),
                      C = Math.abs(m.y - w.y);
                  b < S && C < S && uT(e, d, v);
              }
          });
      }
  }
  isEnabled(e) {
      const i = this.container,
          s = i.interactivity.mouse,
          o = ((e == null ? void 0 : e.interactivity) ?? i.actualOptions.interactivity).events;
      return o.onHover.enable && s.position ? Ke(cT, o.onHover.mode) : !1;
  }
  loadModeOptions(e, ...i) {
      e.connect || (e.connect = new rT());
      for (const s of i) e.connect.load(s == null ? void 0 : s.connect);
  }
  reset() {}
}
async function dT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalConnect", (i) => Promise.resolve(new fT(i)), e);
}
class hT {
  constructor() {
      (this.blink = !1), (this.consent = !1), (this.opacity = 1);
  }
  load(e) {
      W(e) || (e.blink !== void 0 && (this.blink = e.blink), e.color !== void 0 && (this.color = vt.create(this.color, e.color)), e.consent !== void 0 && (this.consent = e.consent), e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class pT {
  constructor() {
      (this.distance = 100), (this.links = new hT());
  }
  load(e) {
      W(e) || (e.distance !== void 0 && (this.distance = e.distance), this.links.load(e.links));
  }
}
const mT = 0;
function gT(t, e, i, s, o, l) {
  so(t, i, s), (t.strokeStyle = Hn(o, l)), (t.lineWidth = e), t.stroke();
}
function yT(t, e, i, s, o) {
  t.canvas.draw((l) => {
      const u = e.getPosition();
      gT(l, e.retina.linksWidth ?? mT, u, o, i, s);
  });
}
const vT = "grab",
  xT = 0,
  wT = 0;
class ST extends On {
  constructor(e, i) {
      super(e), (this._engine = i);
  }
  clear() {}
  init() {
      const e = this.container,
          i = e.actualOptions.interactivity.modes.grab;
      i && (e.retina.grabModeDistance = i.distance * e.retina.pixelRatio);
  }
  interact() {
      var c;
      const e = this.container,
          i = e.actualOptions,
          s = i.interactivity;
      if (!s.modes.grab || !s.events.onHover.enable || e.interactivity.status !== Xi) return;
      const o = e.interactivity.mouse.position;
      if (!o) return;
      const l = e.retina.grabModeDistance;
      if (!l || l < xT) return;
      const u = e.particles.quadTree.queryCircle(o, l, (d) => this.isEnabled(d));
      for (const d of u) {
          const h = d.getPosition(),
              m = Nt(h, o);
          if (m > l) continue;
          const y = s.modes.grab.links,
              v = y.opacity,
              w = v - (m * v) / l;
          if (w <= wT) continue;
          const S = y.color ?? ((c = d.options.links) == null ? void 0 : c.color);
          if (!e.particles.grabLineColor && S) {
              const C = s.modes.grab.links;
              e.particles.grabLineColor = t0(this._engine, S, C.blink, C.consent);
          }
          const b = Tf(d, void 0, e.particles.grabLineColor);
          b && yT(e, d, b, w, o);
      }
  }
  isEnabled(e) {
      const i = this.container,
          s = i.interactivity.mouse,
          o = ((e == null ? void 0 : e.interactivity) ?? i.actualOptions.interactivity).events;
      return o.onHover.enable && !!s.position && Ke(vT, o.onHover.mode);
  }
  loadModeOptions(e, ...i) {
      e.grab || (e.grab = new pT());
      for (const s of i) e.grab.load(s == null ? void 0 : s.grab);
  }
  reset() {}
}
async function bT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalGrab", (i) => Promise.resolve(new ST(i, t)), e);
}
const CT = "pause";
class kT extends On {
  constructor(e) {
      super(e),
          (this.handleClickMode = (i) => {
              if (i !== CT) return;
              const s = this.container;
              s.animationStatus ? s.pause() : s.play();
          });
  }
  clear() {}
  init() {}
  interact() {}
  isEnabled() {
      return !0;
  }
  reset() {}
}
async function PT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalPause", (i) => Promise.resolve(new kT(i)), e);
}
class TT {
  constructor() {
      (this.default = !0), (this.groups = []), (this.quantity = 4);
  }
  load(e) {
      if (W(e)) return;
      e.default !== void 0 && (this.default = e.default), e.groups !== void 0 && (this.groups = e.groups.map((s) => s)), this.groups.length || (this.default = !0);
      const i = e.quantity;
      i !== void 0 && (this.quantity = be(i));
  }
}
const ET = "push",
  _T = 0;
class RT extends On {
  constructor(e) {
      super(e),
          (this.handleClickMode = (i) => {
              if (i !== ET) return;
              const s = this.container,
                  o = s.actualOptions,
                  l = o.interactivity.modes.push;
              if (!l) return;
              const u = ne(l.quantity);
              if (u <= _T) return;
              const c = _l([void 0, ...l.groups]),
                  d = c !== void 0 ? s.actualOptions.particles.groups[c] : void 0;
              s.particles.push(u, s.interactivity.mouse, d, c);
          });
  }
  clear() {}
  init() {}
  interact() {}
  isEnabled() {
      return !0;
  }
  loadModeOptions(e, ...i) {
      e.push || (e.push = new TT());
      for (const s of i) e.push.load(s == null ? void 0 : s.push);
  }
  reset() {}
}
async function MT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalPush", (i) => Promise.resolve(new RT(i)), e);
}
class AT {
  constructor() {
      this.quantity = 2;
  }
  load(e) {
      if (W(e)) return;
      const i = e.quantity;
      i !== void 0 && (this.quantity = be(i));
  }
}
const OT = "remove";
class DT extends On {
  constructor(e) {
      super(e),
          (this.handleClickMode = (i) => {
              const s = this.container,
                  o = s.actualOptions;
              if (!o.interactivity.modes.remove || i !== OT) return;
              const l = ne(o.interactivity.modes.remove.quantity);
              s.particles.removeQuantity(l);
          });
  }
  clear() {}
  init() {}
  interact() {}
  isEnabled() {
      return !0;
  }
  loadModeOptions(e, ...i) {
      e.remove || (e.remove = new AT());
      for (const s of i) e.remove.load(s == null ? void 0 : s.remove);
  }
  reset() {}
}
async function LT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalRemove", (i) => Promise.resolve(new DT(i)), e);
}
class g0 {
  constructor() {
      (this.distance = 200), (this.duration = 0.4), (this.factor = 100), (this.speed = 1), (this.maxSpeed = 50), (this.easing = Gi.easeOutQuad);
  }
  load(e) {
      W(e) ||
          (e.distance !== void 0 && (this.distance = e.distance),
          e.duration !== void 0 && (this.duration = e.duration),
          e.easing !== void 0 && (this.easing = e.easing),
          e.factor !== void 0 && (this.factor = e.factor),
          e.speed !== void 0 && (this.speed = e.speed),
          e.maxSpeed !== void 0 && (this.maxSpeed = e.maxSpeed));
  }
}
class IT extends g0 {
  constructor() {
      super(), (this.selectors = []);
  }
  load(e) {
      super.load(e), !W(e) && e.selectors !== void 0 && (this.selectors = e.selectors);
  }
}
class jT extends g0 {
  load(e) {
      super.load(e),
          !W(e) &&
              (this.divs = Jt(e.divs, (i) => {
                  const s = new IT();
                  return s.load(i), s;
              }));
  }
}
const zi = "repulse",
  zT = 0,
  NT = 6,
  FT = 3,
  VT = 2,
  BT = 0,
  $T = 0,
  UT = 1,
  Yc = 0.5;
class HT extends On {
  constructor(e, i) {
      super(i),
          (this._clickRepulse = () => {
              const s = this.container,
                  o = s.actualOptions.interactivity.modes.repulse;
              if (!o) return;
              const l = s.repulse ?? { particles: [] };
              if ((l.finish || (l.count || (l.count = 0), l.count++, l.count === s.particles.count && (l.finish = !0)), l.clicking)) {
                  const u = s.retina.repulseModeDistance;
                  if (!u || u < zT) return;
                  const c = Math.pow(u / NT, FT),
                      d = s.interactivity.mouse.clickPosition;
                  if (d === void 0) return;
                  const h = new gt(d.x, d.y, c),
                      m = s.particles.quadTree.query(h, (y) => this.isEnabled(y));
                  for (const y of m) {
                      const { dx: v, dy: w, distance: S } = bt(d, y.position),
                          b = S ** VT,
                          C = o.speed,
                          P = (-c * C) / b;
                      if (b <= c) {
                          l.particles.push(y);
                          const E = rt.create(v, w);
                          (E.length = P), y.velocity.setTo(E);
                      }
                  }
              } else if (l.clicking === !1) {
                  for (const u of l.particles) u.velocity.setTo(u.initialVelocity);
                  l.particles = [];
              }
          }),
          (this._hoverRepulse = () => {
              const s = this.container,
                  o = s.interactivity.mouse.position,
                  l = s.retina.repulseModeDistance;
              !l || l < BT || !o || this._processRepulse(o, l, new gt(o.x, o.y, l));
          }),
          (this._processRepulse = (s, o, l, u) => {
              const c = this.container,
                  d = c.particles.quadTree.query(l, (C) => this.isEnabled(C)),
                  h = c.actualOptions.interactivity.modes.repulse;
              if (!h) return;
              const { easing: m, speed: y, factor: v, maxSpeed: w } = h,
                  S = this._engine.getEasing(m),
                  b = ((u == null ? void 0 : u.speed) ?? y) * v;
              for (const C of d) {
                  const { dx: P, dy: E, distance: D } = bt(C.position, s),
                      I = Zt(S(UT - D / o) * b, $T, w),
                      z = rt.create(D ? (P / D) * I : b, D ? (E / D) * I : b);
                  C.position.addTo(z);
              }
          }),
          (this._singleSelectorRepulse = (s, o) => {
              const l = this.container,
                  u = l.actualOptions.interactivity.modes.repulse;
              if (!u) return;
              const c = document.querySelectorAll(s);
              c.length &&
                  c.forEach((d) => {
                      const h = d,
                          m = l.retina.pixelRatio,
                          y = { x: (h.offsetLeft + h.offsetWidth * Yc) * m, y: (h.offsetTop + h.offsetHeight * Yc) * m },
                          v = h.offsetWidth * Yc * m,
                          w = o.type === Qr.circle ? new gt(y.x, y.y, v) : new gn(h.offsetLeft * m, h.offsetTop * m, h.offsetWidth * m, h.offsetHeight * m),
                          S = u.divs,
                          b = Kv(S, h);
                      this._processRepulse(y, v, w, b);
                  });
          }),
          (this._engine = e),
          i.repulse || (i.repulse = { particles: [] }),
          (this.handleClickMode = (s) => {
              const o = this.container.actualOptions,
                  l = o.interactivity.modes.repulse;
              if (!l || s !== zi) return;
              i.repulse || (i.repulse = { particles: [] });
              const u = i.repulse;
              (u.clicking = !0), (u.count = 0);
              for (const c of i.repulse.particles) this.isEnabled(c) && c.velocity.setTo(c.initialVelocity);
              (u.particles = []),
                  (u.finish = !1),
                  setTimeout(() => {
                      i.destroyed || (u.clicking = !1);
                  }, l.duration * mt);
          });
  }
  clear() {}
  init() {
      const e = this.container,
          i = e.actualOptions.interactivity.modes.repulse;
      i && (e.retina.repulseModeDistance = i.distance * e.retina.pixelRatio);
  }
  interact() {
      const e = this.container,
          i = e.actualOptions,
          s = e.interactivity.status === Xi,
          o = i.interactivity.events,
          l = o.onHover,
          u = l.enable,
          c = l.mode,
          d = o.onClick,
          h = d.enable,
          m = d.mode,
          y = o.onDiv;
      s && u && Ke(zi, c) ? this._hoverRepulse() : h && Ke(zi, m) ? this._clickRepulse() : ld(zi, y, (v, w) => this._singleSelectorRepulse(v, w));
  }
  isEnabled(e) {
      const i = this.container,
          s = i.actualOptions,
          o = i.interactivity.mouse,
          l = ((e == null ? void 0 : e.interactivity) ?? s.interactivity).events,
          u = l.onDiv,
          c = l.onHover,
          d = l.onClick,
          h = ad(zi, u);
      if (!(h || (c.enable && o.position) || (d.enable && o.clickPosition))) return !1;
      const m = c.mode,
          y = d.mode;
      return Ke(zi, m) || Ke(zi, y) || h;
  }
  loadModeOptions(e, ...i) {
      e.repulse || (e.repulse = new jT());
      for (const s of i) e.repulse.load(s == null ? void 0 : s.repulse);
  }
  reset() {}
}
async function WT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalRepulse", (i) => Promise.resolve(new HT(t, i)), e);
}
class qT {
  constructor() {
      (this.factor = 3), (this.radius = 200);
  }
  load(e) {
      W(e) || (e.factor !== void 0 && (this.factor = e.factor), e.radius !== void 0 && (this.radius = e.radius));
  }
}
const KT = "slow",
  GT = 0;
class YT extends On {
  constructor(e) {
      super(e);
  }
  clear(e, i, s) {
      (e.slow.inRange && !s) || (e.slow.factor = 1);
  }
  init() {
      const e = this.container,
          i = e.actualOptions.interactivity.modes.slow;
      i && (e.retina.slowModeRadius = i.radius * e.retina.pixelRatio);
  }
  interact() {}
  isEnabled(e) {
      const i = this.container,
          s = i.interactivity.mouse,
          o = ((e == null ? void 0 : e.interactivity) ?? i.actualOptions.interactivity).events;
      return o.onHover.enable && !!s.position && Ke(KT, o.onHover.mode);
  }
  loadModeOptions(e, ...i) {
      e.slow || (e.slow = new qT());
      for (const s of i) e.slow.load(s == null ? void 0 : s.slow);
  }
  reset(e) {
      e.slow.inRange = !1;
      const i = this.container,
          s = i.actualOptions,
          o = i.interactivity.mouse.position,
          l = i.retina.slowModeRadius,
          u = s.interactivity.modes.slow;
      if (!u || !l || l < GT || !o) return;
      const c = e.getPosition(),
          d = Nt(o, c),
          h = d / l,
          m = u.factor,
          { slow: y } = e;
      d > l || ((y.inRange = !0), (y.factor = h / m));
  }
}
async function QT(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("externalSlow", (i) => Promise.resolve(new YT(i)), e);
}
const XT = 0,
  ZT = 1,
  JT = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))|currentcolor/gi;
function e2(t, e, i) {
  const { svgData: s } = t;
  if (!s) return "";
  const o = ho(e, i);
  if (s.includes("fill")) return s.replace(JT, () => o);
  const l = s.indexOf(">");
  return `${s.substring(XT, l)} fill="${o}"${s.substring(l)}`;
}
async function Rl(t) {
  return new Promise((e) => {
      t.loading = !0;
      const i = new Image();
      (t.element = i),
          i.addEventListener("load", () => {
              (t.loading = !1), e();
          }),
          i.addEventListener("error", () => {
              (t.element = void 0), (t.error = !0), (t.loading = !1), Ji().error(`${Xt} loading image: ${t.source}`), e();
          }),
          (i.src = t.source);
  });
}
async function t2(t) {
  if (t.type !== "svg") {
      await Rl(t);
      return;
  }
  t.loading = !0;
  const e = await fetch(t.source);
  e.ok ? (t.svgData = await e.text()) : (Ji().error(`${Xt} Image not found`), (t.error = !0)), (t.loading = !1);
}
function n2(t, e, i, s) {
  var u;
  const o = e2(t, i, ((u = s.opacity) == null ? void 0 : u.value) ?? ZT),
      l = { color: i, gif: e.gif, data: { ...t, svgData: o }, loaded: !1, ratio: e.width / e.height, replaceColor: e.replaceColor, source: e.src };
  return new Promise((c) => {
      const d = new Blob([o], { type: "image/svg+xml" }),
          h = URL || window.URL || window.webkitURL || window,
          m = h.createObjectURL(d),
          y = new Image();
      y.addEventListener("load", () => {
          (l.loaded = !0), (l.element = y), c(l), h.revokeObjectURL(m);
      });
      const v = async () => {
          h.revokeObjectURL(m);
          const w = { ...t, error: !1, loading: !0 };
          await Rl(w), (l.loaded = !0), (l.element = w.element), c(l);
      };
      y.addEventListener("error", () => void v()), (y.src = m);
  });
}
const Qc = [0, 4, 2, 1],
  Fg = [8, 8, 4, 2];
class i2 {
  constructor(e) {
      (this.pos = 0), (this.data = new Uint8ClampedArray(e));
  }
  getString(e) {
      const i = this.data.slice(this.pos, this.pos + e);
      return (this.pos += i.length), i.reduce((s, o) => s + String.fromCharCode(o), "");
  }
  nextByte() {
      return this.data[this.pos++];
  }
  nextTwoBytes() {
      return (this.pos += 2), this.data[this.pos - 2] + (this.data[this.pos - 1] << 8);
  }
  readSubBlocks() {
      let e = "",
          i = 0;
      const s = 0,
          o = 0;
      do {
          i = this.data[this.pos++];
          for (let l = i; --l >= s; e += String.fromCharCode(this.data[this.pos++]));
      } while (i !== o);
      return e;
  }
  readSubBlocksBin() {
      let e = this.data[this.pos],
          i = 0;
      const s = 0,
          o = 1;
      for (let u = 0; e !== s; u += e + o, e = this.data[this.pos + u]) i += e;
      const l = new Uint8Array(i);
      e = this.data[this.pos++];
      for (let u = 0; e !== s; e = this.data[this.pos++]) for (let c = e; --c >= s; l[u++] = this.data[this.pos++]);
      return l;
  }
  skipSubBlocks() {
      for (const e = 1, i = 0; this.data[this.pos] !== i; this.pos += this.data[this.pos] + e);
      this.pos++;
  }
}
var un;
(function (t) {
  (t[(t.Replace = 0)] = "Replace"),
      (t[(t.Combine = 1)] = "Combine"),
      (t[(t.RestoreBackground = 2)] = "RestoreBackground"),
      (t[(t.RestorePrevious = 3)] = "RestorePrevious"),
      (t[(t.UndefinedA = 4)] = "UndefinedA"),
      (t[(t.UndefinedB = 5)] = "UndefinedB"),
      (t[(t.UndefinedC = 6)] = "UndefinedC"),
      (t[(t.UndefinedD = 7)] = "UndefinedD");
})(un || (un = {}));
var $n;
(function (t) {
  (t[(t.Extension = 33)] = "Extension"),
      (t[(t.ApplicationExtension = 255)] = "ApplicationExtension"),
      (t[(t.GraphicsControlExtension = 249)] = "GraphicsControlExtension"),
      (t[(t.PlainTextExtension = 1)] = "PlainTextExtension"),
      (t[(t.CommentExtension = 254)] = "CommentExtension"),
      (t[(t.Image = 44)] = "Image"),
      (t[(t.EndOfFile = 59)] = "EndOfFile");
})($n || ($n = {}));
const Rt = { x: 0, y: 0 },
  r2 = 0,
  Vg = 0.5,
  s2 = 0,
  Bg = 0,
  Rf = 0;
function y0(t, e) {
  const i = [];
  for (let s = 0; s < e; s++) i.push({ r: t.data[t.pos], g: t.data[t.pos + 1], b: t.data[t.pos + 2] }), (t.pos += 3);
  return i;
}
function o2(t, e, i, s) {
  switch (t.nextByte()) {
      case $n.GraphicsControlExtension: {
          const o = e.frames[i(!1)];
          t.pos++;
          const l = t.nextByte();
          (o.GCreserved = (l & 224) >>> 5), (o.disposalMethod = (l & 28) >>> 2), (o.userInputDelayFlag = (l & 2) === 2);
          const u = (l & 1) === 1;
          o.delayTime = t.nextTwoBytes() * 10;
          const c = t.nextByte();
          u && s(c), t.pos++;
          break;
      }
      case $n.ApplicationExtension: {
          t.pos++;
          const o = { identifier: t.getString(8), authenticationCode: t.getString(3), data: t.readSubBlocksBin() };
          e.applicationExtensions.push(o);
          break;
      }
      case $n.CommentExtension: {
          e.comments.push([i(!1), t.readSubBlocks()]);
          break;
      }
      case $n.PlainTextExtension: {
          if (e.globalColorTable.length === 0) throw new EvalError("plain text extension without global color table");
          t.pos++,
              (e.frames[i(!1)].plainTextData = {
                  left: t.nextTwoBytes(),
                  top: t.nextTwoBytes(),
                  width: t.nextTwoBytes(),
                  height: t.nextTwoBytes(),
                  charSize: { width: t.nextTwoBytes(), height: t.nextTwoBytes() },
                  foregroundColor: t.nextByte(),
                  backgroundColor: t.nextByte(),
                  text: t.readSubBlocks(),
              });
          break;
      }
      default:
          t.skipSubBlocks();
          break;
  }
}
async function a2(t, e, i, s, o, l) {
  const u = e.frames[s(!0)];
  (u.left = t.nextTwoBytes()), (u.top = t.nextTwoBytes()), (u.width = t.nextTwoBytes()), (u.height = t.nextTwoBytes());
  const c = t.nextByte(),
      d = (c & 128) === 128,
      h = (c & 64) === 64;
  (u.sortFlag = (c & 32) === 32), (u.reserved = (c & 24) >>> 3);
  const m = 1 << ((c & 7) + 1);
  d && (u.localColorTable = y0(t, m));
  const y = (P) => {
          const { r: E, g: D, b: I } = (d ? u.localColorTable : e.globalColorTable)[P];
          return P !== o(null) ? { r: E, g: D, b: I, a: 255 } : { r: E, g: D, b: I, a: i ? ~~((E + D + I) / 3) : 0 };
      },
      v = (() => {
          try {
              return new ImageData(u.width, u.height, { colorSpace: "srgb" });
          } catch (P) {
              if (P instanceof DOMException && P.name === "IndexSizeError") return null;
              throw P;
          }
      })();
  if (v == null) throw new EvalError("GIF frame size is to large");
  const w = t.nextByte(),
      S = t.readSubBlocksBin(),
      b = 1 << w,
      C = (P, E) => {
          const D = P >>> 3,
              I = P & 7;
          return ((S[D] + (S[D + 1] << 8) + (S[D + 2] << 16)) & (((1 << E) - 1) << I)) >>> I;
      };
  if (h) {
      for (let P = 0, E = w + 1, D = 0, I = [[0]], z = 0; z < 4; z++)
          if (Qc[z] < u.height) {
              let N = 0,
                  Q = 0,
                  q = !1;
              for (; !q; ) {
                  const K = P;
                  if (((P = C(D, E)), (D += E + 1), P === b)) {
                      (E = w + 1), (I.length = b + 2);
                      for (let ie = 0; ie < I.length; ie++) I[ie] = ie < b ? [ie] : [];
                  } else {
                      P >= I.length ? I.push(I[K].concat(I[K][0])) : K !== b && I.push(I[K].concat(I[P][0]));
                      for (const ie of I[P]) {
                          const { r: ue, g: _e, b: Te, a: he } = y(ie);
                          v.data.set([ue, _e, Te, he], Qc[z] * u.width + Fg[z] * Q + (N % (u.width * 4))), (N += 4);
                      }
                      I.length === 1 << E && E < 12 && E++;
                  }
                  N === u.width * 4 * (Q + 1) && (Q++, Qc[z] + Fg[z] * Q >= u.height && (q = !0));
              }
          }
      (u.image = v), (u.bitmap = await createImageBitmap(v));
  } else {
      let P = 0,
          E = w + 1,
          D = 0,
          I = -4,
          z = !1;
      const N = [[0]];
      for (; !z; ) {
          const Q = P;
          if (((P = C(D, E)), (D += E), P === b)) {
              (E = w + 1), (N.length = b + 2);
              for (let q = 0; q < N.length; q++) N[q] = q < b ? [q] : [];
          } else {
              if (P === b + 1) {
                  z = !0;
                  break;
              }
              P >= N.length ? N.push(N[Q].concat(N[Q][0])) : Q !== b && N.push(N[Q].concat(N[P][0]));
              for (const q of N[P]) {
                  const { r: K, g: ie, b: ue, a: _e } = y(q);
                  v.data.set([K, ie, ue, _e], (I += 4));
              }
              N.length >= 1 << E && E < 12 && E++;
          }
      }
      (u.image = v), (u.bitmap = await createImageBitmap(v));
  }
}
async function l2(t, e, i, s, o, l) {
  switch (t.nextByte()) {
      case $n.EndOfFile:
          return !0;
      case $n.Image:
          await a2(t, e, i, s, o);
          break;
      case $n.Extension:
          o2(t, e, s, o);
          break;
      default:
          throw new EvalError("undefined block found");
  }
  return !1;
}
function u2(t) {
  for (const e of t.applicationExtensions) if (e.identifier + e.authenticationCode === "NETSCAPE2.0") return e.data[1] + (e.data[2] << 8);
  return NaN;
}
async function c2(t, e, i) {
  i || (i = !1);
  const s = await fetch(t);
  if (!s.ok && s.status === 404) throw new EvalError("file not found");
  const o = await s.arrayBuffer(),
      l = { width: 0, height: 0, totalTime: 0, colorRes: 0, pixelAspectRatio: 0, frames: [], sortFlag: !1, globalColorTable: [], backgroundImage: new ImageData(1, 1, { colorSpace: "srgb" }), comments: [], applicationExtensions: [] },
      u = new i2(new Uint8ClampedArray(o));
  if (u.getString(6) !== "GIF89a") throw new Error("not a supported GIF file");
  (l.width = u.nextTwoBytes()), (l.height = u.nextTwoBytes());
  const c = u.nextByte(),
      d = (c & 128) === 128;
  (l.colorRes = (c & 112) >>> 4), (l.sortFlag = (c & 8) === 8);
  const h = 1 << ((c & 7) + 1),
      m = u.nextByte();
  (l.pixelAspectRatio = u.nextByte()), l.pixelAspectRatio !== 0 && (l.pixelAspectRatio = (l.pixelAspectRatio + 15) / 64), d && (l.globalColorTable = y0(u, h));
  const y = (() => {
      try {
          return new ImageData(l.width, l.height, { colorSpace: "srgb" });
      } catch (I) {
          if (I instanceof DOMException && I.name === "IndexSizeError") return null;
          throw I;
      }
  })();
  if (y == null) throw new Error("GIF frame size is to large");
  const { r: v, g: w, b: S } = l.globalColorTable[m];
  y.data.set(d ? [v, w, S, 255] : [0, 0, 0, 0]);
  for (let I = 4; I < y.data.length; I *= 2) y.data.copyWithin(I, 0, I);
  l.backgroundImage = y;
  let b = -1,
      C = !0,
      P = -1;
  const E = (I) => (I && (C = !0), b),
      D = (I) => (I != null && (P = I), P);
  try {
      do
          C &&
              (l.frames.push({
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                  disposalMethod: un.Replace,
                  image: new ImageData(1, 1, { colorSpace: "srgb" }),
                  plainTextData: null,
                  userInputDelayFlag: !1,
                  delayTime: 0,
                  sortFlag: !1,
                  localColorTable: [],
                  reserved: 0,
                  GCreserved: 0,
              }),
              b++,
              (P = -1),
              (C = !1));
      while (!(await l2(u, l, i, E, D, e)));
      l.frames.length--;
      for (const I of l.frames) {
          if (I.userInputDelayFlag && I.delayTime === 0) {
              l.totalTime = 1 / 0;
              break;
          }
          l.totalTime += I.delayTime;
      }
      return l;
  } catch (I) {
      throw I instanceof EvalError ? new Error(`error while parsing frame ${b} "${I.message}"`) : I;
  }
}
function f2(t) {
  const { context: e, radius: i, particle: s, delta: o } = t,
      l = s.image;
  if (!(l != null && l.gifData) || !l.gif) return;
  const u = new OffscreenCanvas(l.gifData.width, l.gifData.height),
      c = u.getContext("2d");
  if (!c) throw new Error("could not create offscreen canvas context");
  (c.imageSmoothingQuality = "low"), (c.imageSmoothingEnabled = !1), c.clearRect(Rt.x, Rt.y, u.width, u.height), s.gifLoopCount === void 0 && (s.gifLoopCount = l.gifLoopCount ?? Rf);
  let d = s.gifFrame ?? r2;
  const h = { x: -l.gifData.width * Vg, y: -l.gifData.height * Vg },
      m = l.gifData.frames[d];
  if ((s.gifTime === void 0 && (s.gifTime = s2), !!m.bitmap)) {
      switch ((e.scale(i / l.gifData.width, i / l.gifData.height), m.disposalMethod)) {
          case un.UndefinedA:
          case un.UndefinedB:
          case un.UndefinedC:
          case un.UndefinedD:
          case un.Replace:
              c.drawImage(m.bitmap, m.left, m.top), e.drawImage(u, h.x, h.y), c.clearRect(Rt.x, Rt.y, u.width, u.height);
              break;
          case un.Combine:
              c.drawImage(m.bitmap, m.left, m.top), e.drawImage(u, h.x, h.y);
              break;
          case un.RestoreBackground:
              c.drawImage(m.bitmap, m.left, m.top),
                  e.drawImage(u, h.x, h.y),
                  c.clearRect(Rt.x, Rt.y, u.width, u.height),
                  l.gifData.globalColorTable.length ? c.putImageData(l.gifData.backgroundImage, h.x, h.y) : c.putImageData(l.gifData.frames[Bg].image, h.x + m.left, h.y + m.top);
              break;
          case un.RestorePrevious:
              {
                  const y = c.getImageData(Rt.x, Rt.y, u.width, u.height);
                  c.drawImage(m.bitmap, m.left, m.top), e.drawImage(u, h.x, h.y), c.clearRect(Rt.x, Rt.y, u.width, u.height), c.putImageData(y, Rt.x, Rt.y);
              }
              break;
      }
      if (((s.gifTime += o.value), s.gifTime > m.delayTime)) {
          if (((s.gifTime -= m.delayTime), ++d >= l.gifData.frames.length)) {
              if (--s.gifLoopCount <= Rf) return;
              (d = Bg), c.clearRect(Rt.x, Rt.y, u.width, u.height);
          }
          s.gifFrame = d;
      }
      e.scale(l.gifData.width / i, l.gifData.height / i);
  }
}
async function d2(t) {
  if (t.type !== "gif") {
      await Rl(t);
      return;
  }
  t.loading = !0;
  try {
      (t.gifData = await c2(t.source)), (t.gifLoopCount = u2(t.gifData) ?? Rf), t.gifLoopCount || (t.gifLoopCount = 1 / 0);
  } catch {
      t.error = !0;
  }
  t.loading = !1;
}
const h2 = 2,
  p2 = 1,
  m2 = 12,
  g2 = 1;
class y2 {
  constructor(e) {
      (this.validTypes = ["image", "images"]),
          (this.loadImageShape = async (i) => {
              if (!this._engine.loadImage) throw new Error(`${Xt} image shape not initialized`);
              await this._engine.loadImage({ gif: i.gif, name: i.name, replaceColor: i.replaceColor ?? !1, src: i.src });
          }),
          (this._engine = e);
  }
  addImage(e) {
      this._engine.images || (this._engine.images = []), this._engine.images.push(e);
  }
  draw(e) {
      const { context: i, radius: s, particle: o, opacity: l } = e,
          u = o.image,
          c = u == null ? void 0 : u.element;
      if (u) {
          if (((i.globalAlpha = l), u.gif && u.gifData)) f2(e);
          else if (c) {
              const d = u.ratio,
                  h = { x: -s, y: -s },
                  m = s * h2;
              i.drawImage(c, h.x, h.y, m, m / d);
          }
          i.globalAlpha = p2;
      }
  }
  getSidesCount() {
      return m2;
  }
  async init(e) {
      const i = e.actualOptions;
      if (!(!i.preload || !this._engine.loadImage)) for (const s of i.preload) await this._engine.loadImage(s);
  }
  loadShape(e) {
      if (e.shape !== "image" && e.shape !== "images") return;
      this._engine.images || (this._engine.images = []);
      const i = e.shapeData;
      if (!i) return;
      this._engine.images.find((o) => o.name === i.name || o.source === i.src) ||
          this.loadImageShape(i).then(() => {
              this.loadShape(e);
          });
  }
  particleInit(e, i) {
      if (i.shape !== "image" && i.shape !== "images") return;
      this._engine.images || (this._engine.images = []);
      const s = this._engine.images,
          o = i.shapeData;
      if (!o) return;
      const l = i.getFillColor(),
          u = s.find((d) => d.name === o.name || d.source === o.src);
      if (!u) return;
      const c = o.replaceColor ?? u.replaceColor;
      if (u.loading) {
          setTimeout(() => {
              this.particleInit(e, i);
          });
          return;
      }
      (async () => {
          let d;
          u.svgData && l
              ? (d = await n2(u, o, l, i))
              : (d = { color: l, data: u, element: u.element, gif: u.gif, gifData: u.gifData, gifLoopCount: u.gifLoopCount, loaded: !0, ratio: o.width && o.height ? o.width / o.height : u.ratio ?? g2, replaceColor: c, source: o.src }),
              d.ratio || (d.ratio = 1);
          const h = o.fill ?? i.shapeFill,
              m = o.close ?? i.shapeClose,
              y = { image: d, fill: h, close: m };
          (i.image = y.image), (i.shapeFill = y.fill), (i.shapeClose = y.close);
      })();
  }
}
class v2 {
  constructor() {
      (this.src = ""), (this.gif = !1);
  }
  load(e) {
      W(e) ||
          (e.gif !== void 0 && (this.gif = e.gif),
          e.height !== void 0 && (this.height = e.height),
          e.name !== void 0 && (this.name = e.name),
          e.replaceColor !== void 0 && (this.replaceColor = e.replaceColor),
          e.src !== void 0 && (this.src = e.src),
          e.width !== void 0 && (this.width = e.width));
  }
}
class x2 {
  constructor(e) {
      (this.id = "imagePreloader"), (this._engine = e);
  }
  async getPlugin() {
      return await Promise.resolve(), {};
  }
  loadOptions(e, i) {
      if (!(i != null && i.preload)) return;
      e.preload || (e.preload = []);
      const s = e.preload;
      for (const o of i.preload) {
          const l = s.find((u) => u.name === o.name || u.src === o.src);
          if (l) l.load(o);
          else {
              const u = new v2();
              u.load(o), s.push(u);
          }
      }
  }
  needsPlugin() {
      return !0;
  }
}
const w2 = 3;
function S2(t) {
  t.loadImage ||
      (t.loadImage = async (e) => {
          if (!e.name && !e.src) throw new Error(`${Xt} no image source provided`);
          if ((t.images || (t.images = []), !t.images.find((i) => i.name === e.name || i.source === e.src)))
              try {
                  const i = {
                      gif: e.gif ?? !1,
                      name: e.name ?? e.src,
                      source: e.src,
                      type: e.src.substring(e.src.length - w2),
                      error: !1,
                      loading: !0,
                      replaceColor: e.replaceColor,
                      ratio: e.width && e.height ? e.width / e.height : void 0,
                  };
                  t.images.push(i);
                  let s;
                  e.gif ? (s = d2) : (s = e.replaceColor ? t2 : Rl), await s(i);
              } catch {
                  throw new Error(`${Xt} ${e.name ?? e.src} not found`);
              }
      });
}
async function b2(t, e = !0) {
  ye(t, "3.7.1"), S2(t);
  const i = new x2(t);
  await t.addPlugin(i, e), await t.addShape(new y2(t), e);
}
class C2 extends nr {
  constructor() {
      super(), (this.sync = !1);
  }
  load(e) {
      W(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class k2 extends nr {
  constructor() {
      super(), (this.sync = !1);
  }
  load(e) {
      W(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class P2 {
  constructor() {
      (this.count = 0), (this.delay = new C2()), (this.duration = new k2());
  }
  load(e) {
      W(e) || (e.count !== void 0 && (this.count = e.count), this.delay.load(e.delay), this.duration.load(e.duration));
  }
}
const Mr = 0,
  T2 = -1,
  $g = 0,
  Ug = 0;
function E2(t, e, i) {
  if (!t.life) return;
  const s = t.life;
  let o = !1;
  if (t.spawning)
      if (((s.delayTime += e.value), s.delayTime >= t.life.delay)) (o = !0), (t.spawning = !1), (s.delayTime = Mr), (s.time = Mr);
      else return;
  if (s.duration === T2 || t.spawning || (o ? (s.time = Mr) : (s.time += e.value), s.time < s.duration)) return;
  if (((s.time = Mr), t.life.count > $g && t.life.count--, t.life.count === $g)) {
      t.destroy();
      return;
  }
  const l = be(Ug, i.width),
      u = be(Ug, i.width);
  (t.position.x = zt(l)), (t.position.y = zt(u)), (t.spawning = !0), (s.delayTime = Mr), (s.time = Mr), t.reset();
  const c = t.options.life;
  c && ((s.delay = ne(c.delay.value) * mt), (s.duration = ne(c.duration.value) * mt));
}
const Ni = 0,
  Hg = 1,
  Wg = -1;
class _2 {
  constructor(e) {
      this.container = e;
  }
  init(e) {
      const i = this.container,
          s = e.options,
          o = s.life;
      o &&
          ((e.life = {
              delay: i.retina.reduceFactor ? ((ne(o.delay.value) * (o.delay.sync ? Hg : Ae())) / i.retina.reduceFactor) * mt : Ni,
              delayTime: Ni,
              duration: i.retina.reduceFactor ? ((ne(o.duration.value) * (o.duration.sync ? Hg : Ae())) / i.retina.reduceFactor) * mt : Ni,
              time: Ni,
              count: o.count,
          }),
          e.life.duration <= Ni && (e.life.duration = Wg),
          e.life.count <= Ni && (e.life.count = Wg),
          e.life && (e.spawning = e.life.delay > Ni));
  }
  isEnabled(e) {
      return !e.destroyed;
  }
  loadOptions(e, ...i) {
      e.life || (e.life = new P2());
      for (const s of i) e.life.load(s == null ? void 0 : s.life);
  }
  update(e, i) {
      !this.isEnabled(e) || !e.life || E2(e, i, this.container.canvas.size);
  }
}
async function R2(t, e = !0) {
  ye(t, "3.7.1"), await t.addParticleUpdater("life", async (i) => Promise.resolve(new _2(i)), e);
}
function M2(t) {
  const { context: e, particle: i, radius: s } = t,
      o = i.shapeData,
      l = 0;
  e.moveTo(-s, l), e.lineTo(s, l), (e.lineCap = (o == null ? void 0 : o.cap) ?? "butt");
}
const A2 = 1;
class O2 {
  constructor() {
      this.validTypes = ["line"];
  }
  draw(e) {
      M2(e);
  }
  getSidesCount() {
      return A2;
  }
}
async function D2(t, e = !0) {
  ye(t, "3.7.1"), await t.addShape(new O2(), e);
}
const qg = 0.5;
class L2 {
  init() {}
  isEnabled(e) {
      return !er() && !e.destroyed && e.container.actualOptions.interactivity.events.onHover.parallax.enable;
  }
  move(e) {
      const i = e.container,
          s = i.actualOptions,
          o = s.interactivity.events.onHover.parallax;
      if (er() || !o.enable) return;
      const l = o.force,
          u = i.interactivity.mouse.position;
      if (!u) return;
      const c = i.canvas.size,
          d = { x: c.width * qg, y: c.height * qg },
          h = o.smooth,
          m = e.getRadius() / l,
          y = { x: (u.x - d.x) * m, y: (u.y - d.y) * m },
          { offset: v } = e;
      (v.x += (y.x - v.x) / h), (v.y += (y.y - v.y) / h);
  }
}
async function I2(t, e = !0) {
  ye(t, "3.7.1"), await t.addMover("parallax", () => Promise.resolve(new L2()), e);
}
const Kg = 1e3,
  j2 = 1;
class z2 extends hd {
  constructor(e) {
      super(e);
  }
  clear() {}
  init() {}
  interact(e) {
      const i = this.container;
      e.attractDistance === void 0 && (e.attractDistance = ne(e.options.move.attract.distance) * i.retina.pixelRatio);
      const s = e.attractDistance,
          o = e.getPosition(),
          l = i.particles.quadTree.queryCircle(o, s);
      for (const u of l) {
          if (e === u || !u.options.move.attract.enable || u.destroyed || u.spawning) continue;
          const c = u.getPosition(),
              { dx: d, dy: h } = bt(o, c),
              m = e.options.move.attract.rotate,
              y = d / (m.x * Kg),
              v = h / (m.y * Kg),
              w = u.size.value / e.size.value,
              S = j2 / w;
          (e.velocity.x -= y * w), (e.velocity.y -= v * w), (u.velocity.x += y * S), (u.velocity.y += v * S);
      }
  }
  isEnabled(e) {
      return e.options.move.attract.enable;
  }
  reset() {}
}
async function N2(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("particlesAttract", (i) => Promise.resolve(new z2(i)), e);
}
const F2 = 0.5,
  V2 = 10,
  B2 = 0;
function Gg(t, e, i, s, o, l) {
  const u = Zt((t.options.collisions.absorb.speed * o.factor) / V2, B2, s);
  (t.size.value += u * F2), (i.size.value -= u), s <= l && ((i.size.value = 0), i.destroy());
}
function $2(t, e, i, s) {
  const o = t.getRadius(),
      l = e.getRadius();
  o === void 0 && l !== void 0 ? t.destroy() : o !== void 0 && l === void 0 ? e.destroy() : o !== void 0 && l !== void 0 && (o >= l ? Gg(t, o, e, l, i, s) : Gg(e, l, t, o, i, s));
}
const Yg = (t) => {
  t.collisionMaxSpeed === void 0 && (t.collisionMaxSpeed = ne(t.options.collisions.maxSpeed)), t.velocity.length > t.collisionMaxSpeed && (t.velocity.length = t.collisionMaxSpeed);
};
function v0(t, e) {
  Gv(kf(t), kf(e)), Yg(t), Yg(e);
}
function U2(t, e) {
  !t.unbreakable && !e.unbreakable && v0(t, e),
      t.getRadius() === void 0 && e.getRadius() !== void 0
          ? t.destroy()
          : t.getRadius() !== void 0 && e.getRadius() === void 0
          ? e.destroy()
          : t.getRadius() !== void 0 && e.getRadius() !== void 0 && (t.getRadius() >= e.getRadius() ? e : t).destroy();
}
function H2(t, e, i, s) {
  switch (t.options.collisions.mode) {
      case Ur.absorb: {
          $2(t, e, i, s);
          break;
      }
      case Ur.bounce: {
          v0(t, e);
          break;
      }
      case Ur.destroy: {
          U2(t, e);
          break;
      }
  }
}
const W2 = 2;
class q2 extends hd {
  constructor(e) {
      super(e);
  }
  clear() {}
  init() {}
  interact(e, i) {
      if (e.destroyed || e.spawning) return;
      const s = this.container,
          o = e.getPosition(),
          l = e.getRadius(),
          u = s.particles.quadTree.queryCircle(o, l * W2);
      for (const c of u) {
          if (e === c || !c.options.collisions.enable || e.options.collisions.mode !== c.options.collisions.mode || c.destroyed || c.spawning) continue;
          const d = c.getPosition(),
              h = c.getRadius();
          if (Math.abs(Math.round(o.z) - Math.round(d.z)) > l + h) continue;
          const m = Nt(o, d),
              y = l + h;
          m > y || H2(e, c, i, s.retina.pixelRatio);
      }
  }
  isEnabled(e) {
      return e.options.collisions.enable;
  }
  reset() {}
}
async function K2(t, e = !0) {
  ye(t, "3.7.1"), await t.addInteractor("particlesCollisions", (i) => Promise.resolve(new q2(i)), e);
}
const Xc = 2;
class G2 extends gt {
  constructor(e, i, s, o) {
      super(e, i, s), (this.canvasSize = o), (this.canvasSize = { ...o });
  }
  contains(e) {
      const { width: i, height: s } = this.canvasSize,
          { x: o, y: l } = e;
      return super.contains(e) || super.contains({ x: o - i, y: l }) || super.contains({ x: o - i, y: l - s }) || super.contains({ x: o, y: l - s });
  }
  intersects(e) {
      if (super.intersects(e)) return !0;
      const i = e,
          s = e,
          o = { x: e.position.x - this.canvasSize.width, y: e.position.y - this.canvasSize.height };
      if (s.radius !== void 0) {
          const l = new gt(o.x, o.y, s.radius * Xc);
          return super.intersects(l);
      } else if (i.size !== void 0) {
          const l = new gn(o.x, o.y, i.size.width * Xc, i.size.height * Xc);
          return super.intersects(l);
      }
      return !1;
  }
}
class Y2 {
  constructor() {
      (this.blur = 5), (this.color = new vt()), (this.color.value = "#000"), (this.enable = !1);
  }
  load(e) {
      W(e) || (e.blur !== void 0 && (this.blur = e.blur), (this.color = vt.create(this.color, e.color)), e.enable !== void 0 && (this.enable = e.enable));
  }
}
class Q2 {
  constructor() {
      (this.enable = !1), (this.frequency = 1);
  }
  load(e) {
      W(e) ||
          (e.color !== void 0 && (this.color = vt.create(this.color, e.color)),
          e.enable !== void 0 && (this.enable = e.enable),
          e.frequency !== void 0 && (this.frequency = e.frequency),
          e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class X2 {
  constructor() {
      (this.blink = !1),
          (this.color = new vt()),
          (this.color.value = "#fff"),
          (this.consent = !1),
          (this.distance = 100),
          (this.enable = !1),
          (this.frequency = 1),
          (this.opacity = 1),
          (this.shadow = new Y2()),
          (this.triangles = new Q2()),
          (this.width = 1),
          (this.warp = !1);
  }
  load(e) {
      W(e) ||
          (e.id !== void 0 && (this.id = e.id),
          e.blink !== void 0 && (this.blink = e.blink),
          (this.color = vt.create(this.color, e.color)),
          e.consent !== void 0 && (this.consent = e.consent),
          e.distance !== void 0 && (this.distance = e.distance),
          e.enable !== void 0 && (this.enable = e.enable),
          e.frequency !== void 0 && (this.frequency = e.frequency),
          e.opacity !== void 0 && (this.opacity = e.opacity),
          this.shadow.load(e.shadow),
          this.triangles.load(e.triangles),
          e.width !== void 0 && (this.width = e.width),
          e.warp !== void 0 && (this.warp = e.warp));
  }
}
const Qg = 2,
  Z2 = 1,
  Za = { x: 0, y: 0 },
  J2 = 0;
function eE(t, e, i, s, o) {
  const { dx: l, dy: u, distance: c } = bt(t, e);
  if (!o || c <= i) return c;
  const d = { x: Math.abs(l), y: Math.abs(u) },
      h = { x: Math.min(d.x, s.width - d.x), y: Math.min(d.y, s.height - d.y) };
  return Math.sqrt(h.x ** Qg + h.y ** Qg);
}
class tE extends hd {
  constructor(e, i) {
      super(e),
          (this._setColor = (s) => {
              if (!s.options.links) return;
              const o = this._linkContainer,
                  l = s.options.links;
              let u = l.id === void 0 ? o.particles.linksColor : o.particles.linksColors.get(l.id);
              if (u) return;
              const c = l.color;
              (u = t0(this._engine, c, l.blink, l.consent)), l.id === void 0 ? (o.particles.linksColor = u) : o.particles.linksColors.set(l.id, u);
          }),
          (this._linkContainer = e),
          (this._engine = i);
  }
  clear() {}
  init() {
      (this._linkContainer.particles.linksColor = void 0), (this._linkContainer.particles.linksColors = new Map());
  }
  interact(e) {
      if (!e.options.links) return;
      e.links = [];
      const i = e.getPosition(),
          s = this.container,
          o = s.canvas.size;
      if (i.x < Za.x || i.y < Za.y || i.x > o.width || i.y > o.height) return;
      const l = e.options.links,
          u = l.opacity,
          c = e.retina.linksDistance ?? J2,
          d = l.warp;
      let h;
      d ? (h = new G2(i.x, i.y, c, o)) : (h = new gt(i.x, i.y, c));
      const m = s.particles.quadTree.query(h);
      for (const y of m) {
          const v = y.options.links;
          if (e === y || !(v != null && v.enable) || l.id !== v.id || y.spawning || y.destroyed || !y.links || e.links.some((C) => C.destination === y) || y.links.some((C) => C.destination === e)) continue;
          const w = y.getPosition();
          if (w.x < Za.x || w.y < Za.y || w.x > o.width || w.y > o.height) continue;
          const S = eE(i, w, c, o, d && v.warp);
          if (S > c) continue;
          const b = (Z2 - S / c) * u;
          this._setColor(e), e.links.push({ destination: y, opacity: b });
      }
  }
  isEnabled(e) {
      var i;
      return !!((i = e.options.links) != null && i.enable);
  }
  loadParticlesOptions(e, ...i) {
      e.links || (e.links = new X2());
      for (const s of i) e.links.load(s == null ? void 0 : s.links);
  }
  reset() {}
}
async function nE(t, e = !0) {
  await t.addInteractor("particlesLinks", async (i) => Promise.resolve(new tE(i, t)), e);
}
function iE(t, e, i, s) {
  t.beginPath(), t.moveTo(e.x, e.y), t.lineTo(i.x, i.y), t.lineTo(s.x, s.y), t.closePath();
}
function rE(t) {
  let e = !1;
  const { begin: i, end: s, engine: o, maxDistance: l, context: u, canvasSize: c, width: d, backgroundMask: h, colorLine: m, opacity: y, links: v } = t;
  if (Nt(i, s) <= l) so(u, i, s), (e = !0);
  else if (v.warp) {
      let S, b;
      const C = { x: s.x - c.width, y: s.y },
          P = bt(i, C);
      if (P.distance <= l) {
          const E = i.y - (P.dy / P.dx) * i.x;
          (S = { x: 0, y: E }), (b = { x: c.width, y: E });
      } else {
          const E = { x: s.x, y: s.y - c.height },
              D = bt(i, E);
          if (D.distance <= l) {
              const z = -(i.y - (D.dy / D.dx) * i.x) / (D.dy / D.dx);
              (S = { x: z, y: 0 }), (b = { x: z, y: c.height });
          } else {
              const I = { x: s.x - c.width, y: s.y - c.height },
                  z = bt(i, I);
              if (z.distance <= l) {
                  const N = i.y - (z.dy / z.dx) * i.x;
                  (S = { x: -N / (z.dy / z.dx), y: N }), (b = { x: S.x + c.width, y: S.y + c.height });
              }
          }
      }
      S && b && (so(u, i, S), so(u, s, b), (e = !0));
  }
  if (!e) return;
  (u.lineWidth = d), h.enable && (u.globalCompositeOperation = h.composite), (u.strokeStyle = Hn(m, y));
  const { shadow: w } = v;
  if (w.enable) {
      const S = hn(o, w.color);
      S && ((u.shadowBlur = w.blur), (u.shadowColor = Hn(S)));
  }
  u.stroke();
}
function sE(t) {
  const { context: e, pos1: i, pos2: s, pos3: o, backgroundMask: l, colorTriangle: u, opacityTriangle: c } = t;
  iE(e, i, s, o), l.enable && (e.globalCompositeOperation = l.composite), (e.fillStyle = Hn(u, c)), e.fill();
}
function oE(t) {
  return t.sort((e, i) => e - i), t.join("_");
}
function Xg(t, e) {
  const i = oE(t.map((o) => o.id));
  let s = e.get(i);
  return s === void 0 && ((s = Ae()), e.set(i, s)), s;
}
const Zg = 0,
  Zc = 0,
  Jg = 0,
  aE = 0.5,
  lE = 1;
class uE {
  constructor(e, i) {
      (this._drawLinkLine = (s, o) => {
          const l = s.options.links;
          if (!(l != null && l.enable)) return;
          const u = this._container,
              c = u.actualOptions,
              d = o.destination,
              h = s.getPosition(),
              m = d.getPosition();
          let y = o.opacity;
          u.canvas.draw((v) => {
              var E;
              let w;
              const S = (E = s.options.twinkle) == null ? void 0 : E.lines;
              if (S != null && S.enable) {
                  const D = S.frequency,
                      I = hn(this._engine, S.color);
                  Ae() < D && I && ((w = I), (y = ne(S.opacity)));
              }
              if (!w) {
                  const D = l.id !== void 0 ? u.particles.linksColors.get(l.id) : u.particles.linksColor;
                  w = Tf(s, d, D);
              }
              if (!w) return;
              const b = s.retina.linksWidth ?? Zc,
                  C = s.retina.linksDistance ?? Jg,
                  { backgroundMask: P } = c;
              rE({ context: v, width: b, begin: h, end: m, engine: this._engine, maxDistance: C, canvasSize: u.canvas.size, links: l, backgroundMask: P, colorLine: w, opacity: y });
          });
      }),
          (this._drawLinkTriangle = (s, o, l) => {
              const u = s.options.links;
              if (!(u != null && u.enable)) return;
              const c = u.triangles;
              if (!c.enable) return;
              const d = this._container,
                  h = d.actualOptions,
                  m = o.destination,
                  y = l.destination,
                  v = c.opacity ?? (o.opacity + l.opacity) * aE;
              v <= Zg ||
                  d.canvas.draw((w) => {
                      const S = s.getPosition(),
                          b = m.getPosition(),
                          C = y.getPosition(),
                          P = s.retina.linksDistance ?? Jg;
                      if (Nt(S, b) > P || Nt(C, b) > P || Nt(C, S) > P) return;
                      let E = hn(this._engine, c.color);
                      if (!E) {
                          const D = u.id !== void 0 ? d.particles.linksColors.get(u.id) : d.particles.linksColor;
                          E = Tf(s, m, D);
                      }
                      E && sE({ context: w, pos1: S, pos2: b, pos3: C, backgroundMask: h.backgroundMask, colorTriangle: E, opacityTriangle: v });
                  });
          }),
          (this._drawTriangles = (s, o, l, u) => {
              var h, m, y;
              const c = l.destination;
              if (!((h = s.links) != null && h.triangles.enable && (m = c.options.links) != null && m.triangles.enable)) return;
              const d =
                  (y = c.links) == null
                      ? void 0
                      : y.filter((v) => {
                            const w = this._getLinkFrequency(c, v.destination);
                            return c.options.links && w <= c.options.links.frequency && u.findIndex((b) => b.destination === v.destination) >= 0;
                        });
              if (d != null && d.length)
                  for (const v of d) {
                      const w = v.destination;
                      this._getTriangleFrequency(o, c, w) > s.links.triangles.frequency || this._drawLinkTriangle(o, l, v);
                  }
          }),
          (this._getLinkFrequency = (s, o) => Xg([s, o], this._freqs.links)),
          (this._getTriangleFrequency = (s, o, l) => Xg([s, o, l], this._freqs.triangles)),
          (this._container = e),
          (this._engine = i),
          (this._freqs = { links: new Map(), triangles: new Map() });
  }
  drawParticle(e, i) {
      const { links: s, options: o } = i;
      if (!(s != null && s.length)) return;
      const l = s.filter((u) => o.links && (o.links.frequency >= lE || this._getLinkFrequency(i, u.destination) <= o.links.frequency));
      for (const u of l) this._drawTriangles(o, i, u, l), u.opacity > Zg && (i.retina.linksWidth ?? Zc) > Zc && this._drawLinkLine(i, u);
  }
  async init() {
      (this._freqs.links = new Map()), (this._freqs.triangles = new Map()), await Promise.resolve();
  }
  particleCreated(e) {
      if (((e.links = []), !e.options.links)) return;
      const i = this._container.retina.pixelRatio,
          { retina: s } = e,
          { distance: o, width: l } = e.options.links;
      (s.linksDistance = o * i), (s.linksWidth = l * i);
  }
  particleDestroyed(e) {
      e.links = [];
  }
}
class cE {
  constructor(e) {
      (this.id = "links"), (this._engine = e);
  }
  getPlugin(e) {
      return Promise.resolve(new uE(e, this._engine));
  }
  loadOptions() {}
  needsPlugin() {
      return !0;
  }
}
async function fE(t, e = !0) {
  const i = new cE(t);
  await t.addPlugin(i, e);
}
async function dE(t, e = !0) {
  ye(t, "3.7.1"), await nE(t, e), await fE(t, e);
}
const hE = 180,
  Ja = { x: 0, y: 0 },
  pE = 2;
function mE(t, e, i) {
  const { context: s } = t,
      o = i.count.numerator * i.count.denominator,
      l = i.count.numerator / i.count.denominator,
      u = (hE * (l - pE)) / l,
      c = Math.PI - pi(u);
  if (s) {
      s.beginPath(), s.translate(e.x, e.y), s.moveTo(Ja.x, Ja.y);
      for (let d = 0; d < o; d++) s.lineTo(i.length, Ja.y), s.translate(i.length, Ja.y), s.rotate(c);
  }
}
const gE = 5;
class x0 {
  draw(e) {
      const { particle: i, radius: s } = e,
          o = this.getCenter(i, s),
          l = this.getSidesData(i, s);
      mE(e, o, l);
  }
  getSidesCount(e) {
      const i = e.shapeData;
      return Math.round(ne((i == null ? void 0 : i.sides) ?? gE));
  }
}
const ey = 3.5,
  ty = 2.66,
  yE = 3;
class vE extends x0 {
  constructor() {
      super(...arguments), (this.validTypes = ["polygon"]);
  }
  getCenter(e, i) {
      return { x: -i / (e.sides / ey), y: -i / (ty / ey) };
  }
  getSidesData(e, i) {
      const s = e.sides;
      return { count: { denominator: 1, numerator: s }, length: (i * ty) / (s / yE) };
  }
}
const xE = 1.66,
  wE = 3,
  SE = 2;
class bE extends x0 {
  constructor() {
      super(...arguments), (this.validTypes = ["triangle"]);
  }
  getCenter(e, i) {
      return { x: -i, y: i / xE };
  }
  getSidesCount() {
      return wE;
  }
  getSidesData(e, i) {
      const s = i * SE;
      return { count: { denominator: 2, numerator: 3 }, length: s };
  }
}
async function CE(t, e = !0) {
  ye(t, "3.7.1"), await t.addShape(new vE(), e);
}
async function kE(t, e = !0) {
  ye(t, "3.7.1"), await t.addShape(new bE(), e);
}
async function PE(t, e = !0) {
  ye(t, "3.7.1"), await CE(t, e), await kE(t, e);
}
class TE {
  constructor() {
      (this.enable = !1), (this.speed = 0), (this.decay = 0), (this.sync = !1);
  }
  load(e) {
      W(e) || (e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = be(e.speed)), e.decay !== void 0 && (this.decay = be(e.decay)), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class EE extends nr {
  constructor() {
      super(), (this.animation = new TE()), (this.direction = Qt.clockwise), (this.path = !1), (this.value = 0);
  }
  load(e) {
      W(e) || (super.load(e), e.direction !== void 0 && (this.direction = e.direction), this.animation.load(e.animation), e.path !== void 0 && (this.path = e.path));
  }
}
const w0 = 2,
  _E = Math.PI * w0,
  RE = 1,
  ME = 360;
class AE {
  constructor(e) {
      this.container = e;
  }
  init(e) {
      const i = e.options.rotate;
      if (!i) return;
      (e.rotate = { enable: i.animation.enable, value: pi(ne(i.value)), min: 0, max: _E }), (e.pathRotation = i.path);
      let s = i.direction;
      switch ((s === Qt.random && (s = Math.floor(Ae() * w0) > 0 ? Qt.counterClockwise : Qt.clockwise), s)) {
          case Qt.counterClockwise:
          case "counterClockwise":
              e.rotate.status = Qe.decreasing;
              break;
          case Qt.clockwise:
              e.rotate.status = Qe.increasing;
              break;
      }
      const o = i.animation;
      o.enable && ((e.rotate.decay = RE - ne(o.decay)), (e.rotate.velocity = (ne(o.speed) / ME) * this.container.retina.reduceFactor), o.sync || (e.rotate.velocity *= Ae())), (e.rotation = e.rotate.value);
  }
  isEnabled(e) {
      const i = e.options.rotate;
      return i ? !e.destroyed && !e.spawning && (!!i.value || i.animation.enable || i.path) : !1;
  }
  loadOptions(e, ...i) {
      e.rotate || (e.rotate = new EE());
      for (const s of i) e.rotate.load(s == null ? void 0 : s.rotate);
  }
  update(e, i) {
      this.isEnabled(e) && ((e.isRotating = !!e.rotate), e.rotate && (ud(e, e.rotate, !1, Zi.none, i), (e.rotation = e.rotate.value)));
  }
}
async function OE(t, e = !0) {
  ye(t, "3.7.1"), await t.addParticleUpdater("rotate", (i) => Promise.resolve(new AE(i)), e);
}
const DE = 2,
  LE = Math.sqrt(DE),
  IE = 2;
function jE(t) {
  const { context: e, radius: i } = t,
      s = i / LE,
      o = s * IE;
  e.rect(-s, -s, o, o);
}
const zE = 4;
class NE {
  constructor() {
      this.validTypes = ["edge", "square"];
  }
  draw(e) {
      jE(e);
  }
  getSidesCount() {
      return zE;
  }
}
async function FE(t, e = !0) {
  ye(t, "3.7.1"), await t.addShape(new NE(), e);
}
const VE = 2,
  Ar = { x: 0, y: 0 };
function BE(t) {
  const { context: e, particle: i, radius: s } = t,
      o = i.sides,
      l = i.starInset ?? VE;
  e.moveTo(Ar.x, Ar.y - s);
  for (let u = 0; u < o; u++) e.rotate(Math.PI / o), e.lineTo(Ar.x, Ar.y - s * l), e.rotate(Math.PI / o), e.lineTo(Ar.x, Ar.y - s);
}
const $E = 2,
  UE = 5;
class HE {
  constructor() {
      this.validTypes = ["star"];
  }
  draw(e) {
      BE(e);
  }
  getSidesCount(e) {
      const i = e.shapeData;
      return Math.round(ne((i == null ? void 0 : i.sides) ?? UE));
  }
  particleInit(e, i) {
      const s = i.shapeData;
      i.starInset = ne((s == null ? void 0 : s.inset) ?? $E);
  }
}
async function WE(t, e = !0) {
  ye(t, "3.7.1"), await t.addShape(new HE(), e);
}
const qE = 1;
class KE {
  constructor(e, i) {
      (this._container = e), (this._engine = i);
  }
  init(e) {
      var u;
      const i = this._container,
          s = e.options,
          o = cn(s.stroke, e.id, s.reduceDuplicates);
      (e.strokeWidth = ne(o.width) * i.retina.pixelRatio), (e.strokeOpacity = ne(o.opacity ?? qE)), (e.strokeAnimation = (u = o.color) == null ? void 0 : u.animation);
      const l = fo(this._engine, o.color) ?? e.getFillColor();
      l && (e.strokeColor = n0(l, e.strokeAnimation, i.retina.reduceFactor));
  }
  isEnabled(e) {
      const i = e.strokeAnimation,
          { strokeColor: s } = e;
      return (
          !e.destroyed && !e.spawning && !!i && (((s == null ? void 0 : s.h.value) !== void 0 && s.h.enable) || ((s == null ? void 0 : s.s.value) !== void 0 && s.s.enable) || ((s == null ? void 0 : s.l.value) !== void 0 && s.l.enable))
      );
  }
  update(e, i) {
      this.isEnabled(e) && i0(e.strokeColor, i);
  }
}
async function GE(t, e = !0) {
  ye(t, "3.7.1"), await t.addParticleUpdater("strokeColor", (i) => Promise.resolve(new KE(i, t)), e);
}
async function YE(t, e = !0) {
  ye(t, "3.7.1"),
      await I2(t, !1),
      await FP(t, !1),
      await GP(t, !1),
      await nT(t, !1),
      await dT(t, !1),
      await bT(t, !1),
      await PT(t, !1),
      await MT(t, !1),
      await LT(t, !1),
      await WT(t, !1),
      await QT(t, !1),
      await N2(t, !1),
      await K2(t, !1),
      await dE(t, !1),
      await RP(t, !1),
      await OP(t, !1),
      await b2(t, !1),
      await D2(t, !1),
      await PE(t, !1),
      await FE(t, !1),
      await WE(t, !1),
      await R2(t, !1),
      await OE(t, !1),
      await GE(t, !1),
      await _P(t, e);
}
const QE = ({ id: t }) => {
  const [e, i] = A.useState(!1);
  A.useEffect(() => {
      (async () => {
          await jk(async (l) => {
              await YE(l);
          }),
              i(!0);
      })();
  }, []);
  const s = A.useMemo(
      () => ({
          background: { color: { value: "#0810170" } },
          fpsLimit: 120,
          interactivity: { events: { onClick: { enable: !0, mode: "push" }, onHover: { enable: !0, mode: "repulse" } }, modes: { push: { distance: 0.1, duration: 1 }, grab: { distance: 150 } } },
          particles: {
              color: { value: "#00A7FD" },
              links: { color: "#00A7FD", distance: 150, enable: !1, opacity: 0, width: 1 },
              move: { direction: "none", enable: !0, outModes: { default: "destroy" }, random: !0, speed: 1, straight: !1 },
              number: { density: { enable: !0 }, value: 150 },
              opacity: { value: 1 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
          },
          detectRetina: !0,
      }),
      []
  );
  return e ? k.jsx(Ik, { id: t, options: s }) : null;
};
var Mf = new Map(),
  el = new WeakMap(),
  ny = 0,
  XE = void 0;
function ZE(t) {
  return t ? (el.has(t) || ((ny += 1), el.set(t, ny.toString())), el.get(t)) : "0";
}
function JE(t) {
  return Object.keys(t)
      .sort()
      .filter((e) => t[e] !== void 0)
      .map((e) => `${e}_${e === "root" ? ZE(t.root) : t[e]}`)
      .toString();
}
function e_(t) {
  const e = JE(t);
  let i = Mf.get(e);
  if (!i) {
      const s = new Map();
      let o;
      const l = new IntersectionObserver((u) => {
          u.forEach((c) => {
              var d;
              const h = c.isIntersecting && o.some((m) => c.intersectionRatio >= m);
              t.trackVisibility && typeof c.isVisible > "u" && (c.isVisible = h),
                  (d = s.get(c.target)) == null ||
                      d.forEach((m) => {
                          m(h, c);
                      });
          });
      }, t);
      (o = l.thresholds || (Array.isArray(t.threshold) ? t.threshold : [t.threshold || 0])), (i = { id: e, observer: l, elements: s }), Mf.set(e, i);
  }
  return i;
}
function t_(t, e, i = {}, s = XE) {
  if (typeof window.IntersectionObserver > "u" && s !== void 0) {
      const d = t.getBoundingClientRect();
      return e(s, { isIntersecting: s, target: t, intersectionRatio: typeof i.threshold == "number" ? i.threshold : 0, time: 0, boundingClientRect: d, intersectionRect: d, rootBounds: d }), () => {};
  }
  const { id: o, observer: l, elements: u } = e_(i),
      c = u.get(t) || [];
  return (
      u.has(t) || u.set(t, c),
      c.push(e),
      l.observe(t),
      function () {
          c.splice(c.indexOf(e), 1), c.length === 0 && (u.delete(t), l.unobserve(t)), u.size === 0 && (l.disconnect(), Mf.delete(o));
      }
  );
}
function rs({ threshold: t, delay: e, trackVisibility: i, rootMargin: s, root: o, triggerOnce: l, skip: u, initialInView: c, fallbackInView: d, onChange: h } = {}) {
  var m;
  const [y, v] = A.useState(null),
      w = A.useRef(h),
      [S, b] = A.useState({ inView: !!c, entry: void 0 });
  (w.current = h),
      A.useEffect(() => {
          if (u || !y) return;
          let D;
          return (
              (D = t_(
                  y,
                  (I, z) => {
                      b({ inView: I, entry: z }), w.current && w.current(I, z), z.isIntersecting && l && D && (D(), (D = void 0));
                  },
                  { root: o, rootMargin: s, threshold: t, trackVisibility: i, delay: e },
                  d
              )),
              () => {
                  D && D();
              }
          );
      }, [Array.isArray(t) ? t.toString() : t, y, o, s, l, u, i, d, e]);
  const C = (m = S.entry) == null ? void 0 : m.target,
      P = A.useRef(void 0);
  !y && C && !l && !u && P.current !== C && ((P.current = C), b({ inView: !!c, entry: void 0 }));
  const E = [v, S.inView, S.entry];
  return (E.ref = E[0]), (E.inView = E[1]), (E.entry = E[2]), E;
}
const n_ = (t) => {
      let e;
      const i = new Set(),
          s = (h, m) => {
              const y = typeof h == "function" ? h(e) : h;
              if (!Object.is(y, e)) {
                  const v = e;
                  (e = m ?? (typeof y != "object" || y === null) ? y : Object.assign({}, e, y)), i.forEach((w) => w(e, v));
              }
          },
          o = () => e,
          c = { setState: s, getState: o, getInitialState: () => d, subscribe: (h) => (i.add(h), () => i.delete(h)) },
          d = (e = t(s, o, c));
      return c;
  },
  i_ = (t) => n_(t),
  r_ = (t) => t;
function s_(t, e = r_) {
  const i = He.useSyncExternalStore(
      t.subscribe,
      () => e(t.getState()),
      () => e(t.getInitialState())
  );
  return He.useDebugValue(i), i;
}
const o_ = (t) => {
      const e = i_(t),
          i = (s) => s_(e, s);
      return Object.assign(i, e), i;
  },
  a_ = (t) => o_(t),
  S0 = a_((t) => ({ buyNowIsActive: !1, toggleActive: () => t((e) => ({ buyNowIsActive: !e.buyNowIsActive })), setActive: (e) => t({ buyNowIsActive: e }) }));
function l_(t) {
  if (typeof Proxy > "u") return t;
  const e = new Map(),
      i = (...s) => t(...s);
  return new Proxy(i, { get: (s, o) => (o === "create" ? t : (e.has(o) || e.set(o, t(o)), e.get(o))) });
}
function Ml(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
const Af = (t) => Array.isArray(t);
function b0(t, e) {
  if (!Array.isArray(e)) return !1;
  const i = e.length;
  if (i !== t.length) return !1;
  for (let s = 0; s < i; s++) if (e[s] !== t[s]) return !1;
  return !0;
}
function go(t) {
  return typeof t == "string" || Array.isArray(t);
}
function iy(t) {
  const e = [{}, {}];
  return (
      t == null ||
          t.values.forEach((i, s) => {
              (e[0][s] = i.get()), (e[1][s] = i.getVelocity());
          }),
      e
  );
}
function md(t, e, i, s) {
  if (typeof e == "function") {
      const [o, l] = iy(s);
      e = e(i !== void 0 ? i : t.custom, o, l);
  }
  if ((typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function")) {
      const [o, l] = iy(s);
      e = e(i !== void 0 ? i : t.custom, o, l);
  }
  return e;
}
function Al(t, e, i) {
  const s = t.getProps();
  return md(s, e, i !== void 0 ? i : s.custom, t);
}
const gd = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"],
  yd = ["initial", ...gd],
  Eo = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
  ir = new Set(Eo),
  Tn = (t) => t * 1e3,
  En = (t) => t / 1e3,
  u_ = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  c_ = (t) => ({ type: "spring", stiffness: 550, damping: t === 0 ? 2 * Math.sqrt(550) : 30, restSpeed: 10 }),
  f_ = { type: "keyframes", duration: 0.8 },
  d_ = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  h_ = (t, { keyframes: e }) => (e.length > 2 ? f_ : ir.has(t) ? (t.startsWith("scale") ? c_(e[1]) : u_) : d_);
function vd(t, e) {
  return t ? t[e] || t.default || t : void 0;
}
const p_ = { skipAnimations: !1, useManualTiming: !1 },
  m_ = (t) => t !== null;
function Ol(t, { repeat: e, repeatType: i = "loop" }, s) {
  const o = t.filter(m_),
      l = e && i !== "loop" && e % 2 === 1 ? 0 : o.length - 1;
  return !l || s === void 0 ? o[l] : s;
}
const Ft = (t) => t;
let Of = Ft;
function g_(t) {
  let e = new Set(),
      i = new Set(),
      s = !1,
      o = !1;
  const l = new WeakSet();
  let u = { delta: 0, timestamp: 0, isProcessing: !1 };
  function c(h) {
      l.has(h) && (d.schedule(h), t()), h(u);
  }
  const d = {
      schedule: (h, m = !1, y = !1) => {
          const w = y && s ? e : i;
          return m && l.add(h), w.has(h) || w.add(h), h;
      },
      cancel: (h) => {
          i.delete(h), l.delete(h);
      },
      process: (h) => {
          if (((u = h), s)) {
              o = !0;
              return;
          }
          (s = !0), ([e, i] = [i, e]), e.forEach(c), e.clear(), (s = !1), o && ((o = !1), d.process(h));
      },
  };
  return d;
}
const tl = ["read", "resolveKeyframes", "update", "preRender", "render", "postRender"],
  y_ = 40;
function C0(t, e) {
  let i = !1,
      s = !0;
  const o = { delta: 0, timestamp: 0, isProcessing: !1 },
      l = () => (i = !0),
      u = tl.reduce((P, E) => ((P[E] = g_(l)), P), {}),
      { read: c, resolveKeyframes: d, update: h, preRender: m, render: y, postRender: v } = u,
      w = () => {
          const P = performance.now();
          (i = !1),
              (o.delta = s ? 1e3 / 60 : Math.max(Math.min(P - o.timestamp, y_), 1)),
              (o.timestamp = P),
              (o.isProcessing = !0),
              c.process(o),
              d.process(o),
              h.process(o),
              m.process(o),
              y.process(o),
              v.process(o),
              (o.isProcessing = !1),
              i && e && ((s = !1), t(w));
      },
      S = () => {
          (i = !0), (s = !0), o.isProcessing || t(w);
      };
  return {
      schedule: tl.reduce((P, E) => {
          const D = u[E];
          return (P[E] = (I, z = !1, N = !1) => (i || S(), D.schedule(I, z, N))), P;
      }, {}),
      cancel: (P) => {
          for (let E = 0; E < tl.length; E++) u[tl[E]].cancel(P);
      },
      state: o,
      steps: u,
  };
}
const { schedule: Oe, cancel: vi, state: lt, steps: Jc } = C0(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ft, !0),
  k0 = (t, e, i) => (((1 - 3 * i + 3 * e) * t + (3 * i - 6 * e)) * t + 3 * e) * t,
  v_ = 1e-7,
  x_ = 12;
function w_(t, e, i, s, o) {
  let l,
      u,
      c = 0;
  do (u = e + (i - e) / 2), (l = k0(u, s, o) - t), l > 0 ? (i = u) : (e = u);
  while (Math.abs(l) > v_ && ++c < x_);
  return u;
}
function _o(t, e, i, s) {
  if (t === e && i === s) return Ft;
  const o = (l) => w_(l, 0, 1, t, i);
  return (l) => (l === 0 || l === 1 ? l : k0(o(l), e, s));
}
const P0 = (t) => (e) => (e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2),
  T0 = (t) => (e) => 1 - t(1 - e),
  E0 = _o(0.33, 1.53, 0.69, 0.99),
  xd = T0(E0),
  _0 = P0(xd),
  R0 = (t) => ((t *= 2) < 1 ? 0.5 * xd(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1)))),
  wd = (t) => 1 - Math.sin(Math.acos(t)),
  M0 = T0(wd),
  A0 = P0(wd),
  O0 = (t) => /^0[^.\s]+$/u.test(t);
function S_(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || O0(t) : !0;
}
const D0 = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t),
  L0 = (t) => (e) => typeof e == "string" && e.startsWith(t),
  I0 = L0("--"),
  b_ = L0("var(--"),
  Sd = (t) => (b_(t) ? C_.test(t.split("/*")[0].trim()) : !1),
  C_ = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
  k_ = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function P_(t) {
  const e = k_.exec(t);
  if (!e) return [,];
  const [, i, s, o] = e;
  return [`--${i ?? s}`, o];
}
function j0(t, e, i = 1) {
  const [s, o] = P_(t);
  if (!s) return;
  const l = window.getComputedStyle(e).getPropertyValue(s);
  if (l) {
      const u = l.trim();
      return D0(u) ? parseFloat(u) : u;
  }
  return Sd(o) ? j0(o, e, i + 1) : o;
}
const Wn = (t, e, i) => (i > e ? e : i < t ? t : i),
  ss = { test: (t) => typeof t == "number", parse: parseFloat, transform: (t) => t },
  yo = { ...ss, transform: (t) => Wn(0, 1, t) },
  nl = { ...ss, default: 1 },
  Ro = (t) => ({ test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1, parse: parseFloat, transform: (e) => `${e}${t}` }),
  fi = Ro("deg"),
  _n = Ro("%"),
  oe = Ro("px"),
  T_ = Ro("vh"),
  E_ = Ro("vw"),
  ry = { ..._n, parse: (t) => _n.parse(t) / 100, transform: (t) => _n.transform(t * 100) },
  __ = new Set(["width", "height", "top", "left", "right", "bottom", "x", "y", "translateX", "translateY"]),
  sy = (t) => t === ss || t === oe,
  oy = (t, e) => parseFloat(t.split(", ")[e]),
  ay = (t, e) => (i, { transform: s }) => {
      if (s === "none" || !s) return 0;
      const o = s.match(/^matrix3d\((.+)\)$/u);
      if (o) return oy(o[1], e);
      {
          const l = s.match(/^matrix\((.+)\)$/u);
          return l ? oy(l[1], t) : 0;
      }
  },
  R_ = new Set(["x", "y", "z"]),
  M_ = Eo.filter((t) => !R_.has(t));
function A_(t) {
  const e = [];
  return (
      M_.forEach((i) => {
          const s = t.getValue(i);
          s !== void 0 && (e.push([i, s.get()]), s.set(i.startsWith("scale") ? 1 : 0));
      }),
      e
  );
}
const Zr = {
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: i = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(i),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: i = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(i),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  x: ay(4, 13),
  y: ay(5, 14),
};
Zr.translateX = Zr.x;
Zr.translateY = Zr.y;
const z0 = (t) => (e) => e.test(t),
  O_ = { test: (t) => t === "auto", parse: (t) => t },
  N0 = [ss, oe, _n, fi, E_, T_, O_],
  ly = (t) => N0.find(z0(t)),
  Yi = new Set();
let Df = !1,
  Lf = !1;
function F0() {
  if (Lf) {
      const t = Array.from(Yi).filter((s) => s.needsMeasurement),
          e = new Set(t.map((s) => s.element)),
          i = new Map();
      e.forEach((s) => {
          const o = A_(s);
          o.length && (i.set(s, o), s.render());
      }),
          t.forEach((s) => s.measureInitialState()),
          e.forEach((s) => {
              s.render();
              const o = i.get(s);
              o &&
                  o.forEach(([l, u]) => {
                      var c;
                      (c = s.getValue(l)) === null || c === void 0 || c.set(u);
                  });
          }),
          t.forEach((s) => s.measureEndState()),
          t.forEach((s) => {
              s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY);
          });
  }
  (Lf = !1), (Df = !1), Yi.forEach((t) => t.complete()), Yi.clear();
}
function V0() {
  Yi.forEach((t) => {
      t.readKeyframes(), t.needsMeasurement && (Lf = !0);
  });
}
function D_() {
  V0(), F0();
}
class bd {
  constructor(e, i, s, o, l, u = !1) {
      (this.isComplete = !1),
          (this.isAsync = !1),
          (this.needsMeasurement = !1),
          (this.isScheduled = !1),
          (this.unresolvedKeyframes = [...e]),
          (this.onComplete = i),
          (this.name = s),
          (this.motionValue = o),
          (this.element = l),
          (this.isAsync = u);
  }
  scheduleResolve() {
      (this.isScheduled = !0), this.isAsync ? (Yi.add(this), Df || ((Df = !0), Oe.read(V0), Oe.resolveKeyframes(F0))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
      const { unresolvedKeyframes: e, name: i, element: s, motionValue: o } = this;
      for (let l = 0; l < e.length; l++)
          if (e[l] === null)
              if (l === 0) {
                  const u = o == null ? void 0 : o.get(),
                      c = e[e.length - 1];
                  if (u !== void 0) e[0] = u;
                  else if (s && i) {
                      const d = s.readValue(i, c);
                      d != null && (e[0] = d);
                  }
                  e[0] === void 0 && (e[0] = c), o && u === void 0 && o.set(e[0]);
              } else e[l] = e[l - 1];
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete() {
      (this.isComplete = !0), this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), Yi.delete(this);
  }
  cancel() {
      this.isComplete || ((this.isScheduled = !1), Yi.delete(this));
  }
  resume() {
      this.isComplete || this.scheduleResolve();
  }
}
const oo = (t) => Math.round(t * 1e5) / 1e5,
  Cd = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function L_(t) {
  return t == null;
}
const I_ = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  kd = (t, e) => (i) => !!((typeof i == "string" && I_.test(i) && i.startsWith(t)) || (e && !L_(i) && Object.prototype.hasOwnProperty.call(i, e))),
  B0 = (t, e, i) => (s) => {
      if (typeof s != "string") return s;
      const [o, l, u, c] = s.match(Cd);
      return { [t]: parseFloat(o), [e]: parseFloat(l), [i]: parseFloat(u), alpha: c !== void 0 ? parseFloat(c) : 1 };
  },
  j_ = (t) => Wn(0, 255, t),
  ef = { ...ss, transform: (t) => Math.round(j_(t)) },
  Ki = {
      test: kd("rgb", "red"),
      parse: B0("red", "green", "blue"),
      transform: ({ red: t, green: e, blue: i, alpha: s = 1 }) => "rgba(" + ef.transform(t) + ", " + ef.transform(e) + ", " + ef.transform(i) + ", " + oo(yo.transform(s)) + ")",
  };
function z_(t) {
  let e = "",
      i = "",
      s = "",
      o = "";
  return (
      t.length > 5
          ? ((e = t.substring(1, 3)), (i = t.substring(3, 5)), (s = t.substring(5, 7)), (o = t.substring(7, 9)))
          : ((e = t.substring(1, 2)), (i = t.substring(2, 3)), (s = t.substring(3, 4)), (o = t.substring(4, 5)), (e += e), (i += i), (s += s), (o += o)),
      { red: parseInt(e, 16), green: parseInt(i, 16), blue: parseInt(s, 16), alpha: o ? parseInt(o, 16) / 255 : 1 }
  );
}
const If = { test: kd("#"), parse: z_, transform: Ki.transform },
  jr = {
      test: kd("hsl", "hue"),
      parse: B0("hue", "saturation", "lightness"),
      transform: ({ hue: t, saturation: e, lightness: i, alpha: s = 1 }) => "hsla(" + Math.round(t) + ", " + _n.transform(oo(e)) + ", " + _n.transform(oo(i)) + ", " + oo(yo.transform(s)) + ")",
  },
  pt = {
      test: (t) => Ki.test(t) || If.test(t) || jr.test(t),
      parse: (t) => (Ki.test(t) ? Ki.parse(t) : jr.test(t) ? jr.parse(t) : If.parse(t)),
      transform: (t) => (typeof t == "string" ? t : t.hasOwnProperty("red") ? Ki.transform(t) : jr.transform(t)),
  },
  N_ = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function F_(t) {
  var e, i;
  return isNaN(t) && typeof t == "string" && (((e = t.match(Cd)) === null || e === void 0 ? void 0 : e.length) || 0) + (((i = t.match(N_)) === null || i === void 0 ? void 0 : i.length) || 0) > 0;
}
const $0 = "number",
  U0 = "color",
  V_ = "var",
  B_ = "var(",
  uy = "${}",
  $_ = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function vo(t) {
  const e = t.toString(),
      i = [],
      s = { color: [], number: [], var: [] },
      o = [];
  let l = 0;
  const c = e.replace($_, (d) => (pt.test(d) ? (s.color.push(l), o.push(U0), i.push(pt.parse(d))) : d.startsWith(B_) ? (s.var.push(l), o.push(V_), i.push(d)) : (s.number.push(l), o.push($0), i.push(parseFloat(d))), ++l, uy)).split(uy);
  return { values: i, split: c, indexes: s, types: o };
}
function H0(t) {
  return vo(t).values;
}
function W0(t) {
  const { split: e, types: i } = vo(t),
      s = e.length;
  return (o) => {
      let l = "";
      for (let u = 0; u < s; u++)
          if (((l += e[u]), o[u] !== void 0)) {
              const c = i[u];
              c === $0 ? (l += oo(o[u])) : c === U0 ? (l += pt.transform(o[u])) : (l += o[u]);
          }
      return l;
  };
}
const U_ = (t) => (typeof t == "number" ? 0 : t);
function H_(t) {
  const e = H0(t);
  return W0(t)(e.map(U_));
}
const xi = { test: F_, parse: H0, createTransformer: W0, getAnimatableNone: H_ },
  W_ = new Set(["brightness", "contrast", "saturate", "opacity"]);
function q_(t) {
  const [e, i] = t.slice(0, -1).split("(");
  if (e === "drop-shadow") return t;
  const [s] = i.match(Cd) || [];
  if (!s) return t;
  const o = i.replace(s, "");
  let l = W_.has(e) ? 1 : 0;
  return s !== i && (l *= 100), e + "(" + l + o + ")";
}
const K_ = /\b([a-z-]*)\(.*?\)/gu,
  jf = {
      ...xi,
      getAnimatableNone: (t) => {
          const e = t.match(K_);
          return e ? e.map(q_).join(" ") : t;
      },
  },
  G_ = {
      borderWidth: oe,
      borderTopWidth: oe,
      borderRightWidth: oe,
      borderBottomWidth: oe,
      borderLeftWidth: oe,
      borderRadius: oe,
      radius: oe,
      borderTopLeftRadius: oe,
      borderTopRightRadius: oe,
      borderBottomRightRadius: oe,
      borderBottomLeftRadius: oe,
      width: oe,
      maxWidth: oe,
      height: oe,
      maxHeight: oe,
      top: oe,
      right: oe,
      bottom: oe,
      left: oe,
      padding: oe,
      paddingTop: oe,
      paddingRight: oe,
      paddingBottom: oe,
      paddingLeft: oe,
      margin: oe,
      marginTop: oe,
      marginRight: oe,
      marginBottom: oe,
      marginLeft: oe,
      backgroundPositionX: oe,
      backgroundPositionY: oe,
  },
  Y_ = {
      rotate: fi,
      rotateX: fi,
      rotateY: fi,
      rotateZ: fi,
      scale: nl,
      scaleX: nl,
      scaleY: nl,
      scaleZ: nl,
      skew: fi,
      skewX: fi,
      skewY: fi,
      distance: oe,
      translateX: oe,
      translateY: oe,
      translateZ: oe,
      x: oe,
      y: oe,
      z: oe,
      perspective: oe,
      transformPerspective: oe,
      opacity: yo,
      originX: ry,
      originY: ry,
      originZ: oe,
  },
  cy = { ...ss, transform: Math.round },
  Pd = { ...G_, ...Y_, zIndex: cy, size: oe, fillOpacity: yo, strokeOpacity: yo, numOctaves: cy },
  Q_ = { ...Pd, color: pt, backgroundColor: pt, outlineColor: pt, fill: pt, stroke: pt, borderColor: pt, borderTopColor: pt, borderRightColor: pt, borderBottomColor: pt, borderLeftColor: pt, filter: jf, WebkitFilter: jf },
  Td = (t) => Q_[t];
function q0(t, e) {
  let i = Td(t);
  return i !== jf && (i = xi), i.getAnimatableNone ? i.getAnimatableNone(e) : void 0;
}
const X_ = new Set(["auto", "none", "0"]);
function Z_(t, e, i) {
  let s = 0,
      o;
  for (; s < t.length && !o; ) {
      const l = t[s];
      typeof l == "string" && !X_.has(l) && vo(l).values.length && (o = t[s]), s++;
  }
  if (o && i) for (const l of e) t[l] = q0(i, o);
}
class K0 extends bd {
  constructor(e, i, s, o, l) {
      super(e, i, s, o, l, !0);
  }
  readKeyframes() {
      const { unresolvedKeyframes: e, element: i, name: s } = this;
      if (!i || !i.current) return;
      super.readKeyframes();
      for (let d = 0; d < e.length; d++) {
          let h = e[d];
          if (typeof h == "string" && ((h = h.trim()), Sd(h))) {
              const m = j0(h, i.current);
              m !== void 0 && (e[d] = m), d === e.length - 1 && (this.finalKeyframe = h);
          }
      }
      if ((this.resolveNoneKeyframes(), !__.has(s) || e.length !== 2)) return;
      const [o, l] = e,
          u = ly(o),
          c = ly(l);
      if (u !== c)
          if (sy(u) && sy(c))
              for (let d = 0; d < e.length; d++) {
                  const h = e[d];
                  typeof h == "string" && (e[d] = parseFloat(h));
              }
          else this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
      const { unresolvedKeyframes: e, name: i } = this,
          s = [];
      for (let o = 0; o < e.length; o++) S_(e[o]) && s.push(o);
      s.length && Z_(e, s, i);
  }
  measureInitialState() {
      const { element: e, unresolvedKeyframes: i, name: s } = this;
      if (!e || !e.current) return;
      s === "height" && (this.suspendedScrollY = window.pageYOffset), (this.measuredOrigin = Zr[s](e.measureViewportBox(), window.getComputedStyle(e.current))), (i[0] = this.measuredOrigin);
      const o = i[i.length - 1];
      o !== void 0 && e.getValue(s, o).jump(o, !1);
  }
  measureEndState() {
      var e;
      const { element: i, name: s, unresolvedKeyframes: o } = this;
      if (!i || !i.current) return;
      const l = i.getValue(s);
      l && l.jump(this.measuredOrigin, !1);
      const u = o.length - 1,
          c = o[u];
      (o[u] = Zr[s](i.measureViewportBox(), window.getComputedStyle(i.current))),
          c !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = c),
          !((e = this.removedTransforms) === null || e === void 0) &&
              e.length &&
              this.removedTransforms.forEach(([d, h]) => {
                  i.getValue(d).set(h);
              }),
          this.resolveNoneKeyframes();
  }
}
function Dl(t) {
  return typeof t == "function";
}
let ll;
function J_() {
  ll = void 0;
}
const Rn = {
      now: () => (ll === void 0 && Rn.set(lt.isProcessing || p_.useManualTiming ? lt.timestamp : performance.now()), ll),
      set: (t) => {
          (ll = t), queueMicrotask(J_);
      },
  },
  fy = (t, e) => (e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || (typeof t == "string" && (xi.test(t) || t === "0") && !t.startsWith("url("))));
function e3(t) {
  const e = t[0];
  if (t.length === 1) return !0;
  for (let i = 0; i < t.length; i++) if (t[i] !== e) return !0;
}
function t3(t, e, i, s) {
  const o = t[0];
  if (o === null) return !1;
  if (e === "display" || e === "visibility") return !0;
  const l = t[t.length - 1],
      u = fy(o, e),
      c = fy(l, e);
  return !u || !c ? !1 : e3(t) || ((i === "spring" || Dl(i)) && s);
}
const n3 = 40;
class G0 {
  constructor({ autoplay: e = !0, delay: i = 0, type: s = "keyframes", repeat: o = 0, repeatDelay: l = 0, repeatType: u = "loop", ...c }) {
      (this.isStopped = !1), (this.hasAttemptedResolve = !1), (this.createdAt = Rn.now()), (this.options = { autoplay: e, delay: i, type: s, repeat: o, repeatDelay: l, repeatType: u, ...c }), this.updateFinishedPromise();
  }
  calcStartTime() {
      return this.resolvedAt ? (this.resolvedAt - this.createdAt > n3 ? this.resolvedAt : this.createdAt) : this.createdAt;
  }
  get resolved() {
      return !this._resolved && !this.hasAttemptedResolve && D_(), this._resolved;
  }
  onKeyframesResolved(e, i) {
      (this.resolvedAt = Rn.now()), (this.hasAttemptedResolve = !0);
      const { name: s, type: o, velocity: l, delay: u, onComplete: c, onUpdate: d, isGenerator: h } = this.options;
      if (!h && !t3(e, s, o, l))
          if (u) this.options.duration = 0;
          else {
              d == null || d(Ol(e, this.options, i)), c == null || c(), this.resolveFinishedPromise();
              return;
          }
      const m = this.initPlayback(e, i);
      m !== !1 && ((this._resolved = { keyframes: e, finalKeyframe: i, ...m }), this.onPostResolved());
  }
  onPostResolved() {}
  then(e, i) {
      return this.currentFinishedPromise.then(e, i);
  }
  flatten() {
      (this.options.type = "keyframes"), (this.options.ease = "linear");
  }
  updateFinishedPromise() {
      this.currentFinishedPromise = new Promise((e) => {
          this.resolveFinishedPromise = e;
      });
  }
}
const tr = (t, e, i) => {
      const s = e - t;
      return s === 0 ? 1 : (i - t) / s;
  },
  Y0 = (t, e, i = 10) => {
      let s = "";
      const o = Math.max(Math.round(e / i), 2);
      for (let l = 0; l < o; l++) s += t(tr(0, o - 1, l)) + ", ";
      return `linear(${s.substring(0, s.length - 2)})`;
  };
function Q0(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const i3 = 5;
function X0(t, e, i) {
  const s = Math.max(e - i3, 0);
  return Q0(i - t(s), e - s);
}
const Ue = {
      stiffness: 100,
      damping: 10,
      mass: 1,
      velocity: 0,
      duration: 800,
      bounce: 0.3,
      visualDuration: 0.3,
      restSpeed: { granular: 0.01, default: 2 },
      restDelta: { granular: 0.005, default: 0.5 },
      minDuration: 0.01,
      maxDuration: 10,
      minDamping: 0.05,
      maxDamping: 1,
  },
  tf = 0.001;
function r3({ duration: t = Ue.duration, bounce: e = Ue.bounce, velocity: i = Ue.velocity, mass: s = Ue.mass }) {
  let o,
      l,
      u = 1 - e;
  (u = Wn(Ue.minDamping, Ue.maxDamping, u)),
      (t = Wn(Ue.minDuration, Ue.maxDuration, En(t))),
      u < 1
          ? ((o = (h) => {
                const m = h * u,
                    y = m * t,
                    v = m - i,
                    w = zf(h, u),
                    S = Math.exp(-y);
                return tf - (v / w) * S;
            }),
            (l = (h) => {
                const y = h * u * t,
                    v = y * i + i,
                    w = Math.pow(u, 2) * Math.pow(h, 2) * t,
                    S = Math.exp(-y),
                    b = zf(Math.pow(h, 2), u);
                return ((-o(h) + tf > 0 ? -1 : 1) * ((v - w) * S)) / b;
            }))
          : ((o = (h) => {
                const m = Math.exp(-h * t),
                    y = (h - i) * t + 1;
                return -tf + m * y;
            }),
            (l = (h) => {
                const m = Math.exp(-h * t),
                    y = (i - h) * (t * t);
                return m * y;
            }));
  const c = 5 / t,
      d = o3(o, l, c);
  if (((t = Tn(t)), isNaN(d))) return { stiffness: Ue.stiffness, damping: Ue.damping, duration: t };
  {
      const h = Math.pow(d, 2) * s;
      return { stiffness: h, damping: u * 2 * Math.sqrt(s * h), duration: t };
  }
}
const s3 = 12;
function o3(t, e, i) {
  let s = i;
  for (let o = 1; o < s3; o++) s = s - t(s) / e(s);
  return s;
}
function zf(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const ml = 2e4;
function Ed(t) {
  let e = 0;
  const i = 50;
  let s = t.next(e);
  for (; !s.done && e < ml; ) (e += i), (s = t.next(e));
  return e >= ml ? 1 / 0 : e;
}
const a3 = ["duration", "bounce"],
  l3 = ["stiffness", "damping", "mass"];
function dy(t, e) {
  return e.some((i) => t[i] !== void 0);
}
function u3(t) {
  let e = { velocity: Ue.velocity, stiffness: Ue.stiffness, damping: Ue.damping, mass: Ue.mass, isResolvedFromDuration: !1, ...t };
  if (!dy(t, l3) && dy(t, a3))
      if (t.visualDuration) {
          const i = t.visualDuration,
              s = (2 * Math.PI) / (i * 1.2),
              o = s * s,
              l = 2 * Wn(0.05, 1, 1 - t.bounce) * Math.sqrt(o);
          e = { ...e, mass: Ue.mass, stiffness: o, damping: l };
      } else {
          const i = r3(t);
          (e = { ...e, ...i, mass: Ue.mass }), (e.isResolvedFromDuration = !0);
      }
  return e;
}
function _d(t = Ue.visualDuration, e = Ue.bounce) {
  const i = typeof t != "object" ? { visualDuration: t, keyframes: [0, 1], bounce: e } : t;
  let { restSpeed: s, restDelta: o } = i;
  const l = i.keyframes[0],
      u = i.keyframes[i.keyframes.length - 1],
      c = { done: !1, value: l },
      { stiffness: d, damping: h, mass: m, duration: y, velocity: v, isResolvedFromDuration: w } = u3({ ...i, velocity: -En(i.velocity || 0) }),
      S = v || 0,
      b = h / (2 * Math.sqrt(d * m)),
      C = u - l,
      P = En(Math.sqrt(d / m)),
      E = Math.abs(C) < 5;
  s || (s = E ? Ue.restSpeed.granular : Ue.restSpeed.default), o || (o = E ? Ue.restDelta.granular : Ue.restDelta.default);
  let D;
  if (b < 1) {
      const z = zf(P, b);
      D = (N) => {
          const Q = Math.exp(-b * P * N);
          return u - Q * (((S + b * P * C) / z) * Math.sin(z * N) + C * Math.cos(z * N));
      };
  } else if (b === 1) D = (z) => u - Math.exp(-P * z) * (C + (S + P * C) * z);
  else {
      const z = P * Math.sqrt(b * b - 1);
      D = (N) => {
          const Q = Math.exp(-b * P * N),
              q = Math.min(z * N, 300);
          return u - (Q * ((S + b * P * C) * Math.sinh(q) + z * C * Math.cosh(q))) / z;
      };
  }
  const I = {
      calculatedDuration: (w && y) || null,
      next: (z) => {
          const N = D(z);
          if (w) c.done = z >= y;
          else {
              let Q = 0;
              b < 1 && (Q = z === 0 ? Tn(S) : X0(D, z, N));
              const q = Math.abs(Q) <= s,
                  K = Math.abs(u - N) <= o;
              c.done = q && K;
          }
          return (c.value = c.done ? u : N), c;
      },
      toString: () => {
          const z = Math.min(Ed(I), ml),
              N = Y0((Q) => I.next(z * Q).value, z, 30);
          return z + "ms " + N;
      },
  };
  return I;
}
function hy({ keyframes: t, velocity: e = 0, power: i = 0.8, timeConstant: s = 325, bounceDamping: o = 10, bounceStiffness: l = 500, modifyTarget: u, min: c, max: d, restDelta: h = 0.5, restSpeed: m }) {
  const y = t[0],
      v = { done: !1, value: y },
      w = (q) => (c !== void 0 && q < c) || (d !== void 0 && q > d),
      S = (q) => (c === void 0 ? d : d === void 0 || Math.abs(c - q) < Math.abs(d - q) ? c : d);
  let b = i * e;
  const C = y + b,
      P = u === void 0 ? C : u(C);
  P !== C && (b = P - y);
  const E = (q) => -b * Math.exp(-q / s),
      D = (q) => P + E(q),
      I = (q) => {
          const K = E(q),
              ie = D(q);
          (v.done = Math.abs(K) <= h), (v.value = v.done ? P : ie);
      };
  let z, N;
  const Q = (q) => {
      w(v.value) && ((z = q), (N = _d({ keyframes: [v.value, S(v.value)], velocity: X0(D, q, v.value), damping: o, stiffness: l, restDelta: h, restSpeed: m })));
  };
  return (
      Q(0),
      {
          calculatedDuration: null,
          next: (q) => {
              let K = !1;
              return !N && z === void 0 && ((K = !0), I(q), Q(q)), z !== void 0 && q >= z ? N.next(q - z) : (!K && I(q), v);
          },
      }
  );
}
const c3 = _o(0.42, 0, 1, 1),
  f3 = _o(0, 0, 0.58, 1),
  Z0 = _o(0.42, 0, 0.58, 1),
  J0 = (t) => Array.isArray(t) && typeof t[0] != "number",
  Rd = (t) => Array.isArray(t) && typeof t[0] == "number",
  py = { linear: Ft, easeIn: c3, easeInOut: Z0, easeOut: f3, circIn: wd, circInOut: A0, circOut: M0, backIn: xd, backInOut: _0, backOut: E0, anticipate: R0 },
  Nf = (t) => {
      if (Rd(t)) {
          Of(t.length === 4);
          const [e, i, s, o] = t;
          return _o(e, i, s, o);
      } else if (typeof t == "string") return Of(py[t] !== void 0), py[t];
      return t;
  },
  d3 = (t, e) => (i) => e(t(i)),
  Mo = (...t) => t.reduce(d3),
  je = (t, e, i) => t + (e - t) * i;
function nf(t, e, i) {
  return i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6 ? t + (e - t) * 6 * i : i < 1 / 2 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t;
}
function h3({ hue: t, saturation: e, lightness: i, alpha: s }) {
  (t /= 360), (e /= 100), (i /= 100);
  let o = 0,
      l = 0,
      u = 0;
  if (!e) o = l = u = i;
  else {
      const c = i < 0.5 ? i * (1 + e) : i + e - i * e,
          d = 2 * i - c;
      (o = nf(d, c, t + 1 / 3)), (l = nf(d, c, t)), (u = nf(d, c, t - 1 / 3));
  }
  return { red: Math.round(o * 255), green: Math.round(l * 255), blue: Math.round(u * 255), alpha: s };
}
function gl(t, e) {
  return (i) => (i > 0 ? e : t);
}
const rf = (t, e, i) => {
      const s = t * t,
          o = i * (e * e - s) + s;
      return o < 0 ? 0 : Math.sqrt(o);
  },
  p3 = [If, Ki, jr],
  m3 = (t) => p3.find((e) => e.test(t));
function my(t) {
  const e = m3(t);
  if (!e) return !1;
  let i = e.parse(t);
  return e === jr && (i = h3(i)), i;
}
const gy = (t, e) => {
      const i = my(t),
          s = my(e);
      if (!i || !s) return gl(t, e);
      const o = { ...i };
      return (l) => ((o.red = rf(i.red, s.red, l)), (o.green = rf(i.green, s.green, l)), (o.blue = rf(i.blue, s.blue, l)), (o.alpha = je(i.alpha, s.alpha, l)), Ki.transform(o));
  },
  Ff = new Set(["none", "hidden"]);
function g3(t, e) {
  return Ff.has(t) ? (i) => (i <= 0 ? t : e) : (i) => (i >= 1 ? e : t);
}
function y3(t, e) {
  return (i) => je(t, e, i);
}
function Md(t) {
  return typeof t == "number" ? y3 : typeof t == "string" ? (Sd(t) ? gl : pt.test(t) ? gy : w3) : Array.isArray(t) ? ex : typeof t == "object" ? (pt.test(t) ? gy : v3) : gl;
}
function ex(t, e) {
  const i = [...t],
      s = i.length,
      o = t.map((l, u) => Md(l)(l, e[u]));
  return (l) => {
      for (let u = 0; u < s; u++) i[u] = o[u](l);
      return i;
  };
}
function v3(t, e) {
  const i = { ...t, ...e },
      s = {};
  for (const o in i) t[o] !== void 0 && e[o] !== void 0 && (s[o] = Md(t[o])(t[o], e[o]));
  return (o) => {
      for (const l in s) i[l] = s[l](o);
      return i;
  };
}
function x3(t, e) {
  var i;
  const s = [],
      o = { color: 0, var: 0, number: 0 };
  for (let l = 0; l < e.values.length; l++) {
      const u = e.types[l],
          c = t.indexes[u][o[u]],
          d = (i = t.values[c]) !== null && i !== void 0 ? i : 0;
      (s[l] = d), o[u]++;
  }
  return s;
}
const w3 = (t, e) => {
  const i = xi.createTransformer(e),
      s = vo(t),
      o = vo(e);
  return s.indexes.var.length === o.indexes.var.length && s.indexes.color.length === o.indexes.color.length && s.indexes.number.length >= o.indexes.number.length
      ? (Ff.has(t) && !o.values.length) || (Ff.has(e) && !s.values.length)
          ? g3(t, e)
          : Mo(ex(x3(s, o), o.values), i)
      : gl(t, e);
};
function tx(t, e, i) {
  return typeof t == "number" && typeof e == "number" && typeof i == "number" ? je(t, e, i) : Md(t)(t, e);
}
function S3(t, e, i) {
  const s = [],
      o = i || tx,
      l = t.length - 1;
  for (let u = 0; u < l; u++) {
      let c = o(t[u], t[u + 1]);
      if (e) {
          const d = Array.isArray(e) ? e[u] || Ft : e;
          c = Mo(d, c);
      }
      s.push(c);
  }
  return s;
}
function b3(t, e, { clamp: i = !0, ease: s, mixer: o } = {}) {
  const l = t.length;
  if ((Of(l === e.length), l === 1)) return () => e[0];
  if (l === 2 && t[0] === t[1]) return () => e[1];
  t[0] > t[l - 1] && ((t = [...t].reverse()), (e = [...e].reverse()));
  const u = S3(e, s, o),
      c = u.length,
      d = (h) => {
          let m = 0;
          if (c > 1) for (; m < t.length - 2 && !(h < t[m + 1]); m++);
          const y = tr(t[m], t[m + 1], h);
          return u[m](y);
      };
  return i ? (h) => d(Wn(t[0], t[l - 1], h)) : d;
}
function nx(t, e) {
  const i = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
      const o = tr(0, e, s);
      t.push(je(i, 1, o));
  }
}
function ix(t) {
  const e = [0];
  return nx(e, t.length - 1), e;
}
function C3(t, e) {
  return t.map((i) => i * e);
}
function k3(t, e) {
  return t.map(() => e || Z0).splice(0, t.length - 1);
}
function yl({ duration: t = 300, keyframes: e, times: i, ease: s = "easeInOut" }) {
  const o = J0(s) ? s.map(Nf) : Nf(s),
      l = { done: !1, value: e[0] },
      u = C3(i && i.length === e.length ? i : ix(e), t),
      c = b3(u, e, { ease: Array.isArray(o) ? o : k3(e, o) });
  return { calculatedDuration: t, next: (d) => ((l.value = c(d)), (l.done = d >= t), l) };
}
const P3 = (t) => {
      const e = ({ timestamp: i }) => t(i);
      return { start: () => Oe.update(e, !0), stop: () => vi(e), now: () => (lt.isProcessing ? lt.timestamp : Rn.now()) };
  },
  T3 = { decay: hy, inertia: hy, tween: yl, keyframes: yl, spring: _d },
  E3 = (t) => t / 100;
class Ad extends G0 {
  constructor(e) {
      super(e),
          (this.holdTime = null),
          (this.cancelTime = null),
          (this.currentTime = 0),
          (this.playbackSpeed = 1),
          (this.pendingPlayState = "running"),
          (this.startTime = null),
          (this.state = "idle"),
          (this.stop = () => {
              if ((this.resolver.cancel(), (this.isStopped = !0), this.state === "idle")) return;
              this.teardown();
              const { onStop: d } = this.options;
              d && d();
          });
      const { name: i, motionValue: s, element: o, keyframes: l } = this.options,
          u = (o == null ? void 0 : o.KeyframeResolver) || bd,
          c = (d, h) => this.onKeyframesResolved(d, h);
      (this.resolver = new u(l, c, i, s, o)), this.resolver.scheduleResolve();
  }
  flatten() {
      super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(e) {
      const { type: i = "keyframes", repeat: s = 0, repeatDelay: o = 0, repeatType: l, velocity: u = 0 } = this.options,
          c = Dl(i) ? i : T3[i] || yl;
      let d, h;
      c !== yl && typeof e[0] != "number" && ((d = Mo(E3, tx(e[0], e[1]))), (e = [0, 100]));
      const m = c({ ...this.options, keyframes: e });
      l === "mirror" && (h = c({ ...this.options, keyframes: [...e].reverse(), velocity: -u })), m.calculatedDuration === null && (m.calculatedDuration = Ed(m));
      const { calculatedDuration: y } = m,
          v = y + o,
          w = v * (s + 1) - o;
      return { generator: m, mirroredGenerator: h, mapPercentToKeyframes: d, calculatedDuration: y, resolvedDuration: v, totalDuration: w };
  }
  onPostResolved() {
      const { autoplay: e = !0 } = this.options;
      this.play(), this.pendingPlayState === "paused" || !e ? this.pause() : (this.state = this.pendingPlayState);
  }
  tick(e, i = !1) {
      const { resolved: s } = this;
      if (!s) {
          const { keyframes: q } = this.options;
          return { done: !0, value: q[q.length - 1] };
      }
      const { finalKeyframe: o, generator: l, mirroredGenerator: u, mapPercentToKeyframes: c, keyframes: d, calculatedDuration: h, totalDuration: m, resolvedDuration: y } = s;
      if (this.startTime === null) return l.next(0);
      const { delay: v, repeat: w, repeatType: S, repeatDelay: b, onUpdate: C } = this.options;
      this.speed > 0 ? (this.startTime = Math.min(this.startTime, e)) : this.speed < 0 && (this.startTime = Math.min(e - m / this.speed, this.startTime)),
          i ? (this.currentTime = e) : this.holdTime !== null ? (this.currentTime = this.holdTime) : (this.currentTime = Math.round(e - this.startTime) * this.speed);
      const P = this.currentTime - v * (this.speed >= 0 ? 1 : -1),
          E = this.speed >= 0 ? P < 0 : P > m;
      (this.currentTime = Math.max(P, 0)), this.state === "finished" && this.holdTime === null && (this.currentTime = m);
      let D = this.currentTime,
          I = l;
      if (w) {
          const q = Math.min(this.currentTime, m) / y;
          let K = Math.floor(q),
              ie = q % 1;
          !ie && q >= 1 && (ie = 1), ie === 1 && K--, (K = Math.min(K, w + 1)), !!(K % 2) && (S === "reverse" ? ((ie = 1 - ie), b && (ie -= b / y)) : S === "mirror" && (I = u)), (D = Wn(0, 1, ie) * y);
      }
      const z = E ? { done: !1, value: d[0] } : I.next(D);
      c && (z.value = c(z.value));
      let { done: N } = z;
      !E && h !== null && (N = this.speed >= 0 ? this.currentTime >= m : this.currentTime <= 0);
      const Q = this.holdTime === null && (this.state === "finished" || (this.state === "running" && N));
      return Q && o !== void 0 && (z.value = Ol(d, this.options, o)), C && C(z.value), Q && this.finish(), z;
  }
  get duration() {
      const { resolved: e } = this;
      return e ? En(e.calculatedDuration) : 0;
  }
  get time() {
      return En(this.currentTime);
  }
  set time(e) {
      (e = Tn(e)), (this.currentTime = e), this.holdTime !== null || this.speed === 0 ? (this.holdTime = e) : this.driver && (this.startTime = this.driver.now() - e / this.speed);
  }
  get speed() {
      return this.playbackSpeed;
  }
  set speed(e) {
      const i = this.playbackSpeed !== e;
      (this.playbackSpeed = e), i && (this.time = En(this.currentTime));
  }
  play() {
      if ((this.resolver.isScheduled || this.resolver.resume(), !this._resolved)) {
          this.pendingPlayState = "running";
          return;
      }
      if (this.isStopped) return;
      const { driver: e = P3, onPlay: i, startTime: s } = this.options;
      this.driver || (this.driver = e((l) => this.tick(l))), i && i();
      const o = this.driver.now();
      this.holdTime !== null ? (this.startTime = o - this.holdTime) : this.startTime ? this.state === "finished" && (this.startTime = o) : (this.startTime = s ?? this.calcStartTime()),
          this.state === "finished" && this.updateFinishedPromise(),
          (this.cancelTime = this.startTime),
          (this.holdTime = null),
          (this.state = "running"),
          this.driver.start();
  }
  pause() {
      var e;
      if (!this._resolved) {
          this.pendingPlayState = "paused";
          return;
      }
      (this.state = "paused"), (this.holdTime = (e = this.currentTime) !== null && e !== void 0 ? e : 0);
  }
  complete() {
      this.state !== "running" && this.play(), (this.pendingPlayState = this.state = "finished"), (this.holdTime = null);
  }
  finish() {
      this.teardown(), (this.state = "finished");
      const { onComplete: e } = this.options;
      e && e();
  }
  cancel() {
      this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
  }
  teardown() {
      (this.state = "idle"), this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), (this.startTime = this.cancelTime = null), this.resolver.cancel();
  }
  stopDriver() {
      this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(e) {
      return (this.startTime = 0), this.tick(e, !0);
  }
}
const _3 = new Set(["opacity", "clipPath", "filter", "transform"]);
function Od(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const R3 = { linearEasing: void 0 };
function M3(t, e) {
  const i = Od(t);
  return () => {
      var s;
      return (s = R3[e]) !== null && s !== void 0 ? s : i();
  };
}
const vl = M3(() => {
  try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
      return !1;
  }
  return !0;
}, "linearEasing");
function rx(t) {
  return !!((typeof t == "function" && vl()) || !t || (typeof t == "string" && (t in Vf || vl())) || Rd(t) || (Array.isArray(t) && t.every(rx)));
}
const no = ([t, e, i, s]) => `cubic-bezier(${t}, ${e}, ${i}, ${s})`,
  Vf = {
      linear: "linear",
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      circIn: no([0, 0.65, 0.55, 1]),
      circOut: no([0.55, 0, 1, 0.45]),
      backIn: no([0.31, 0.01, 0.66, -0.59]),
      backOut: no([0.33, 1.53, 0.69, 0.99]),
  };
function sx(t, e) {
  if (t) return typeof t == "function" && vl() ? Y0(t, e) : Rd(t) ? no(t) : Array.isArray(t) ? t.map((i) => sx(i, e) || Vf.easeOut) : Vf[t];
}
function A3(t, e, i, { delay: s = 0, duration: o = 300, repeat: l = 0, repeatType: u = "loop", ease: c = "easeInOut", times: d } = {}) {
  const h = { [e]: i };
  d && (h.offset = d);
  const m = sx(c, o);
  return Array.isArray(m) && (h.easing = m), t.animate(h, { delay: s, duration: o, easing: Array.isArray(m) ? "linear" : m, fill: "both", iterations: l + 1, direction: u === "reverse" ? "alternate" : "normal" });
}
function yy(t, e) {
  (t.timeline = e), (t.onfinish = null);
}
const O3 = Od(() => Object.hasOwnProperty.call(Element.prototype, "animate")),
  xl = 10,
  D3 = 2e4;
function L3(t) {
  return Dl(t.type) || t.type === "spring" || !rx(t.ease);
}
function I3(t, e) {
  const i = new Ad({ ...e, keyframes: t, repeat: 0, delay: 0, isGenerator: !0 });
  let s = { done: !1, value: t[0] };
  const o = [];
  let l = 0;
  for (; !s.done && l < D3; ) (s = i.sample(l)), o.push(s.value), (l += xl);
  return { times: void 0, keyframes: o, duration: l - xl, ease: "linear" };
}
const ox = { anticipate: R0, backInOut: _0, circInOut: A0 };
function j3(t) {
  return t in ox;
}
class vy extends G0 {
  constructor(e) {
      super(e);
      const { name: i, motionValue: s, element: o, keyframes: l } = this.options;
      (this.resolver = new K0(l, (u, c) => this.onKeyframesResolved(u, c), i, s, o)), this.resolver.scheduleResolve();
  }
  initPlayback(e, i) {
      var s;
      let { duration: o = 300, times: l, ease: u, type: c, motionValue: d, name: h, startTime: m } = this.options;
      if (!(!((s = d.owner) === null || s === void 0) && s.current)) return !1;
      if ((typeof u == "string" && vl() && j3(u) && (u = ox[u]), L3(this.options))) {
          const { onComplete: v, onUpdate: w, motionValue: S, element: b, ...C } = this.options,
              P = I3(e, C);
          (e = P.keyframes), e.length === 1 && (e[1] = e[0]), (o = P.duration), (l = P.times), (u = P.ease), (c = "keyframes");
      }
      const y = A3(d.owner.current, h, e, { ...this.options, duration: o, times: l, ease: u });
      return (
          (y.startTime = m ?? this.calcStartTime()),
          this.pendingTimeline
              ? (yy(y, this.pendingTimeline), (this.pendingTimeline = void 0))
              : (y.onfinish = () => {
                    const { onComplete: v } = this.options;
                    d.set(Ol(e, this.options, i)), v && v(), this.cancel(), this.resolveFinishedPromise();
                }),
          { animation: y, duration: o, times: l, type: c, ease: u, keyframes: e }
      );
  }
  get duration() {
      const { resolved: e } = this;
      if (!e) return 0;
      const { duration: i } = e;
      return En(i);
  }
  get time() {
      const { resolved: e } = this;
      if (!e) return 0;
      const { animation: i } = e;
      return En(i.currentTime || 0);
  }
  set time(e) {
      const { resolved: i } = this;
      if (!i) return;
      const { animation: s } = i;
      s.currentTime = Tn(e);
  }
  get speed() {
      const { resolved: e } = this;
      if (!e) return 1;
      const { animation: i } = e;
      return i.playbackRate;
  }
  set speed(e) {
      const { resolved: i } = this;
      if (!i) return;
      const { animation: s } = i;
      s.playbackRate = e;
  }
  get state() {
      const { resolved: e } = this;
      if (!e) return "idle";
      const { animation: i } = e;
      return i.playState;
  }
  get startTime() {
      const { resolved: e } = this;
      if (!e) return null;
      const { animation: i } = e;
      return i.startTime;
  }
  attachTimeline(e) {
      if (!this._resolved) this.pendingTimeline = e;
      else {
          const { resolved: i } = this;
          if (!i) return Ft;
          const { animation: s } = i;
          yy(s, e);
      }
      return Ft;
  }
  play() {
      if (this.isStopped) return;
      const { resolved: e } = this;
      if (!e) return;
      const { animation: i } = e;
      i.playState === "finished" && this.updateFinishedPromise(), i.play();
  }
  pause() {
      const { resolved: e } = this;
      if (!e) return;
      const { animation: i } = e;
      i.pause();
  }
  stop() {
      if ((this.resolver.cancel(), (this.isStopped = !0), this.state === "idle")) return;
      this.resolveFinishedPromise(), this.updateFinishedPromise();
      const { resolved: e } = this;
      if (!e) return;
      const { animation: i, keyframes: s, duration: o, type: l, ease: u, times: c } = e;
      if (i.playState === "idle" || i.playState === "finished") return;
      if (this.time) {
          const { motionValue: h, onUpdate: m, onComplete: y, element: v, ...w } = this.options,
              S = new Ad({ ...w, keyframes: s, duration: o, type: l, ease: u, times: c, isGenerator: !0 }),
              b = Tn(this.time);
          h.setWithVelocity(S.sample(b - xl).value, S.sample(b).value, xl);
      }
      const { onStop: d } = this.options;
      d && d(), this.cancel();
  }
  complete() {
      const { resolved: e } = this;
      e && e.animation.finish();
  }
  cancel() {
      const { resolved: e } = this;
      e && e.animation.cancel();
  }
  static supports(e) {
      const { motionValue: i, name: s, repeatDelay: o, repeatType: l, damping: u, type: c } = e;
      return O3() && s && _3.has(s) && i && i.owner && i.owner.current instanceof HTMLElement && !i.owner.getProps().onUpdate && !o && l !== "mirror" && u !== 0 && c !== "inertia";
  }
}
const z3 = Od(() => window.ScrollTimeline !== void 0);
class ax {
  constructor(e) {
      (this.stop = () => this.runAll("stop")), (this.animations = e.filter(Boolean));
  }
  then(e, i) {
      return Promise.all(this.animations).then(e).catch(i);
  }
  getAll(e) {
      return this.animations[0][e];
  }
  setAll(e, i) {
      for (let s = 0; s < this.animations.length; s++) this.animations[s][e] = i;
  }
  attachTimeline(e, i) {
      const s = this.animations.map((o) => (z3() && o.attachTimeline ? o.attachTimeline(e) : i(o)));
      return () => {
          s.forEach((o, l) => {
              o && o(), this.animations[l].stop();
          });
      };
  }
  get time() {
      return this.getAll("time");
  }
  set time(e) {
      this.setAll("time", e);
  }
  get speed() {
      return this.getAll("speed");
  }
  set speed(e) {
      this.setAll("speed", e);
  }
  get startTime() {
      return this.getAll("startTime");
  }
  get duration() {
      let e = 0;
      for (let i = 0; i < this.animations.length; i++) e = Math.max(e, this.animations[i].duration);
      return e;
  }
  runAll(e) {
      this.animations.forEach((i) => i[e]());
  }
  flatten() {
      this.runAll("flatten");
  }
  play() {
      this.runAll("play");
  }
  pause() {
      this.runAll("pause");
  }
  cancel() {
      this.runAll("cancel");
  }
  complete() {
      this.runAll("complete");
  }
}
function N3({ when: t, delay: e, delayChildren: i, staggerChildren: s, staggerDirection: o, repeat: l, repeatType: u, repeatDelay: c, from: d, elapsed: h, ...m }) {
  return !!Object.keys(m).length;
}
const Dd = (t, e, i, s = {}, o, l) => (u) => {
      const c = vd(s, t) || {},
          d = c.delay || s.delay || 0;
      let { elapsed: h = 0 } = s;
      h = h - Tn(d);
      let m = {
          keyframes: Array.isArray(i) ? i : [null, i],
          ease: "easeOut",
          velocity: e.getVelocity(),
          ...c,
          delay: -h,
          onUpdate: (v) => {
              e.set(v), c.onUpdate && c.onUpdate(v);
          },
          onComplete: () => {
              u(), c.onComplete && c.onComplete();
          },
          name: t,
          motionValue: e,
          element: l ? void 0 : o,
      };
      N3(c) || (m = { ...m, ...h_(t, m) }), m.duration && (m.duration = Tn(m.duration)), m.repeatDelay && (m.repeatDelay = Tn(m.repeatDelay)), m.from !== void 0 && (m.keyframes[0] = m.from);
      let y = !1;
      if (((m.type === !1 || (m.duration === 0 && !m.repeatDelay)) && ((m.duration = 0), m.delay === 0 && (y = !0)), y && !l && e.get() !== void 0)) {
          const v = Ol(m.keyframes, c);
          if (v !== void 0)
              return (
                  Oe.update(() => {
                      m.onUpdate(v), m.onComplete();
                  }),
                  new ax([])
              );
      }
      return !l && vy.supports(m) ? new vy(m) : new Ad(m);
  },
  F3 = (t) => !!(t && typeof t == "object" && t.mix && t.toValue),
  V3 = (t) => (Af(t) ? t[t.length - 1] || 0 : t);
function Ld(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function Ll(t, e) {
  const i = t.indexOf(e);
  i > -1 && t.splice(i, 1);
}
class Id {
  constructor() {
      this.subscriptions = [];
  }
  add(e) {
      return Ld(this.subscriptions, e), () => Ll(this.subscriptions, e);
  }
  notify(e, i, s) {
      const o = this.subscriptions.length;
      if (o)
          if (o === 1) this.subscriptions[0](e, i, s);
          else
              for (let l = 0; l < o; l++) {
                  const u = this.subscriptions[l];
                  u && u(e, i, s);
              }
  }
  getSize() {
      return this.subscriptions.length;
  }
  clear() {
      this.subscriptions.length = 0;
  }
}
const xy = 30,
  B3 = (t) => !isNaN(parseFloat(t));
class $3 {
  constructor(e, i = {}) {
      (this.version = "11.15.0"),
          (this.canTrackVelocity = null),
          (this.events = {}),
          (this.updateAndNotify = (s, o = !0) => {
              const l = Rn.now();
              this.updatedAt !== l && this.setPrevFrameValue(),
                  (this.prev = this.current),
                  this.setCurrent(s),
                  this.current !== this.prev && this.events.change && this.events.change.notify(this.current),
                  o && this.events.renderRequest && this.events.renderRequest.notify(this.current);
          }),
          (this.hasAnimated = !1),
          this.setCurrent(e),
          (this.owner = i.owner);
  }
  setCurrent(e) {
      (this.current = e), (this.updatedAt = Rn.now()), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = B3(this.current));
  }
  setPrevFrameValue(e = this.current) {
      (this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt);
  }
  onChange(e) {
      return this.on("change", e);
  }
  on(e, i) {
      this.events[e] || (this.events[e] = new Id());
      const s = this.events[e].add(i);
      return e === "change"
          ? () => {
                s(),
                    Oe.read(() => {
                        this.events.change.getSize() || this.stop();
                    });
            }
          : s;
  }
  clearListeners() {
      for (const e in this.events) this.events[e].clear();
  }
  attach(e, i) {
      (this.passiveEffect = e), (this.stopPassiveEffect = i);
  }
  set(e, i = !0) {
      !i || !this.passiveEffect ? this.updateAndNotify(e, i) : this.passiveEffect(e, this.updateAndNotify);
  }
  setWithVelocity(e, i, s) {
      this.set(i), (this.prev = void 0), (this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt - s);
  }
  jump(e, i = !0) {
      this.updateAndNotify(e), (this.prev = e), (this.prevUpdatedAt = this.prevFrameValue = void 0), i && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  get() {
      return this.current;
  }
  getPrevious() {
      return this.prev;
  }
  getVelocity() {
      const e = Rn.now();
      if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > xy) return 0;
      const i = Math.min(this.updatedAt - this.prevUpdatedAt, xy);
      return Q0(parseFloat(this.current) - parseFloat(this.prevFrameValue), i);
  }
  start(e) {
      return (
          this.stop(),
          new Promise((i) => {
              (this.hasAnimated = !0), (this.animation = e(i)), this.events.animationStart && this.events.animationStart.notify();
          }).then(() => {
              this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
          })
      );
  }
  stop() {
      this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  isAnimating() {
      return !!this.animation;
  }
  clearAnimation() {
      delete this.animation;
  }
  destroy() {
      this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function xo(t, e) {
  return new $3(t, e);
}
function U3(t, e, i) {
  t.hasValue(e) ? t.getValue(e).set(i) : t.addValue(e, xo(i));
}
function H3(t, e) {
  const i = Al(t, e);
  let { transitionEnd: s = {}, transition: o = {}, ...l } = i || {};
  l = { ...l, ...s };
  for (const u in l) {
      const c = V3(l[u]);
      U3(t, u, c);
  }
}
const jd = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(),
  W3 = "framerAppearId",
  lx = "data-" + jd(W3);
function ux(t) {
  return t.props[lx];
}
const it = (t) => !!(t && t.getVelocity);
function q3(t) {
  return !!(it(t) && t.add);
}
function Bf(t, e) {
  const i = t.getValue("willChange");
  if (q3(i)) return i.add(e);
}
function K3({ protectedKeys: t, needsAnimating: e }, i) {
  const s = t.hasOwnProperty(i) && e[i] !== !0;
  return (e[i] = !1), s;
}
function zd(t, e, { delay: i = 0, transitionOverride: s, type: o } = {}) {
  var l;
  let { transition: u = t.getDefaultTransition(), transitionEnd: c, ...d } = e;
  s && (u = s);
  const h = [],
      m = o && t.animationState && t.animationState.getState()[o];
  for (const y in d) {
      const v = t.getValue(y, (l = t.latestValues[y]) !== null && l !== void 0 ? l : null),
          w = d[y];
      if (w === void 0 || (m && K3(m, y))) continue;
      const S = { delay: i, ...vd(u || {}, y) };
      let b = !1;
      if (window.MotionHandoffAnimation) {
          const P = ux(t);
          if (P) {
              const E = window.MotionHandoffAnimation(P, y, Oe);
              E !== null && ((S.startTime = E), (b = !0));
          }
      }
      Bf(t, y), v.start(Dd(y, v, w, t.shouldReduceMotion && ir.has(y) ? { type: !1 } : S, t, b));
      const C = v.animation;
      C && h.push(C);
  }
  return (
      c &&
          Promise.all(h).then(() => {
              Oe.update(() => {
                  c && H3(t, c);
              });
          }),
      h
  );
}
function $f(t, e, i = {}) {
  var s;
  const o = Al(t, e, i.type === "exit" ? ((s = t.presenceContext) === null || s === void 0 ? void 0 : s.custom) : void 0);
  let { transition: l = t.getDefaultTransition() || {} } = o || {};
  i.transitionOverride && (l = i.transitionOverride);
  const u = o ? () => Promise.all(zd(t, o, i)) : () => Promise.resolve(),
      c =
          t.variantChildren && t.variantChildren.size
              ? (h = 0) => {
                    const { delayChildren: m = 0, staggerChildren: y, staggerDirection: v } = l;
                    return G3(t, e, m + h, y, v, i);
                }
              : () => Promise.resolve(),
      { when: d } = l;
  if (d) {
      const [h, m] = d === "beforeChildren" ? [u, c] : [c, u];
      return h().then(() => m());
  } else return Promise.all([u(), c(i.delay)]);
}
function G3(t, e, i = 0, s = 0, o = 1, l) {
  const u = [],
      c = (t.variantChildren.size - 1) * s,
      d = o === 1 ? (h = 0) => h * s : (h = 0) => c - h * s;
  return (
      Array.from(t.variantChildren)
          .sort(Y3)
          .forEach((h, m) => {
              h.notify("AnimationStart", e), u.push($f(h, e, { ...l, delay: i + d(m) }).then(() => h.notify("AnimationComplete", e)));
          }),
      Promise.all(u)
  );
}
function Y3(t, e) {
  return t.sortNodePosition(e);
}
function Q3(t, e, i = {}) {
  t.notify("AnimationStart", e);
  let s;
  if (Array.isArray(e)) {
      const o = e.map((l) => $f(t, l, i));
      s = Promise.all(o);
  } else if (typeof e == "string") s = $f(t, e, i);
  else {
      const o = typeof e == "function" ? Al(t, e, i.custom) : e;
      s = Promise.all(zd(t, o, i));
  }
  return s.then(() => {
      t.notify("AnimationComplete", e);
  });
}
const X3 = yd.length;
function cx(t) {
  if (!t) return;
  if (!t.isControllingVariants) {
      const i = t.parent ? cx(t.parent) || {} : {};
      return t.props.initial !== void 0 && (i.initial = t.props.initial), i;
  }
  const e = {};
  for (let i = 0; i < X3; i++) {
      const s = yd[i],
          o = t.props[s];
      (go(o) || o === !1) && (e[s] = o);
  }
  return e;
}
const Z3 = [...gd].reverse(),
  J3 = gd.length;
function eR(t) {
  return (e) => Promise.all(e.map(({ animation: i, options: s }) => Q3(t, i, s)));
}
function tR(t) {
  let e = eR(t),
      i = wy(),
      s = !0;
  const o = (d) => (h, m) => {
      var y;
      const v = Al(t, m, d === "exit" ? ((y = t.presenceContext) === null || y === void 0 ? void 0 : y.custom) : void 0);
      if (v) {
          const { transition: w, transitionEnd: S, ...b } = v;
          h = { ...h, ...b, ...S };
      }
      return h;
  };
  function l(d) {
      e = d(t);
  }
  function u(d) {
      const { props: h } = t,
          m = cx(t.parent) || {},
          y = [],
          v = new Set();
      let w = {},
          S = 1 / 0;
      for (let C = 0; C < J3; C++) {
          const P = Z3[C],
              E = i[P],
              D = h[P] !== void 0 ? h[P] : m[P],
              I = go(D),
              z = P === d ? E.isActive : null;
          z === !1 && (S = C);
          let N = D === m[P] && D !== h[P] && I;
          if ((N && s && t.manuallyAnimateOnMount && (N = !1), (E.protectedKeys = { ...w }), (!E.isActive && z === null) || (!D && !E.prevProp) || Ml(D) || typeof D == "boolean")) continue;
          const Q = nR(E.prevProp, D);
          let q = Q || (P === d && E.isActive && !N && I) || (C > S && I),
              K = !1;
          const ie = Array.isArray(D) ? D : [D];
          let ue = ie.reduce(o(P), {});
          z === !1 && (ue = {});
          const { prevResolvedValues: _e = {} } = E,
              Te = { ..._e, ...ue },
              he = (ae) => {
                  (q = !0), v.has(ae) && ((K = !0), v.delete(ae)), (E.needsAnimating[ae] = !0);
                  const U = t.getValue(ae);
                  U && (U.liveStyle = !1);
              };
          for (const ae in Te) {
              const U = ue[ae],
                  te = _e[ae];
              if (w.hasOwnProperty(ae)) continue;
              let G = !1;
              Af(U) && Af(te) ? (G = !b0(U, te)) : (G = U !== te), G ? (U != null ? he(ae) : v.add(ae)) : U !== void 0 && v.has(ae) ? he(ae) : (E.protectedKeys[ae] = !0);
          }
          (E.prevProp = D), (E.prevResolvedValues = ue), E.isActive && (w = { ...w, ...ue }), s && t.blockInitialAnimation && (q = !1), q && (!(N && Q) || K) && y.push(...ie.map((ae) => ({ animation: ae, options: { type: P } })));
      }
      if (v.size) {
          const C = {};
          v.forEach((P) => {
              const E = t.getBaseTarget(P),
                  D = t.getValue(P);
              D && (D.liveStyle = !0), (C[P] = E ?? null);
          }),
              y.push({ animation: C });
      }
      let b = !!y.length;
      return s && (h.initial === !1 || h.initial === h.animate) && !t.manuallyAnimateOnMount && (b = !1), (s = !1), b ? e(y) : Promise.resolve();
  }
  function c(d, h) {
      var m;
      if (i[d].isActive === h) return Promise.resolve();
      (m = t.variantChildren) === null ||
          m === void 0 ||
          m.forEach((v) => {
              var w;
              return (w = v.animationState) === null || w === void 0 ? void 0 : w.setActive(d, h);
          }),
          (i[d].isActive = h);
      const y = u(d);
      for (const v in i) i[v].protectedKeys = {};
      return y;
  }
  return {
      animateChanges: u,
      setActive: c,
      setAnimateFunction: l,
      getState: () => i,
      reset: () => {
          (i = wy()), (s = !0);
      },
  };
}
function nR(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !b0(e, t) : !1;
}
function Fi(t = !1) {
  return { isActive: t, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
}
function wy() {
  return { animate: Fi(!0), whileInView: Fi(), whileHover: Fi(), whileTap: Fi(), whileDrag: Fi(), whileFocus: Fi(), exit: Fi() };
}
class Si {
  constructor(e) {
      (this.isMounted = !1), (this.node = e);
  }
  update() {}
}
class iR extends Si {
  constructor(e) {
      super(e), e.animationState || (e.animationState = tR(e));
  }
  updateAnimationControlsSubscription() {
      const { animate: e } = this.node.getProps();
      Ml(e) && (this.unmountControls = e.subscribe(this.node));
  }
  mount() {
      this.updateAnimationControlsSubscription();
  }
  update() {
      const { animate: e } = this.node.getProps(),
          { animate: i } = this.node.prevProps || {};
      e !== i && this.updateAnimationControlsSubscription();
  }
  unmount() {
      var e;
      this.node.animationState.reset(), (e = this.unmountControls) === null || e === void 0 || e.call(this);
  }
}
let rR = 0;
class sR extends Si {
  constructor() {
      super(...arguments), (this.id = rR++);
  }
  update() {
      if (!this.node.presenceContext) return;
      const { isPresent: e, onExitComplete: i } = this.node.presenceContext,
          { isPresent: s } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || e === s) return;
      const o = this.node.animationState.setActive("exit", !e);
      i && !e && o.then(() => i(this.id));
  }
  mount() {
      const { register: e } = this.node.presenceContext || {};
      e && (this.unmount = e(this.id));
  }
  unmount() {}
}
const oR = { animation: { Feature: iR }, exit: { Feature: sR } },
  ln = { x: !1, y: !1 };
function fx() {
  return ln.x || ln.y;
}
function dx(t, e, i) {
  var s;
  if (t instanceof Element) return [t];
  if (typeof t == "string") {
      let o = document;
      e && (o = e.current);
      const l = (s = i == null ? void 0 : i[t]) !== null && s !== void 0 ? s : o.querySelectorAll(t);
      return l ? Array.from(l) : [];
  }
  return Array.from(t);
}
function hx(t, e) {
  const i = dx(t),
      s = new AbortController(),
      o = { passive: !0, ...e, signal: s.signal };
  return [i, o, () => s.abort()];
}
function Sy(t) {
  return (e) => {
      e.pointerType === "touch" || fx() || t(e);
  };
}
function aR(t, e, i = {}) {
  const [s, o, l] = hx(t, i),
      u = Sy((c) => {
          const { target: d } = c,
              h = e(c);
          if (!h || !d) return;
          const m = Sy((y) => {
              h(y), d.removeEventListener("pointerleave", m);
          });
          d.addEventListener("pointerleave", m, o);
      });
  return (
      s.forEach((c) => {
          c.addEventListener("pointerenter", u, o);
      }),
      l
  );
}
const Nd = (t) => (t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1),
  io = new WeakSet();
function by(t) {
  return (e) => {
      e.key === "Enter" && t(e);
  };
}
function sf(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const lR = (t, e) => {
      const i = t.currentTarget;
      if (!i) return;
      const s = by(() => {
          if (io.has(i)) return;
          sf(i, "down");
          const o = by(() => {
                  sf(i, "up");
              }),
              l = () => sf(i, "cancel");
          i.addEventListener("keyup", o, e), i.addEventListener("blur", l, e);
      });
      i.addEventListener("keydown", s, e), i.addEventListener("blur", () => i.removeEventListener("keydown", s), e);
  },
  uR = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function cR(t) {
  return uR.has(t.tagName) || t.tabIndex !== -1;
}
const px = (t, e) => (e ? (t === e ? !0 : px(t, e.parentElement)) : !1);
function Cy(t) {
  return Nd(t) && !fx();
}
function fR(t, e, i = {}) {
  const [s, o, l] = hx(t, i),
      u = (c) => {
          const d = c.currentTarget;
          if (!Cy(c) || io.has(d)) return;
          io.add(d);
          const h = e(c),
              m = (w, S) => {
                  window.removeEventListener("pointerup", y), window.removeEventListener("pointercancel", v), !(!Cy(w) || !io.has(d)) && (io.delete(d), h && h(w, { success: S }));
              },
              y = (w) => {
                  m(w, i.useGlobalTarget || px(d, w.target));
              },
              v = (w) => {
                  m(w, !1);
              };
          window.addEventListener("pointerup", y, o), window.addEventListener("pointercancel", v, o);
      };
  return (
      s.forEach((c) => {
          cR(c) || (c.tabIndex = 0), (i.useGlobalTarget ? window : c).addEventListener("pointerdown", u, o), c.addEventListener("focus", (h) => lR(h, o), o);
      }),
      l
  );
}
function dR(t) {
  return t === "x" || t === "y"
      ? ln[t]
          ? null
          : ((ln[t] = !0),
            () => {
                ln[t] = !1;
            })
      : ln.x || ln.y
      ? null
      : ((ln.x = ln.y = !0),
        () => {
            ln.x = ln.y = !1;
        });
}
function Ao(t) {
  return { point: { x: t.pageX, y: t.pageY } };
}
const hR = (t) => (e) => Nd(e) && t(e, Ao(e));
function wo(t, e, i, s = { passive: !0 }) {
  return t.addEventListener(e, i, s), () => t.removeEventListener(e, i);
}
function ao(t, e, i, s) {
  return wo(t, e, hR(i), s);
}
const ky = (t, e) => Math.abs(t - e);
function pR(t, e) {
  const i = ky(t.x, e.x),
      s = ky(t.y, e.y);
  return Math.sqrt(i ** 2 + s ** 2);
}
class mx {
  constructor(e, i, { transformPagePoint: s, contextWindow: o, dragSnapToOrigin: l = !1 } = {}) {
      if (
          ((this.startEvent = null),
          (this.lastMoveEvent = null),
          (this.lastMoveEventInfo = null),
          (this.handlers = {}),
          (this.contextWindow = window),
          (this.updatePoint = () => {
              if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
              const y = af(this.lastMoveEventInfo, this.history),
                  v = this.startEvent !== null,
                  w = pR(y.offset, { x: 0, y: 0 }) >= 3;
              if (!v && !w) return;
              const { point: S } = y,
                  { timestamp: b } = lt;
              this.history.push({ ...S, timestamp: b });
              const { onStart: C, onMove: P } = this.handlers;
              v || (C && C(this.lastMoveEvent, y), (this.startEvent = this.lastMoveEvent)), P && P(this.lastMoveEvent, y);
          }),
          (this.handlePointerMove = (y, v) => {
              (this.lastMoveEvent = y), (this.lastMoveEventInfo = of(v, this.transformPagePoint)), Oe.update(this.updatePoint, !0);
          }),
          (this.handlePointerUp = (y, v) => {
              this.end();
              const { onEnd: w, onSessionEnd: S, resumeAnimation: b } = this.handlers;
              if ((this.dragSnapToOrigin && b && b(), !(this.lastMoveEvent && this.lastMoveEventInfo))) return;
              const C = af(y.type === "pointercancel" ? this.lastMoveEventInfo : of(v, this.transformPagePoint), this.history);
              this.startEvent && w && w(y, C), S && S(y, C);
          }),
          !Nd(e))
      )
          return;
      (this.dragSnapToOrigin = l), (this.handlers = i), (this.transformPagePoint = s), (this.contextWindow = o || window);
      const u = Ao(e),
          c = of(u, this.transformPagePoint),
          { point: d } = c,
          { timestamp: h } = lt;
      this.history = [{ ...d, timestamp: h }];
      const { onSessionStart: m } = i;
      m && m(e, af(c, this.history)),
          (this.removeListeners = Mo(ao(this.contextWindow, "pointermove", this.handlePointerMove), ao(this.contextWindow, "pointerup", this.handlePointerUp), ao(this.contextWindow, "pointercancel", this.handlePointerUp)));
  }
  updateHandlers(e) {
      this.handlers = e;
  }
  end() {
      this.removeListeners && this.removeListeners(), vi(this.updatePoint);
  }
}
function of(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Py(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function af({ point: t }, e) {
  return { point: t, delta: Py(t, gx(e)), offset: Py(t, mR(e)), velocity: gR(e, 0.1) };
}
function mR(t) {
  return t[0];
}
function gx(t) {
  return t[t.length - 1];
}
function gR(t, e) {
  if (t.length < 2) return { x: 0, y: 0 };
  let i = t.length - 1,
      s = null;
  const o = gx(t);
  for (; i >= 0 && ((s = t[i]), !(o.timestamp - s.timestamp > Tn(e))); ) i--;
  if (!s) return { x: 0, y: 0 };
  const l = En(o.timestamp - s.timestamp);
  if (l === 0) return { x: 0, y: 0 };
  const u = { x: (o.x - s.x) / l, y: (o.y - s.y) / l };
  return u.x === 1 / 0 && (u.x = 0), u.y === 1 / 0 && (u.y = 0), u;
}
function zr(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
const yx = 1e-4,
  yR = 1 - yx,
  vR = 1 + yx,
  vx = 0.01,
  xR = 0 - vx,
  wR = 0 + vx;
function Vt(t) {
  return t.max - t.min;
}
function SR(t, e, i) {
  return Math.abs(t - e) <= i;
}
function Ty(t, e, i, s = 0.5) {
  (t.origin = s),
      (t.originPoint = je(e.min, e.max, t.origin)),
      (t.scale = Vt(i) / Vt(e)),
      (t.translate = je(i.min, i.max, t.origin) - t.originPoint),
      ((t.scale >= yR && t.scale <= vR) || isNaN(t.scale)) && (t.scale = 1),
      ((t.translate >= xR && t.translate <= wR) || isNaN(t.translate)) && (t.translate = 0);
}
function lo(t, e, i, s) {
  Ty(t.x, e.x, i.x, s ? s.originX : void 0), Ty(t.y, e.y, i.y, s ? s.originY : void 0);
}
function Ey(t, e, i) {
  (t.min = i.min + e.min), (t.max = t.min + Vt(e));
}
function bR(t, e, i) {
  Ey(t.x, e.x, i.x), Ey(t.y, e.y, i.y);
}
function _y(t, e, i) {
  (t.min = e.min - i.min), (t.max = t.min + Vt(e));
}
function uo(t, e, i) {
  _y(t.x, e.x, i.x), _y(t.y, e.y, i.y);
}
function CR(t, { min: e, max: i }, s) {
  return e !== void 0 && t < e ? (t = s ? je(e, t, s.min) : Math.max(t, e)) : i !== void 0 && t > i && (t = s ? je(i, t, s.max) : Math.min(t, i)), t;
}
function Ry(t, e, i) {
  return { min: e !== void 0 ? t.min + e : void 0, max: i !== void 0 ? t.max + i - (t.max - t.min) : void 0 };
}
function kR(t, { top: e, left: i, bottom: s, right: o }) {
  return { x: Ry(t.x, i, o), y: Ry(t.y, e, s) };
}
function My(t, e) {
  let i = e.min - t.min,
      s = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([i, s] = [s, i]), { min: i, max: s };
}
function PR(t, e) {
  return { x: My(t.x, e.x), y: My(t.y, e.y) };
}
function TR(t, e) {
  let i = 0.5;
  const s = Vt(t),
      o = Vt(e);
  return o > s ? (i = tr(e.min, e.max - s, t.min)) : s > o && (i = tr(t.min, t.max - o, e.min)), Wn(0, 1, i);
}
function ER(t, e) {
  const i = {};
  return e.min !== void 0 && (i.min = e.min - t.min), e.max !== void 0 && (i.max = e.max - t.min), i;
}
const Uf = 0.35;
function _R(t = Uf) {
  return t === !1 ? (t = 0) : t === !0 && (t = Uf), { x: Ay(t, "left", "right"), y: Ay(t, "top", "bottom") };
}
function Ay(t, e, i) {
  return { min: Oy(t, e), max: Oy(t, i) };
}
function Oy(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const Dy = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  Nr = () => ({ x: Dy(), y: Dy() }),
  Ly = () => ({ min: 0, max: 0 }),
  $e = () => ({ x: Ly(), y: Ly() });
function Yt(t) {
  return [t("x"), t("y")];
}
function xx({ top: t, left: e, right: i, bottom: s }) {
  return { x: { min: e, max: i }, y: { min: t, max: s } };
}
function RR({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function MR(t, e) {
  if (!e) return t;
  const i = e({ x: t.left, y: t.top }),
      s = e({ x: t.right, y: t.bottom });
  return { top: i.y, left: i.x, bottom: s.y, right: s.x };
}
function lf(t) {
  return t === void 0 || t === 1;
}
function Hf({ scale: t, scaleX: e, scaleY: i }) {
  return !lf(t) || !lf(e) || !lf(i);
}
function Vi(t) {
  return Hf(t) || wx(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function wx(t) {
  return Iy(t.x) || Iy(t.y);
}
function Iy(t) {
  return t && t !== "0%";
}
function wl(t, e, i) {
  const s = t - i,
      o = e * s;
  return i + o;
}
function jy(t, e, i, s, o) {
  return o !== void 0 && (t = wl(t, o, s)), wl(t, i, s) + e;
}
function Wf(t, e = 0, i = 1, s, o) {
  (t.min = jy(t.min, e, i, s, o)), (t.max = jy(t.max, e, i, s, o));
}
function Sx(t, { x: e, y: i }) {
  Wf(t.x, e.translate, e.scale, e.originPoint), Wf(t.y, i.translate, i.scale, i.originPoint);
}
const zy = 0.999999999999,
  Ny = 1.0000000000001;
function AR(t, e, i, s = !1) {
  const o = i.length;
  if (!o) return;
  e.x = e.y = 1;
  let l, u;
  for (let c = 0; c < o; c++) {
      (l = i[c]), (u = l.projectionDelta);
      const { visualElement: d } = l.options;
      (d && d.props.style && d.props.style.display === "contents") ||
          (s && l.options.layoutScroll && l.scroll && l !== l.root && Vr(t, { x: -l.scroll.offset.x, y: -l.scroll.offset.y }), u && ((e.x *= u.x.scale), (e.y *= u.y.scale), Sx(t, u)), s && Vi(l.latestValues) && Vr(t, l.latestValues));
  }
  e.x < Ny && e.x > zy && (e.x = 1), e.y < Ny && e.y > zy && (e.y = 1);
}
function Fr(t, e) {
  (t.min = t.min + e), (t.max = t.max + e);
}
function Fy(t, e, i, s, o = 0.5) {
  const l = je(t.min, t.max, o);
  Wf(t, e, i, l, s);
}
function Vr(t, e) {
  Fy(t.x, e.x, e.scaleX, e.scale, e.originX), Fy(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function bx(t, e) {
  return xx(MR(t.getBoundingClientRect(), e));
}
function OR(t, e, i) {
  const s = bx(t, i),
      { scroll: o } = e;
  return o && (Fr(s.x, o.offset.x), Fr(s.y, o.offset.y)), s;
}
const Cx = ({ current: t }) => (t ? t.ownerDocument.defaultView : null),
  DR = new WeakMap();
class LR {
  constructor(e) {
      (this.openDragLock = null), (this.isDragging = !1), (this.currentDirection = null), (this.originPoint = { x: 0, y: 0 }), (this.constraints = !1), (this.hasMutatedConstraints = !1), (this.elastic = $e()), (this.visualElement = e);
  }
  start(e, { snapToCursor: i = !1 } = {}) {
      const { presenceContext: s } = this.visualElement;
      if (s && s.isPresent === !1) return;
      const o = (m) => {
              const { dragSnapToOrigin: y } = this.getProps();
              y ? this.pauseAnimation() : this.stopAnimation(), i && this.snapToCursor(Ao(m).point);
          },
          l = (m, y) => {
              const { drag: v, dragPropagation: w, onDragStart: S } = this.getProps();
              if (v && !w && (this.openDragLock && this.openDragLock(), (this.openDragLock = dR(v)), !this.openDragLock)) return;
              (this.isDragging = !0),
                  (this.currentDirection = null),
                  this.resolveConstraints(),
                  this.visualElement.projection && ((this.visualElement.projection.isAnimationBlocked = !0), (this.visualElement.projection.target = void 0)),
                  Yt((C) => {
                      let P = this.getAxisMotionValue(C).get() || 0;
                      if (_n.test(P)) {
                          const { projection: E } = this.visualElement;
                          if (E && E.layout) {
                              const D = E.layout.layoutBox[C];
                              D && (P = Vt(D) * (parseFloat(P) / 100));
                          }
                      }
                      this.originPoint[C] = P;
                  }),
                  S && Oe.postRender(() => S(m, y)),
                  Bf(this.visualElement, "transform");
              const { animationState: b } = this.visualElement;
              b && b.setActive("whileDrag", !0);
          },
          u = (m, y) => {
              const { dragPropagation: v, dragDirectionLock: w, onDirectionLock: S, onDrag: b } = this.getProps();
              if (!v && !this.openDragLock) return;
              const { offset: C } = y;
              if (w && this.currentDirection === null) {
                  (this.currentDirection = IR(C)), this.currentDirection !== null && S && S(this.currentDirection);
                  return;
              }
              this.updateAxis("x", y.point, C), this.updateAxis("y", y.point, C), this.visualElement.render(), b && b(m, y);
          },
          c = (m, y) => this.stop(m, y),
          d = () =>
              Yt((m) => {
                  var y;
                  return this.getAnimationState(m) === "paused" && ((y = this.getAxisMotionValue(m).animation) === null || y === void 0 ? void 0 : y.play());
              }),
          { dragSnapToOrigin: h } = this.getProps();
      this.panSession = new mx(
          e,
          { onSessionStart: o, onStart: l, onMove: u, onSessionEnd: c, resumeAnimation: d },
          { transformPagePoint: this.visualElement.getTransformPagePoint(), dragSnapToOrigin: h, contextWindow: Cx(this.visualElement) }
      );
  }
  stop(e, i) {
      const s = this.isDragging;
      if ((this.cancel(), !s)) return;
      const { velocity: o } = i;
      this.startAnimation(o);
      const { onDragEnd: l } = this.getProps();
      l && Oe.postRender(() => l(e, i));
  }
  cancel() {
      this.isDragging = !1;
      const { projection: e, animationState: i } = this.visualElement;
      e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), (this.panSession = void 0);
      const { dragPropagation: s } = this.getProps();
      !s && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)), i && i.setActive("whileDrag", !1);
  }
  updateAxis(e, i, s) {
      const { drag: o } = this.getProps();
      if (!s || !il(e, o, this.currentDirection)) return;
      const l = this.getAxisMotionValue(e);
      let u = this.originPoint[e] + s[e];
      this.constraints && this.constraints[e] && (u = CR(u, this.constraints[e], this.elastic[e])), l.set(u);
  }
  resolveConstraints() {
      var e;
      const { dragConstraints: i, dragElastic: s } = this.getProps(),
          o = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (e = this.visualElement.projection) === null || e === void 0 ? void 0 : e.layout,
          l = this.constraints;
      i && zr(i) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : i && o ? (this.constraints = kR(o.layoutBox, i)) : (this.constraints = !1),
          (this.elastic = _R(s)),
          l !== this.constraints &&
              o &&
              this.constraints &&
              !this.hasMutatedConstraints &&
              Yt((u) => {
                  this.constraints !== !1 && this.getAxisMotionValue(u) && (this.constraints[u] = ER(o.layoutBox[u], this.constraints[u]));
              });
  }
  resolveRefConstraints() {
      const { dragConstraints: e, onMeasureDragConstraints: i } = this.getProps();
      if (!e || !zr(e)) return !1;
      const s = e.current,
          { projection: o } = this.visualElement;
      if (!o || !o.layout) return !1;
      const l = OR(s, o.root, this.visualElement.getTransformPagePoint());
      let u = PR(o.layout.layoutBox, l);
      if (i) {
          const c = i(RR(u));
          (this.hasMutatedConstraints = !!c), c && (u = xx(c));
      }
      return u;
  }
  startAnimation(e) {
      const { drag: i, dragMomentum: s, dragElastic: o, dragTransition: l, dragSnapToOrigin: u, onDragTransitionEnd: c } = this.getProps(),
          d = this.constraints || {},
          h = Yt((m) => {
              if (!il(m, i, this.currentDirection)) return;
              let y = d[m] || {};
              u && (y = { min: 0, max: 0 });
              const v = o ? 200 : 1e6,
                  w = o ? 40 : 1e7,
                  S = { type: "inertia", velocity: s ? e[m] : 0, bounceStiffness: v, bounceDamping: w, timeConstant: 750, restDelta: 1, restSpeed: 10, ...l, ...y };
              return this.startAxisValueAnimation(m, S);
          });
      return Promise.all(h).then(c);
  }
  startAxisValueAnimation(e, i) {
      const s = this.getAxisMotionValue(e);
      return Bf(this.visualElement, e), s.start(Dd(e, s, 0, i, this.visualElement, !1));
  }
  stopAnimation() {
      Yt((e) => this.getAxisMotionValue(e).stop());
  }
  pauseAnimation() {
      Yt((e) => {
          var i;
          return (i = this.getAxisMotionValue(e).animation) === null || i === void 0 ? void 0 : i.pause();
      });
  }
  getAnimationState(e) {
      var i;
      return (i = this.getAxisMotionValue(e).animation) === null || i === void 0 ? void 0 : i.state;
  }
  getAxisMotionValue(e) {
      const i = `_drag${e.toUpperCase()}`,
          s = this.visualElement.getProps(),
          o = s[i];
      return o || this.visualElement.getValue(e, (s.initial ? s.initial[e] : void 0) || 0);
  }
  snapToCursor(e) {
      Yt((i) => {
          const { drag: s } = this.getProps();
          if (!il(i, s, this.currentDirection)) return;
          const { projection: o } = this.visualElement,
              l = this.getAxisMotionValue(i);
          if (o && o.layout) {
              const { min: u, max: c } = o.layout.layoutBox[i];
              l.set(e[i] - je(u, c, 0.5));
          }
      });
  }
  scalePositionWithinConstraints() {
      if (!this.visualElement.current) return;
      const { drag: e, dragConstraints: i } = this.getProps(),
          { projection: s } = this.visualElement;
      if (!zr(i) || !s || !this.constraints) return;
      this.stopAnimation();
      const o = { x: 0, y: 0 };
      Yt((u) => {
          const c = this.getAxisMotionValue(u);
          if (c && this.constraints !== !1) {
              const d = c.get();
              o[u] = TR({ min: d, max: d }, this.constraints[u]);
          }
      });
      const { transformTemplate: l } = this.visualElement.getProps();
      (this.visualElement.current.style.transform = l ? l({}, "") : "none"),
          s.root && s.root.updateScroll(),
          s.updateLayout(),
          this.resolveConstraints(),
          Yt((u) => {
              if (!il(u, e, null)) return;
              const c = this.getAxisMotionValue(u),
                  { min: d, max: h } = this.constraints[u];
              c.set(je(d, h, o[u]));
          });
  }
  addListeners() {
      if (!this.visualElement.current) return;
      DR.set(this.visualElement, this);
      const e = this.visualElement.current,
          i = ao(e, "pointerdown", (d) => {
              const { drag: h, dragListener: m = !0 } = this.getProps();
              h && m && this.start(d);
          }),
          s = () => {
              const { dragConstraints: d } = this.getProps();
              zr(d) && d.current && (this.constraints = this.resolveRefConstraints());
          },
          { projection: o } = this.visualElement,
          l = o.addEventListener("measure", s);
      o && !o.layout && (o.root && o.root.updateScroll(), o.updateLayout()), Oe.read(s);
      const u = wo(window, "resize", () => this.scalePositionWithinConstraints()),
          c = o.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: h }) => {
              this.isDragging &&
                  h &&
                  (Yt((m) => {
                      const y = this.getAxisMotionValue(m);
                      y && ((this.originPoint[m] += d[m].translate), y.set(y.get() + d[m].translate));
                  }),
                  this.visualElement.render());
          });
      return () => {
          u(), i(), l(), c && c();
      };
  }
  getProps() {
      const e = this.visualElement.getProps(),
          { drag: i = !1, dragDirectionLock: s = !1, dragPropagation: o = !1, dragConstraints: l = !1, dragElastic: u = Uf, dragMomentum: c = !0 } = e;
      return { ...e, drag: i, dragDirectionLock: s, dragPropagation: o, dragConstraints: l, dragElastic: u, dragMomentum: c };
  }
}
function il(t, e, i) {
  return (e === !0 || e === t) && (i === null || i === t);
}
function IR(t, e = 10) {
  let i = null;
  return Math.abs(t.y) > e ? (i = "y") : Math.abs(t.x) > e && (i = "x"), i;
}
class jR extends Si {
  constructor(e) {
      super(e), (this.removeGroupControls = Ft), (this.removeListeners = Ft), (this.controls = new LR(e));
  }
  mount() {
      const { dragControls: e } = this.node.getProps();
      e && (this.removeGroupControls = e.subscribe(this.controls)), (this.removeListeners = this.controls.addListeners() || Ft);
  }
  unmount() {
      this.removeGroupControls(), this.removeListeners();
  }
}
const Vy = (t) => (e, i) => {
  t && Oe.postRender(() => t(e, i));
};
class zR extends Si {
  constructor() {
      super(...arguments), (this.removePointerDownListener = Ft);
  }
  onPointerDown(e) {
      this.session = new mx(e, this.createPanHandlers(), { transformPagePoint: this.node.getTransformPagePoint(), contextWindow: Cx(this.node) });
  }
  createPanHandlers() {
      const { onPanSessionStart: e, onPanStart: i, onPan: s, onPanEnd: o } = this.node.getProps();
      return {
          onSessionStart: Vy(e),
          onStart: Vy(i),
          onMove: s,
          onEnd: (l, u) => {
              delete this.session, o && Oe.postRender(() => o(l, u));
          },
      };
  }
  mount() {
      this.removePointerDownListener = ao(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
  }
  update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
      this.removePointerDownListener(), this.session && this.session.end();
  }
}
const Fd = A.createContext(null);
function NR() {
  const t = A.useContext(Fd);
  if (t === null) return [!0, null];
  const { isPresent: e, onExitComplete: i, register: s } = t,
      o = A.useId();
  A.useEffect(() => s(o), []);
  const l = A.useCallback(() => i && i(o), [o, i]);
  return !e && i ? [!1, l] : [!0];
}
const kx = A.createContext({}),
  Px = A.createContext({}),
  ul = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
function By(t, e) {
  return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
}
const Xs = {
      correct: (t, e) => {
          if (!e.target) return t;
          if (typeof t == "string")
              if (oe.test(t)) t = parseFloat(t);
              else return t;
          const i = By(t, e.target.x),
              s = By(t, e.target.y);
          return `${i}% ${s}%`;
      },
  },
  FR = {
      correct: (t, { treeScale: e, projectionDelta: i }) => {
          const s = t,
              o = xi.parse(t);
          if (o.length > 5) return s;
          const l = xi.createTransformer(t),
              u = typeof o[0] != "number" ? 1 : 0,
              c = i.x.scale * e.x,
              d = i.y.scale * e.y;
          (o[0 + u] /= c), (o[1 + u] /= d);
          const h = je(c, d, 0.5);
          return typeof o[2 + u] == "number" && (o[2 + u] /= h), typeof o[3 + u] == "number" && (o[3 + u] /= h), l(o);
      },
  },
  Sl = {};
function VR(t) {
  Object.assign(Sl, t);
}
const { schedule: Vd, cancel: $O } = C0(queueMicrotask, !1);
class BR extends A.Component {
  componentDidMount() {
      const { visualElement: e, layoutGroup: i, switchLayoutGroup: s, layoutId: o } = this.props,
          { projection: l } = e;
      VR($R),
          l &&
              (i.group && i.group.add(l),
              s && s.register && o && s.register(l),
              l.root.didUpdate(),
              l.addEventListener("animationComplete", () => {
                  this.safeToRemove();
              }),
              l.setOptions({ ...l.options, onExitComplete: () => this.safeToRemove() })),
          (ul.hasEverUpdated = !0);
  }
  getSnapshotBeforeUpdate(e) {
      const { layoutDependency: i, visualElement: s, drag: o, isPresent: l } = this.props,
          u = s.projection;
      return (
          u &&
              ((u.isPresent = l),
              o || e.layoutDependency !== i || i === void 0 ? u.willUpdate() : this.safeToRemove(),
              e.isPresent !== l &&
                  (l
                      ? u.promote()
                      : u.relegate() ||
                        Oe.postRender(() => {
                            const c = u.getStack();
                            (!c || !c.members.length) && this.safeToRemove();
                        }))),
          null
      );
  }
  componentDidUpdate() {
      const { projection: e } = this.props.visualElement;
      e &&
          (e.root.didUpdate(),
          Vd.postRender(() => {
              !e.currentAnimation && e.isLead() && this.safeToRemove();
          }));
  }
  componentWillUnmount() {
      const { visualElement: e, layoutGroup: i, switchLayoutGroup: s } = this.props,
          { projection: o } = e;
      o && (o.scheduleCheckAfterUnmount(), i && i.group && i.group.remove(o), s && s.deregister && s.deregister(o));
  }
  safeToRemove() {
      const { safeToRemove: e } = this.props;
      e && e();
  }
  render() {
      return null;
  }
}
function Tx(t) {
  const [e, i] = NR(),
      s = A.useContext(kx);
  return k.jsx(BR, { ...t, layoutGroup: s, switchLayoutGroup: A.useContext(Px), isPresent: e, safeToRemove: i });
}
const $R = {
      borderRadius: { ...Xs, applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"] },
      borderTopLeftRadius: Xs,
      borderTopRightRadius: Xs,
      borderBottomLeftRadius: Xs,
      borderBottomRightRadius: Xs,
      boxShadow: FR,
  },
  Ex = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
  UR = Ex.length,
  $y = (t) => (typeof t == "string" ? parseFloat(t) : t),
  Uy = (t) => typeof t == "number" || oe.test(t);
function HR(t, e, i, s, o, l) {
  o
      ? ((t.opacity = je(0, i.opacity !== void 0 ? i.opacity : 1, WR(s))), (t.opacityExit = je(e.opacity !== void 0 ? e.opacity : 1, 0, qR(s))))
      : l && (t.opacity = je(e.opacity !== void 0 ? e.opacity : 1, i.opacity !== void 0 ? i.opacity : 1, s));
  for (let u = 0; u < UR; u++) {
      const c = `border${Ex[u]}Radius`;
      let d = Hy(e, c),
          h = Hy(i, c);
      if (d === void 0 && h === void 0) continue;
      d || (d = 0), h || (h = 0), d === 0 || h === 0 || Uy(d) === Uy(h) ? ((t[c] = Math.max(je($y(d), $y(h), s), 0)), (_n.test(h) || _n.test(d)) && (t[c] += "%")) : (t[c] = h);
  }
  (e.rotate || i.rotate) && (t.rotate = je(e.rotate || 0, i.rotate || 0, s));
}
function Hy(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const WR = _x(0, 0.5, M0),
  qR = _x(0.5, 0.95, Ft);
function _x(t, e, i) {
  return (s) => (s < t ? 0 : s > e ? 1 : i(tr(t, e, s)));
}
function Wy(t, e) {
  (t.min = e.min), (t.max = e.max);
}
function Gt(t, e) {
  Wy(t.x, e.x), Wy(t.y, e.y);
}
function qy(t, e) {
  (t.translate = e.translate), (t.scale = e.scale), (t.originPoint = e.originPoint), (t.origin = e.origin);
}
function Ky(t, e, i, s, o) {
  return (t -= e), (t = wl(t, 1 / i, s)), o !== void 0 && (t = wl(t, 1 / o, s)), t;
}
function KR(t, e = 0, i = 1, s = 0.5, o, l = t, u = t) {
  if ((_n.test(e) && ((e = parseFloat(e)), (e = je(u.min, u.max, e / 100) - u.min)), typeof e != "number")) return;
  let c = je(l.min, l.max, s);
  t === l && (c -= e), (t.min = Ky(t.min, e, i, c, o)), (t.max = Ky(t.max, e, i, c, o));
}
function Gy(t, e, [i, s, o], l, u) {
  KR(t, e[i], e[s], e[o], e.scale, l, u);
}
const GR = ["x", "scaleX", "originX"],
  YR = ["y", "scaleY", "originY"];
function Yy(t, e, i, s) {
  Gy(t.x, e, GR, i ? i.x : void 0, s ? s.x : void 0), Gy(t.y, e, YR, i ? i.y : void 0, s ? s.y : void 0);
}
function Qy(t) {
  return t.translate === 0 && t.scale === 1;
}
function Rx(t) {
  return Qy(t.x) && Qy(t.y);
}
function Xy(t, e) {
  return t.min === e.min && t.max === e.max;
}
function QR(t, e) {
  return Xy(t.x, e.x) && Xy(t.y, e.y);
}
function Zy(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function Mx(t, e) {
  return Zy(t.x, e.x) && Zy(t.y, e.y);
}
function Jy(t) {
  return Vt(t.x) / Vt(t.y);
}
function ev(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class XR {
  constructor() {
      this.members = [];
  }
  add(e) {
      Ld(this.members, e), e.scheduleRender();
  }
  remove(e) {
      if ((Ll(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead)) {
          const i = this.members[this.members.length - 1];
          i && this.promote(i);
      }
  }
  relegate(e) {
      const i = this.members.findIndex((o) => e === o);
      if (i === 0) return !1;
      let s;
      for (let o = i; o >= 0; o--) {
          const l = this.members[o];
          if (l.isPresent !== !1) {
              s = l;
              break;
          }
      }
      return s ? (this.promote(s), !0) : !1;
  }
  promote(e, i) {
      const s = this.lead;
      if (e !== s && ((this.prevLead = s), (this.lead = e), e.show(), s)) {
          s.instance && s.scheduleRender(),
              e.scheduleRender(),
              (e.resumeFrom = s),
              i && (e.resumeFrom.preserveOpacity = !0),
              s.snapshot && ((e.snapshot = s.snapshot), (e.snapshot.latestValues = s.animationValues || s.latestValues)),
              e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
          const { crossfade: o } = e.options;
          o === !1 && s.hide();
      }
  }
  exitAnimationComplete() {
      this.members.forEach((e) => {
          const { options: i, resumingFrom: s } = e;
          i.onExitComplete && i.onExitComplete(), s && s.options.onExitComplete && s.options.onExitComplete();
      });
  }
  scheduleRender() {
      this.members.forEach((e) => {
          e.instance && e.scheduleRender(!1);
      });
  }
  removeLeadSnapshot() {
      this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function ZR(t, e, i) {
  let s = "";
  const o = t.x.translate / e.x,
      l = t.y.translate / e.y,
      u = (i == null ? void 0 : i.z) || 0;
  if (((o || l || u) && (s = `translate3d(${o}px, ${l}px, ${u}px) `), (e.x !== 1 || e.y !== 1) && (s += `scale(${1 / e.x}, ${1 / e.y}) `), i)) {
      const { transformPerspective: h, rotate: m, rotateX: y, rotateY: v, skewX: w, skewY: S } = i;
      h && (s = `perspective(${h}px) ${s}`), m && (s += `rotate(${m}deg) `), y && (s += `rotateX(${y}deg) `), v && (s += `rotateY(${v}deg) `), w && (s += `skewX(${w}deg) `), S && (s += `skewY(${S}deg) `);
  }
  const c = t.x.scale * e.x,
      d = t.y.scale * e.y;
  return (c !== 1 || d !== 1) && (s += `scale(${c}, ${d})`), s || "none";
}
const JR = (t, e) => t.depth - e.depth;
class eM {
  constructor() {
      (this.children = []), (this.isDirty = !1);
  }
  add(e) {
      Ld(this.children, e), (this.isDirty = !0);
  }
  remove(e) {
      Ll(this.children, e), (this.isDirty = !0);
  }
  forEach(e) {
      this.isDirty && this.children.sort(JR), (this.isDirty = !1), this.children.forEach(e);
  }
}
function cl(t) {
  const e = it(t) ? t.get() : t;
  return F3(e) ? e.toValue() : e;
}
function tM(t, e) {
  const i = Rn.now(),
      s = ({ timestamp: o }) => {
          const l = o - i;
          l >= e && (vi(s), t(l - e));
      };
  return Oe.read(s, !0), () => vi(s);
}
function Ax(t) {
  return t instanceof SVGElement && t.tagName !== "svg";
}
function Ox(t, e, i) {
  const s = it(t) ? t : xo(t);
  return s.start(Dd("", s, e, i)), s.animation;
}
const Bi = { type: "projectionFrame", totalNodes: 0, resolvedTargetDeltas: 0, recalculatedProjection: 0 },
  ro = typeof window < "u" && window.MotionDebug !== void 0,
  uf = ["", "X", "Y", "Z"],
  nM = { visibility: "hidden" },
  tv = 1e3;
let iM = 0;
function cf(t, e, i, s) {
  const { latestValues: o } = e;
  o[t] && ((i[t] = o[t]), e.setStaticValue(t, 0), s && (s[t] = 0));
}
function Dx(t) {
  if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
  const { visualElement: e } = t.options;
  if (!e) return;
  const i = ux(e);
  if (window.MotionHasOptimisedAnimation(i, "transform")) {
      const { layout: o, layoutId: l } = t.options;
      window.MotionCancelOptimisedAnimation(i, "transform", Oe, !(o || l));
  }
  const { parent: s } = t;
  s && !s.hasCheckedOptimisedAppear && Dx(s);
}
function Lx({ attachResizeListener: t, defaultParent: e, measureScroll: i, checkIsScrollRoot: s, resetTransform: o }) {
  return class {
      constructor(u = {}, c = e == null ? void 0 : e()) {
          (this.id = iM++),
              (this.animationId = 0),
              (this.children = new Set()),
              (this.options = {}),
              (this.isTreeAnimating = !1),
              (this.isAnimationBlocked = !1),
              (this.isLayoutDirty = !1),
              (this.isProjectionDirty = !1),
              (this.isSharedProjectionDirty = !1),
              (this.isTransformDirty = !1),
              (this.updateManuallyBlocked = !1),
              (this.updateBlockedByResize = !1),
              (this.isUpdating = !1),
              (this.isSVG = !1),
              (this.needsReset = !1),
              (this.shouldResetTransform = !1),
              (this.hasCheckedOptimisedAppear = !1),
              (this.treeScale = { x: 1, y: 1 }),
              (this.eventHandlers = new Map()),
              (this.hasTreeAnimated = !1),
              (this.updateScheduled = !1),
              (this.scheduleUpdate = () => this.update()),
              (this.projectionUpdateScheduled = !1),
              (this.checkUpdateFailed = () => {
                  this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
              }),
              (this.updateProjection = () => {
                  (this.projectionUpdateScheduled = !1),
                      ro && (Bi.totalNodes = Bi.resolvedTargetDeltas = Bi.recalculatedProjection = 0),
                      this.nodes.forEach(oM),
                      this.nodes.forEach(fM),
                      this.nodes.forEach(dM),
                      this.nodes.forEach(aM),
                      ro && window.MotionDebug.record(Bi);
              }),
              (this.resolvedRelativeTargetAt = 0),
              (this.hasProjected = !1),
              (this.isVisible = !0),
              (this.animationProgress = 0),
              (this.sharedNodes = new Map()),
              (this.latestValues = u),
              (this.root = c ? c.root || c : this),
              (this.path = c ? [...c.path, c] : []),
              (this.parent = c),
              (this.depth = c ? c.depth + 1 : 0);
          for (let d = 0; d < this.path.length; d++) this.path[d].shouldResetTransform = !0;
          this.root === this && (this.nodes = new eM());
      }
      addEventListener(u, c) {
          return this.eventHandlers.has(u) || this.eventHandlers.set(u, new Id()), this.eventHandlers.get(u).add(c);
      }
      notifyListeners(u, ...c) {
          const d = this.eventHandlers.get(u);
          d && d.notify(...c);
      }
      hasListeners(u) {
          return this.eventHandlers.has(u);
      }
      mount(u, c = this.root.hasTreeAnimated) {
          if (this.instance) return;
          (this.isSVG = Ax(u)), (this.instance = u);
          const { layoutId: d, layout: h, visualElement: m } = this.options;
          if ((m && !m.current && m.mount(u), this.root.nodes.add(this), this.parent && this.parent.children.add(this), c && (h || d) && (this.isLayoutDirty = !0), t)) {
              let y;
              const v = () => (this.root.updateBlockedByResize = !1);
              t(u, () => {
                  (this.root.updateBlockedByResize = !0), y && y(), (y = tM(v, 250)), ul.hasAnimatedSinceResize && ((ul.hasAnimatedSinceResize = !1), this.nodes.forEach(iv));
              });
          }
          d && this.root.registerSharedNode(d, this),
              this.options.animate !== !1 &&
                  m &&
                  (d || h) &&
                  this.addEventListener("didUpdate", ({ delta: y, hasLayoutChanged: v, hasRelativeTargetChanged: w, layout: S }) => {
                      if (this.isTreeAnimationBlocked()) {
                          (this.target = void 0), (this.relativeTarget = void 0);
                          return;
                      }
                      const b = this.options.transition || m.getDefaultTransition() || yM,
                          { onLayoutAnimationStart: C, onLayoutAnimationComplete: P } = m.getProps(),
                          E = !this.targetLayout || !Mx(this.targetLayout, S) || w,
                          D = !v && w;
                      if (this.options.layoutRoot || (this.resumeFrom && this.resumeFrom.instance) || D || (v && (E || !this.currentAnimation))) {
                          this.resumeFrom && ((this.resumingFrom = this.resumeFrom), (this.resumingFrom.resumingFrom = void 0)), this.setAnimationOrigin(y, D);
                          const I = { ...vd(b, "layout"), onPlay: C, onComplete: P };
                          (m.shouldReduceMotion || this.options.layoutRoot) && ((I.delay = 0), (I.type = !1)), this.startAnimation(I);
                      } else v || iv(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
                      this.targetLayout = S;
                  });
      }
      unmount() {
          this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
          const u = this.getStack();
          u && u.remove(this), this.parent && this.parent.children.delete(this), (this.instance = void 0), vi(this.updateProjection);
      }
      blockUpdate() {
          this.updateManuallyBlocked = !0;
      }
      unblockUpdate() {
          this.updateManuallyBlocked = !1;
      }
      isUpdateBlocked() {
          return this.updateManuallyBlocked || this.updateBlockedByResize;
      }
      isTreeAnimationBlocked() {
          return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1;
      }
      startUpdate() {
          this.isUpdateBlocked() || ((this.isUpdating = !0), this.nodes && this.nodes.forEach(hM), this.animationId++);
      }
      getTransformTemplate() {
          const { visualElement: u } = this.options;
          return u && u.getProps().transformTemplate;
      }
      willUpdate(u = !0) {
          if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
              this.options.onExitComplete && this.options.onExitComplete();
              return;
          }
          if ((window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Dx(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)) return;
          this.isLayoutDirty = !0;
          for (let m = 0; m < this.path.length; m++) {
              const y = this.path[m];
              (y.shouldResetTransform = !0), y.updateScroll("snapshot"), y.options.layoutRoot && y.willUpdate(!1);
          }
          const { layoutId: c, layout: d } = this.options;
          if (c === void 0 && !d) return;
          const h = this.getTransformTemplate();
          (this.prevTransformTemplateValue = h ? h(this.latestValues, "") : void 0), this.updateSnapshot(), u && this.notifyListeners("willUpdate");
      }
      update() {
          if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
              this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(nv);
              return;
          }
          this.isUpdating || this.nodes.forEach(uM), (this.isUpdating = !1), this.nodes.forEach(cM), this.nodes.forEach(rM), this.nodes.forEach(sM), this.clearAllSnapshots();
          const c = Rn.now();
          (lt.delta = Wn(0, 1e3 / 60, c - lt.timestamp)), (lt.timestamp = c), (lt.isProcessing = !0), Jc.update.process(lt), Jc.preRender.process(lt), Jc.render.process(lt), (lt.isProcessing = !1);
      }
      didUpdate() {
          this.updateScheduled || ((this.updateScheduled = !0), Vd.read(this.scheduleUpdate));
      }
      clearAllSnapshots() {
          this.nodes.forEach(lM), this.sharedNodes.forEach(pM);
      }
      scheduleUpdateProjection() {
          this.projectionUpdateScheduled || ((this.projectionUpdateScheduled = !0), Oe.preRender(this.updateProjection, !1, !0));
      }
      scheduleCheckAfterUnmount() {
          Oe.postRender(() => {
              this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
          });
      }
      updateSnapshot() {
          this.snapshot || !this.instance || (this.snapshot = this.measure());
      }
      updateLayout() {
          if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
          if (this.resumeFrom && !this.resumeFrom.instance) for (let d = 0; d < this.path.length; d++) this.path[d].updateScroll();
          const u = this.layout;
          (this.layout = this.measure(!1)), (this.layoutCorrected = $e()), (this.isLayoutDirty = !1), (this.projectionDelta = void 0), this.notifyListeners("measure", this.layout.layoutBox);
          const { visualElement: c } = this.options;
          c && c.notify("LayoutMeasure", this.layout.layoutBox, u ? u.layoutBox : void 0);
      }
      updateScroll(u = "measure") {
          let c = !!(this.options.layoutScroll && this.instance);
          if ((this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === u && (c = !1), c)) {
              const d = s(this.instance);
              this.scroll = { animationId: this.root.animationId, phase: u, isRoot: d, offset: i(this.instance), wasRoot: this.scroll ? this.scroll.isRoot : d };
          }
      }
      resetTransform() {
          if (!o) return;
          const u = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
              c = this.projectionDelta && !Rx(this.projectionDelta),
              d = this.getTransformTemplate(),
              h = d ? d(this.latestValues, "") : void 0,
              m = h !== this.prevTransformTemplateValue;
          u && (c || Vi(this.latestValues) || m) && (o(this.instance, h), (this.shouldResetTransform = !1), this.scheduleRender());
      }
      measure(u = !0) {
          const c = this.measurePageBox();
          let d = this.removeElementScroll(c);
          return u && (d = this.removeTransform(d)), vM(d), { animationId: this.root.animationId, measuredBox: c, layoutBox: d, latestValues: {}, source: this.id };
      }
      measurePageBox() {
          var u;
          const { visualElement: c } = this.options;
          if (!c) return $e();
          const d = c.measureViewportBox();
          if (!(((u = this.scroll) === null || u === void 0 ? void 0 : u.wasRoot) || this.path.some(xM))) {
              const { scroll: m } = this.root;
              m && (Fr(d.x, m.offset.x), Fr(d.y, m.offset.y));
          }
          return d;
      }
      removeElementScroll(u) {
          var c;
          const d = $e();
          if ((Gt(d, u), !((c = this.scroll) === null || c === void 0) && c.wasRoot)) return d;
          for (let h = 0; h < this.path.length; h++) {
              const m = this.path[h],
                  { scroll: y, options: v } = m;
              m !== this.root && y && v.layoutScroll && (y.wasRoot && Gt(d, u), Fr(d.x, y.offset.x), Fr(d.y, y.offset.y));
          }
          return d;
      }
      applyTransform(u, c = !1) {
          const d = $e();
          Gt(d, u);
          for (let h = 0; h < this.path.length; h++) {
              const m = this.path[h];
              !c && m.options.layoutScroll && m.scroll && m !== m.root && Vr(d, { x: -m.scroll.offset.x, y: -m.scroll.offset.y }), Vi(m.latestValues) && Vr(d, m.latestValues);
          }
          return Vi(this.latestValues) && Vr(d, this.latestValues), d;
      }
      removeTransform(u) {
          const c = $e();
          Gt(c, u);
          for (let d = 0; d < this.path.length; d++) {
              const h = this.path[d];
              if (!h.instance || !Vi(h.latestValues)) continue;
              Hf(h.latestValues) && h.updateSnapshot();
              const m = $e(),
                  y = h.measurePageBox();
              Gt(m, y), Yy(c, h.latestValues, h.snapshot ? h.snapshot.layoutBox : void 0, m);
          }
          return Vi(this.latestValues) && Yy(c, this.latestValues), c;
      }
      setTargetDelta(u) {
          (this.targetDelta = u), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0);
      }
      setOptions(u) {
          this.options = { ...this.options, ...u, crossfade: u.crossfade !== void 0 ? u.crossfade : !0 };
      }
      clearMeasurements() {
          (this.scroll = void 0), (this.layout = void 0), (this.snapshot = void 0), (this.prevTransformTemplateValue = void 0), (this.targetDelta = void 0), (this.target = void 0), (this.isLayoutDirty = !1);
      }
      forceRelativeParentToResolveTarget() {
          this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== lt.timestamp && this.relativeParent.resolveTargetDelta(!0);
      }
      resolveTargetDelta(u = !1) {
          var c;
          const d = this.getLead();
          this.isProjectionDirty || (this.isProjectionDirty = d.isProjectionDirty),
              this.isTransformDirty || (this.isTransformDirty = d.isTransformDirty),
              this.isSharedProjectionDirty || (this.isSharedProjectionDirty = d.isSharedProjectionDirty);
          const h = !!this.resumingFrom || this !== d;
          if (!(u || (h && this.isSharedProjectionDirty) || this.isProjectionDirty || (!((c = this.parent) === null || c === void 0) && c.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
              return;
          const { layout: y, layoutId: v } = this.options;
          if (!(!this.layout || !(y || v))) {
              if (((this.resolvedRelativeTargetAt = lt.timestamp), !this.targetDelta && !this.relativeTarget)) {
                  const w = this.getClosestProjectingParent();
                  w && w.layout && this.animationProgress !== 1
                      ? ((this.relativeParent = w),
                        this.forceRelativeParentToResolveTarget(),
                        (this.relativeTarget = $e()),
                        (this.relativeTargetOrigin = $e()),
                        uo(this.relativeTargetOrigin, this.layout.layoutBox, w.layout.layoutBox),
                        Gt(this.relativeTarget, this.relativeTargetOrigin))
                      : (this.relativeParent = this.relativeTarget = void 0);
              }
              if (!(!this.relativeTarget && !this.targetDelta)) {
                  if (
                      (this.target || ((this.target = $e()), (this.targetWithTransforms = $e())),
                      this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target
                          ? (this.forceRelativeParentToResolveTarget(), bR(this.target, this.relativeTarget, this.relativeParent.target))
                          : this.targetDelta
                          ? (this.resumingFrom ? (this.target = this.applyTransform(this.layout.layoutBox)) : Gt(this.target, this.layout.layoutBox), Sx(this.target, this.targetDelta))
                          : Gt(this.target, this.layout.layoutBox),
                      this.attemptToResolveRelativeTarget)
                  ) {
                      this.attemptToResolveRelativeTarget = !1;
                      const w = this.getClosestProjectingParent();
                      w && !!w.resumingFrom == !!this.resumingFrom && !w.options.layoutScroll && w.target && this.animationProgress !== 1
                          ? ((this.relativeParent = w),
                            this.forceRelativeParentToResolveTarget(),
                            (this.relativeTarget = $e()),
                            (this.relativeTargetOrigin = $e()),
                            uo(this.relativeTargetOrigin, this.target, w.target),
                            Gt(this.relativeTarget, this.relativeTargetOrigin))
                          : (this.relativeParent = this.relativeTarget = void 0);
                  }
                  ro && Bi.resolvedTargetDeltas++;
              }
          }
      }
      getClosestProjectingParent() {
          if (!(!this.parent || Hf(this.parent.latestValues) || wx(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
      }
      isProjecting() {
          return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
      }
      calcProjection() {
          var u;
          const c = this.getLead(),
              d = !!this.resumingFrom || this !== c;
          let h = !0;
          if (
              ((this.isProjectionDirty || (!((u = this.parent) === null || u === void 0) && u.isProjectionDirty)) && (h = !1),
              d && (this.isSharedProjectionDirty || this.isTransformDirty) && (h = !1),
              this.resolvedRelativeTargetAt === lt.timestamp && (h = !1),
              h)
          )
              return;
          const { layout: m, layoutId: y } = this.options;
          if (
              ((this.isTreeAnimating = !!((this.parent && this.parent.isTreeAnimating) || this.currentAnimation || this.pendingAnimation)),
              this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
              !this.layout || !(m || y))
          )
              return;
          Gt(this.layoutCorrected, this.layout.layoutBox);
          const v = this.treeScale.x,
              w = this.treeScale.y;
          AR(this.layoutCorrected, this.treeScale, this.path, d), c.layout && !c.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && ((c.target = c.layout.layoutBox), (c.targetWithTransforms = $e()));
          const { target: S } = c;
          if (!S) {
              this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
              return;
          }
          !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (qy(this.prevProjectionDelta.x, this.projectionDelta.x), qy(this.prevProjectionDelta.y, this.projectionDelta.y)),
              lo(this.projectionDelta, this.layoutCorrected, S, this.latestValues),
              (this.treeScale.x !== v || this.treeScale.y !== w || !ev(this.projectionDelta.x, this.prevProjectionDelta.x) || !ev(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
                  ((this.hasProjected = !0), this.scheduleRender(), this.notifyListeners("projectionUpdate", S)),
              ro && Bi.recalculatedProjection++;
      }
      hide() {
          this.isVisible = !1;
      }
      show() {
          this.isVisible = !0;
      }
      scheduleRender(u = !0) {
          var c;
          if (((c = this.options.visualElement) === null || c === void 0 || c.scheduleRender(), u)) {
              const d = this.getStack();
              d && d.scheduleRender();
          }
          this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
      }
      createProjectionDeltas() {
          (this.prevProjectionDelta = Nr()), (this.projectionDelta = Nr()), (this.projectionDeltaWithTransform = Nr());
      }
      setAnimationOrigin(u, c = !1) {
          const d = this.snapshot,
              h = d ? d.latestValues : {},
              m = { ...this.latestValues },
              y = Nr();
          (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), (this.attemptToResolveRelativeTarget = !c);
          const v = $e(),
              w = d ? d.source : void 0,
              S = this.layout ? this.layout.source : void 0,
              b = w !== S,
              C = this.getStack(),
              P = !C || C.members.length <= 1,
              E = !!(b && !P && this.options.crossfade === !0 && !this.path.some(gM));
          this.animationProgress = 0;
          let D;
          (this.mixTargetDelta = (I) => {
              const z = I / 1e3;
              rv(y.x, u.x, z),
                  rv(y.y, u.y, z),
                  this.setTargetDelta(y),
                  this.relativeTarget &&
                      this.relativeTargetOrigin &&
                      this.layout &&
                      this.relativeParent &&
                      this.relativeParent.layout &&
                      (uo(v, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
                      mM(this.relativeTarget, this.relativeTargetOrigin, v, z),
                      D && QR(this.relativeTarget, D) && (this.isProjectionDirty = !1),
                      D || (D = $e()),
                      Gt(D, this.relativeTarget)),
                  b && ((this.animationValues = m), HR(m, h, this.latestValues, z, E, P)),
                  this.root.scheduleUpdateProjection(),
                  this.scheduleRender(),
                  (this.animationProgress = z);
          }),
              this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
      }
      startAnimation(u) {
          this.notifyListeners("animationStart"),
              this.currentAnimation && this.currentAnimation.stop(),
              this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(),
              this.pendingAnimation && (vi(this.pendingAnimation), (this.pendingAnimation = void 0)),
              (this.pendingAnimation = Oe.update(() => {
                  (ul.hasAnimatedSinceResize = !0),
                      (this.currentAnimation = Ox(0, tv, {
                          ...u,
                          onUpdate: (c) => {
                              this.mixTargetDelta(c), u.onUpdate && u.onUpdate(c);
                          },
                          onComplete: () => {
                              u.onComplete && u.onComplete(), this.completeAnimation();
                          },
                      })),
                      this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
                      (this.pendingAnimation = void 0);
              }));
      }
      completeAnimation() {
          this.resumingFrom && ((this.resumingFrom.currentAnimation = void 0), (this.resumingFrom.preserveOpacity = void 0));
          const u = this.getStack();
          u && u.exitAnimationComplete(), (this.resumingFrom = this.currentAnimation = this.animationValues = void 0), this.notifyListeners("animationComplete");
      }
      finishAnimation() {
          this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(tv), this.currentAnimation.stop()), this.completeAnimation();
      }
      applyTransformsToTarget() {
          const u = this.getLead();
          let { targetWithTransforms: c, target: d, layout: h, latestValues: m } = u;
          if (!(!c || !d || !h)) {
              if (this !== u && this.layout && h && Ix(this.options.animationType, this.layout.layoutBox, h.layoutBox)) {
                  d = this.target || $e();
                  const y = Vt(this.layout.layoutBox.x);
                  (d.x.min = u.target.x.min), (d.x.max = d.x.min + y);
                  const v = Vt(this.layout.layoutBox.y);
                  (d.y.min = u.target.y.min), (d.y.max = d.y.min + v);
              }
              Gt(c, d), Vr(c, m), lo(this.projectionDeltaWithTransform, this.layoutCorrected, c, m);
          }
      }
      registerSharedNode(u, c) {
          this.sharedNodes.has(u) || this.sharedNodes.set(u, new XR()), this.sharedNodes.get(u).add(c);
          const h = c.options.initialPromotionConfig;
          c.promote({ transition: h ? h.transition : void 0, preserveFollowOpacity: h && h.shouldPreserveFollowOpacity ? h.shouldPreserveFollowOpacity(c) : void 0 });
      }
      isLead() {
          const u = this.getStack();
          return u ? u.lead === this : !0;
      }
      getLead() {
          var u;
          const { layoutId: c } = this.options;
          return c ? ((u = this.getStack()) === null || u === void 0 ? void 0 : u.lead) || this : this;
      }
      getPrevLead() {
          var u;
          const { layoutId: c } = this.options;
          return c ? ((u = this.getStack()) === null || u === void 0 ? void 0 : u.prevLead) : void 0;
      }
      getStack() {
          const { layoutId: u } = this.options;
          if (u) return this.root.sharedNodes.get(u);
      }
      promote({ needsReset: u, transition: c, preserveFollowOpacity: d } = {}) {
          const h = this.getStack();
          h && h.promote(this, d), u && ((this.projectionDelta = void 0), (this.needsReset = !0)), c && this.setOptions({ transition: c });
      }
      relegate() {
          const u = this.getStack();
          return u ? u.relegate(this) : !1;
      }
      resetSkewAndRotation() {
          const { visualElement: u } = this.options;
          if (!u) return;
          let c = !1;
          const { latestValues: d } = u;
          if (((d.z || d.rotate || d.rotateX || d.rotateY || d.rotateZ || d.skewX || d.skewY) && (c = !0), !c)) return;
          const h = {};
          d.z && cf("z", u, h, this.animationValues);
          for (let m = 0; m < uf.length; m++) cf(`rotate${uf[m]}`, u, h, this.animationValues), cf(`skew${uf[m]}`, u, h, this.animationValues);
          u.render();
          for (const m in h) u.setStaticValue(m, h[m]), this.animationValues && (this.animationValues[m] = h[m]);
          u.scheduleRender();
      }
      getProjectionStyles(u) {
          var c, d;
          if (!this.instance || this.isSVG) return;
          if (!this.isVisible) return nM;
          const h = { visibility: "" },
              m = this.getTransformTemplate();
          if (this.needsReset) return (this.needsReset = !1), (h.opacity = ""), (h.pointerEvents = cl(u == null ? void 0 : u.pointerEvents) || ""), (h.transform = m ? m(this.latestValues, "") : "none"), h;
          const y = this.getLead();
          if (!this.projectionDelta || !this.layout || !y.target) {
              const b = {};
              return (
                  this.options.layoutId && ((b.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1), (b.pointerEvents = cl(u == null ? void 0 : u.pointerEvents) || "")),
                  this.hasProjected && !Vi(this.latestValues) && ((b.transform = m ? m({}, "") : "none"), (this.hasProjected = !1)),
                  b
              );
          }
          const v = y.animationValues || y.latestValues;
          this.applyTransformsToTarget(), (h.transform = ZR(this.projectionDeltaWithTransform, this.treeScale, v)), m && (h.transform = m(v, h.transform));
          const { x: w, y: S } = this.projectionDelta;
          (h.transformOrigin = `${w.origin * 100}% ${S.origin * 100}% 0`),
              y.animationValues
                  ? (h.opacity = y === this ? ((d = (c = v.opacity) !== null && c !== void 0 ? c : this.latestValues.opacity) !== null && d !== void 0 ? d : 1) : this.preserveOpacity ? this.latestValues.opacity : v.opacityExit)
                  : (h.opacity = y === this ? (v.opacity !== void 0 ? v.opacity : "") : v.opacityExit !== void 0 ? v.opacityExit : 0);
          for (const b in Sl) {
              if (v[b] === void 0) continue;
              const { correct: C, applyTo: P } = Sl[b],
                  E = h.transform === "none" ? v[b] : C(v[b], y);
              if (P) {
                  const D = P.length;
                  for (let I = 0; I < D; I++) h[P[I]] = E;
              } else h[b] = E;
          }
          return this.options.layoutId && (h.pointerEvents = y === this ? cl(u == null ? void 0 : u.pointerEvents) || "" : "none"), h;
      }
      clearSnapshot() {
          this.resumeFrom = this.snapshot = void 0;
      }
      resetTree() {
          this.root.nodes.forEach((u) => {
              var c;
              return (c = u.currentAnimation) === null || c === void 0 ? void 0 : c.stop();
          }),
              this.root.nodes.forEach(nv),
              this.root.sharedNodes.clear();
      }
  };
}
function rM(t) {
  t.updateLayout();
}
function sM(t) {
  var e;
  const i = ((e = t.resumeFrom) === null || e === void 0 ? void 0 : e.snapshot) || t.snapshot;
  if (t.isLead() && t.layout && i && t.hasListeners("didUpdate")) {
      const { layoutBox: s, measuredBox: o } = t.layout,
          { animationType: l } = t.options,
          u = i.source !== t.layout.source;
      l === "size"
          ? Yt((y) => {
                const v = u ? i.measuredBox[y] : i.layoutBox[y],
                    w = Vt(v);
                (v.min = s[y].min), (v.max = v.min + w);
            })
          : Ix(l, i.layoutBox, s) &&
            Yt((y) => {
                const v = u ? i.measuredBox[y] : i.layoutBox[y],
                    w = Vt(s[y]);
                (v.max = v.min + w), t.relativeTarget && !t.currentAnimation && ((t.isProjectionDirty = !0), (t.relativeTarget[y].max = t.relativeTarget[y].min + w));
            });
      const c = Nr();
      lo(c, s, i.layoutBox);
      const d = Nr();
      u ? lo(d, t.applyTransform(o, !0), i.measuredBox) : lo(d, s, i.layoutBox);
      const h = !Rx(c);
      let m = !1;
      if (!t.resumeFrom) {
          const y = t.getClosestProjectingParent();
          if (y && !y.resumeFrom) {
              const { snapshot: v, layout: w } = y;
              if (v && w) {
                  const S = $e();
                  uo(S, i.layoutBox, v.layoutBox);
                  const b = $e();
                  uo(b, s, w.layoutBox), Mx(S, b) || (m = !0), y.options.layoutRoot && ((t.relativeTarget = b), (t.relativeTargetOrigin = S), (t.relativeParent = y));
              }
          }
      }
      t.notifyListeners("didUpdate", { layout: s, snapshot: i, delta: d, layoutDelta: c, hasLayoutChanged: h, hasRelativeTargetChanged: m });
  } else if (t.isLead()) {
      const { onExitComplete: s } = t.options;
      s && s();
  }
  t.options.transition = void 0;
}
function oM(t) {
  ro && Bi.totalNodes++,
      t.parent &&
          (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty),
          t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)),
          t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function aM(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function lM(t) {
  t.clearSnapshot();
}
function nv(t) {
  t.clearMeasurements();
}
function uM(t) {
  t.isLayoutDirty = !1;
}
function cM(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function iv(t) {
  t.finishAnimation(), (t.targetDelta = t.relativeTarget = t.target = void 0), (t.isProjectionDirty = !0);
}
function fM(t) {
  t.resolveTargetDelta();
}
function dM(t) {
  t.calcProjection();
}
function hM(t) {
  t.resetSkewAndRotation();
}
function pM(t) {
  t.removeLeadSnapshot();
}
function rv(t, e, i) {
  (t.translate = je(e.translate, 0, i)), (t.scale = je(e.scale, 1, i)), (t.origin = e.origin), (t.originPoint = e.originPoint);
}
function sv(t, e, i, s) {
  (t.min = je(e.min, i.min, s)), (t.max = je(e.max, i.max, s));
}
function mM(t, e, i, s) {
  sv(t.x, e.x, i.x, s), sv(t.y, e.y, i.y, s);
}
function gM(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const yM = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  ov = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t),
  av = ov("applewebkit/") && !ov("chrome/") ? Math.round : Ft;
function lv(t) {
  (t.min = av(t.min)), (t.max = av(t.max));
}
function vM(t) {
  lv(t.x), lv(t.y);
}
function Ix(t, e, i) {
  return t === "position" || (t === "preserve-aspect" && !SR(Jy(e), Jy(i), 0.2));
}
function xM(t) {
  var e;
  return t !== t.root && ((e = t.scroll) === null || e === void 0 ? void 0 : e.wasRoot);
}
const wM = Lx({
      attachResizeListener: (t, e) => wo(t, "resize", e),
      measureScroll: () => ({ x: document.documentElement.scrollLeft || document.body.scrollLeft, y: document.documentElement.scrollTop || document.body.scrollTop }),
      checkIsScrollRoot: () => !0,
  }),
  ff = { current: void 0 },
  jx = Lx({
      measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }),
      defaultParent: () => {
          if (!ff.current) {
              const t = new wM({});
              t.mount(window), t.setOptions({ layoutScroll: !0 }), (ff.current = t);
          }
          return ff.current;
      },
      resetTransform: (t, e) => {
          t.style.transform = e !== void 0 ? e : "none";
      },
      checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed",
  }),
  SM = { pan: { Feature: zR }, drag: { Feature: jR, ProjectionNode: jx, MeasureLayout: Tx } };
function uv(t, e, i) {
  const { props: s } = t;
  t.animationState && s.whileHover && t.animationState.setActive("whileHover", i === "Start");
  const o = "onHover" + i,
      l = s[o];
  l && Oe.postRender(() => l(e, Ao(e)));
}
class bM extends Si {
  mount() {
      const { current: e } = this.node;
      e && (this.unmount = aR(e, (i) => (uv(this.node, i, "Start"), (s) => uv(this.node, s, "End"))));
  }
  unmount() {}
}
class CM extends Si {
  constructor() {
      super(...arguments), (this.isActive = !1);
  }
  onFocus() {
      let e = !1;
      try {
          e = this.node.current.matches(":focus-visible");
      } catch {
          e = !0;
      }
      !e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), (this.isActive = !0));
  }
  onBlur() {
      !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), (this.isActive = !1));
  }
  mount() {
      this.unmount = Mo(
          wo(this.node.current, "focus", () => this.onFocus()),
          wo(this.node.current, "blur", () => this.onBlur())
      );
  }
  unmount() {}
}
function cv(t, e, i) {
  const { props: s } = t;
  t.animationState && s.whileTap && t.animationState.setActive("whileTap", i === "Start");
  const o = "onTap" + (i === "End" ? "" : i),
      l = s[o];
  l && Oe.postRender(() => l(e, Ao(e)));
}
class kM extends Si {
  mount() {
      const { current: e } = this.node;
      e && (this.unmount = fR(e, (i) => (cv(this.node, i, "Start"), (s, { success: o }) => cv(this.node, s, o ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {}
}
const qf = new WeakMap(),
  df = new WeakMap(),
  PM = (t) => {
      const e = qf.get(t.target);
      e && e(t);
  },
  TM = (t) => {
      t.forEach(PM);
  };
function EM({ root: t, ...e }) {
  const i = t || document;
  df.has(i) || df.set(i, {});
  const s = df.get(i),
      o = JSON.stringify(e);
  return s[o] || (s[o] = new IntersectionObserver(TM, { root: t, ...e })), s[o];
}
function _M(t, e, i) {
  const s = EM(e);
  return (
      qf.set(t, i),
      s.observe(t),
      () => {
          qf.delete(t), s.unobserve(t);
      }
  );
}
const RM = { some: 0, all: 1 };
class MM extends Si {
  constructor() {
      super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1);
  }
  startObserver() {
      this.unmount();
      const { viewport: e = {} } = this.node.getProps(),
          { root: i, margin: s, amount: o = "some", once: l } = e,
          u = { root: i ? i.current : void 0, rootMargin: s, threshold: typeof o == "number" ? o : RM[o] },
          c = (d) => {
              const { isIntersecting: h } = d;
              if (this.isInView === h || ((this.isInView = h), l && !h && this.hasEnteredView)) return;
              h && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", h);
              const { onViewportEnter: m, onViewportLeave: y } = this.node.getProps(),
                  v = h ? m : y;
              v && v(d);
          };
      return _M(this.node.current, u, c);
  }
  mount() {
      this.startObserver();
  }
  update() {
      if (typeof IntersectionObserver > "u") return;
      const { props: e, prevProps: i } = this.node;
      ["amount", "margin", "root"].some(AM(e, i)) && this.startObserver();
  }
  unmount() {}
}
function AM({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (i) => t[i] !== e[i];
}
const OM = { inView: { Feature: MM }, tap: { Feature: kM }, focus: { Feature: CM }, hover: { Feature: bM } },
  DM = { layout: { ProjectionNode: jx, MeasureLayout: Tx } },
  zx = A.createContext({ transformPagePoint: (t) => t, isStatic: !1, reducedMotion: "never" }),
  Il = A.createContext({}),
  Bd = typeof window < "u",
  LM = Bd ? A.useLayoutEffect : A.useEffect,
  Nx = A.createContext({ strict: !1 });
function IM(t, e, i, s, o) {
  var l, u;
  const { visualElement: c } = A.useContext(Il),
      d = A.useContext(Nx),
      h = A.useContext(Fd),
      m = A.useContext(zx).reducedMotion,
      y = A.useRef(null);
  (s = s || d.renderer), !y.current && s && (y.current = s(t, { visualState: e, parent: c, props: i, presenceContext: h, blockInitialAnimation: h ? h.initial === !1 : !1, reducedMotionConfig: m }));
  const v = y.current,
      w = A.useContext(Px);
  v && !v.projection && o && (v.type === "html" || v.type === "svg") && jM(y.current, i, o, w);
  const S = A.useRef(!1);
  A.useInsertionEffect(() => {
      v && S.current && v.update(i, h);
  });
  const b = i[lx],
      C = A.useRef(!!b && !(!((l = window.MotionHandoffIsComplete) === null || l === void 0) && l.call(window, b)) && ((u = window.MotionHasOptimisedAnimation) === null || u === void 0 ? void 0 : u.call(window, b)));
  return (
      LM(() => {
          v && ((S.current = !0), (window.MotionIsMounted = !0), v.updateFeatures(), Vd.render(v.render), C.current && v.animationState && v.animationState.animateChanges());
      }),
      A.useEffect(() => {
          v &&
              (!C.current && v.animationState && v.animationState.animateChanges(),
              C.current &&
                  (queueMicrotask(() => {
                      var P;
                      (P = window.MotionHandoffMarkAsComplete) === null || P === void 0 || P.call(window, b);
                  }),
                  (C.current = !1)));
      }),
      v
  );
}
function jM(t, e, i, s) {
  const { layoutId: o, layout: l, drag: u, dragConstraints: c, layoutScroll: d, layoutRoot: h } = e;
  (t.projection = new i(t.latestValues, e["data-framer-portal-id"] ? void 0 : Fx(t.parent))),
      t.projection.setOptions({ layoutId: o, layout: l, alwaysMeasureLayout: !!u || (c && zr(c)), visualElement: t, animationType: typeof l == "string" ? l : "both", initialPromotionConfig: s, layoutScroll: d, layoutRoot: h });
}
function Fx(t) {
  if (t) return t.options.allowProjection !== !1 ? t.projection : Fx(t.parent);
}
function zM(t, e, i) {
  return A.useCallback(
      (s) => {
          s && t.mount && t.mount(s), e && (s ? e.mount(s) : e.unmount()), i && (typeof i == "function" ? i(s) : zr(i) && (i.current = s));
      },
      [e]
  );
}
function jl(t) {
  return Ml(t.animate) || yd.some((e) => go(t[e]));
}
function Vx(t) {
  return !!(jl(t) || t.variants);
}
function NM(t, e) {
  if (jl(t)) {
      const { initial: i, animate: s } = t;
      return { initial: i === !1 || go(i) ? i : void 0, animate: go(s) ? s : void 0 };
  }
  return t.inherit !== !1 ? e : {};
}
function FM(t) {
  const { initial: e, animate: i } = NM(t, A.useContext(Il));
  return A.useMemo(() => ({ initial: e, animate: i }), [fv(e), fv(i)]);
}
function fv(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const dv = {
      animation: ["animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag"],
      exit: ["exit"],
      drag: ["drag", "dragControls"],
      focus: ["whileFocus"],
      hover: ["whileHover", "onHoverStart", "onHoverEnd"],
      tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
      pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
      inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
      layout: ["layout", "layoutId"],
  },
  Jr = {};
for (const t in dv) Jr[t] = { isEnabled: (e) => dv[t].some((i) => !!e[i]) };
function VM(t) {
  for (const e in t) Jr[e] = { ...Jr[e], ...t[e] };
}
const BM = Symbol.for("motionComponentSymbol");
function $M({ preloadedFeatures: t, createVisualElement: e, useRender: i, useVisualState: s, Component: o }) {
  t && VM(t);
  function l(c, d) {
      let h;
      const m = { ...A.useContext(zx), ...c, layoutId: UM(c) },
          { isStatic: y } = m,
          v = FM(c),
          w = s(c, y);
      if (!y && Bd) {
          HM();
          const S = WM(m);
          (h = S.MeasureLayout), (v.visualElement = IM(o, w, m, e, S.ProjectionNode));
      }
      return k.jsxs(Il.Provider, { value: v, children: [h && v.visualElement ? k.jsx(h, { visualElement: v.visualElement, ...m }) : null, i(o, c, zM(w, v.visualElement, d), w, y, v.visualElement)] });
  }
  const u = A.forwardRef(l);
  return (u[BM] = o), u;
}
function UM({ layoutId: t }) {
  const e = A.useContext(kx).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function HM(t, e) {
  A.useContext(Nx).strict;
}
function WM(t) {
  const { drag: e, layout: i } = Jr;
  if (!e && !i) return {};
  const s = { ...e, ...i };
  return { MeasureLayout: (e != null && e.isEnabled(t)) || (i != null && i.isEnabled(t)) ? s.MeasureLayout : void 0, ProjectionNode: s.ProjectionNode };
}
const qM = ["animate", "circle", "defs", "desc", "ellipse", "g", "image", "line", "filter", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline", "rect", "stop", "switch", "symbol", "svg", "text", "tspan", "use", "view"];
function $d(t) {
  return typeof t != "string" || t.includes("-") ? !1 : !!(qM.indexOf(t) > -1 || /[A-Z]/u.test(t));
}
function Bx(t, { style: e, vars: i }, s, o) {
  Object.assign(t.style, e, o && o.getProjectionStyles(s));
  for (const l in i) t.style.setProperty(l, i[l]);
}
const $x = new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust",
]);
function Ux(t, e, i, s) {
  Bx(t, e, void 0, s);
  for (const o in e.attrs) t.setAttribute($x.has(o) ? o : jd(o), e.attrs[o]);
}
function Hx(t, { layout: e, layoutId: i }) {
  return ir.has(t) || t.startsWith("origin") || ((e || i !== void 0) && (!!Sl[t] || t === "opacity"));
}
function Ud(t, e, i) {
  var s;
  const { style: o } = t,
      l = {};
  for (const u in o) (it(o[u]) || (e.style && it(e.style[u])) || Hx(u, t) || ((s = i == null ? void 0 : i.getValue(u)) === null || s === void 0 ? void 0 : s.liveStyle) !== void 0) && (l[u] = o[u]);
  return l;
}
function Wx(t, e, i) {
  const s = Ud(t, e, i);
  for (const o in t)
      if (it(t[o]) || it(e[o])) {
          const l = Eo.indexOf(o) !== -1 ? "attr" + o.charAt(0).toUpperCase() + o.substring(1) : o;
          s[l] = t[o];
      }
  return s;
}
function Kf(t) {
  const e = A.useRef(null);
  return e.current === null && (e.current = t()), e.current;
}
function KM({ scrapeMotionValuesFromProps: t, createRenderState: e, onMount: i }, s, o, l) {
  const u = { latestValues: GM(s, o, l, t), renderState: e() };
  return i && (u.mount = (c) => i(s, c, u)), u;
}
const qx = (t) => (e, i) => {
  const s = A.useContext(Il),
      o = A.useContext(Fd),
      l = () => KM(t, e, s, o);
  return i ? l() : Kf(l);
};
function GM(t, e, i, s) {
  const o = {},
      l = s(t, {});
  for (const v in l) o[v] = cl(l[v]);
  let { initial: u, animate: c } = t;
  const d = jl(t),
      h = Vx(t);
  e && h && !d && t.inherit !== !1 && (u === void 0 && (u = e.initial), c === void 0 && (c = e.animate));
  let m = i ? i.initial === !1 : !1;
  m = m || u === !1;
  const y = m ? c : u;
  if (y && typeof y != "boolean" && !Ml(y)) {
      const v = Array.isArray(y) ? y : [y];
      for (let w = 0; w < v.length; w++) {
          const S = md(t, v[w]);
          if (S) {
              const { transitionEnd: b, transition: C, ...P } = S;
              for (const E in P) {
                  let D = P[E];
                  if (Array.isArray(D)) {
                      const I = m ? D.length - 1 : 0;
                      D = D[I];
                  }
                  D !== null && (o[E] = D);
              }
              for (const E in b) o[E] = b[E];
          }
      }
  }
  return o;
}
const Hd = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} }),
  Kx = () => ({ ...Hd(), attrs: {} }),
  Gx = (t, e) => (e && typeof t == "number" ? e.transform(t) : t),
  YM = { x: "translateX", y: "translateY", z: "translateZ", transformPerspective: "perspective" },
  QM = Eo.length;
function XM(t, e, i) {
  let s = "",
      o = !0;
  for (let l = 0; l < QM; l++) {
      const u = Eo[l],
          c = t[u];
      if (c === void 0) continue;
      let d = !0;
      if ((typeof c == "number" ? (d = c === (u.startsWith("scale") ? 1 : 0)) : (d = parseFloat(c) === 0), !d || i)) {
          const h = Gx(c, Pd[u]);
          if (!d) {
              o = !1;
              const m = YM[u] || u;
              s += `${m}(${h}) `;
          }
          i && (e[u] = h);
      }
  }
  return (s = s.trim()), i ? (s = i(e, o ? "" : s)) : o && (s = "none"), s;
}
function Wd(t, e, i) {
  const { style: s, vars: o, transformOrigin: l } = t;
  let u = !1,
      c = !1;
  for (const d in e) {
      const h = e[d];
      if (ir.has(d)) {
          u = !0;
          continue;
      } else if (I0(d)) {
          o[d] = h;
          continue;
      } else {
          const m = Gx(h, Pd[d]);
          d.startsWith("origin") ? ((c = !0), (l[d] = m)) : (s[d] = m);
      }
  }
  if ((e.transform || (u || i ? (s.transform = XM(e, t.transform, i)) : s.transform && (s.transform = "none")), c)) {
      const { originX: d = "50%", originY: h = "50%", originZ: m = 0 } = l;
      s.transformOrigin = `${d} ${h} ${m}`;
  }
}
function hv(t, e, i) {
  return typeof t == "string" ? t : oe.transform(e + i * t);
}
function ZM(t, e, i) {
  const s = hv(e, t.x, t.width),
      o = hv(i, t.y, t.height);
  return `${s} ${o}`;
}
const JM = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  eA = { offset: "strokeDashoffset", array: "strokeDasharray" };
function tA(t, e, i = 1, s = 0, o = !0) {
  t.pathLength = 1;
  const l = o ? JM : eA;
  t[l.offset] = oe.transform(-s);
  const u = oe.transform(e),
      c = oe.transform(i);
  t[l.array] = `${u} ${c}`;
}
function qd(t, { attrX: e, attrY: i, attrScale: s, originX: o, originY: l, pathLength: u, pathSpacing: c = 1, pathOffset: d = 0, ...h }, m, y) {
  if ((Wd(t, h, y), m)) {
      t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
      return;
  }
  (t.attrs = t.style), (t.style = {});
  const { attrs: v, style: w, dimensions: S } = t;
  v.transform && (S && (w.transform = v.transform), delete v.transform),
      S && (o !== void 0 || l !== void 0 || w.transform) && (w.transformOrigin = ZM(S, o !== void 0 ? o : 0.5, l !== void 0 ? l : 0.5)),
      e !== void 0 && (v.x = e),
      i !== void 0 && (v.y = i),
      s !== void 0 && (v.scale = s),
      u !== void 0 && tA(v, u, c, d, !1);
}
const Kd = (t) => typeof t == "string" && t.toLowerCase() === "svg",
  nA = {
      useVisualState: qx({
          scrapeMotionValuesFromProps: Wx,
          createRenderState: Kx,
          onMount: (t, e, { renderState: i, latestValues: s }) => {
              Oe.read(() => {
                  try {
                      i.dimensions = typeof e.getBBox == "function" ? e.getBBox() : e.getBoundingClientRect();
                  } catch {
                      i.dimensions = { x: 0, y: 0, width: 0, height: 0 };
                  }
              }),
                  Oe.render(() => {
                      qd(i, s, Kd(e.tagName), t.transformTemplate), Ux(e, i);
                  });
          },
      }),
  },
  iA = { useVisualState: qx({ scrapeMotionValuesFromProps: Ud, createRenderState: Hd }) };
function Yx(t, e, i) {
  for (const s in e) !it(e[s]) && !Hx(s, i) && (t[s] = e[s]);
}
function rA({ transformTemplate: t }, e) {
  return A.useMemo(() => {
      const i = Hd();
      return Wd(i, e, t), Object.assign({}, i.vars, i.style);
  }, [e]);
}
function sA(t, e) {
  const i = t.style || {},
      s = {};
  return Yx(s, i, t), Object.assign(s, rA(t, e)), s;
}
function oA(t, e) {
  const i = {},
      s = sA(t, e);
  return (
      t.drag && t.dragListener !== !1 && ((i.draggable = !1), (s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none"), (s.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`)),
      t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (i.tabIndex = 0),
      (i.style = s),
      i
  );
}
const aA = new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport",
]);
function bl(t) {
  return t.startsWith("while") || (t.startsWith("drag") && t !== "draggable") || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || aA.has(t);
}
let Qx = (t) => !bl(t);
function lA(t) {
  t && (Qx = (e) => (e.startsWith("on") ? !bl(e) : t(e)));
}
try {
  lA(require("@emotion/is-prop-valid").default);
} catch {}
function uA(t, e, i) {
  const s = {};
  for (const o in t) (o === "values" && typeof t.values == "object") || ((Qx(o) || (i === !0 && bl(o)) || (!e && !bl(o)) || (t.draggable && o.startsWith("onDrag"))) && (s[o] = t[o]));
  return s;
}
function cA(t, e, i, s) {
  const o = A.useMemo(() => {
      const l = Kx();
      return qd(l, e, Kd(s), t.transformTemplate), { ...l.attrs, style: { ...l.style } };
  }, [e]);
  if (t.style) {
      const l = {};
      Yx(l, t.style, t), (o.style = { ...l, ...o.style });
  }
  return o;
}
function fA(t = !1) {
  return (i, s, o, { latestValues: l }, u) => {
      const d = ($d(i) ? cA : oA)(s, l, u, i),
          h = uA(s, typeof i == "string", t),
          m = i !== A.Fragment ? { ...h, ...d, ref: o } : {},
          { children: y } = s,
          v = A.useMemo(() => (it(y) ? y.get() : y), [y]);
      return A.createElement(i, { ...m, children: v });
  };
}
function dA(t, e) {
  return function (s, { forwardMotionProps: o } = { forwardMotionProps: !1 }) {
      const u = { ...($d(s) ? nA : iA), preloadedFeatures: t, useRender: fA(o), createVisualElement: e, Component: s };
      return $M(u);
  };
}
const Gf = { current: null },
  Xx = { current: !1 };
function hA() {
  if (((Xx.current = !0), !!Bd))
      if (window.matchMedia) {
          const t = window.matchMedia("(prefers-reduced-motion)"),
              e = () => (Gf.current = t.matches);
          t.addListener(e), e();
      } else Gf.current = !1;
}
function pA(t, e, i) {
  for (const s in e) {
      const o = e[s],
          l = i[s];
      if (it(o)) t.addValue(s, o);
      else if (it(l)) t.addValue(s, xo(o, { owner: t }));
      else if (l !== o)
          if (t.hasValue(s)) {
              const u = t.getValue(s);
              u.liveStyle === !0 ? u.jump(o) : u.hasAnimated || u.set(o);
          } else {
              const u = t.getStaticValue(s);
              t.addValue(s, xo(u !== void 0 ? u : o, { owner: t }));
          }
  }
  for (const s in i) e[s] === void 0 && t.removeValue(s);
  return e;
}
const es = new WeakMap(),
  mA = [...N0, pt, xi],
  gA = (t) => mA.find(z0(t)),
  pv = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"];
class Zx {
  scrapeMotionValuesFromProps(e, i, s) {
      return {};
  }
  constructor({ parent: e, props: i, presenceContext: s, reducedMotionConfig: o, blockInitialAnimation: l, visualState: u }, c = {}) {
      (this.current = null),
          (this.children = new Set()),
          (this.isVariantNode = !1),
          (this.isControllingVariants = !1),
          (this.shouldReduceMotion = null),
          (this.values = new Map()),
          (this.KeyframeResolver = bd),
          (this.features = {}),
          (this.valueSubscriptions = new Map()),
          (this.prevMotionValues = {}),
          (this.events = {}),
          (this.propEventSubscriptions = {}),
          (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
          (this.render = () => {
              this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
          }),
          (this.renderScheduledAt = 0),
          (this.scheduleRender = () => {
              const v = Rn.now();
              this.renderScheduledAt < v && ((this.renderScheduledAt = v), Oe.render(this.render, !1, !0));
          });
      const { latestValues: d, renderState: h } = u;
      (this.latestValues = d),
          (this.baseTarget = { ...d }),
          (this.initialValues = i.initial ? { ...d } : {}),
          (this.renderState = h),
          (this.parent = e),
          (this.props = i),
          (this.presenceContext = s),
          (this.depth = e ? e.depth + 1 : 0),
          (this.reducedMotionConfig = o),
          (this.options = c),
          (this.blockInitialAnimation = !!l),
          (this.isControllingVariants = jl(i)),
          (this.isVariantNode = Vx(i)),
          this.isVariantNode && (this.variantChildren = new Set()),
          (this.manuallyAnimateOnMount = !!(e && e.current));
      const { willChange: m, ...y } = this.scrapeMotionValuesFromProps(i, {}, this);
      for (const v in y) {
          const w = y[v];
          d[v] !== void 0 && it(w) && w.set(d[v], !1);
      }
  }
  mount(e) {
      (this.current = e),
          es.set(e, this),
          this.projection && !this.projection.instance && this.projection.mount(e),
          this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)),
          this.values.forEach((i, s) => this.bindToMotionValue(s, i)),
          Xx.current || hA(),
          (this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Gf.current),
          this.parent && this.parent.children.add(this),
          this.update(this.props, this.presenceContext);
  }
  unmount() {
      es.delete(this.current),
          this.projection && this.projection.unmount(),
          vi(this.notifyUpdate),
          vi(this.render),
          this.valueSubscriptions.forEach((e) => e()),
          this.valueSubscriptions.clear(),
          this.removeFromVariantTree && this.removeFromVariantTree(),
          this.parent && this.parent.children.delete(this);
      for (const e in this.events) this.events[e].clear();
      for (const e in this.features) {
          const i = this.features[e];
          i && (i.unmount(), (i.isMounted = !1));
      }
      this.current = null;
  }
  bindToMotionValue(e, i) {
      this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
      const s = ir.has(e),
          o = i.on("change", (c) => {
              (this.latestValues[e] = c), this.props.onUpdate && Oe.preRender(this.notifyUpdate), s && this.projection && (this.projection.isTransformDirty = !0);
          }),
          l = i.on("renderRequest", this.scheduleRender);
      let u;
      window.MotionCheckAppearSync && (u = window.MotionCheckAppearSync(this, e, i)),
          this.valueSubscriptions.set(e, () => {
              o(), l(), u && u(), i.owner && i.stop();
          });
  }
  sortNodePosition(e) {
      return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
      let e = "animation";
      for (e in Jr) {
          const i = Jr[e];
          if (!i) continue;
          const { isEnabled: s, Feature: o } = i;
          if ((!this.features[e] && o && s(this.props) && (this.features[e] = new o(this)), this.features[e])) {
              const l = this.features[e];
              l.isMounted ? l.update() : (l.mount(), (l.isMounted = !0));
          }
      }
  }
  triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : $e();
  }
  getStaticValue(e) {
      return this.latestValues[e];
  }
  setStaticValue(e, i) {
      this.latestValues[e] = i;
  }
  update(e, i) {
      (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), (this.prevProps = this.props), (this.props = e), (this.prevPresenceContext = this.presenceContext), (this.presenceContext = i);
      for (let s = 0; s < pv.length; s++) {
          const o = pv[s];
          this.propEventSubscriptions[o] && (this.propEventSubscriptions[o](), delete this.propEventSubscriptions[o]);
          const l = "on" + o,
              u = e[l];
          u && (this.propEventSubscriptions[o] = this.on(o, u));
      }
      (this.prevMotionValues = pA(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues)), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
      return this.props;
  }
  getVariant(e) {
      return this.props.variants ? this.props.variants[e] : void 0;
  }
  getDefaultTransition() {
      return this.props.transition;
  }
  getTransformPagePoint() {
      return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  addVariantChild(e) {
      const i = this.getClosestVariantNode();
      if (i) return i.variantChildren && i.variantChildren.add(e), () => i.variantChildren.delete(e);
  }
  addValue(e, i) {
      const s = this.values.get(e);
      i !== s && (s && this.removeValue(e), this.bindToMotionValue(e, i), this.values.set(e, i), (this.latestValues[e] = i.get()));
  }
  removeValue(e) {
      this.values.delete(e);
      const i = this.valueSubscriptions.get(e);
      i && (i(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
  }
  hasValue(e) {
      return this.values.has(e);
  }
  getValue(e, i) {
      if (this.props.values && this.props.values[e]) return this.props.values[e];
      let s = this.values.get(e);
      return s === void 0 && i !== void 0 && ((s = xo(i === null ? void 0 : i, { owner: this })), this.addValue(e, s)), s;
  }
  readValue(e, i) {
      var s;
      let o = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : (s = this.getBaseTargetFromProps(this.props, e)) !== null && s !== void 0 ? s : this.readValueFromInstance(this.current, e, this.options);
      return o != null && (typeof o == "string" && (D0(o) || O0(o)) ? (o = parseFloat(o)) : !gA(o) && xi.test(i) && (o = q0(e, i)), this.setBaseTarget(e, it(o) ? o.get() : o)), it(o) ? o.get() : o;
  }
  setBaseTarget(e, i) {
      this.baseTarget[e] = i;
  }
  getBaseTarget(e) {
      var i;
      const { initial: s } = this.props;
      let o;
      if (typeof s == "string" || typeof s == "object") {
          const u = md(this.props, s, (i = this.presenceContext) === null || i === void 0 ? void 0 : i.custom);
          u && (o = u[e]);
      }
      if (s && o !== void 0) return o;
      const l = this.getBaseTargetFromProps(this.props, e);
      return l !== void 0 && !it(l) ? l : this.initialValues[e] !== void 0 && o === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, i) {
      return this.events[e] || (this.events[e] = new Id()), this.events[e].add(i);
  }
  notify(e, ...i) {
      this.events[e] && this.events[e].notify(...i);
  }
}
class Jx extends Zx {
  constructor() {
      super(...arguments), (this.KeyframeResolver = K0);
  }
  sortInstanceNodePosition(e, i) {
      return e.compareDocumentPosition(i) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, i) {
      return e.style ? e.style[i] : void 0;
  }
  removeValueFromRenderState(e, { vars: i, style: s }) {
      delete i[e], delete s[e];
  }
  handleChildMotionValue() {
      this.childSubscription && (this.childSubscription(), delete this.childSubscription);
      const { children: e } = this.props;
      it(e) &&
          (this.childSubscription = e.on("change", (i) => {
              this.current && (this.current.textContent = `${i}`);
          }));
  }
}
function yA(t) {
  return window.getComputedStyle(t);
}
class ew extends Jx {
  constructor() {
      super(...arguments), (this.type = "html"), (this.renderInstance = Bx);
  }
  readValueFromInstance(e, i) {
      if (ir.has(i)) {
          const s = Td(i);
          return (s && s.default) || 0;
      } else {
          const s = yA(e),
              o = (I0(i) ? s.getPropertyValue(i) : s[i]) || 0;
          return typeof o == "string" ? o.trim() : o;
      }
  }
  measureInstanceViewportBox(e, { transformPagePoint: i }) {
      return bx(e, i);
  }
  build(e, i, s) {
      Wd(e, i, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, i, s) {
      return Ud(e, i, s);
  }
}
class tw extends Jx {
  constructor() {
      super(...arguments), (this.type = "svg"), (this.isSVGTag = !1), (this.measureInstanceViewportBox = $e);
  }
  getBaseTargetFromProps(e, i) {
      return e[i];
  }
  readValueFromInstance(e, i) {
      if (ir.has(i)) {
          const s = Td(i);
          return (s && s.default) || 0;
      }
      return (i = $x.has(i) ? i : jd(i)), e.getAttribute(i);
  }
  scrapeMotionValuesFromProps(e, i, s) {
      return Wx(e, i, s);
  }
  build(e, i, s) {
      qd(e, i, this.isSVGTag, s.transformTemplate);
  }
  renderInstance(e, i, s, o) {
      Ux(e, i, s, o);
  }
  mount(e) {
      (this.isSVGTag = Kd(e.tagName)), super.mount(e);
  }
}
const vA = (t, e) => ($d(t) ? new tw(e) : new ew(e, { allowProjection: t !== A.Fragment })),
  xA = dA({ ...oR, ...OM, ...SM, ...DM }, vA),
  mv = l_(xA);
function wA(t) {
  return A.useEffect(() => () => t(), []);
}
function SA(t, e = 100, i) {
  const s = i({ ...t, keyframes: [0, e] }),
      o = Math.min(Ed(s), ml);
  return { type: "keyframes", ease: (l) => s.next(o * l).value / e, duration: En(o) };
}
function Gd(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function nw(t, e, i, s) {
  return typeof t == "string" && Gd(e) ? dx(t, i, s) : t instanceof NodeList ? Array.from(t) : Array.isArray(t) ? t : [t];
}
function gv(t, e, i, s) {
  var o;
  return typeof e == "number" ? e : e.startsWith("-") || e.startsWith("+") ? Math.max(0, t + parseFloat(e)) : e === "<" ? i : (o = s.get(e)) !== null && o !== void 0 ? o : t;
}
const bA = (t, e, i) => {
  const s = e - t;
  return ((((i - t) % s) + s) % s) + t;
};
function iw(t, e) {
  return J0(t) ? t[bA(0, t.length, e)] : t;
}
function CA(t, e, i) {
  for (let s = 0; s < t.length; s++) {
      const o = t[s];
      o.at > e && o.at < i && (Ll(t, o), s--);
  }
}
function kA(t, e, i, s, o, l) {
  CA(t, o, l);
  for (let u = 0; u < e.length; u++) t.push({ value: e[u], at: je(o, l, s[u]), easing: iw(i, u) });
}
function PA(t, e) {
  return t.at === e.at ? (t.value === null ? 1 : e.value === null ? -1 : 0) : t.at - e.at;
}
function TA(t, e) {
  for (let i = 0; i < t.length; i++) t[i] = t[i] / (e + 1);
}
function EA(t, e, i) {
  return t * (e + 1);
}
const _A = "easeInOut";
function RA(t, { defaultTransition: e = {}, ...i } = {}, s, o) {
  const l = e.duration || 0.3,
      u = new Map(),
      c = new Map(),
      d = {},
      h = new Map();
  let m = 0,
      y = 0,
      v = 0;
  for (let w = 0; w < t.length; w++) {
      const S = t[w];
      if (typeof S == "string") {
          h.set(S, y);
          continue;
      } else if (!Array.isArray(S)) {
          h.set(S.name, gv(y, S.at, m, h));
          continue;
      }
      let [b, C, P = {}] = S;
      P.at !== void 0 && (y = gv(y, P.at, m, h));
      let E = 0;
      const D = (I, z, N, Q = 0, q = 0) => {
          const K = MA(I),
              { delay: ie = 0, times: ue = ix(K), type: _e = "keyframes", repeat: Te, repeatType: he, repeatDelay: Ge = 0, ...st } = z;
          let { ease: ae = e.ease || "easeOut", duration: U } = z;
          const te = typeof ie == "function" ? ie(Q, q) : ie,
              G = K.length,
              M = Dl(_e) ? _e : o == null ? void 0 : o[_e];
          if (G <= 2 && M) {
              let pe = 100;
              if (G === 2 && DA(K)) {
                  const xe = K[1] - K[0];
                  pe = Math.abs(xe);
              }
              const ge = { ...st };
              U !== void 0 && (ge.duration = Tn(U));
              const Ce = SA(ge, pe, M);
              (ae = Ce.ease), (U = Ce.duration);
          }
          U ?? (U = l);
          const F = y + te;
          ue.length === 1 && ue[0] === 0 && (ue[1] = 1);
          const fe = ue.length - K.length;
          if ((fe > 0 && nx(ue, fe), K.length === 1 && K.unshift(null), Te)) {
              U = EA(U, Te);
              const pe = [...K],
                  ge = [...ue];
              ae = Array.isArray(ae) ? [...ae] : [ae];
              const Ce = [...ae];
              for (let xe = 0; xe < Te; xe++) {
                  K.push(...pe);
                  for (let ke = 0; ke < pe.length; ke++) ue.push(ge[ke] + (xe + 1)), ae.push(ke === 0 ? "linear" : iw(Ce, ke - 1));
              }
              TA(ue, Te);
          }
          const de = F + U;
          kA(N, K, ae, ue, F, de), (E = Math.max(te + U, E)), (v = Math.max(de, v));
      };
      if (it(b)) {
          const I = yv(b, c);
          D(C, P, vv("default", I));
      } else {
          const I = nw(b, C, s, d),
              z = I.length;
          for (let N = 0; N < z; N++) {
              (C = C), (P = P);
              const Q = I[N],
                  q = yv(Q, c);
              for (const K in C) D(C[K], AA(P, K), vv(K, q), N, z);
          }
      }
      (m = y), (y += E);
  }
  return (
      c.forEach((w, S) => {
          for (const b in w) {
              const C = w[b];
              C.sort(PA);
              const P = [],
                  E = [],
                  D = [];
              for (let z = 0; z < C.length; z++) {
                  const { at: N, value: Q, easing: q } = C[z];
                  P.push(Q), E.push(tr(0, v, N)), D.push(q || "easeOut");
              }
              E[0] !== 0 && (E.unshift(0), P.unshift(P[0]), D.unshift(_A)), E[E.length - 1] !== 1 && (E.push(1), P.push(null)), u.has(S) || u.set(S, { keyframes: {}, transition: {} });
              const I = u.get(S);
              (I.keyframes[b] = P), (I.transition[b] = { ...e, duration: v, ease: D, times: E, ...i });
          }
      }),
      u
  );
}
function yv(t, e) {
  return !e.has(t) && e.set(t, {}), e.get(t);
}
function vv(t, e) {
  return e[t] || (e[t] = []), e[t];
}
function MA(t) {
  return Array.isArray(t) ? t : [t];
}
function AA(t, e) {
  return t && t[e] ? { ...t, ...t[e] } : { ...t };
}
const OA = (t) => typeof t == "number",
  DA = (t) => t.every(OA);
function LA(t, e) {
  return t in e;
}
class IA extends Zx {
  constructor() {
      super(...arguments), (this.type = "object");
  }
  readValueFromInstance(e, i) {
      if (LA(i, e)) {
          const s = e[i];
          if (typeof s == "string" || typeof s == "number") return s;
      }
  }
  getBaseTargetFromProps() {}
  removeValueFromRenderState(e, i) {
      delete i.output[e];
  }
  measureInstanceViewportBox() {
      return $e();
  }
  build(e, i) {
      Object.assign(e.output, i);
  }
  renderInstance(e, { output: i }) {
      Object.assign(e, i);
  }
  sortInstanceNodePosition() {
      return 0;
  }
}
function jA(t) {
  const e = { presenceContext: null, props: {}, visualState: { renderState: { transform: {}, transformOrigin: {}, style: {}, vars: {}, attrs: {} }, latestValues: {} } },
      i = Ax(t) ? new tw(e) : new ew(e);
  i.mount(t), es.set(t, i);
}
function zA(t) {
  const e = { presenceContext: null, props: {}, visualState: { renderState: { output: {} }, latestValues: {} } },
      i = new IA(e);
  i.mount(t), es.set(t, i);
}
function NA(t, e) {
  return it(t) || typeof t == "number" || (typeof t == "string" && !Gd(e));
}
function rw(t, e, i, s) {
  const o = [];
  if (NA(t, e)) o.push(Ox(t, (Gd(e) && e.default) || e, i && (i.default || i)));
  else {
      const l = nw(t, e, s),
          u = l.length;
      for (let c = 0; c < u; c++) {
          const d = l[c],
              h = d instanceof Element ? jA : zA;
          es.has(d) || h(d);
          const m = es.get(d),
              y = { ...i };
          "delay" in y && typeof y.delay == "function" && (y.delay = y.delay(c, u)), o.push(...zd(m, { ...e, transition: y }, {}));
      }
  }
  return o;
}
function FA(t, e, i) {
  const s = [];
  return (
      RA(t, e, i, { spring: _d }).forEach(({ keyframes: l, transition: u }, c) => {
          s.push(...rw(c, l, u));
      }),
      s
  );
}
function VA(t) {
  return Array.isArray(t) && Array.isArray(t[0]);
}
function BA(t) {
  function e(i, s, o) {
      let l = [];
      VA(i) ? (l = FA(i, s, t)) : (l = rw(i, s, o, t));
      const u = new ax(l);
      return t && t.animations.push(u), u;
  }
  return e;
}
function $A() {
  const t = Kf(() => ({ current: null, animations: [] })),
      e = Kf(() => BA(t));
  return (
      wA(() => {
          t.animations.forEach((i) => i.stop());
      }),
      [t, e]
  );
}
function UA(t, e) {
  if (t === "first") return 0;
  {
      const i = e - 1;
      return t === "last" ? i : i / 2;
  }
}
function HA(t = 0.1, { startDelay: e = 0, from: i = 0, ease: s } = {}) {
  return (o, l) => {
      const u = typeof i == "number" ? i : UA(i, l),
          c = Math.abs(u - o);
      let d = t * c;
      if (s) {
          const h = l * t;
          d = Nf(s)(d / h) * h;
      }
      return e + d;
  };
}
const sw = ({ words: t, className: e, filter: i = !0, duration: s = 0.5, colors: o = [], toggle: l = !1 }) => {
      const [u, c] = $A();
      let d = t.split(" ");
      A.useEffect(() => {
          l && c("span", { opacity: 1, filter: i ? "blur(0px)" : "none" }, { duration: s, delay: HA(0.2) });
      }, [c, s, i, l]);
      const h = () =>
          k.jsx(mv.div, {
              ref: u,
              children: d.map((m, y) => {
                  const v = o[y % o.length] || "inherit";
                  return k.jsxs(mv.span, { className: `dark:text-white opacity-0 ${v}`, style: { filter: i ? "blur(10px)" : "none" }, children: [m, " "] }, m + y);
              }),
          });
      return k.jsx("div", { className: e, children: h() });
  },
  WA = He.memo(() => {
      const { setActive: t } = S0(),
          { ref: e, inView: i } = rs({ triggerOnce: !0, threshold: 0.2 }),
          s = () => {
              to("pricing", 70), t(!0);
          };
      return k.jsx("div", {
          className: "px-4 sm:px-8 md:px-24 pt-3 sm:pt-6 lg:pt-12 md:pt-12 flex-col items-center gap-16 md:gap-32 self-stretch",
          children: k.jsxs("div", {
              id: "top",
              className: "flex flex-col items-center gap-3 sm:gap-6 lg:gap-24 md:gap-12 self-stretch",
              children: [
                  k.jsx(sw, {
                      toggle: !0,
                      className: "font-publicsans text-[2rem] sm:text-[2rem] 2xl:text-[4.5rem] md:text-[3rem] text-center font-bold self-stretch",
                      duration: 2,
                      filter: !0,
                      words: "Unbreakable Protection for Your FiveM Server",
                      colors: ["text-white-gray", "text-blue-theme", "text-white-gray", "text-white-gray"],
                  }),
                  k.jsx("div", {
                      className:
                          "py-2 px-4 flex items-center justify-center bg-blue-theme text-sm sm:text-base md:text-base text-background-theme rounded-full font-semibold font-jakartasans leading-5 border border-transparent hover:bg-transparent hover:border-blue-theme hover:drop-shadow-[0rem_0rem_1rem_#00A7FD] hover:text-white-gray transition-all duration-300",
                      onClick: () => s(),
                      children: "View Plans",
                  }),
                  k.jsx("div", {
                      ref: e,
                      className: `flex pt-5 px-3 sm:mx-6 lg:mx-24 md:mx-12 justify-center items-center self-stretch ${i ? "animate-custom-fadeIn" : "opacity-0"}`,
                      children: k.jsxs("div", {
                          className: "w-full sm:w-[40rem] md:w-[64rem] lg:w-[64rem] rounded-[1.375rem] border border-[#91a6b633] card-wrapper relative flex flex-col",
                          children: [
                              k.jsx("div", { className: "card-content bg-[#082134] card-shine-effect" }),
                              k.jsxs("div", {
                                  className: "flex items-center justify-between mt-4 mx-4 md:mt-9 md:mx-9 z-20",
                                  children: [
                                      k.jsxs("div", {
                                          className: "flex items-center gap-1 md:gap-2",
                                          children: [
                                              k.jsx("img", { src: "/static/image/logo.svg", alt: "Atomic Shield", className: "h-5 lg:h-7 md:h-6 sm:h-5" }),
                                              k.jsx("div", {
                                                  className: "text-[1rem] sm:text-[0.4375rem] lg:text-[1.75rem] md:text-[0.875rem] font-jakartasans font-bold text-blue-theme tracking-[-0.07rem] leading-[100%]",
                                                  children: "Atomic Shield",
                                              }),
                                          ],
                                      }),
                                      k.jsx("div", {
                                          className:
                                              "py-1 lg:py-2 px-2 lg:px-4 md:px-3 sm:px-2 flex items-center justify-center bg-blue-theme text-xs sm:text-sm md:text-base lg:text-base text-background-theme rounded-full font-semibold font-jakartasans leading-5 border border-transparent hover:bg-transparent hover:border-blue-theme hover:drop-shadow-[0rem_0rem_1rem_#00A7FD] hover:text-white-gray transition-all duration-300",
                                          children: "Dashboard",
                                      }),
                                  ],
                              }),
                              k.jsx("div", {
                                  className: "flex justify-center items-center mt-5 md:mt-10",
                                  children: k.jsxs("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      viewBox: "0 0 945 575",
                                      fill: "none",
                                      className: "w-[90%] h-auto mb-7 sm:mx-5 md:mx-2 animate-pulse",
                                      children: [
                                          k.jsx("path", {
                                              opacity: "0.3",
                                              d:
                                                  "M0.734314 16.2878C0.734314 7.45129 7.89776 0.287842 16.7343 0.287842H713.734C722.571 0.287842 729.734 7.45129 729.734 16.2878V255.288C729.734 264.124 722.571 271.288 713.734 271.288H16.7343C7.89775 271.288 0.734314 264.124 0.734314 255.288V16.2878Z",
                                              fill: "#D6DFE6",
                                              "fill-opacity": "0.2",
                                          }),
                                          k.jsx("path", {
                                              opacity: "0.3",
                                              d:
                                                  "M0.734314 319.288C0.734314 310.451 7.89776 303.288 16.7343 303.288H713.734C722.571 303.288 729.734 310.451 729.734 319.288V558.288C729.734 567.124 722.571 574.288 713.734 574.288H16.7343C7.89775 574.288 0.734314 567.124 0.734314 558.288V319.288Z",
                                              fill: "#D6DFE6",
                                              "fill-opacity": "0.2",
                                          }),
                                          k.jsx("path", {
                                              opacity: "0.3",
                                              d:
                                                  "M761.734 16.2879C761.734 7.4513 768.898 0.287842 777.734 0.287842H928.734C937.571 0.287842 944.734 7.45129 944.734 16.2878V558.288C944.734 567.124 937.571 574.288 928.734 574.288H777.734C768.898 574.288 761.734 567.124 761.734 558.288V16.2879Z",
                                              fill: "#D6DFE6",
                                              "fill-opacity": "0.2",
                                          }),
                                      ],
                                  }),
                              }),
                          ],
                      }),
                  }),
              ],
          }),
      });
  }),
  qA = He.memo(() => {
      const e = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 0.05 : 0.2,
          { ref: i, inView: s } = rs({ triggerOnce: !0, threshold: e });
      return k.jsxs("div", {
          id: "features",
          ref: i,
          className: `flex gap-2 sm:gap-3 lg:gap-12 md:gap-6 py-3 sm:py-3 lg:py-12 md:py-6 flex-col justify-center items-start self-stretch ${s ? "animate-custom-fadeIn" : "opacity-0"}`,
          children: [
              k.jsx(sw, {
                  toggle: s,
                  duration: 2,
                  filter: !0,
                  words: "Why Choose Atomic Shield",
                  colors: ["text-white-gray", "text-white-gray", "text-blue-theme", "text-blue-theme"],
                  className: "text-center font-publicsans font-bold leading-[3.25rem] tracking-[-0.06rem] lg:text-5xl text-[2rem] w-full",
              }),
              k.jsxs("div", {
                  className: "flex flex-col gap-6 self-stretch items-start",
                  children: [
                      k.jsxs("div", {
                          className: "flex flex-col md:flex-row gap-6 self-stretch items-start",
                          children: [
                              k.jsxs("div", {
                                  className:
                                      "flex card-shine-effect h-[20rem] md:h-[30rem] pt-8 flex-col items-start flex-1 rounded-[1.375rem] relative border border-[#91a6b633] bg-[#121920] hover:border-blue-theme justify-between hover:scale-105 transition-all duration-300",
                                  children: [
                                      k.jsxs("div", {
                                          className: "flex gap-2 px-8 flex-col items-start self-stretch",
                                          children: [
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.75rem] font-bold leading-[2rem]", children: "Real-Time Detection" }),
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.25rem] font-medium leading-[2rem]", children: "Instantly detect and prevent cheating activities." }),
                                          ],
                                      }),
                                      k.jsx("img", { src: "/static/image/elm-one.svg", className: "w-full h-auto" }),
                                  ],
                              }),
                              k.jsxs("div", {
                                  className:
                                      "flex card-shine-effect h-[20rem] md:h-[30rem] w-full md:w-[30rem] pt-8 flex-col items-start rounded-[1.375rem] border border-[#91a6b633] bg-[#121920] hover:border-blue-theme justify-between hover:scale-105 transition-all duration-300",
                                  children: [
                                      k.jsxs("div", {
                                          className: "flex gap-2 px-8 flex-col items-start self-stretch",
                                          children: [
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.75rem] font-bold leading-[2rem]", children: "User-Friendly Interface" }),
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.25rem] font-medium leading-[2rem]", children: "Easy to navigate and manage." }),
                                          ],
                                      }),
                                      k.jsx("img", { src: "/static/image/elm-two.svg", className: "w-[100%] sm:w-full lg:w-full md:w-full h-auto" }),
                                  ],
                              }),
                          ],
                      }),
                      k.jsxs("div", {
                          className: "flex flex-col md:flex-row gap-6 self-stretch items-start",
                          children: [
                              k.jsxs("div", {
                                  className:
                                      "flex card-shine-effect h-[20rem] md:h-[30rem] w-full md:w-[30rem] pt-8 flex-col items-start rounded-[1.375rem] border border-[#91a6b633] bg-[#121920] hover:border-blue-theme justify-between hover:scale-105 transition-all duration-300",
                                  children: [
                                      k.jsxs("div", {
                                          className: "flex gap-2 px-8 flex-col items-start self-stretch",
                                          children: [
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.75rem] font-bold leading-[2rem]", children: "Secure and Reliable" }),
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.25rem] font-medium leading-[2rem]", children: "Built with top-notch security." }),
                                          ],
                                      }),
                                      k.jsx("img", { src: "/static/image/elm-three.svg", className: "w-[57%] sm:w-[40%] lg:w-[85%] md:w-[90%] h-auto" }),
                                  ],
                              }),
                              k.jsxs("div", {
                                  className:
                                      "flex card-shine-effect h-[20rem] md:h-[30rem] pt-8 flex-col items-start flex-1 rounded-[1.375rem] relative border border-[#91a6b633] bg-[#121920] hover:border-blue-theme justify-between hover:scale-105 transition-all duration-300",
                                  children: [
                                      k.jsxs("div", {
                                          className: "flex gap-2 px-8 flex-col items-start self-stretch",
                                          children: [
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.75rem] font-bold leading-[2rem]", children: "24/7 Support" }),
                                              k.jsx("div", { className: "self-stretch text-white-gray text-[1.25rem] font-medium leading-[2rem]", children: "Always here to help." }),
                                          ],
                                      }),
                                      k.jsx("img", { src: "/static/image/elm-four.svg", className: "w-full h-auto" }),
                                  ],
                              }),
                          ],
                      }),
                  ],
              }),
          ],
      });
  }),
  KA = He.memo(() => {
      const { ref: t, inView: e } = rs({ triggerOnce: !0, threshold: 0.2 });
      return k.jsx("div", {
          ref: t,
          className: `flex py-1 sm:py-3 lg:py-12 md:py-6 flex-col items-center self-stretch ${e ? "animate-custom-fadeIn" : "opacity-0"}`,
          children: k.jsxs("div", {
              className: "flex py-12 items-start gap-2 sm:gap-1 lg:gap-24 md:gap-12 flex-col md:flex-row w-full",
              children: [
                  k.jsxs("div", {
                      className: "text-white-gray font-publicsans font-bold text-[2rem] sm:text-[2.5rem] md:text-[3rem] tracking-[-0.06rem] leading-[3.25rem]",
                      children: ["About ", k.jsx("span", { className: "text-blue-theme", children: "Atomic Shield" })],
                  }),
                  k.jsx("div", {
                      className: "flex pt-2 flex-col items-start w-full",
                      children: k.jsx("div", {
                          className: "text-white-gray font-jakartasans font-medium leading-8 tracking-[-0.0075rem] text-[1.25rem] sm:text-[1.5rem] md:text-[1.5rem]",
                          children: "Atomic Shield provides the most advanced anti-cheat solutions to protect your gaming experience from cheaters and hackers. Our technology ensures fair play and keeps your gaming environment secure.",
                      }),
                  }),
              ],
          }),
      });
  }),
  GA = He.memo(() => {
      const { buyNowIsActive: t, setActive: e } = S0(),
          { ref: i, inView: s } = rs({ triggerOnce: !0, threshold: 0.2 }),
          o = [
              {
                  title: "Basic",
                  url: "",
                  duration: "per month",
                  price: "$70",
                  features: { feature1: ["Live Web Panel", !0], feature2: ["Fully configurable detections", !0], feature3: ["Detection webhooks on Discord", !0], feature4: ["Instant Delivery", !0], feature5: ["Custom Launcher", !1] },
              },
              {
                  title: "Pro",
                  url: "",
                  duration: "3 months",
                  price: "$175",
                  features: { feature1: ["Live Web Panel", !0], feature2: ["Fully configurable detections", !0], feature3: ["Detection webhooks on Discord", !0], feature4: ["Instant Delivery", !0], feature5: ["Custom Launcher", !1] },
              },
              {
                  title: "Enterprise",
                  duration: "3 months",
                  url: "",
                  price: "$250",
                  features: { feature1: ["Live Web Panel", !0], feature2: ["Fully configurable detections", !0], feature3: ["Detection webhooks on Discord", !0], feature4: ["Instant Delivery", !0], feature5: ["Custom Launcher", !0] },
              },
          ];
      return k.jsxs("div", {
          id: "pricing",
          ref: i,
          className: `flex py-3 sm:py-3 lg:py-12 md:py-6 flex-col justify-center self-stretch items-start gap-2 sm:gap-1 lg:gap-24 md:gap-12 ${s ? "animate-custom-fadeIn" : "opacity-0"}`,
          children: [
              k.jsxs("div", {
                  className: "flex flex-col items-center gap-2 sm:gap-1 lg:gap-24 md:gap-12 self-stretch",
                  children: [
                      k.jsxs("div", {
                          className: "flex flex-col items-start gap-2 lg:gap-4 self-stretch",
                          children: [
                              k.jsx("div", { className: "text-white-gray self-stretch text-center font-jakartasans text-[2rem] lg:text-[4rem] font-bold leading-[4.25rem] tracking-[-0.08rem]", children: "Flexible Pricing Plans" }),
                              k.jsx("div", {
                                  className: "text-white-gray self-stretch text-center font-jakartasans text-base lg:text-[1.5rem] font-normal leading-[2rem] tracking-[-0.0075rem]",
                                  children: "Our pricing plans are designed to be affordable and flexible, catering to all types of users. Choose the plan that best suits your needs and enjoy uninterrupted protection.",
                              }),
                          ],
                      }),
                      k.jsx("button", {
                          className: `py-1 lg:py-2 px-2 lg:px-4 md:px-3 sm:px-2 flex items-center justify-center bg-blue-theme text-xs sm:text-sm md:text-base lg:text-base text-background-theme rounded-full font-semibold font-jakartasans leading-5 border border-transparent hover:bg-transparent hover:border-blue-theme hover:drop-shadow-[0rem_0rem_1rem_#00A7FD] hover:text-white-gray transition-all duration-300 ${
                              t ? "hidden" : ""
                          }`,
                          onClick: () => e(!t),
                          children: "View Pricing",
                      }),
                  ],
              }),
              t &&
                  k.jsx("div", {
                      className: "flex justify-center items-center gap-5 self-stretch flex-col sm:flex-row sm:flex-wrap my-4",
                      children: o.map((l, u) =>
                          k.jsxs(
                              "div",
                              {
                                  className:
                                      "flex p-6 flex-col items-start gap-6 rounded-[1.25rem] animation-pcicing animate-slideLeft relative w-full sm:w-[calc(33.33%-1.25rem)] sm:max-w-[400px] border border-[#91a6b633] hover:border-blue-theme hover:scale-105 transition-all duration-300",
                                  style: { animationDelay: `${u * 0.2}s` },
                                  children: [
                                      k.jsx("div", { className: "card-content rounded-[1.25rem] bg-[#00000067] card-shine-effect backdrop-blur-3xl" }),
                                      k.jsxs("div", {
                                          className: "flex flex-col items-start gap-4 self-stretch z-10",
                                          children: [
                                              k.jsx("div", { className: "self-stretch text-white-gray font-jakartasans text-base font-bold leading-6", children: l.title }),
                                              k.jsxs("div", {
                                                  className: "flex items-baseline gap-1 self-stretch",
                                                  children: [
                                                      k.jsx("div", { className: "text-white-gray text-5xl font-publicsans font-bold leading-[3.25rem]", children: l.price }),
                                                      k.jsx("div", { className: "text-white-gray text-xl font-publicsans font-medium leading-[1.5rem] flex-1", children: l.duration }),
                                                  ],
                                              }),
                                              k.jsx("div", {
                                                  className: "pricing-text self-stretch overflow-hidden text-[#d6dfe69e] text-ellipsis font-jakartasans text-[0.8125rem] font-medium leading-4",
                                                  children: "Start Securing Your Server Now!",
                                              }),
                                          ],
                                      }),
                                      k.jsx("a", {
                                          href: l.url,
                                          className:
                                              "flex items-center justify-center self-stretch px-4 py-2 rounded-xl z-10 border text-white-gray border-[#91a6b633] hover:bg-blue-theme hover:text-background-theme hover:border-blue-theme hover:drop-shadow-[0rem_0rem_1rem_#00A7FD] transition-all duration-300",
                                          children: k.jsx("div", { className: "text-[0.9375rem] font-publicsans font-medium leading-[1.5rem]", children: "Purchase Now" }),
                                      }),
                                      k.jsx("div", { className: "h-[0.1rem] w-full bg-[#d6dfe633] z-10" }),
                                      Object.keys(l.features).map((c, d) => {
                                          const [h, m] = l.features[c];
                                          return k.jsx(
                                              "div",
                                              {
                                                  className: "flex items-center justify-start text-white-gray font-jakartasans",
                                                  children: m
                                                      ? k.jsxs("div", {
                                                            className: "w-full z-10 flex",
                                                            children: [
                                                                k.jsx("img", { src: "/static/image/tick.svg", className: "w-4 mr-3" }),
                                                                k.jsx("div", { className: "text-xs sm:text-sm md:text-base lg:text-base font-jakartasans font-medium", children: h }),
                                                            ],
                                                        })
                                                      : k.jsxs("div", {
                                                            className: "w-full z-10 opacity-60 flex",
                                                            children: [
                                                                k.jsx("img", { src: "/static/image/untick.svg", className: "w-4 mr-3" }),
                                                                k.jsx("div", { className: "text-xs sm:text-sm md:text-base lg:text-base font-jakartasans font-medium", children: h }),
                                                            ],
                                                        }),
                                              },
                                              d
                                          );
                                      }),
                                  ],
                              },
                              u
                          )
                      ),
                  }),
              k.jsx("img", { src: "/static/image/office.png", className: "w-full self-stretch rounded-3xl border border-[#91a6b633]" }),
          ],
      });
  }),
  hf = [
      { avatar: "/static/image/logo.svg", name: "vix<33", title: "Server Owner", testimonial: "Thanks to AtomicShield, our server is safer than ever. It's a total game-changer!" },
      { avatar: "/static/image/logo.svg", name: "sosa", title: "Server Owner", testimonial: "Cheating is a thing of the past with AtomicShield. Our players couldn’t be happier!" },
      { avatar: "/static/image/logo.svg", name: "Dominic", title: "Server Owner", testimonial: "Our server’s integrity is intact, thanks to AtomicShield. Highly recommended!" },
      { avatar: "/static/image/logo.svg", name: "vix<33", title: "Server Owner", testimonial: "Thanks to AtomicShield, our server is safer than ever. It's a total game-changer!" },
      { avatar: "/static/image/logo.svg", name: "sosa", title: "Server Owner", testimonial: "Cheating is a thing of the past with AtomicShield. Our players couldn’t be happier!" },
      { avatar: "/static/image/logo.svg", name: "Dominic", title: "Server Owner", testimonial: "Our server’s integrity is intact, thanks to AtomicShield. Highly recommended!" },
      { avatar: "/static/image/logo.svg", name: "vix<33", title: "Server Owner", testimonial: "Thanks to AtomicShield, our server is safer than ever. It's a total game-changer!" },
      { avatar: "/static/image/logo.svg", name: "sosa", title: "Server Owner", testimonial: "Cheating is a thing of the past with AtomicShield. Our players couldn’t be happier!" },
      { avatar: "/static/image/logo.svg", name: "Dominic", title: "Server Owner", testimonial: "Our server’s integrity is intact, thanks to AtomicShield. Highly recommended!" },
      { avatar: "/static/image/logo.svg", name: "vix<33", title: "Server Owner", testimonial: "Thanks to AtomicShield, our server is safer than ever. It's a total game-changer!" },
      { avatar: "/static/image/logo.svg", name: "sosa", title: "Server Owner", testimonial: "Cheating is a thing of the past with AtomicShield. Our players couldn’t be happier!" },
      { avatar: "/static/image/logo.svg", name: "Dominic", title: "Server Owner", testimonial: "Our server’s integrity is intact, thanks to AtomicShield. Highly recommended!" },
      { avatar: "/static/image/logo.svg", name: "vix<33", title: "Server Owner", testimonial: "Thanks to AtomicShield, our server is safer than ever. It's a total game-changer!" },
      { avatar: "/static/image/logo.svg", name: "sosa", title: "Server Owner", testimonial: "Cheating is a thing of the past with AtomicShield. Our players couldn’t be happier!" },
      { avatar: "/static/image/logo.svg", name: "Dominic", title: "Server Owner", testimonial: "Our server’s integrity is intact, thanks to AtomicShield. Highly recommended!" },
  ],
  YA = He.memo(() => {
      const { ref: t, inView: e } = rs({ triggerOnce: !0, threshold: 0.2 }),
          i = [...hf, ...hf, ...hf];
      return k.jsxs("div", {
          ref: t,
          className: `flex py-3 sm:py-12 flex-col justify-center items-center gap-3 sm:gap-12 self-stretch relative ${e ? "animate-custom-fadeIn" : "opacity-0"}`,
          children: [
              k.jsx("div", { className: "h-full w-8 sm:w-32  absolute left-0 top-0 bg-gradient-to-r from-background-theme via-background-theme to-transparent z-20" }),
              k.jsx("div", { className: "h-full w-8 sm:w-32 absolute right-0 top-0 bg-gradient-to-l from-background-theme via-background-theme to-transparent z-20" }),
              k.jsx("div", { className: "self-stretch text-white-gray text-center font-publicsans text-[2rem] lg:text-[4rem] font-bold sm:leading-[3.25rem] tracking-[-0.06rem] z-20", children: "What Our Users Say" }),
              k.jsx("div", {
                  className: "w-full h-full overflow-hidden",
                  children: k.jsx("div", {
                      className: "flex items-start gap-6 self-stretch animate-scroll",
                      children: i.map((s, o) =>
                          k.jsxs(
                              "div",
                              {
                                  className: "flex min-w-72 p-6 flex-col items-start gap-4 bg-gray-theme border border-[#91a6b633] hover:border-blue-theme rounded-[1.375rem]",
                                  children: [
                                      k.jsxs("div", {
                                          className: "flex items-center gap-3 self-stretch",
                                          children: [
                                              k.jsx("img", { src: s.avatar, alt: "useravt", className: "flex w-12 h-12 rounded-full" }),
                                              k.jsxs("div", {
                                                  className: "flex flex-col items-start flex100",
                                                  children: [
                                                      k.jsx("div", { className: "self-stretch text-white-gray font-jakartasans text-[0.9375rem] font-bold leading-[1.25rem]", children: s.name }),
                                                      k.jsx("div", { className: "self-stretch text-[#d1e0eb9e] font-jakartasans text-[0.9375rem] font-medium leading-[1.25rem]", children: s.title }),
                                                  ],
                                              }),
                                          ],
                                      }),
                                      k.jsxs("div", {
                                          className: "flex pb-2 items-start gap-3 self-stretch",
                                          children: [
                                              k.jsx("div", { className: "flex w-[0.1875rem] flex-col items-center self-stretch", children: k.jsx("div", { className: "w-[0.0938rem] h-full bg-[#d6dfe633] flex100" }) }),
                                              k.jsx("div", { className: "flex100 font-jakartasans text-[#d1e0eb9e] text-[1.25rem] font-medium leading-[1.5rem]", children: s.testimonial }),
                                          ],
                                      }),
                                  ],
                              },
                              o
                          )
                      ),
                  }),
              }),
          ],
      });
  }),
  QA = He.memo(() => {
      const { ref: t, inView: e } = rs({ triggerOnce: !0, threshold: 0.2 }),
          i = [
              { target: 1, title: "Unique Bans Issued", imgSrc: "/static/image/lock.svg", unit: "K" },
              { target: 1, title: "Years on the market", imgSrc: "/static/image/radio-empty.svg", unit: "+" },
              { target: 10, title: "Servers Protected", imgSrc: "/static/image/building.svg", unit: "+" },
          ],
          [s, o] = A.useState(i.map(() => 0)),
          l = (u, c, d = 1e3) => {
              let h = 0;
              const m = Math.max(1, Math.floor(u / (d / 100))),
                  y = setInterval(() => {
                      (h += m),
                          h >= u && (h = u),
                          o((v) => {
                              const w = [...v];
                              return (w[c] = h), w;
                          }),
                          h >= u && clearInterval(y);
                  }, 100);
          };
      return (
          A.useEffect(() => {
              e &&
                  i.forEach((u, c) => {
                      l(u.target, c);
                  });
          }, [e]),
          k.jsxs("div", {
              ref: t,
              className: `flex pt-4 md:pt-16 pb-24 flex-col items-start gap-6 self-stretch ${e ? "animate-custom-fadeIn" : "opacity-0"}`,
              children: [
                  k.jsx("div", {
                      className: "flex flex-col items-start gap-2 lg:gap-4 self-stretch",
                      children: k.jsx("div", { className: "text-white-gray self-stretch text-center font-jakartasans text-[2rem] lg:text-[4rem] font-bold leading-[4.25rem] tracking-[-0.08rem]", children: "Counter Statistics" }),
                  }),
                  k.jsx("div", {
                      className: "flex flex-wrap justify-center items-start gap-6 self-stretch",
                      children: i.map((u, c) =>
                          k.jsxs(
                              "div",
                              {
                                  className: "flex h-64 p-8 flex-col items-start gap-6 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 rounded-[1.25rem] animation-pcicing relative border border-[#91a6b633]",
                                  children: [
                                      k.jsx("div", { className: "card-content rounded-[1.25rem] bg-[#00000067] card-shine-effect backdrop-blur-3xl" }),
                                      k.jsx("img", { src: u.imgSrc, alt: "icon", className: "z-10 w-[4rem]" }),
                                      k.jsx("div", { className: "z-10 text-ellipsis font-jakartasans text-[1rem] font-medium leading-8 text-[#d1e0eb9e] tracking-[-0.0075rem]", children: u.title }),
                                      k.jsxs("div", {
                                          className: "z-10 text-ellipsis font-jakartasans text-[4rem] font-bold leading-8 text-blue-theme tracking-[-0.0075rem] drop-shadow-[0rem_0rem_1rem_#47c2ff5a]",
                                          children: [s[c], u.unit],
                                      }),
                                  ],
                              },
                              c
                          )
                      ),
                  }),
              ],
          })
      );
  }),
  XA = He.memo(() =>
      k.jsxs("body", {
          className: "flex min-h-screen w-full pt-6 md:pt-12 items-start justify-center overflow-hidden relative",
          children: [
              k.jsx(QE, { id: "tsparticles" }),
              k.jsx("div", {
                  className: "relative z-10 flex w-full max-w-screen-xl flex-col items-start",
                  children: k.jsxs("div", { className: "flex flex-col items-center self-stretch px-6 md:px-12", children: [k.jsx(WA, {}), k.jsx(qA, {}), k.jsx(KA, {}), k.jsx(GA, {}), k.jsx(YA, {}), k.jsx(QA, {})] }),
              }),
          ],
      })
  ),
  Yd = He.memo(() => {
      const t = [
          { title: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
          { title: "Resources", links: ["Help Center", "Community", "Developers", "Documentation"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "Compliance"] },
          { title: "Contact", links: ["Support", "Sales", "Partners", "Affiliates"] },
      ];
      return k.jsxs("footer", {
          id: "contact",
          className: "bg-background-theme flex flex-col px-6 pb-6 md:px-12 md:pb-12 items-center md:items-start gap-6 self-stretch z-10 relative",
          children: [
              k.jsx("div", { className: "w-full h-[1.5px] bg-gray-theme absolute top-[-0.5rem] md:top-[-1rem] left-0" }),
              k.jsxs("div", {
                  className: "flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 self-stretch text-center md:text-left",
                  children: [
                      k.jsxs("div", {
                          className: "flex flex-col justify-between items-center md:items-start flex100 self-stretch w-full md:w-[12.5rem]",
                          children: [
                              k.jsxs("div", {
                                  className: "flex h-12 items-center gap-2",
                                  children: [
                                      k.jsx("img", { src: "/static/image/logo.svg", alt: "Atomic Shield", className: "h-7" }),
                                      k.jsx("div", { className: "text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] font-jakartasans font-bold text-blue-theme tracking-[-0.07rem] leading-[100%]", children: "Atomic Shield" }),
                                  ],
                              }),
                              k.jsxs("div", {
                                  className: "flex items-center gap-3 mt-4 md:mt-0",
                                  children: [
                                      k.jsx("a", { href: "", children: k.jsx("img", { src: "/static/image/facebook.svg", alt: "facebook", className: "h-[1.5rem]" }) }),
                                      k.jsx("a", { href: "", children: k.jsx("img", { src: "/static/image/instagram.svg", alt: "instagram", className: "h-[1.5rem]" }) }),
                                      k.jsx("a", { href: "", children: k.jsx("img", { src: "/static/image/twitter.svg", alt: "twitter", className: "h-[1.5rem]" }) }),
                                  ],
                              }),
                          ],
                      }),
                      t.map((e, i) =>
                          k.jsxs(
                              "div",
                              {
                                  className: "flex w-full md:w-[12.5rem] flex-col justify-center items-center md:items-start gap-2",
                                  children: [
                                      k.jsx("div", { className: "text-[#D7DFE5] font-jakartasans text-[0.9375rem] font-semibold leading-[1.25rem]", children: e.title }),
                                      e.links.map((s, o) => k.jsx("div", { className: "text-[#d7dfe58a] font-jakartasans text-[0.9375rem] font-semibold leading-[1.25rem]", children: s }, o)),
                                  ],
                              },
                              i
                          )
                      ),
                  ],
              }),
          ],
      });
  });
var pf = { exports: {} },
  mf,
  xv;
function ZA() {
  if (xv) return mf;
  xv = 1;
  var t = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return (mf = t), mf;
}
var gf, wv;
function JA() {
  if (wv) return gf;
  wv = 1;
  var t = ZA();
  function e() {}
  function i() {}
  return (
      (i.resetWarningCache = e),
      (gf = function () {
          function s(u, c, d, h, m, y) {
              if (y !== t) {
                  var v = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
                  throw ((v.name = "Invariant Violation"), v);
              }
          }
          s.isRequired = s;
          function o() {
              return s;
          }
          var l = {
              array: s,
              bigint: s,
              bool: s,
              func: s,
              number: s,
              object: s,
              string: s,
              symbol: s,
              any: s,
              arrayOf: o,
              element: s,
              elementType: s,
              instanceOf: o,
              node: s,
              objectOf: o,
              oneOf: o,
              oneOfType: o,
              shape: o,
              exact: o,
              checkPropTypes: i,
              resetWarningCache: e,
          };
          return (l.PropTypes = l), l;
      }),
      gf
  );
}
var Sv;
function eO() {
  return Sv || ((Sv = 1), (pf.exports = JA()())), pf.exports;
}
var tO = eO();
const Le = Co(tO);
var yf, bv;
function nO() {
  if (bv) return yf;
  bv = 1;
  function t(c) {
      return c && typeof c == "object" && "default" in c ? c.default : c;
  }
  var e = kl(),
      i = t(e);
  function s(c, d, h) {
      return d in c ? Object.defineProperty(c, d, { value: h, enumerable: !0, configurable: !0, writable: !0 }) : (c[d] = h), c;
  }
  function o(c, d) {
      (c.prototype = Object.create(d.prototype)), (c.prototype.constructor = c), (c.__proto__ = d);
  }
  var l = !!(typeof window < "u" && window.document && window.document.createElement);
  function u(c, d, h) {
      if (typeof c != "function") throw new Error("Expected reducePropsToState to be a function.");
      if (typeof d != "function") throw new Error("Expected handleStateChangeOnClient to be a function.");
      if (typeof h < "u" && typeof h != "function") throw new Error("Expected mapStateOnServer to either be undefined or a function.");
      function m(y) {
          return y.displayName || y.name || "Component";
      }
      return function (v) {
          if (typeof v != "function") throw new Error("Expected WrappedComponent to be a React component.");
          var w = [],
              S;
          function b() {
              (S = c(
                  w.map(function (P) {
                      return P.props;
                  })
              )),
                  C.canUseDOM ? d(S) : h && (S = h(S));
          }
          var C = (function (P) {
              o(E, P);
              function E() {
                  return P.apply(this, arguments) || this;
              }
              (E.peek = function () {
                  return S;
              }),
                  (E.rewind = function () {
                      if (E.canUseDOM) throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");
                      var z = S;
                      return (S = void 0), (w = []), z;
                  });
              var D = E.prototype;
              return (
                  (D.UNSAFE_componentWillMount = function () {
                      w.push(this), b();
                  }),
                  (D.componentDidUpdate = function () {
                      b();
                  }),
                  (D.componentWillUnmount = function () {
                      var z = w.indexOf(this);
                      w.splice(z, 1), b();
                  }),
                  (D.render = function () {
                      return i.createElement(v, this.props);
                  }),
                  E
              );
          })(e.PureComponent);
          return s(C, "displayName", "SideEffect(" + m(v) + ")"), s(C, "canUseDOM", l), C;
      };
  }
  return (yf = u), yf;
}
var iO = nO();
const rO = Co(iO);
var vf, Cv;
function sO() {
  if (Cv) return vf;
  Cv = 1;
  var t = typeof Element < "u",
      e = typeof Map == "function",
      i = typeof Set == "function",
      s = typeof ArrayBuffer == "function" && !!ArrayBuffer.isView;
  function o(l, u) {
      if (l === u) return !0;
      if (l && u && typeof l == "object" && typeof u == "object") {
          if (l.constructor !== u.constructor) return !1;
          var c, d, h;
          if (Array.isArray(l)) {
              if (((c = l.length), c != u.length)) return !1;
              for (d = c; d-- !== 0; ) if (!o(l[d], u[d])) return !1;
              return !0;
          }
          var m;
          if (e && l instanceof Map && u instanceof Map) {
              if (l.size !== u.size) return !1;
              for (m = l.entries(); !(d = m.next()).done; ) if (!u.has(d.value[0])) return !1;
              for (m = l.entries(); !(d = m.next()).done; ) if (!o(d.value[1], u.get(d.value[0]))) return !1;
              return !0;
          }
          if (i && l instanceof Set && u instanceof Set) {
              if (l.size !== u.size) return !1;
              for (m = l.entries(); !(d = m.next()).done; ) if (!u.has(d.value[0])) return !1;
              return !0;
          }
          if (s && ArrayBuffer.isView(l) && ArrayBuffer.isView(u)) {
              if (((c = l.length), c != u.length)) return !1;
              for (d = c; d-- !== 0; ) if (l[d] !== u[d]) return !1;
              return !0;
          }
          if (l.constructor === RegExp) return l.source === u.source && l.flags === u.flags;
          if (l.valueOf !== Object.prototype.valueOf && typeof l.valueOf == "function" && typeof u.valueOf == "function") return l.valueOf() === u.valueOf();
          if (l.toString !== Object.prototype.toString && typeof l.toString == "function" && typeof u.toString == "function") return l.toString() === u.toString();
          if (((h = Object.keys(l)), (c = h.length), c !== Object.keys(u).length)) return !1;
          for (d = c; d-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(u, h[d])) return !1;
          if (t && l instanceof Element) return !1;
          for (d = c; d-- !== 0; ) if (!((h[d] === "_owner" || h[d] === "__v" || h[d] === "__o") && l.$$typeof) && !o(l[h[d]], u[h[d]])) return !1;
          return !0;
      }
      return l !== l && u !== u;
  }
  return (
      (vf = function (u, c) {
          try {
              return o(u, c);
          } catch (d) {
              if ((d.message || "").match(/stack|recursion/i)) return console.warn("react-fast-compare cannot handle circular refs"), !1;
              throw d;
          }
      }),
      vf
  );
}
var oO = sO();
const aO = Co(oO);
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/ var xf, kv;
function lO() {
  if (kv) return xf;
  kv = 1;
  var t = Object.getOwnPropertySymbols,
      e = Object.prototype.hasOwnProperty,
      i = Object.prototype.propertyIsEnumerable;
  function s(l) {
      if (l == null) throw new TypeError("Object.assign cannot be called with null or undefined");
      return Object(l);
  }
  function o() {
      try {
          if (!Object.assign) return !1;
          var l = new String("abc");
          if (((l[5] = "de"), Object.getOwnPropertyNames(l)[0] === "5")) return !1;
          for (var u = {}, c = 0; c < 10; c++) u["_" + String.fromCharCode(c)] = c;
          var d = Object.getOwnPropertyNames(u).map(function (m) {
              return u[m];
          });
          if (d.join("") !== "0123456789") return !1;
          var h = {};
          return (
              "abcdefghijklmnopqrst".split("").forEach(function (m) {
                  h[m] = m;
              }),
              Object.keys(Object.assign({}, h)).join("") === "abcdefghijklmnopqrst"
          );
      } catch {
          return !1;
      }
  }
  return (
      (xf = o()
          ? Object.assign
          : function (l, u) {
                for (var c, d = s(l), h, m = 1; m < arguments.length; m++) {
                    c = Object(arguments[m]);
                    for (var y in c) e.call(c, y) && (d[y] = c[y]);
                    if (t) {
                        h = t(c);
                        for (var v = 0; v < h.length; v++) i.call(c, h[v]) && (d[h[v]] = c[h[v]]);
                    }
                }
                return d;
            }),
      xf
  );
}
var uO = lO();
const cO = Co(uO);
var Qi = { BODY: "bodyAttributes", HTML: "htmlAttributes", TITLE: "titleAttributes" },
  ce = { BASE: "base", BODY: "body", HEAD: "head", HTML: "html", LINK: "link", META: "meta", NOSCRIPT: "noscript", SCRIPT: "script", STYLE: "style", TITLE: "title" };
Object.keys(ce).map(function (t) {
  return ce[t];
});
var Ie = { CHARSET: "charset", CSS_TEXT: "cssText", HREF: "href", HTTPEQUIV: "http-equiv", INNER_HTML: "innerHTML", ITEM_PROP: "itemprop", NAME: "name", PROPERTY: "property", REL: "rel", SRC: "src", TARGET: "target" },
  Cl = { accesskey: "accessKey", charset: "charSet", class: "className", contenteditable: "contentEditable", contextmenu: "contextMenu", "http-equiv": "httpEquiv", itemprop: "itemProp", tabindex: "tabIndex" },
  So = { DEFAULT_TITLE: "defaultTitle", DEFER: "defer", ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters", ON_CHANGE_CLIENT_STATE: "onChangeClientState", TITLE_TEMPLATE: "titleTemplate" },
  fO = Object.keys(Cl).reduce(function (t, e) {
      return (t[Cl[e]] = e), t;
  }, {}),
  dO = [ce.NOSCRIPT, ce.SCRIPT, ce.STYLE],
  dn = "data-react-helmet",
  hO =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
          ? function (t) {
                return typeof t;
            }
          : function (t) {
                return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
            },
  pO = function (t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
  },
  mO = (function () {
      function t(e, i) {
          for (var s = 0; s < i.length; s++) {
              var o = i[s];
              (o.enumerable = o.enumerable || !1), (o.configurable = !0), "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
          }
      }
      return function (e, i, s) {
          return i && t(e.prototype, i), s && t(e, s), e;
      };
  })(),
  Mt =
      Object.assign ||
      function (t) {
          for (var e = 1; e < arguments.length; e++) {
              var i = arguments[e];
              for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s]);
          }
          return t;
      },
  gO = function (t, e) {
      if (typeof e != "function" && e !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
      (t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
  },
  Pv = function (t, e) {
      var i = {};
      for (var s in t) e.indexOf(s) >= 0 || (Object.prototype.hasOwnProperty.call(t, s) && (i[s] = t[s]));
      return i;
  },
  yO = function (t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return e && (typeof e == "object" || typeof e == "function") ? e : t;
  },
  Yf = function (e) {
      var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      return i === !1 ? String(e) : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  },
  vO = function (e) {
      var i = qr(e, ce.TITLE),
          s = qr(e, So.TITLE_TEMPLATE);
      if (s && i)
          return s.replace(/%s/g, function () {
              return Array.isArray(i) ? i.join("") : i;
          });
      var o = qr(e, So.DEFAULT_TITLE);
      return i || o || void 0;
  },
  xO = function (e) {
      return qr(e, So.ON_CHANGE_CLIENT_STATE) || function () {};
  },
  wf = function (e, i) {
      return i
          .filter(function (s) {
              return typeof s[e] < "u";
          })
          .map(function (s) {
              return s[e];
          })
          .reduce(function (s, o) {
              return Mt({}, s, o);
          }, {});
  },
  wO = function (e, i) {
      return i
          .filter(function (s) {
              return typeof s[ce.BASE] < "u";
          })
          .map(function (s) {
              return s[ce.BASE];
          })
          .reverse()
          .reduce(function (s, o) {
              if (!s.length)
                  for (var l = Object.keys(o), u = 0; u < l.length; u++) {
                      var c = l[u],
                          d = c.toLowerCase();
                      if (e.indexOf(d) !== -1 && o[d]) return s.concat(o);
                  }
              return s;
          }, []);
  },
  Zs = function (e, i, s) {
      var o = {};
      return s
          .filter(function (l) {
              return Array.isArray(l[e]) ? !0 : (typeof l[e] < "u" && kO("Helmet: " + e + ' should be of type "Array". Instead found type "' + hO(l[e]) + '"'), !1);
          })
          .map(function (l) {
              return l[e];
          })
          .reverse()
          .reduce(function (l, u) {
              var c = {};
              u.filter(function (v) {
                  for (var w = void 0, S = Object.keys(v), b = 0; b < S.length; b++) {
                      var C = S[b],
                          P = C.toLowerCase();
                      i.indexOf(P) !== -1 && !(w === Ie.REL && v[w].toLowerCase() === "canonical") && !(P === Ie.REL && v[P].toLowerCase() === "stylesheet") && (w = P),
                          i.indexOf(C) !== -1 && (C === Ie.INNER_HTML || C === Ie.CSS_TEXT || C === Ie.ITEM_PROP) && (w = C);
                  }
                  if (!w || !v[w]) return !1;
                  var E = v[w].toLowerCase();
                  return o[w] || (o[w] = {}), c[w] || (c[w] = {}), o[w][E] ? !1 : ((c[w][E] = !0), !0);
              })
                  .reverse()
                  .forEach(function (v) {
                      return l.push(v);
                  });
              for (var d = Object.keys(c), h = 0; h < d.length; h++) {
                  var m = d[h],
                      y = cO({}, o[m], c[m]);
                  o[m] = y;
              }
              return l;
          }, [])
          .reverse();
  },
  qr = function (e, i) {
      for (var s = e.length - 1; s >= 0; s--) {
          var o = e[s];
          if (o.hasOwnProperty(i)) return o[i];
      }
      return null;
  },
  SO = function (e) {
      return {
          baseTag: wO([Ie.HREF, Ie.TARGET], e),
          bodyAttributes: wf(Qi.BODY, e),
          defer: qr(e, So.DEFER),
          encode: qr(e, So.ENCODE_SPECIAL_CHARACTERS),
          htmlAttributes: wf(Qi.HTML, e),
          linkTags: Zs(ce.LINK, [Ie.REL, Ie.HREF], e),
          metaTags: Zs(ce.META, [Ie.NAME, Ie.CHARSET, Ie.HTTPEQUIV, Ie.PROPERTY, Ie.ITEM_PROP], e),
          noscriptTags: Zs(ce.NOSCRIPT, [Ie.INNER_HTML], e),
          onChangeClientState: xO(e),
          scriptTags: Zs(ce.SCRIPT, [Ie.SRC, Ie.INNER_HTML], e),
          styleTags: Zs(ce.STYLE, [Ie.CSS_TEXT], e),
          title: vO(e),
          titleAttributes: wf(Qi.TITLE, e),
      };
  },
  Qf = (function () {
      var t = Date.now();
      return function (e) {
          var i = Date.now();
          i - t > 16
              ? ((t = i), e(i))
              : setTimeout(function () {
                    Qf(e);
                }, 0);
      };
  })(),
  Tv = function (e) {
      return clearTimeout(e);
  },
  bO = typeof window < "u" ? (window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || Qf : global.requestAnimationFrame || Qf,
  CO = typeof window < "u" ? window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || Tv : global.cancelAnimationFrame || Tv,
  kO = function (e) {
      return console && typeof console.warn == "function" && console.warn(e);
  },
  Js = null,
  PO = function (e) {
      Js && CO(Js),
          e.defer
              ? (Js = bO(function () {
                    Ev(e, function () {
                        Js = null;
                    });
                }))
              : (Ev(e), (Js = null));
  },
  Ev = function (e, i) {
      var s = e.baseTag,
          o = e.bodyAttributes,
          l = e.htmlAttributes,
          u = e.linkTags,
          c = e.metaTags,
          d = e.noscriptTags,
          h = e.onChangeClientState,
          m = e.scriptTags,
          y = e.styleTags,
          v = e.title,
          w = e.titleAttributes;
      Xf(ce.BODY, o), Xf(ce.HTML, l), TO(v, w);
      var S = { baseTag: Or(ce.BASE, s), linkTags: Or(ce.LINK, u), metaTags: Or(ce.META, c), noscriptTags: Or(ce.NOSCRIPT, d), scriptTags: Or(ce.SCRIPT, m), styleTags: Or(ce.STYLE, y) },
          b = {},
          C = {};
      Object.keys(S).forEach(function (P) {
          var E = S[P],
              D = E.newTags,
              I = E.oldTags;
          D.length && (b[P] = D), I.length && (C[P] = S[P].oldTags);
      }),
          i && i(),
          h(e, b, C);
  },
  ow = function (e) {
      return Array.isArray(e) ? e.join("") : e;
  },
  TO = function (e, i) {
      typeof e < "u" && document.title !== e && (document.title = ow(e)), Xf(ce.TITLE, i);
  },
  Xf = function (e, i) {
      var s = document.getElementsByTagName(e)[0];
      if (s) {
          for (var o = s.getAttribute(dn), l = o ? o.split(",") : [], u = [].concat(l), c = Object.keys(i), d = 0; d < c.length; d++) {
              var h = c[d],
                  m = i[h] || "";
              s.getAttribute(h) !== m && s.setAttribute(h, m), l.indexOf(h) === -1 && l.push(h);
              var y = u.indexOf(h);
              y !== -1 && u.splice(y, 1);
          }
          for (var v = u.length - 1; v >= 0; v--) s.removeAttribute(u[v]);
          l.length === u.length ? s.removeAttribute(dn) : s.getAttribute(dn) !== c.join(",") && s.setAttribute(dn, c.join(","));
      }
  },
  Or = function (e, i) {
      var s = document.head || document.querySelector(ce.HEAD),
          o = s.querySelectorAll(e + "[" + dn + "]"),
          l = Array.prototype.slice.call(o),
          u = [],
          c = void 0;
      return (
          i &&
              i.length &&
              i.forEach(function (d) {
                  var h = document.createElement(e);
                  for (var m in d)
                      if (d.hasOwnProperty(m))
                          if (m === Ie.INNER_HTML) h.innerHTML = d.innerHTML;
                          else if (m === Ie.CSS_TEXT) h.styleSheet ? (h.styleSheet.cssText = d.cssText) : h.appendChild(document.createTextNode(d.cssText));
                          else {
                              var y = typeof d[m] > "u" ? "" : d[m];
                              h.setAttribute(m, y);
                          }
                  h.setAttribute(dn, "true"),
                      l.some(function (v, w) {
                          return (c = w), h.isEqualNode(v);
                      })
                          ? l.splice(c, 1)
                          : u.push(h);
              }),
          l.forEach(function (d) {
              return d.parentNode.removeChild(d);
          }),
          u.forEach(function (d) {
              return s.appendChild(d);
          }),
          { oldTags: l, newTags: u }
      );
  },
  aw = function (e) {
      return Object.keys(e).reduce(function (i, s) {
          var o = typeof e[s] < "u" ? s + '="' + e[s] + '"' : "" + s;
          return i ? i + " " + o : o;
      }, "");
  },
  EO = function (e, i, s, o) {
      var l = aw(s),
          u = ow(i);
      return l ? "<" + e + " " + dn + '="true" ' + l + ">" + Yf(u, o) + "</" + e + ">" : "<" + e + " " + dn + '="true">' + Yf(u, o) + "</" + e + ">";
  },
  _O = function (e, i, s) {
      return i.reduce(function (o, l) {
          var u = Object.keys(l)
                  .filter(function (h) {
                      return !(h === Ie.INNER_HTML || h === Ie.CSS_TEXT);
                  })
                  .reduce(function (h, m) {
                      var y = typeof l[m] > "u" ? m : m + '="' + Yf(l[m], s) + '"';
                      return h ? h + " " + y : y;
                  }, ""),
              c = l.innerHTML || l.cssText || "",
              d = dO.indexOf(e) === -1;
          return o + "<" + e + " " + dn + '="true" ' + u + (d ? "/>" : ">" + c + "</" + e + ">");
      }, "");
  },
  lw = function (e) {
      var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return Object.keys(e).reduce(function (s, o) {
          return (s[Cl[o] || o] = e[o]), s;
      }, i);
  },
  RO = function (e) {
      var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return Object.keys(e).reduce(function (s, o) {
          return (s[fO[o] || o] = e[o]), s;
      }, i);
  },
  MO = function (e, i, s) {
      var o,
          l = ((o = { key: i }), (o[dn] = !0), o),
          u = lw(s, l);
      return [He.createElement(ce.TITLE, u, i)];
  },
  AO = function (e, i) {
      return i.map(function (s, o) {
          var l,
              u = ((l = { key: o }), (l[dn] = !0), l);
          return (
              Object.keys(s).forEach(function (c) {
                  var d = Cl[c] || c;
                  if (d === Ie.INNER_HTML || d === Ie.CSS_TEXT) {
                      var h = s.innerHTML || s.cssText;
                      u.dangerouslySetInnerHTML = { __html: h };
                  } else u[d] = s[c];
              }),
              He.createElement(e, u)
          );
      });
  },
  Bn = function (e, i, s) {
      switch (e) {
          case ce.TITLE:
              return {
                  toComponent: function () {
                      return MO(e, i.title, i.titleAttributes);
                  },
                  toString: function () {
                      return EO(e, i.title, i.titleAttributes, s);
                  },
              };
          case Qi.BODY:
          case Qi.HTML:
              return {
                  toComponent: function () {
                      return lw(i);
                  },
                  toString: function () {
                      return aw(i);
                  },
              };
          default:
              return {
                  toComponent: function () {
                      return AO(e, i);
                  },
                  toString: function () {
                      return _O(e, i, s);
                  },
              };
      }
  },
  uw = function (e) {
      var i = e.baseTag,
          s = e.bodyAttributes,
          o = e.encode,
          l = e.htmlAttributes,
          u = e.linkTags,
          c = e.metaTags,
          d = e.noscriptTags,
          h = e.scriptTags,
          m = e.styleTags,
          y = e.title,
          v = y === void 0 ? "" : y,
          w = e.titleAttributes;
      return {
          base: Bn(ce.BASE, i, o),
          bodyAttributes: Bn(Qi.BODY, s, o),
          htmlAttributes: Bn(Qi.HTML, l, o),
          link: Bn(ce.LINK, u, o),
          meta: Bn(ce.META, c, o),
          noscript: Bn(ce.NOSCRIPT, d, o),
          script: Bn(ce.SCRIPT, h, o),
          style: Bn(ce.STYLE, m, o),
          title: Bn(ce.TITLE, { title: v, titleAttributes: w }, o),
      };
  },
  OO = function (e) {
      var i, s;
      return (
          (s = i = (function (o) {
              gO(l, o);
              function l() {
                  return pO(this, l), yO(this, o.apply(this, arguments));
              }
              return (
                  (l.prototype.shouldComponentUpdate = function (c) {
                      return !aO(this.props, c);
                  }),
                  (l.prototype.mapNestedChildrenToProps = function (c, d) {
                      if (!d) return null;
                      switch (c.type) {
                          case ce.SCRIPT:
                          case ce.NOSCRIPT:
                              return { innerHTML: d };
                          case ce.STYLE:
                              return { cssText: d };
                      }
                      throw new Error("<" + c.type + " /> elements are self-closing and can not contain children. Refer to our API for more information.");
                  }),
                  (l.prototype.flattenArrayTypeChildren = function (c) {
                      var d,
                          h = c.child,
                          m = c.arrayTypeChildren,
                          y = c.newChildProps,
                          v = c.nestedChildren;
                      return Mt({}, m, ((d = {}), (d[h.type] = [].concat(m[h.type] || [], [Mt({}, y, this.mapNestedChildrenToProps(h, v))])), d));
                  }),
                  (l.prototype.mapObjectTypeChildren = function (c) {
                      var d,
                          h,
                          m = c.child,
                          y = c.newProps,
                          v = c.newChildProps,
                          w = c.nestedChildren;
                      switch (m.type) {
                          case ce.TITLE:
                              return Mt({}, y, ((d = {}), (d[m.type] = w), (d.titleAttributes = Mt({}, v)), d));
                          case ce.BODY:
                              return Mt({}, y, { bodyAttributes: Mt({}, v) });
                          case ce.HTML:
                              return Mt({}, y, { htmlAttributes: Mt({}, v) });
                      }
                      return Mt({}, y, ((h = {}), (h[m.type] = Mt({}, v)), h));
                  }),
                  (l.prototype.mapArrayTypeChildrenToProps = function (c, d) {
                      var h = Mt({}, d);
                      return (
                          Object.keys(c).forEach(function (m) {
                              var y;
                              h = Mt({}, h, ((y = {}), (y[m] = c[m]), y));
                          }),
                          h
                      );
                  }),
                  (l.prototype.warnOnInvalidChildren = function (c, d) {
                      return !0;
                  }),
                  (l.prototype.mapChildrenToProps = function (c, d) {
                      var h = this,
                          m = {};
                      return (
                          He.Children.forEach(c, function (y) {
                              if (!(!y || !y.props)) {
                                  var v = y.props,
                                      w = v.children,
                                      S = Pv(v, ["children"]),
                                      b = RO(S);
                                  switch ((h.warnOnInvalidChildren(y, w), y.type)) {
                                      case ce.LINK:
                                      case ce.META:
                                      case ce.NOSCRIPT:
                                      case ce.SCRIPT:
                                      case ce.STYLE:
                                          m = h.flattenArrayTypeChildren({ child: y, arrayTypeChildren: m, newChildProps: b, nestedChildren: w });
                                          break;
                                      default:
                                          d = h.mapObjectTypeChildren({ child: y, newProps: d, newChildProps: b, nestedChildren: w });
                                          break;
                                  }
                              }
                          }),
                          (d = this.mapArrayTypeChildrenToProps(m, d)),
                          d
                      );
                  }),
                  (l.prototype.render = function () {
                      var c = this.props,
                          d = c.children,
                          h = Pv(c, ["children"]),
                          m = Mt({}, h);
                      return d && (m = this.mapChildrenToProps(d, m)), He.createElement(e, m);
                  }),
                  mO(l, null, [
                      {
                          key: "canUseDOM",
                          set: function (c) {
                              e.canUseDOM = c;
                          },
                      },
                  ]),
                  l
              );
          })(He.Component)),
          (i.propTypes = {
              base: Le.object,
              bodyAttributes: Le.object,
              children: Le.oneOfType([Le.arrayOf(Le.node), Le.node]),
              defaultTitle: Le.string,
              defer: Le.bool,
              encodeSpecialCharacters: Le.bool,
              htmlAttributes: Le.object,
              link: Le.arrayOf(Le.object),
              meta: Le.arrayOf(Le.object),
              noscript: Le.arrayOf(Le.object),
              onChangeClientState: Le.func,
              script: Le.arrayOf(Le.object),
              style: Le.arrayOf(Le.object),
              title: Le.string,
              titleAttributes: Le.object,
              titleTemplate: Le.string,
          }),
          (i.defaultProps = { defer: !0, encodeSpecialCharacters: !0 }),
          (i.peek = e.peek),
          (i.rewind = function () {
              var o = e.rewind();
              return o || (o = uw({ baseTag: [], bodyAttributes: {}, encodeSpecialCharacters: !0, htmlAttributes: {}, linkTags: [], metaTags: [], noscriptTags: [], scriptTags: [], styleTags: [], title: "", titleAttributes: {} })), o;
          }),
          s
      );
  },
  DO = function () {
      return null;
  },
  LO = rO(SO, PO, uw)(DO),
  bo = OO(LO);
bo.renderStatic = bo.rewind;
const IO = He.memo(() =>
      k.jsxs(k.Fragment, {
          children: [
              k.jsxs(bo, {
                  children: [
                      k.jsx("title", { children: "Atomic Shield - Home" }),
                      k.jsx("meta", { name: "description", content: "Atomic Shield" }),
                      k.jsx("meta", { name: "keywords", content: "Atomic Shield, AntiCheat Fivem, Fivem Shield, Fivem" }),
                  ],
              }),
              k.jsxs("div", {
                  className: "w-full bg-background-theme flex items-start flex-col noselect",
                  children: [k.jsx("h1", { className: "hidden", children: "Atomic Shield" }), k.jsx("img", { src: "/static/image/logo-ico.svg", alt: "Atomic Shield", className: "hidden" }), k.jsx(sd, {}), k.jsx(XA, {}), k.jsx(Yd, {})],
              }),
          ],
      })
  ),
  jO = He.memo(() => {
      const [t, e] = A.useState(!1),
          i = () => {
              e((s) => !s);
          };
      return k.jsx("div", {
          className: "flex py-12 items-center justify-center self-stretch px-4 sm:px-8 md:px-12",
          children: k.jsx("div", {
              className: "flex flex-col items-center w-full max-w-lg mx-auto",
              children: k.jsx("div", {
                  className: "flex min-h-[43rem] py-8 flex-col items-center gap-8 self-stretch",
                  children: k.jsxs("div", {
                      className: "flex w-full flex-col items-center gap-6",
                      children: [
                          k.jsxs("div", {
                              className: "flex flex-col items-center gap-2 w-full text-center",
                              children: [
                                  k.jsx("h1", { className: "text-white-gray text-xl sm:text-2xl font-bold leading-6 sm:leading-8", children: "Sign In" }),
                                  k.jsx("p", { className: "text-white-gray text-sm sm:text-base font-normal leading-5", children: "Enter your credentials to access your account." }),
                              ],
                          }),
                          k.jsxs("div", {
                              className: "flex flex-col items-start gap-4 w-full",
                              children: [
                                  k.jsx("input", {
                                      type: "text",
                                      className: "flex px-3 py-2 gap-2 w-full border border-[#91a6b633] bg-[#121920] rounded-lg text-sm leading-5 text-white-gray placeholder:text-[#d1e2eb66] focus:outline-none",
                                      placeholder: "Email Address",
                                  }),
                                  k.jsxs("div", {
                                      className: "relative w-full",
                                      children: [
                                          k.jsx("input", {
                                              type: t ? "text" : "password",
                                              className: "flex px-3 py-2 gap-2 w-full border border-[#91a6b633] bg-[#121920] rounded-lg text-sm leading-5 text-white-gray placeholder:text-[#d1e2eb66] focus:outline-none",
                                              placeholder: "Your Password",
                                          }),
                                          k.jsx("button", {
                                              type: "button",
                                              className: "absolute inset-y-0 right-3 flex items-center text-[#d1e2eb66]",
                                              onClick: i,
                                              children: t
                                                  ? k.jsx("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        strokeWidth: 1.5,
                                                        stroke: "currentColor",
                                                        className: "w-5 h-5",
                                                        children: k.jsx("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            d:
                                                                "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88",
                                                        }),
                                                    })
                                                  : k.jsxs("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        strokeWidth: 1.5,
                                                        stroke: "currentColor",
                                                        className: "w-5 h-5",
                                                        children: [
                                                            k.jsx("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                d:
                                                                    "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z",
                                                            }),
                                                            k.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                                                        ],
                                                    }),
                                          }),
                                      ],
                                  }),
                                  k.jsx("button", { className: "flex px-3 py-2 justify-center items-center w-full rounded-lg bg-blue-theme text-background-theme text-sm sm:text-base font-semibold leading-5", children: "Sign In" }),
                                  k.jsx("a", {
                                      href: "/auth/signup",
                                      className: "flex px-3 py-2 justify-center items-center w-full rounded-lg bg-[#121920] border border-[#91a6b633] text-white-gray text-sm sm:text-base font-semibold leading-5",
                                      children: "Create New Account",
                                  }),
                              ],
                          }),
                          k.jsxs("div", {
                              className: "flex items-center w-full gap-2",
                              children: [
                                  k.jsx("div", { className: "flex-1 h-[1px] bg-[#121920]" }),
                                  k.jsx("span", { className: "text-[#d1e2eb9e] font-medium text-xs sm:text-sm whitespace-nowrap", children: "or continue with" }),
                                  k.jsx("div", { className: "flex-1 h-[1px] bg-[#121920]" }),
                              ],
                          }),
                          k.jsxs("div", {
                              className: "flex p-2 items-center justify-center self-stretch rounded-lg border border-[#91a6b633] relative",
                              children: [
                                  k.jsx("div", { className: "text-white-gray text-center font-jakartasansn font-semibold leading-[1.25rem] text-base", children: "Discord" }),
                                  k.jsxs("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      width: "20",
                                      height: "20",
                                      viewBox: "0 0 20 20",
                                      fill: "none",
                                      className: "w-5 h-5 absolute left-2",
                                      children: [
                                          k.jsx("mask", { id: "mask0_9_9404", maskUnits: "userSpaceOnUse", x: "0", y: "0", width: "20", height: "20", children: k.jsx("path", { d: "M20 0H0V20H20V0Z", fill: "white" }) }),
                                          k.jsxs("g", {
                                              mask: "url(#mask0_9_9404)",
                                              children: [
                                                  k.jsx("path", {
                                                      d: "M0 9.97674C0 4.46512 4.46512 0 9.97674 0C15.4884 0 19.9535 4.46512 19.9535 9.97674C19.9535 15.4884 15.4884 19.9535 9.97674 19.9535C4.46512 19.9419 0 15.4767 0 9.97674Z",
                                                      fill: "#5865F2",
                                                  }),
                                                  k.jsx("path", {
                                                      d:
                                                          "M14.4651 5.91857C13.6163 5.53485 12.7325 5.25578 11.8139 5.10461C11.6977 5.31392 11.5698 5.58136 11.4767 5.80229C10.5 5.65113 9.51162 5.65113 8.53487 5.80229C8.43022 5.5581 8.31394 5.32554 8.18603 5.10461C7.26743 5.25578 6.37208 5.53485 5.53487 5.9302C3.86045 8.4302 3.40697 10.8604 3.6279 13.2674C4.61627 14 5.70929 14.5581 6.88371 14.9069C7.15115 14.5465 7.38371 14.1744 7.58138 13.779C7.19766 13.6395 6.8372 13.4651 6.48836 13.2558C6.58138 13.186 6.66278 13.1162 6.7558 13.0465C8.81394 14.0232 11.2093 14.0232 13.2674 13.0465C13.3605 13.1162 13.4418 13.186 13.5349 13.2558C13.186 13.4651 12.8139 13.6395 12.4302 13.779C12.6279 14.1744 12.8605 14.5465 13.1279 14.9069C14.3023 14.5465 15.407 14 16.3837 13.2674C16.6395 10.4767 15.9186 8.0581 14.4651 5.91857ZM7.86046 11.779C7.22092 11.779 6.70929 11.1976 6.70929 10.4883C6.70929 9.77903 7.22092 9.18601 7.86046 9.18601C8.51162 9.18601 9.02325 9.7674 9.02325 10.4883C9.01162 11.1976 8.51162 11.779 7.86046 11.779ZM12.1395 11.779C11.5 11.779 10.9884 11.1976 10.9884 10.4883C10.9884 9.77903 11.5 9.18601 12.1395 9.18601C12.7907 9.18601 13.3023 9.7674 13.2907 10.4883C13.2791 11.2093 12.7791 11.779 12.1395 11.779Z",
                                                      fill: "white",
                                                  }),
                                              ],
                                          }),
                                      ],
                                  }),
                              ],
                          }),
                      ],
                  }),
              }),
          }),
      });
  }),
  zO = He.memo(() =>
      k.jsxs(k.Fragment, {
          children: [
              k.jsxs(bo, {
                  children: [
                      k.jsx("title", { children: "Atomic Shield - Sign In" }),
                      k.jsx("meta", { name: "description", content: "Atomic Shield" }),
                      k.jsx("meta", { name: "keywords", content: "Atomic Shield, AntiCheat Fivem, Fivem Shield, Fivem" }),
                  ],
              }),
              k.jsxs("div", {
                  className: "w-full bg-background-theme flex items-start flex-col noselect",
                  children: [
                      k.jsx("h1", { className: "hidden", children: "Atomic Shield - Sign In" }),
                      k.jsx("img", { src: "/static/image/logo-ico.svg", alt: "Atomic Shield", className: "hidden" }),
                      k.jsx(sd, {}),
                      k.jsx(jO, {}),
                      k.jsx(Yd, {}),
                  ],
              }),
          ],
      })
  ),
  NO = He.memo(() => {
      const [t, e] = A.useState(!1),
          [i, s] = A.useState(!1),
          o = () => {
              e((u) => !u);
          },
          l = () => {
              s((u) => !u);
          };
      return k.jsx("div", {
          className: "flex py-12 items-center justify-center self-stretch px-4 sm:px-8 md:px-12",
          children: k.jsx("div", {
              className: "flex flex-col items-center w-full max-w-lg mx-auto",
              children: k.jsx("div", {
                  className: "flex min-h-[43rem] py-8 flex-col items-center gap-8 self-stretch",
                  children: k.jsxs("div", {
                      className: "flex w-full flex-col items-center gap-6",
                      children: [
                          k.jsxs("div", {
                              className: "flex flex-col items-center gap-2 w-full text-center",
                              children: [
                                  k.jsx("h1", { className: "text-white-gray text-xl sm:text-2xl font-bold leading-6 sm:leading-8", children: "Create Your Account" }),
                                  k.jsx("p", { className: "text-white-gray text-sm sm:text-base font-normal leading-5", children: "Join Atomic Shield today and start innovating!" }),
                              ],
                          }),
                          k.jsxs("div", {
                              className: "flex flex-col items-start gap-4 w-full",
                              children: [
                                  k.jsx("input", {
                                      type: "text",
                                      className: "flex px-3 py-2 gap-2 w-full border border-[#91a6b633] bg-[#121920] rounded-lg text-sm leading-5 text-white-gray placeholder:text-[#d1e2eb66] focus:outline-none",
                                      placeholder: "Your Name",
                                  }),
                                  k.jsx("input", {
                                      type: "text",
                                      className: "flex px-3 py-2 gap-2 w-full border border-[#91a6b633] bg-[#121920] rounded-lg text-sm leading-5 text-white-gray placeholder:text-[#d1e2eb66] focus:outline-none",
                                      placeholder: "Email Address",
                                  }),
                                  k.jsxs("div", {
                                      className: "relative w-full",
                                      children: [
                                          k.jsx("input", {
                                              type: t ? "text" : "password",
                                              className: "flex px-3 py-2 gap-2 w-full border border-[#91a6b633] bg-[#121920] rounded-lg text-sm leading-5 text-white-gray placeholder:text-[#d1e2eb66] focus:outline-none",
                                              placeholder: "New Password",
                                          }),
                                          k.jsx("button", {
                                              type: "button",
                                              className: "absolute inset-y-0 right-3 flex items-center text-[#d1e2eb66]",
                                              onClick: o,
                                              children: t
                                                  ? k.jsx("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        strokeWidth: 1.5,
                                                        stroke: "currentColor",
                                                        className: "w-5 h-5",
                                                        children: k.jsx("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            d:
                                                                "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88",
                                                        }),
                                                    })
                                                  : k.jsxs("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        strokeWidth: 1.5,
                                                        stroke: "currentColor",
                                                        className: "w-5 h-5",
                                                        children: [
                                                            k.jsx("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                d:
                                                                    "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z",
                                                            }),
                                                            k.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                                                        ],
                                                    }),
                                          }),
                                      ],
                                  }),
                                  k.jsx("button", { className: "flex px-3 py-2 justify-center items-center w-full rounded-lg bg-blue-theme text-background-theme text-sm sm:text-base font-semibold leading-5", children: "Sign Up" }),
                              ],
                          }),
                          k.jsxs("div", {
                              className: "flex items-center w-full gap-2",
                              children: [
                                  k.jsx("div", { className: "flex-1 h-[1px] bg-[#121920]" }),
                                  k.jsx("span", { className: "text-[#d1e2eb9e] font-medium text-xs sm:text-sm whitespace-nowrap", children: "or continue with" }),
                                  k.jsx("div", { className: "flex-1 h-[1px] bg-[#121920]" }),
                              ],
                          }),
                          k.jsxs("div", {
                              className: "flex p-2 items-center justify-center self-stretch rounded-lg border border-[#91a6b633] relative",
                              children: [
                                  k.jsx("div", { className: "text-white-gray text-center font-jakartasansn font-semibold leading-[1.25rem] text-base", children: "Discord" }),
                                  k.jsxs("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      width: "20",
                                      height: "20",
                                      viewBox: "0 0 20 20",
                                      fill: "none",
                                      className: "w-5 h-5 absolute left-2",
                                      children: [
                                          k.jsx("mask", { id: "mask0_9_9404", maskUnits: "userSpaceOnUse", x: "0", y: "0", width: "20", height: "20", children: k.jsx("path", { d: "M20 0H0V20H20V0Z", fill: "white" }) }),
                                          k.jsxs("g", {
                                              mask: "url(#mask0_9_9404)",
                                              children: [
                                                  k.jsx("path", {
                                                      d: "M0 9.97674C0 4.46512 4.46512 0 9.97674 0C15.4884 0 19.9535 4.46512 19.9535 9.97674C19.9535 15.4884 15.4884 19.9535 9.97674 19.9535C4.46512 19.9419 0 15.4767 0 9.97674Z",
                                                      fill: "#5865F2",
                                                  }),
                                                  k.jsx("path", {
                                                      d:
                                                          "M14.4651 5.91857C13.6163 5.53485 12.7325 5.25578 11.8139 5.10461C11.6977 5.31392 11.5698 5.58136 11.4767 5.80229C10.5 5.65113 9.51162 5.65113 8.53487 5.80229C8.43022 5.5581 8.31394 5.32554 8.18603 5.10461C7.26743 5.25578 6.37208 5.53485 5.53487 5.9302C3.86045 8.4302 3.40697 10.8604 3.6279 13.2674C4.61627 14 5.70929 14.5581 6.88371 14.9069C7.15115 14.5465 7.38371 14.1744 7.58138 13.779C7.19766 13.6395 6.8372 13.4651 6.48836 13.2558C6.58138 13.186 6.66278 13.1162 6.7558 13.0465C8.81394 14.0232 11.2093 14.0232 13.2674 13.0465C13.3605 13.1162 13.4418 13.186 13.5349 13.2558C13.186 13.4651 12.8139 13.6395 12.4302 13.779C12.6279 14.1744 12.8605 14.5465 13.1279 14.9069C14.3023 14.5465 15.407 14 16.3837 13.2674C16.6395 10.4767 15.9186 8.0581 14.4651 5.91857ZM7.86046 11.779C7.22092 11.779 6.70929 11.1976 6.70929 10.4883C6.70929 9.77903 7.22092 9.18601 7.86046 9.18601C8.51162 9.18601 9.02325 9.7674 9.02325 10.4883C9.01162 11.1976 8.51162 11.779 7.86046 11.779ZM12.1395 11.779C11.5 11.779 10.9884 11.1976 10.9884 10.4883C10.9884 9.77903 11.5 9.18601 12.1395 9.18601C12.7907 9.18601 13.3023 9.7674 13.2907 10.4883C13.2791 11.2093 12.7791 11.779 12.1395 11.779Z",
                                                      fill: "white",
                                                  }),
                                              ],
                                          }),
                                      ],
                                  }),
                              ],
                          }),
                          k.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                  i
                                      ? k.jsx("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            width: "52",
                                            height: "52",
                                            viewBox: "0 0 512 512",
                                            fill: "none",
                                            className: "w-4 h-4",
                                            onClick: l,
                                            children: k.jsx("path", {
                                                d:
                                                    "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z",
                                                fill: "white",
                                            }),
                                        })
                                      : k.jsx("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            width: "52",
                                            height: "52",
                                            viewBox: "0 0 512 512",
                                            fill: "none",
                                            className: "w-4 h-4",
                                            onClick: l,
                                            children: k.jsx("path", {
                                                d:
                                                    "M256 48C311.165 48 364.071 69.9142 403.078 108.922C442.086 147.929 464 200.835 464 256C464 311.165 442.086 364.071 403.078 403.078C364.071 442.086 311.165 464 256 464C200.835 464 147.929 442.086 108.922 403.078C69.9142 364.071 48 311.165 48 256C48 200.835 69.9142 147.929 108.922 108.922C147.929 69.9142 200.835 48 256 48ZM256 512C323.895 512 389.01 485.029 437.019 437.019C485.029 389.01 512 323.895 512 256C512 188.105 485.029 122.99 437.019 74.9807C389.01 26.9714 323.895 0 256 0C188.105 0 122.99 26.9714 74.9807 74.9807C26.9714 122.99 0 188.105 0 256C0 323.895 26.9714 389.01 74.9807 437.019C122.99 485.029 188.105 512 256 512Z",
                                                fill: "white",
                                            }),
                                        }),
                                  k.jsx("div", { className: "text-white-gray text-center font-jakartasansn font-semibold leading-[1rem] text-base", children: "I agree to the Terms and Conditions" }),
                              ],
                          }),
                      ],
                  }),
              }),
          }),
      });
  }),
  FO = He.memo(() =>
      k.jsxs(k.Fragment, {
          children: [
              k.jsxs(bo, {
                  children: [
                      k.jsx("title", { children: "Atomic Shield - Sign In" }),
                      k.jsx("meta", { name: "description", content: "Atomic Shield" }),
                      k.jsx("meta", { name: "keywords", content: "Atomic Shield, AntiCheat Fivem, Fivem Shield, Fivem" }),
                  ],
              }),
              k.jsxs("div", {
                  className: "w-full bg-background-theme flex items-start flex-col noselect",
                  children: [
                      k.jsx("h1", { className: "hidden", children: "Atomic Shield - Sign In" }),
                      k.jsx("img", { src: "/static/image/logo-ico.svg", alt: "Atomic Shield", className: "hidden" }),
                      k.jsx(sd, {}),
                      k.jsx(NO, {}),
                      k.jsx(Yd, {}),
                  ],
              }),
          ],
      })
  ),
  VO = He.memo(
      () => (
          console.log(`
\x1B[31m
\x1B[0m\x1B[34m  © Copyright By YoungDev 2025 \x1B[0m
for more information visit: \x1B[32mhttps://youngdev.xyz\x1B[0m
`),
          A.useEffect(
              () => (
                  document.body.classList.add("scrollbar-hidden"),
                  () => {
                      document.body.classList.remove("scrollbar-hidden");
                  }
              ),
              []
          ),
          k.jsx(_b, {
              children: k.jsxs(rb, {
                  children: [
                      k.jsx(eo, { path: "/", element: k.jsx(IO, {}) }),
                      k.jsx(eo, { path: "/auth/signin", element: k.jsx(zO, {}) }),
                      k.jsx(eo, { path: "/auth/signup", element: k.jsx(FO, {}) }),
                  ],
              }),
          })
      )
  );
hS.createRoot(document.getElementById("root")).render(k.jsx(A.StrictMode, { children: k.jsx(VO, {}) }));
