var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(async () => {
  (function polyfill() {
    const relList = document.createElement("link").relList;
    if (relList && relList.supports && relList.supports("modulepreload")) {
      return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
      processPreload(link);
    }
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") {
          continue;
        }
        for (const node of mutation.addedNodes) {
          if (node.tagName === "LINK" && node.rel === "modulepreload")
            processPreload(node);
        }
      }
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function getFetchOpts(link) {
      const fetchOpts = {};
      if (link.integrity)
        fetchOpts.integrity = link.integrity;
      if (link.referrerPolicy)
        fetchOpts.referrerPolicy = link.referrerPolicy;
      if (link.crossOrigin === "use-credentials")
        fetchOpts.credentials = "include";
      else if (link.crossOrigin === "anonymous")
        fetchOpts.credentials = "omit";
      else
        fetchOpts.credentials = "same-origin";
      return fetchOpts;
    }
    function processPreload(link) {
      if (link.ep)
        return;
      link.ep = true;
      const fetchOpts = getFetchOpts(link);
      fetch(link.href, fetchOpts);
    }
  })();
  function makeMap(str, expectsLowerCase) {
    const set2 = new Set(str.split(","));
    return (val) => set2.has(val);
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray$1 = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_2, c) => c ? c.toUpperCase() : "");
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction((str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  });
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function normalizeStyle(value) {
    if (isArray$1(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray$1(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (val && val.__v_isRef) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [
          ...val.entries()
        ].reduce((entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        }, {})
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [
          ...val.values()
        ].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray$1(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
  };
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this.effects = [];
      this.cleanups = [];
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
      }
    }
    get active() {
      return this._active;
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
    on() {
      activeEffectScope = this;
    }
    off() {
      activeEffectScope = this.parent;
    }
    stop(fromParent) {
      if (this._active) {
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
        this._active = false;
      }
    }
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function recordEffectScope(effect2, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect2);
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  let activeEffect;
  class ReactiveEffect {
    constructor(fn, trigger2, scheduler, scope) {
      this.fn = fn;
      this.trigger = trigger2;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this._dirtyLevel = 4;
      this._trackId = 0;
      this._runnings = 0;
      this._shouldSchedule = false;
      this._depsLength = 0;
      recordEffectScope(this, scope);
    }
    get dirty() {
      if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
        this._dirtyLevel = 1;
        pauseTracking();
        for (let i = 0; i < this._depsLength; i++) {
          const dep = this.deps[i];
          if (dep.computed) {
            triggerComputed(dep.computed);
            if (this._dirtyLevel >= 4) {
              break;
            }
          }
        }
        if (this._dirtyLevel === 1) {
          this._dirtyLevel = 0;
        }
        resetTracking();
      }
      return this._dirtyLevel >= 4;
    }
    set dirty(v) {
      this._dirtyLevel = v ? 4 : 0;
    }
    run() {
      this._dirtyLevel = 0;
      if (!this.active) {
        return this.fn();
      }
      let lastShouldTrack = shouldTrack;
      let lastEffect = activeEffect;
      try {
        shouldTrack = true;
        activeEffect = this;
        this._runnings++;
        preCleanupEffect(this);
        return this.fn();
      } finally {
        postCleanupEffect(this);
        this._runnings--;
        activeEffect = lastEffect;
        shouldTrack = lastShouldTrack;
      }
    }
    stop() {
      if (this.active) {
        preCleanupEffect(this);
        postCleanupEffect(this);
        this.onStop && this.onStop();
        this.active = false;
      }
    }
  }
  function triggerComputed(computed2) {
    return computed2.value;
  }
  function preCleanupEffect(effect2) {
    effect2._trackId++;
    effect2._depsLength = 0;
  }
  function postCleanupEffect(effect2) {
    if (effect2.deps.length > effect2._depsLength) {
      for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
        cleanupDepEffect(effect2.deps[i], effect2);
      }
      effect2.deps.length = effect2._depsLength;
    }
  }
  function cleanupDepEffect(dep, effect2) {
    const trackId = dep.get(effect2);
    if (trackId !== void 0 && effect2._trackId !== trackId) {
      dep.delete(effect2);
      if (dep.size === 0) {
        dep.cleanup();
      }
    }
  }
  let shouldTrack = true;
  let pauseScheduleStack = 0;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function pauseScheduling() {
    pauseScheduleStack++;
  }
  function resetScheduling() {
    pauseScheduleStack--;
    while (!pauseScheduleStack && queueEffectSchedulers.length) {
      queueEffectSchedulers.shift()();
    }
  }
  function trackEffect(effect2, dep, debuggerEventExtraInfo) {
    if (dep.get(effect2) !== effect2._trackId) {
      dep.set(effect2, effect2._trackId);
      const oldDep = effect2.deps[effect2._depsLength];
      if (oldDep !== dep) {
        if (oldDep) {
          cleanupDepEffect(oldDep, effect2);
        }
        effect2.deps[effect2._depsLength++] = dep;
      } else {
        effect2._depsLength++;
      }
    }
  }
  const queueEffectSchedulers = [];
  function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
    pauseScheduling();
    for (const effect2 of dep.keys()) {
      let tracking;
      if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
        effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
        effect2._dirtyLevel = dirtyLevel;
      }
      if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
        effect2.trigger();
        if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
          effect2._shouldSchedule = false;
          if (effect2.scheduler) {
            queueEffectSchedulers.push(effect2.scheduler);
          }
        }
      }
    }
    resetScheduling();
  }
  const createDep = (cleanup, computed2) => {
    const dep = /* @__PURE__ */ new Map();
    dep.cleanup = cleanup;
    dep.computed = computed2;
    return dep;
  };
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol("");
  const MAP_KEY_ITERATE_KEY = Symbol("");
  function track(target, type, key) {
    if (shouldTrack && activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
      }
      trackEffect(activeEffect, dep);
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let deps = [];
    if (type === "clear") {
      deps = [
        ...depsMap.values()
      ];
    } else if (key === "length" && isArray$1(target)) {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
          deps.push(dep);
        }
      });
    } else {
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray$1(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            deps.push(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray$1(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    pauseScheduling();
    for (const dep of deps) {
      if (dep) {
        triggerEffects(dep, 4);
      }
    }
    resetScheduling();
  }
  const isNonTrackableKeys = makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
  const arrayInstrumentations = createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    [
      "includes",
      "indexOf",
      "lastIndexOf"
    ].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
          track(arr, "get", i + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    [
      "push",
      "pop",
      "shift",
      "unshift",
      "splice"
    ].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        pauseScheduling();
        const res = toRaw(this)[key].apply(this, args);
        resetScheduling();
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function hasOwnProperty(key) {
    if (!isSymbol(key))
      key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray$1(target);
      if (!isReadonly2) {
        if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && isIntegerKey(key) ? res : res.value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            return false;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      return true;
    }
    deleteProperty(target, key) {
      return true;
    }
  }
  const mutableHandlers = new MutableReactiveHandler();
  const readonlyHandlers = new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get(target, key, isReadonly2 = false, isShallow2 = false) {
    target = target["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly2) {
      if (hasChanged(key, rawKey)) {
        track(rawTarget, "get", key);
      }
      track(rawTarget, "get", rawKey);
    }
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has(key, isReadonly2 = false) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly2) {
      if (hasChanged(key, rawKey)) {
        track(rawTarget, "has", key);
      }
      track(rawTarget, "has", rawKey);
    }
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly2 = false) {
    target = target["__v_raw"];
    !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    }
    const oldValue = get2.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    }
    get2 ? get2.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0);
    }
    return result;
  }
  function createForEach(isReadonly2, isShallow2) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        next() {
          const { value, done } = innerIterator.next();
          return done ? {
            value,
            done
          } : {
            value: isPair ? [
              wrap(value[0]),
              wrap(value[1])
            ] : wrap(value),
            done
          };
        },
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get(this, key);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
      shallowInstrumentations2[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = createInstrumentations();
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  const mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, true)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this.getter = getter;
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this["__v_isReadonly"] = false;
      this.effect = new ReactiveEffect(() => getter(this._value), () => triggerRefValue(this, this.effect._dirtyLevel === 2 ? 2 : 3));
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly2;
    }
    get value() {
      const self2 = toRaw(this);
      if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
        triggerRefValue(self2, 4);
      }
      trackRefValue(self2);
      if (self2.effect._dirtyLevel >= 2) {
        triggerRefValue(self2, 2);
      }
      return self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
    get _dirty() {
      return this.effect.dirty;
    }
    set _dirty(v) {
      this.effect.dirty = v;
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    return cRef;
  }
  function trackRefValue(ref2) {
    var _a;
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      trackEffect(activeEffect, (_a = ref2.dep) != null ? _a : ref2.dep = createDep(() => ref2.dep = void 0, ref2 instanceof ComputedRefImpl ? ref2 : void 0));
    }
  }
  function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
    ref2 = toRaw(ref2);
    const dep = ref2.dep;
    if (dep) {
      triggerEffects(dep, dirtyLevel);
    }
  }
  function isRef(r) {
    return !!(r && r.__v_isRef === true);
  }
  function ref(value) {
    return createRef(value, false);
  }
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow;
      this.dep = void 0;
      this.__v_isRef = true;
      this._rawValue = __v_isShallow ? value : toRaw(value);
      this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
      trackRefValue(this);
      return this._value;
    }
    set value(newVal) {
      const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
      newVal = useDirectValue ? newVal : toRaw(newVal);
      if (hasChanged(newVal, this._rawValue)) {
        this._rawValue = newVal;
        this._value = useDirectValue ? newVal : toReactive(newVal);
        triggerRefValue(this, 4);
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  const stack = [];
  function warn$1(msg, ...args) {
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(appWarnHandler, instance, 11, [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
        trace
      ]);
    } else {
      const warnArgs = [
        `[Vue warn]: ${msg}`,
        ...args
      ];
      if (trace.length && true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [
        `
`
      ], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
    const close = `>` + postfix;
    return vnode.props ? [
      open,
      ...formatProps(vnode.props),
      close
    ] : [
      open + close
    ];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [
        `${key}=${value}`
      ];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [
        `${key}=${value}`
      ];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [
        `${key}=Ref<`,
        value,
        `>`
      ];
    } else if (isFunction(value)) {
      return [
        `${key}=fn${value.name ? `<${value.name}>` : ``}`
      ];
    } else {
      value = toRaw(value);
      return raw ? value : [
        `${key}=`,
        value
      ];
    }
  }
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray$1(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        pauseTracking();
        callWithErrorHandling(appErrorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev);
  }
  function logError(err, type, contextVNode, throwInDev = true) {
    {
      console.error(err);
    }
  }
  let isFlushing = false;
  let isFlushPending = false;
  const queue = [];
  let flushIndex = 0;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.pre) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
      if (job.id == null) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(job.id), 0, job);
      }
      queueFlush();
    }
  }
  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function invalidateJob(job) {
    const i = queue.indexOf(job);
    if (i > flushIndex) {
      queue.splice(i, 1);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray$1(cb)) {
      if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
        pendingPostFlushCbs.push(cb);
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.pre) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        cb();
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [
        ...new Set(pendingPostFlushCbs)
      ].sort((a, b) => getId(a) - getId(b));
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        activePostFlushCbs[postFlushIndex]();
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? Infinity : job.id;
  const comparator = (a, b) => {
    const diff = getId(a) - getId(b);
    if (diff === 0) {
      if (a.pre && !b.pre)
        return -1;
      if (b.pre && !a.pre)
        return 1;
    }
    return diff;
  };
  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    queue.sort(comparator);
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && job.active !== false) {
          if (false)
            ;
          callWithErrorHandling(job, null, 14);
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs();
      isFlushing = false;
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs();
      }
    }
  }
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted)
      return;
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modelArg = isModelListener2 && event.slice(7);
    if (modelArg && modelArg in props) {
      const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
      const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
      if (trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(handler, instance, 6, args);
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(onceHandler, instance, 6, args);
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray$1(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function pushScopeId(id) {
    currentScopeId = id;
  }
  function popScopeId() {
    currentScopeId = null;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx)
      return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit: emit2, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = false ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(`Property '${String(key)}' was accessed via 'this'. Avoid using 'this' in templates.`);
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, false ? shallowReadonly(props) : props, setupState, data, ctx));
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (false)
          ;
        result = normalizeVNode(render2.length > 1 ? render2(false ? shallowReadonly(props) : props, false ? {
          get attrs() {
            markAttrsAccessed();
            return shallowReadonly(attrs);
          },
          slots,
          emit: emit2
        } : {
          attrs,
          slots,
          emit: emit2
        }) : render2(false ? shallowReadonly(props) : props, null));
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        }
      }
    }
    if (vnode.dirs) {
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      root.transition = vnode.transition;
    }
    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const COMPONENTS = "components";
  function resolveComponent(name, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      {
        const selfName = getComponentName(Component, false);
        if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
          return Component;
        }
      }
      const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
      if (!res && maybeSelfReference) {
        return Component;
      }
      return res;
    }
  }
  function resolve(registry, name) {
    return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray$1(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  const INITIAL_WATCHER_VALUE = {};
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush, once, onTrack, onTrigger } = EMPTY_OBJ) {
    if (cb && once) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        unwatch();
      };
    }
    const instance = currentInstance;
    const reactiveGetter = (source2) => deep === true ? source2 : traverse(source2, deep === false ? 1 : void 0);
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray$1(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, 2);
        } else
          ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(source, instance, 2);
      } else {
        getter = () => {
          if (cleanup) {
            cleanup();
          }
          return callWithAsyncErrorHandling(source, instance, 3, [
            onCleanup
          ]);
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
      cleanup = effect2.onStop = () => {
        callWithErrorHandling(fn, instance, 4);
        cleanup = effect2.onStop = void 0;
      };
    };
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      onCleanup = NOOP;
      if (!cb) {
        getter();
      } else if (immediate) {
        callWithAsyncErrorHandling(cb, instance, 3, [
          getter(),
          isMultiSource ? [] : void 0,
          onCleanup
        ]);
      }
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else {
        return NOOP;
      }
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = () => {
      if (!effect2.active || !effect2.dirty) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
          if (cleanup) {
            cleanup();
          }
          callWithAsyncErrorHandling(cb, instance, 3, [
            newValue,
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            onCleanup
          ]);
          oldValue = newValue;
        }
      } else {
        effect2.run();
      }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === "sync") {
      scheduler = job;
    } else if (flush === "post") {
      scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
      job.pre = true;
      if (instance)
        job.id = instance.uid;
      scheduler = () => queueJob(job);
    }
    const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
    const scope = getCurrentScope();
    const unwatch = () => {
      effect2.stop();
      if (scope) {
        remove(scope.effects, effect2);
      }
    };
    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = effect2.run();
      }
    } else if (flush === "post") {
      queuePostRenderEffect(effect2.run.bind(effect2), instance && instance.suspense);
    } else {
      effect2.run();
    }
    if (ssrCleanup)
      ssrCleanup.push(unwatch);
    return unwatch;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray$1(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
    }
    return value;
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      return vnode;
    }
    const instance = getExposeProxy(currentRenderingInstance) || currentRenderingInstance.proxy;
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (() => extend({
      name: options.name
    }, extraOptions, {
      setup: options
    }))() : options;
  }
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(type, hook, keepAliveRoot, true);
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        if (target.isUnmounted) {
          return;
        }
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target);
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook("bu");
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook("bum");
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook("sp");
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache;
    if (isArray$1(source) || isString(source)) {
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(source[i], i, void 0, cached);
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached));
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i)
      return null;
    if (isStatefulComponent(i))
      return getExposeProxy(i) || i.proxy;
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  });
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
        }
        return publicGetter(instance);
      } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
        {
          return globalProperties[key];
        }
      } else
        ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  function normalizePropsOrEmits(props) {
    return isArray$1(props) ? props.reduce((normalized, p2) => (normalized[p2] = null, normalized), {}) : props;
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook(options.beforeCreate, instance, "bc");
    }
    const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!isObject(data))
        ;
      else {
        instance.data = reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        const c = computed({
          get: get2,
          set: set2
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray$1(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray$1(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components)
      instance.components = components;
    if (directives)
      instance.directives = directives;
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray$1(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject(opt)) {
        if ("default" in opt) {
          injected = inject(opt.from || key, opt.default, true);
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook(hook, instance, type) {
    callWithAsyncErrorHandling(isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
  }
  function createWatcher(raw, ctx, publicThis, key) {
    const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        watch(getter, handler);
      }
    } else if (isFunction(raw)) {
      watch(getter, raw.bind(publicThis));
    } else if (isObject(raw)) {
      if (isArray$1(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        }
      }
    } else
      ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach((m) => mergeOptions$1(resolved, m, optionMergeStrategies, true));
      }
      mergeOptions$1(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions$1(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions$1(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach((m) => mergeOptions$1(to, m, strats, true));
    }
    for (const key in from) {
      if (asMixin && key === "expose")
        ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    watch: mergeWatchOptions,
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray$1(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [
      ...new Set([].concat(to, from))
    ] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray$1(to) && isArray$1(from)) {
        return [
          .../* @__PURE__ */ new Set([
            ...to,
            ...from
          ])
        ];
      }
      return extend(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to)
      return from;
    if (!from)
      return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      let isMounted = false;
      const app2 = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin))
            ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app2, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app2, ...options);
          } else
            ;
          return app2;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app2;
        },
        component(name, component) {
          if (!component) {
            return context.components[name];
          }
          context.components[name] = component;
          return app2;
        },
        directive(name, directive) {
          if (!directive) {
            return context.directives[name];
          }
          context.directives[name] = directive;
          return app2;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app2._container = rootContainer;
            rootContainer.__vue_app__ = app2;
            return getExposeProxy(vnode.component) || vnode.component.proxy;
          }
        },
        unmount() {
          if (isMounted) {
            render(null, app2._container);
            delete app2._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app2;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app2;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app2;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    if (!currentInstance)
      ;
    else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance || currentApp) {
      const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else
        ;
    }
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const { props, attrs, vnode: { patchFlag } } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(null, props);
            reset();
          }
        } else {
          value = defaultValue;
        }
      }
      if (opt[0]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[1] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys)
          needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray$1(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? {
            type: opt
          } : extend({}, opt);
          if (prop) {
            const booleanIndex = getTypeIndex(Boolean, prop.type);
            const stringIndex = getTypeIndex(String, prop.type);
            prop[0] = booleanIndex > -1;
            prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
            if (booleanIndex > -1 || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
    }
    const res = [
      normalized,
      needCastKeys
    ];
    if (isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    }
    return false;
  }
  function getType(ctor) {
    if (ctor === null) {
      return "null";
    }
    if (typeof ctor === "function") {
      return ctor.name || "";
    } else if (typeof ctor === "object") {
      const name = ctor.constructor && ctor.constructor.name;
      return name || "";
    }
    return "";
  }
  function isSameType(a, b) {
    return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
    if (isArray$1(expectedTypes)) {
      return expectedTypes.findIndex((t) => isSameType(t, type));
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
  }
  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [
    normalizeVNode(value)
  ];
  const normalizeSlot$1 = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (false)
        ;
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key))
        continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot$1(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const initSlots = (instance, children) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        extend(slots, children);
        def(slots, "_", type, true);
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          extend(slots, children);
          if (!optimized && type === 1) {
            delete slots._;
          }
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = {
        default: 1
      };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray$1(rawRef)) {
      rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    if (oldRef != null && oldRef !== ref3) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (hasOwn(setupState, oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isFunction(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [
        value,
        refs
      ]);
    } else {
      const _isString = isString(ref3);
      const _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
            if (isUnmount) {
              isArray$1(existing) && remove(existing, refValue);
            } else {
              if (!isArray$1(existing)) {
                if (_isString) {
                  refs[ref3] = [
                    refValue
                  ];
                  if (hasOwn(setupState, ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  ref3.value = [
                    refValue
                  ];
                  if (rawRef.k)
                    refs[rawRef.k] = ref3.value;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (hasOwn(setupState, ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            ref3.value = value;
            if (rawRef.k)
              refs[rawRef.k] = value;
          } else
            ;
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      }
    }
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref3, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          }
          break;
        case Fragment:
          processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          break;
        default:
          if (shapeFlag & 1) {
            processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          } else if (shapeFlag & 6) {
            processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          } else if (shapeFlag & 64) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
          } else if (shapeFlag & 128) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
          } else
            ;
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
      } else {
        patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree) {
          const parentVNode = parentComponent.vnode;
          setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(null, child, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
      } else if (!optimized) {
        patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, n1.children, parentComponent, parentSuspense, unmountChildren);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
        patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
      }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(el, key, oldProps[key], null, namespace, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key))
            continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
          if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
            traverseStaticChildren(n1, n2, true);
          }
        } else {
          patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
        } else {
          mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
      } else {
        setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          invalidateJob(instance.update);
          instance.effect.dirty = true;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          if (el && hydrateNode) {
            const hydrateSubTree = () => {
              instance.subTree = renderComponentRoot(instance);
              hydrateNode(el, instance.subTree, instance, parentSuspense, null);
            };
            if (isAsyncWrapperVNode) {
              initialVNode.type.__asyncLoader().then(() => !instance.isUnmounted && hydrateSubTree());
            } else {
              hydrateSubTree();
            }
          } else {
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, namespace);
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
          }
        }
      };
      const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn, NOOP, () => queueJob(update), instance.scope);
      const update = instance.update = () => {
        if (effect2.dirty) {
          effect2.run();
        }
      };
      update.id = instance.uid;
      toggleRecurse(instance, true);
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
      }
      if (oldLength > newLength) {
        unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
      } else {
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
          newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => hostInsert(el, container, anchor);
          const performLeave = () => {
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const { type, props, ref: ref3, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
      if (ref3 != null) {
        setRef(ref3, null, parentSuspense, vnode, true);
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
        } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      const { bum, scope, update, subTree, um } = instance;
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (update) {
        update.active = false;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      return hostNextSibling(vnode.anchor || vnode.el);
    };
    let isFlushing2 = false;
    const render = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(container._vnode || null, vnode, container, null, null, null, namespace);
      }
      if (!isFlushing2) {
        isFlushing2 = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing2 = false;
      }
      container._vnode = vnode;
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    let hydrateNode;
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, update }, allowed) {
    effect2.allowRecurse = update.allowRecurse = allowed;
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray$1(ch1) && isArray$1(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [
      0
    ];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  const isTeleport = (type) => type.__isTeleport;
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value) {
    isBlockTreeEnabled += value;
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({ ref: ref3, ref_key, ref_for }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? {
      i: currentRenderingInstance,
      r: ref3,
      k: ref_key,
      f: !!ref_for
    } : ref3 : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(type, props, true);
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag |= -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style)) {
        if (isProxy(style) && !isArray$1(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
  }
  function guardReactiveProps(props) {
    if (!props)
      return null;
    return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref: ref3, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [
        ref3,
        normalizeRef(extraProps)
      ] : normalizeRef(extraProps) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      cloned.transition = transition.clone(cloned);
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray$1(child)) {
      return createVNode(Fragment, null, child.slice());
    } else if (typeof child === "object") {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray$1(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = {
        default: children,
        _ctx: currentRenderingInstance
      };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [
          createTextVNode(children)
        ];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([
              ret.class,
              toMerge.class
            ]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([
            ret.style,
            toMerge.style
          ]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new EffectScope(true),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      emit: null,
      emitted: null,
      propsDefaults: EMPTY_OBJ,
      inheritAttrs: type.inheritAttrs,
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      attrsProxy: null,
      slotsProxy: null,
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = {
        _: instance
      };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g[key]))
        setters = g[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1)
          setters.forEach((set2) => set2(v));
        else
          setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
    setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      pauseTracking();
      const setupResult = callWithErrorHandling(setup, instance, 0, [
        instance.props,
        setupContext
      ]);
      resetTracking();
      reset();
      if (isPromise(setupResult)) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
    } else
      ;
    finishComponentSetup(instance, isSSR);
  }
  let compile;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile && !Component.render) {
        const template = Component.template || resolveMergedOptions(instance).template;
        if (template) {
          const { isCustomElement, compilerOptions } = instance.appContext.config;
          const { delimiters, compilerOptions: componentCompilerOptions } = Component;
          const finalCompilerOptions = extend(extend({
            isCustomElement,
            delimiters
          }, compilerOptions), componentCompilerOptions);
          Component.render = compile(template, finalCompilerOptions);
        }
      }
      instance.render = Component.render || NOOP;
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      track(target, "get", "");
      return target[key];
    }
  };
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    {
      return {
        attrs: new Proxy(instance.attrs, attrsProxyHandlers),
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getExposeProxy(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    return c;
  };
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [
            propsOrChildren
          ]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVNode(children)) {
        children = [
          children
        ];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }
  const version = "3.4.26";
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : doc.createElement(tag, is ? {
        is
      } : void 0);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling))
            break;
        }
      } else {
        templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        before ? before.nextSibling : parent.firstChild,
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const vtcKey = Symbol("_vtc");
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [
        value,
        ...transitionClasses
      ] : [
        ...transitionClasses
      ]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const CSS_VAR_TEXT = Symbol("");
  const displayRE = /(^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray$1(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null)
        val = "";
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = [
    "Webkit",
    "Moz",
    "ms"
  ];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      const isBoolean = isSpecialBooleanAttr(key);
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, isBoolean ? "" : value);
      }
    }
  }
  function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === "innerHTML" || key === "textContent") {
      if (prevChildren) {
        unmountChildren(prevChildren, parentComponent, parentSuspense);
      }
      el[key] = value == null ? "" : value;
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? "" : value;
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
    needRemove && el.removeAttribute(key);
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(nextValue, instance);
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [
      event,
      options
    ];
  }
  let cachedNow = 0;
  const p = Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [
        e
      ]);
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray$1(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const assignKey = Symbol("_assign");
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing)
          return;
        let domValue = el.value;
        if (trim) {
          domValue = domValue.trim();
        }
        if (castToNumber) {
          domValue = looseToNumber(domValue);
        }
        el[assignKey](domValue);
      });
      if (trim) {
        addEventListener(el, "change", () => {
          el.value = el.value.trim();
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing)
        return;
      const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const rendererOptions = extend({
    patchProp
  }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp = (...args) => {
    const app2 = ensureRenderer().createApp(...args);
    const { mount } = app2;
    app2.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      const component = app2._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = "";
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app2;
  };
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  var isVue2 = false;
  const piniaSymbol = Symbol();
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = effectScope(true);
    const state = scope.run(() => ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = markRaw({
      install(app2) {
        {
          pinia._a = app2;
          app2.provide(piniaSymbol, pinia);
          app2.config.globalProperties.$pinia = pinia;
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia;
  }
  const isBrowser = typeof document !== "undefined";
  function isESModule(obj) {
    return obj.__esModule || obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop = () => {
  };
  const isArray = Array.isArray;
  const HASH_RE = /#/g;
  const AMPERSAND_RE = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE = /=/g;
  const IM_RE = /\?/g;
  const PLUS_RE = /\+/g;
  const ENC_BRACKET_OPEN_RE = /%5B/g;
  const ENC_BRACKET_CLOSE_RE = /%5D/g;
  const ENC_CARET_RE = /%5E/g;
  const ENC_BACKTICK_RE = /%60/g;
  const ENC_CURLY_OPEN_RE = /%7B/g;
  const ENC_PIPE_RE = /%7C/g;
  const ENC_CURLY_CLOSE_RE = /%7D/g;
  const ENC_SPACE_RE = /%20/g;
  function commonEncode(text) {
    return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
  }
  function encodeHash(text) {
    return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryValue(text) {
    return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryKey(text) {
    return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
  }
  function encodePath(text) {
    return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
  }
  function encodeParam(text) {
    return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
  }
  function decode(text) {
    try {
      return decodeURIComponent("" + text);
    } catch (err) {
    }
    return "" + text;
  }
  const TRAILING_SLASH_RE = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
  function parseURL(parseQuery2, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    const hashPos = location2.indexOf("#");
    let searchPos = location2.indexOf("?");
    if (hashPos < searchPos && hashPos >= 0) {
      searchPos = -1;
    }
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery2(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash,
      path,
      query,
      hash: decode(hash)
    };
  }
  function stringifyURL(stringifyQuery2, location2) {
    const query = location2.query ? stringifyQuery2(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery2, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
  }
  function resolveRelativePath(to, from) {
    if (to.startsWith("/"))
      return to;
    if (!to)
      return from;
    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    const lastToSegment = toSegments[toSegments.length - 1];
    if (lastToSegment === ".." || lastToSegment === ".") {
      toSegments.push("");
    }
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
      segment = toSegments[toPosition];
      if (segment === ".")
        continue;
      if (segment === "..") {
        if (position > 1)
          position--;
      } else
        break;
    }
    return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
  }
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  function normalizeBase(base) {
    if (!base) {
      if (isBrowser) {
        const baseEl = document.querySelector("base");
        base = baseEl && baseEl.getAttribute("href") || "/";
        base = base.replace(/^\w+:\/\/[^\/]+/, "");
      } else {
        base = "/";
      }
    }
    if (base[0] !== "/" && base[0] !== "#")
      base = "/" + base;
    return removeTrailingSlash(base);
  }
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location2) {
    return base.replace(BEFORE_HASH_RE, "#") + location2;
  }
  function getElementPosition(el, offset) {
    const docRect = document.documentElement.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      behavior: offset.behavior,
      left: elRect.left - docRect.left - (offset.left || 0),
      top: elRect.top - docRect.top - (offset.top || 0)
    };
  }
  const computeScrollPosition = () => ({
    left: window.scrollX,
    top: window.scrollY
  });
  function scrollToPosition(position) {
    let scrollToOptions;
    if ("el" in position) {
      const positionEl = position.el;
      const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
      const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
      if (!el) {
        return;
      }
      scrollToOptions = getElementPosition(el, position);
    } else {
      scrollToOptions = position;
    }
    if ("scrollBehavior" in document.documentElement.style)
      window.scrollTo(scrollToOptions);
    else {
      window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
    }
  }
  function getScrollKey(path, delta) {
    const position = history.state ? history.state.position - delta : -1;
    return position + path;
  }
  const scrollPositions = /* @__PURE__ */ new Map();
  function saveScrollPosition(key, scrollPosition) {
    scrollPositions.set(key, scrollPosition);
  }
  function getSavedScrollPosition(key) {
    const scroll = scrollPositions.get(key);
    scrollPositions.delete(key);
    return scroll;
  }
  let createBaseLocation = () => location.protocol + "//" + location.host;
  function createCurrentLocation(base, location2) {
    const { pathname, search, hash } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    let pauseState = null;
    const popStateHandler = ({ state }) => {
      const to = createCurrentLocation(base, location);
      const from = currentLocation.value;
      const fromState = historyState.value;
      let delta = 0;
      if (state) {
        currentLocation.value = to;
        historyState.value = state;
        if (pauseState && pauseState === from) {
          pauseState = null;
          return;
        }
        delta = fromState ? state.position - fromState.position : 0;
      } else {
        replace(to);
      }
      listeners.forEach((listener) => {
        listener(currentLocation.value, from, {
          delta,
          type: NavigationType.pop,
          direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
        });
      });
    };
    function pauseListeners() {
      pauseState = currentLocation.value;
    }
    function listen(callback) {
      listeners.push(callback);
      const teardown = () => {
        const index = listeners.indexOf(callback);
        if (index > -1)
          listeners.splice(index, 1);
      };
      teardowns.push(teardown);
      return teardown;
    }
    function beforeUnloadListener() {
      const { history: history2 } = window;
      if (!history2.state)
        return;
      history2.replaceState(assign({}, history2.state, {
        scroll: computeScrollPosition()
      }), "");
    }
    function destroy() {
      for (const teardown of teardowns)
        teardown();
      teardowns = [];
      window.removeEventListener("popstate", popStateHandler);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    }
    window.addEventListener("popstate", popStateHandler);
    window.addEventListener("beforeunload", beforeUnloadListener, {
      passive: true
    });
    return {
      pauseListeners,
      listen,
      destroy
    };
  }
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
      back,
      current,
      forward,
      replaced,
      position: window.history.length,
      scroll: computeScroll ? computeScrollPosition() : null
    };
  }
  function useHistoryStateNavigation(base) {
    const { history: history2, location: location2 } = window;
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = {
      value: history2.state
    };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history2.length - 1,
        replaced: true,
        scroll: null
      }, true);
    }
    function changeLocation(to, state, replace2) {
      const hashIndex = base.indexOf("#");
      const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
      try {
        history2[replace2 ? "replaceState" : "pushState"](state, "", url);
        historyState.value = state;
      } catch (err) {
        {
          console.error(err);
        }
        location2[replace2 ? "replace" : "assign"](url);
      }
    }
    function replace(to, data) {
      const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, {
        position: historyState.value.position
      });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign({}, historyState.value, history2.state, {
        forward: to,
        scroll: computeScrollPosition()
      });
      changeLocation(currentState.current, currentState, true);
      const state = assign({}, buildState(currentLocation.value, to, null), {
        position: currentState.position + 1
      }, data);
      changeLocation(to, state, false);
      currentLocation.value = to;
    }
    return {
      location: currentLocation,
      state: historyState,
      push,
      replace
    };
  }
  function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
      if (!triggerListeners)
        historyListeners.pauseListeners();
      history.go(delta);
    }
    const routerHistory = assign({
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base)
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => historyNavigation.location.value
    });
    Object.defineProperty(routerHistory, "state", {
      enumerable: true,
      get: () => historyNavigation.state.value
    });
    return routerHistory;
  }
  function isRouteLocation(route) {
    return typeof route === "string" || route && typeof route === "object";
  }
  function isRouteName(name) {
    return typeof name === "string" || typeof name === "symbol";
  }
  const START_LOCATION_NORMALIZED = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
  };
  const NavigationFailureSymbol = Symbol("");
  var NavigationFailureType;
  (function(NavigationFailureType2) {
    NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
    NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
    NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
  })(NavigationFailureType || (NavigationFailureType = {}));
  function createRouterError(type, params) {
    {
      return assign(new Error(), {
        type,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type) {
    return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
  }
  const BASE_PARAM_PATTERN = "[^/]+?";
  const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true
  };
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [
        90
      ];
      if (options.strict && !segment.length)
        pattern += "/";
      for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
        const token = segment[tokenIndex];
        let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
        if (token.type === 0) {
          if (!tokenIndex)
            pattern += "/";
          pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
          subSegmentScore += 40;
        } else if (token.type === 1) {
          const { value, repeatable, optional, regexp } = token;
          keys.push({
            name: value,
            repeatable,
            optional
          });
          const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
          if (re2 !== BASE_PARAM_PATTERN) {
            subSegmentScore += 10;
            try {
              new RegExp(`(${re2})`);
            } catch (err) {
              throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
            }
          }
          let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
          if (!tokenIndex)
            subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
          if (optional)
            subPattern += "?";
          pattern += subPattern;
          subSegmentScore += 20;
          if (optional)
            subSegmentScore += -8;
          if (repeatable)
            subSegmentScore += -20;
          if (re2 === ".*")
            subSegmentScore += -50;
        }
        segmentScores.push(subSegmentScore);
      }
      score.push(segmentScores);
    }
    if (options.strict && options.end) {
      const i = score.length - 1;
      score[i][score[i].length - 1] += 0.7000000000000001;
    }
    if (!options.strict)
      pattern += "/?";
    if (options.end)
      pattern += "$";
    else if (options.strict)
      pattern += "(?:/|$)";
    const re = new RegExp(pattern, options.sensitive ? "" : "i");
    function parse(path) {
      const match = path.match(re);
      const params = {};
      if (!match)
        return null;
      for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
      }
      return params;
    }
    function stringify(params) {
      let path = "";
      let avoidDuplicatedSlash = false;
      for (const segment of segments) {
        if (!avoidDuplicatedSlash || !path.endsWith("/"))
          path += "/";
        avoidDuplicatedSlash = false;
        for (const token of segment) {
          if (token.type === 0) {
            path += token.value;
          } else if (token.type === 1) {
            const { value, repeatable, optional } = token;
            const param = value in params ? params[value] : "";
            if (isArray(param) && !repeatable) {
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            }
            const text = isArray(param) ? param.join("/") : param;
            if (!text) {
              if (optional) {
                if (segment.length < 2) {
                  if (path.endsWith("/"))
                    path = path.slice(0, -1);
                  else
                    avoidDuplicatedSlash = true;
                }
              } else
                throw new Error(`Missing required param "${value}"`);
            }
            path += text;
          }
        }
      }
      return path || "/";
    }
    return {
      re,
      score,
      keys,
      parse,
      stringify
    };
  }
  function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
      const diff = b[i] - a[i];
      if (diff)
        return diff;
      i++;
    }
    if (a.length < b.length) {
      return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
    } else if (a.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    if (Math.abs(bScore.length - aScore.length) === 1) {
      if (isLastScoreNegative(aScore))
        return 1;
      if (isLastScoreNegative(bScore))
        return -1;
    }
    return bScore.length - aScore.length;
  }
  function isLastScoreNegative(score) {
    const last = score[score.length - 1];
    return score.length > 0 && last[last.length - 1] < 0;
  }
  const ROOT_TOKEN = {
    type: 0,
    value: ""
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  function tokenizePath(path) {
    if (!path)
      return [
        []
      ];
    if (path === "/")
      return [
        [
          ROOT_TOKEN
        ]
      ];
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path "${path}"`);
    }
    function crash(message) {
      throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0;
    let previousState = state;
    const tokens = [];
    let segment;
    function finalizeSegment() {
      if (segment)
        tokens.push(segment);
      segment = [];
    }
    let i = 0;
    let char;
    let buffer = "";
    let customRe = "";
    function consumeBuffer() {
      if (!buffer)
        return;
      if (state === 0) {
        segment.push({
          type: 0,
          value: buffer
        });
      } else if (state === 1 || state === 2 || state === 3) {
        if (segment.length > 1 && (char === "*" || char === "+"))
          crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
        segment.push({
          type: 1,
          value: buffer,
          regexp: customRe,
          repeatable: char === "*" || char === "+",
          optional: char === "*" || char === "?"
        });
      } else {
        crash("Invalid state to consume buffer");
      }
      buffer = "";
    }
    function addCharToBuffer() {
      buffer += char;
    }
    while (i < path.length) {
      char = path[i++];
      if (char === "\\" && state !== 2) {
        previousState = state;
        state = 4;
        continue;
      }
      switch (state) {
        case 0:
          if (char === "/") {
            if (buffer) {
              consumeBuffer();
            }
            finalizeSegment();
          } else if (char === ":") {
            consumeBuffer();
            state = 1;
          } else {
            addCharToBuffer();
          }
          break;
        case 4:
          addCharToBuffer();
          state = previousState;
          break;
        case 1:
          if (char === "(") {
            state = 2;
          } else if (VALID_PARAM_RE.test(char)) {
            addCharToBuffer();
          } else {
            consumeBuffer();
            state = 0;
            if (char !== "*" && char !== "?" && char !== "+")
              i--;
          }
          break;
        case 2:
          if (char === ")") {
            if (customRe[customRe.length - 1] == "\\")
              customRe = customRe.slice(0, -1) + char;
            else
              state = 3;
          } else {
            customRe += char;
          }
          break;
        case 3:
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
          customRe = "";
          break;
        default:
          crash("Unknown state");
          break;
      }
    }
    if (state === 2)
      crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    return tokens;
  }
  function createRouteRecordMatcher(record, parent, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    const matcher = assign(parser, {
      record,
      parent,
      children: [],
      alias: []
    });
    if (parent) {
      if (!matcher.record.aliasOf === !parent.record.aliasOf)
        parent.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes, globalOptions) {
    const matchers = [];
    const matcherMap = /* @__PURE__ */ new Map();
    globalOptions = mergeOptions({
      strict: false,
      end: true,
      sensitive: false
    }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [
          record.alias
        ] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent && path[0] !== "/") {
          const parentPath = parent.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
          normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
        }
        matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
        if (originalRecord) {
          originalRecord.alias.push(matcher);
        } else {
          originalMatcher = originalMatcher || matcher;
          if (originalMatcher !== matcher)
            originalMatcher.alias.push(matcher);
          if (isRootAdd && record.name && !isAliasRecord(matcher))
            removeRoute(record.name);
        }
        if (mainNormalizedRecord.children) {
          const children = mainNormalizedRecord.children;
          for (let i = 0; i < children.length; i++) {
            addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        if (matcher.record.components && Object.keys(matcher.record.components).length || matcher.record.name || matcher.record.redirect) {
          insertMatcher(matcher);
        }
      }
      return originalMatcher ? () => {
        removeRoute(originalMatcher);
      } : noop;
    }
    function removeRoute(matcherRef) {
      if (isRouteName(matcherRef)) {
        const matcher = matcherMap.get(matcherRef);
        if (matcher) {
          matcherMap.delete(matcherRef);
          matchers.splice(matchers.indexOf(matcher), 1);
          matcher.children.forEach(removeRoute);
          matcher.alias.forEach(removeRoute);
        }
      } else {
        const index = matchers.indexOf(matcherRef);
        if (index > -1) {
          matchers.splice(index, 1);
          if (matcherRef.record.name)
            matcherMap.delete(matcherRef.record.name);
          matcherRef.children.forEach(removeRoute);
          matcherRef.alias.forEach(removeRoute);
        }
      }
    }
    function getRoutes() {
      return matchers;
    }
    function insertMatcher(matcher) {
      let i = 0;
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
        i++;
      matchers.splice(i, 0, matcher);
      if (matcher.record.name && !isAliasRecord(matcher))
        matcherMap.set(matcher.record.name, matcher);
    }
    function resolve2(location2, currentLocation) {
      let matcher;
      let params = {};
      let path;
      let name;
      if ("name" in location2 && location2.name) {
        matcher = matcherMap.get(location2.name);
        if (!matcher)
          throw createRouterError(1, {
            location: location2
          });
        name = matcher.record.name;
        params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)), location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name)));
        path = matcher.stringify(params);
      } else if (location2.path != null) {
        path = location2.path;
        matcher = matchers.find((m) => m.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
        if (!matcher)
          throw createRouterError(1, {
            location: location2,
            currentLocation
          });
        name = matcher.record.name;
        params = assign({}, currentLocation.params, location2.params);
        path = matcher.stringify(params);
      }
      const matched = [];
      let parentMatcher = matcher;
      while (parentMatcher) {
        matched.unshift(parentMatcher.record);
        parentMatcher = parentMatcher.parent;
      }
      return {
        name,
        path,
        params,
        matched,
        meta: mergeMetaFields(matched)
      };
    }
    routes.forEach((route) => addRoute(route));
    return {
      addRoute,
      resolve: resolve2,
      removeRoute,
      getRoutes,
      getRecordMatcher
    };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
      if (key in params)
        newParams[key] = params[key];
    }
    return newParams;
  }
  function normalizeRouteRecord(record) {
    return {
      path: record.path,
      redirect: record.redirect,
      name: record.name,
      meta: record.meta || {},
      aliasOf: void 0,
      beforeEnter: record.beforeEnter,
      props: normalizeRecordProps(record),
      children: record.children || [],
      instances: {},
      leaveGuards: /* @__PURE__ */ new Set(),
      updateGuards: /* @__PURE__ */ new Set(),
      enterCallbacks: {},
      components: "components" in record ? record.components || null : record.component && {
        default: record.component
      }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
        propsObject[name] = typeof props === "object" ? props[name] : props;
    }
    return propsObject;
  }
  function isAliasRecord(record) {
    while (record) {
      if (record.record.aliasOf)
        return true;
      record = record.parent;
    }
    return false;
  }
  function mergeMetaFields(matched) {
    return matched.reduce((meta, record) => assign(meta, record.meta), {});
  }
  function mergeOptions(defaults, partialOptions) {
    const options = {};
    for (const key in defaults) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
  }
  function isRecordChildOf(record, parent) {
    return parent.children.some((child) => child === record || isRecordChildOf(record, child));
  }
  function parseQuery(search) {
    const query = {};
    if (search === "" || search === "?")
      return query;
    const hasLeadingIM = search[0] === "?";
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
    for (let i = 0; i < searchParams.length; ++i) {
      const searchParam = searchParams[i].replace(PLUS_RE, " ");
      const eqPos = searchParam.indexOf("=");
      const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!isArray(currentValue)) {
          currentValue = query[key] = [
            currentValue
          ];
        }
        currentValue.push(value);
      } else {
        query[key] = value;
      }
    }
    return query;
  }
  function stringifyQuery(query) {
    let search = "";
    for (let key in query) {
      const value = query[key];
      key = encodeQueryKey(key);
      if (value == null) {
        if (value !== void 0) {
          search += (search.length ? "&" : "") + key;
        }
        continue;
      }
      const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [
        value && encodeQueryValue(value)
      ];
      values.forEach((value2) => {
        if (value2 !== void 0) {
          search += (search.length ? "&" : "") + key;
          if (value2 != null)
            search += "=" + value2;
        }
      });
    }
    return search;
  }
  function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  const matchedRouteKey = Symbol("");
  const viewDepthKey = Symbol("");
  const routerKey = Symbol("");
  const routeLocationKey = Symbol("");
  const routerViewLocationKey = Symbol("");
  function useCallbacks() {
    let handlers = [];
    function add2(handler) {
      handlers.push(handler);
      return () => {
        const i = handlers.indexOf(handler);
        if (i > -1)
          handlers.splice(i, 1);
      };
    }
    function reset() {
      handlers = [];
    }
    return {
      add: add2,
      list: () => handlers.slice(),
      reset
    };
  }
  function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
    const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve2, reject) => {
      const next = (valid) => {
        if (valid === false) {
          reject(createRouterError(4, {
            from,
            to
          }));
        } else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
            enterCallbackArray.push(valid);
          }
          resolve2();
        }
      };
      const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
      let guardCall = Promise.resolve(guardReturn);
      if (guard.length < 3)
        guardCall = guardCall.then(next);
      guardCall.catch((err) => reject(err));
    });
  }
  function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
    const guards = [];
    for (const record of matched) {
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
          const guard = options[guardType];
          guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
        } else {
          let componentPromise = rawComponent();
          guards.push(() => componentPromise.then((resolved) => {
            if (!resolved)
              return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
            const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
            record.components[name] = resolvedComponent;
            const options = resolvedComponent.__vccOpts || resolvedComponent;
            const guard = options[guardType];
            return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
          }));
        }
      }
    }
    return guards;
  }
  function isRouteComponent(component) {
    return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
  }
  function useLink(props) {
    const router2 = inject(routerKey);
    const currentRoute = inject(routeLocationKey);
    const route = computed(() => {
      const to = unref(props.to);
      return router2.resolve(to);
    });
    const activeRecordIndex = computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index > -1)
        return index;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
    });
    const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router2[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop);
      }
      return Promise.resolve();
    }
    return {
      route,
      href: computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = defineComponent({
    name: "RouterLink",
    compatConfig: {
      MODE: 3
    },
    props: {
      to: {
        type: [
          String,
          Object
        ],
        required: true
      },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: {
        type: String,
        default: "page"
      }
    },
    useLink,
    setup(props, { slots }) {
      const link = reactive(useLink(props));
      const { options } = inject(routerKey);
      const elClass = computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children = slots.default && slots.default(link);
        return props.custom ? children : h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          onClick: link.navigate,
          class: elClass.value
        }, children);
      };
    }
  });
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    if (e.button !== void 0 && e.button !== 0)
      return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target))
        return;
    }
    if (e.preventDefault)
      e.preventDefault();
    return true;
  }
  function includesParams(outer, inner) {
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = defineComponent({
    name: "RouterView",
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: "default"
      },
      route: Object
    },
    compatConfig: {
      MODE: 3
    },
    setup(props, { attrs, slots }) {
      const injectedRoute = inject(routerViewLocationKey);
      const routeToDisplay = computed(() => props.route || injectedRoute.value);
      const injectedDepth = inject(viewDepthKey, 0);
      const depth = computed(() => {
        let initialDepth = unref(injectedDepth);
        const { matched } = routeToDisplay.value;
        let matchedRoute;
        while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
          initialDepth++;
        }
        return initialDepth;
      });
      const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
      provide(viewDepthKey, computed(() => depth.value + 1));
      provide(matchedRouteKey, matchedRouteRef);
      provide(routerViewLocationKey, routeToDisplay);
      const viewRef = ref();
      watch(() => [
        viewRef.value,
        matchedRouteRef.value,
        props.name
      ], ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          to.instances[name] = instance;
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }
        if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, {
        flush: "post"
      });
      return () => {
        const route = routeToDisplay.value;
        const currentName = props.name;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[currentName];
        if (!ViewComponent) {
          return normalizeSlot(slots.default, {
            Component: ViewComponent,
            route
          });
        }
        const routePropsOption = matchedRoute.props[currentName];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        return normalizeSlot(slots.default, {
          Component: component,
          route
        }) || component;
      };
    }
  });
  function normalizeSlot(slot, data) {
    if (!slot)
      return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  const RouterView = RouterViewImpl;
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
    const routerHistory = options.history;
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = applyToParams.bind(null, decode);
    function addRoute(parentOrRoute, route) {
      let parent;
      let record;
      if (isRouteName(parentOrRoute)) {
        parent = matcher.getRecordMatcher(parentOrRoute);
        record = route;
      } else {
        record = parentOrRoute;
      }
      return matcher.addRoute(record, parent);
    }
    function removeRoute(name) {
      const recordMatcher = matcher.getRecordMatcher(name);
      if (recordMatcher) {
        matcher.removeRoute(recordMatcher);
      }
    }
    function getRoutes() {
      return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
    }
    function hasRoute(name) {
      return !!matcher.getRecordMatcher(name);
    }
    function resolve2(rawLocation, currentLocation) {
      currentLocation = assign({}, currentLocation || currentRoute.value);
      if (typeof rawLocation === "string") {
        const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({
          path: locationNormalized.path
        }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
        return assign(locationNormalized, matchedRoute2, {
          params: decodeParams(matchedRoute2.params),
          hash: decode(locationNormalized.hash),
          redirectedFrom: void 0,
          href: href2
        });
      }
      let matcherLocation;
      if (rawLocation.path != null) {
        matcherLocation = assign({}, rawLocation, {
          path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(targetParams)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash,
        query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      }, matchedRoute, {
        redirectedFrom: void 0,
        href
      });
    }
    function locationAsObject(to) {
      return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
      if (pendingLocation !== to) {
        return createRouterError(8, {
          from,
          to
        });
      }
    }
    function push(to) {
      return pushWithRedirect(to);
    }
    function replace(to) {
      return push(assign(locationAsObject(to), {
        replace: true
      }));
    }
    function handleRedirectRecord(to) {
      const lastMatched = to.matched[to.matched.length - 1];
      if (lastMatched && lastMatched.redirect) {
        const { redirect } = lastMatched;
        let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
        if (typeof newTargetLocation === "string") {
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : {
            path: newTargetLocation
          };
          newTargetLocation.params = {};
        }
        return assign({
          query: to.query,
          hash: to.hash,
          params: newTargetLocation.path != null ? {} : to.params
        }, newTargetLocation);
      }
    }
    function pushWithRedirect(to, redirectedFrom) {
      const targetLocation = pendingLocation = resolve2(to);
      const from = currentRoute.value;
      const data = to.state;
      const force = to.force;
      const replace2 = to.replace === true;
      const shouldRedirect = handleRedirectRecord(targetLocation);
      if (shouldRedirect)
        return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
          force,
          replace: replace2
        }), redirectedFrom || targetLocation);
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, {
          to: toLocation,
          from
        });
        handleScroll(from, from, true, false);
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(failure2, 2)) {
            return pushWithRedirect(assign({
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
              force
            }), redirectedFrom || toLocation);
          }
        } else {
          failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
        }
        triggerAfterEach(toLocation, from, failure2);
        return failure2;
      });
    }
    function checkCanceledNavigationAndReject(to, from) {
      const error = checkCanceledNavigation(to, from);
      return error ? Promise.reject(error) : Promise.resolve();
    }
    function runWithContext(fn) {
      const app2 = installedApps.values().next().value;
      return app2 && typeof app2.runWithContext === "function" ? app2.runWithContext(fn) : fn();
    }
    function navigate(to, from) {
      let guards;
      const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
      guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
      for (const record of leavingRecords) {
        record.leaveGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards).then(() => {
        guards = [];
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from));
          });
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const record of enteringRecords) {
          if (record.beforeEnter) {
            if (isArray(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from));
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from));
            }
          }
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        to.matched.forEach((record) => record.enterCallbacks = {});
        guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
    }
    function triggerAfterEach(to, from, failure) {
      afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
    }
    function finalizeNavigation(toLocation, from, isPush, replace2, data) {
      const error = checkCanceledNavigation(toLocation, from);
      if (error)
        return error;
      const isFirstNavigation = from === START_LOCATION_NORMALIZED;
      const state = !isBrowser ? {} : history.state;
      if (isPush) {
        if (replace2 || isFirstNavigation)
          routerHistory.replace(toLocation.fullPath, assign({
            scroll: isFirstNavigation && state && state.scroll
          }, data));
        else
          routerHistory.push(toLocation.fullPath, data);
      }
      currentRoute.value = toLocation;
      handleScroll(toLocation, from, isPush, isFirstNavigation);
      markAsReady();
    }
    let removeHistoryListener;
    function setupListeners() {
      if (removeHistoryListener)
        return;
      removeHistoryListener = routerHistory.listen((to, _from, info) => {
        if (!router2.listening)
          return;
        const toLocation = resolve2(to);
        const shouldRedirect = handleRedirectRecord(toLocation);
        if (shouldRedirect) {
          pushWithRedirect(assign(shouldRedirect, {
            replace: true
          }), toLocation).catch(noop);
          return;
        }
        pendingLocation = toLocation;
        const from = currentRoute.value;
        if (isBrowser) {
          saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
        }
        navigate(toLocation, from).catch((error) => {
          if (isNavigationFailure(error, 4 | 8)) {
            return error;
          }
          if (isNavigationFailure(error, 2)) {
            pushWithRedirect(error.to, toLocation).then((failure) => {
              if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop);
            return Promise.reject();
          }
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          }
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(toLocation, from, false);
          if (failure) {
            if (info.delta && !isNavigationFailure(failure, 8)) {
              routerHistory.go(-info.delta, false);
            } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
              routerHistory.go(-1, false);
            }
          }
          triggerAfterEach(toLocation, from, failure);
        }).catch(noop);
      });
    }
    let readyHandlers = useCallbacks();
    let errorListeners = useCallbacks();
    let ready;
    function triggerError(error, to, from) {
      markAsReady(error);
      const list = errorListeners.list();
      if (list.length) {
        list.forEach((handler) => handler(error, to, from));
      } else {
        console.error(error);
      }
      return Promise.reject(error);
    }
    function isReady() {
      if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
        return Promise.resolve();
      return new Promise((resolve22, reject) => {
        readyHandlers.add([
          resolve22,
          reject
        ]);
      });
    }
    function markAsReady(err) {
      if (!ready) {
        ready = !err;
        setupListeners();
        readyHandlers.list().forEach(([resolve22, reject]) => err ? reject(err) : resolve22());
        readyHandlers.reset();
      }
      return err;
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      const { scrollBehavior } = options;
      if (!isBrowser || !scrollBehavior)
        return Promise.resolve();
      const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
      return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
    }
    const go = (delta) => routerHistory.go(delta);
    let started;
    const installedApps = /* @__PURE__ */ new Set();
    const router2 = {
      currentRoute,
      listening: true,
      addRoute,
      removeRoute,
      hasRoute,
      getRoutes,
      resolve: resolve2,
      options,
      push,
      replace,
      go,
      back: () => go(-1),
      forward: () => go(1),
      beforeEach: beforeGuards.add,
      beforeResolve: beforeResolveGuards.add,
      afterEach: afterGuards.add,
      onError: errorListeners.add,
      isReady,
      install(app2) {
        const router22 = this;
        app2.component("RouterLink", RouterLink);
        app2.component("RouterView", RouterView);
        app2.config.globalProperties.$router = router22;
        Object.defineProperty(app2.config.globalProperties, "$route", {
          enumerable: true,
          get: () => unref(currentRoute)
        });
        if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
          started = true;
          push(routerHistory.location).catch((err) => {
          });
        }
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          Object.defineProperty(reactiveRoute, key, {
            get: () => currentRoute.value[key],
            enumerable: true
          });
        }
        app2.provide(routerKey, router22);
        app2.provide(routeLocationKey, shallowReactive(reactiveRoute));
        app2.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app2.unmount;
        installedApps.add(app2);
        app2.unmount = function() {
          installedApps.delete(app2);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            removeHistoryListener = null;
            currentRoute.value = START_LOCATION_NORMALIZED;
            started = false;
            ready = false;
          }
          unmountApp();
        };
      }
    };
    function runGuardQueue(guards) {
      return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
    }
    return router2;
  }
  function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
      const recordFrom = from.matched[i];
      if (recordFrom) {
        if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
          updatingRecords.push(recordFrom);
        else
          leavingRecords.push(recordFrom);
      }
      const recordTo = to.matched[i];
      if (recordTo) {
        if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
          enteringRecords.push(recordTo);
        }
      }
    }
    return [
      leavingRecords,
      updatingRecords,
      enteringRecords
    ];
  }
  const _hoisted_1$3 = {
    class: "header-container"
  };
  const _hoisted_2$2 = {
    class: "wrapper"
  };
  const _sfc_main$4 = defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_Search = resolveComponent("Search");
        return openBlock(), createElementBlock(Fragment, null, [
          createBaseVNode("header", _hoisted_1$3, [
            createBaseVNode("div", _hoisted_2$2, [
              createVNode(_component_Search)
            ])
          ]),
          createVNode(unref(RouterView))
        ], 64);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const App = _export_sfc(_sfc_main$4, [
    [
      "__scopeId",
      "data-v-6e835618"
    ]
  ]);
  const __vite__wasmUrl = "/pealim-demo/assets/libpealimrs_bg-BYHqUndX.wasm";
  const __vite__initWasm = async (opts = {}, url) => {
    let result;
    if (url.startsWith("data:")) {
      const urlContent = url.replace(/^data:.*?base64,/, "");
      let bytes;
      if (typeof Buffer === "function" && typeof Buffer.from === "function") {
        bytes = Buffer.from(urlContent, "base64");
      } else if (typeof atob === "function") {
        const binaryString = atob(urlContent);
        bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      } else {
        throw new Error("Cannot decode base64-encoded data URL");
      }
      result = await WebAssembly.instantiate(bytes, opts);
    } else {
      const response = await fetch(url);
      const contentType = response.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && contentType.startsWith("application/wasm")) {
        result = await WebAssembly.instantiateStreaming(response, opts);
      } else {
        const buffer = await response.arrayBuffer();
        result = await WebAssembly.instantiate(buffer, opts);
      }
    }
    return result.instance.exports;
  };
  let wasm$1;
  function __wbg_set_wasm(val) {
    wasm$1 = val;
  }
  const lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;
  let cachedTextDecoder = new lTextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  cachedTextDecoder.decode();
  let cachedUint8Memory0 = null;
  function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
      cachedUint8Memory0 = new Uint8Array(wasm$1.memory.buffer);
    }
    return cachedUint8Memory0;
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }
  let cachedInt32Memory0 = null;
  function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
      cachedInt32Memory0 = new Int32Array(wasm$1.memory.buffer);
    }
    return cachedInt32Memory0;
  }
  let WASM_VECTOR_LEN = 0;
  const lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder;
  let cachedTextEncoder = new lTextEncoder("utf-8");
  const encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
  } : function(arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === void 0) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr2 = malloc(buf.length, 1) >>> 0;
      getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr2;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 127)
        break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);
      offset += ret.written;
      ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  function isLikeNone(x) {
    return x === void 0 || x === null;
  }
  const heap = new Array(128).fill(void 0);
  heap.push(void 0, null, true, false);
  let heap_next = heap.length;
  function addHeapObject(obj) {
    if (heap_next === heap.length)
      heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  function getObject(idx) {
    return heap[idx];
  }
  function dropObject(idx) {
    if (idx < 132)
      return;
    heap[idx] = heap_next;
    heap_next = idx;
  }
  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }
  let cachedUint32Memory0 = null;
  function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
      cachedUint32Memory0 = new Uint32Array(wasm$1.memory.buffer);
    }
    return cachedUint32Memory0;
  }
  function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
      result.push(takeObject(slice[i]));
    }
    return result;
  }
  function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
      mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
  }
  function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
      throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
  }
  function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
  }
  function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  const SearchResultFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_searchresult_free(ptr >>> 0));
  class SearchResult {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(SearchResult.prototype);
      obj.__wbg_ptr = ptr;
      SearchResultFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      SearchResultFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_searchresult_free(ptr);
    }
    get word() {
      const ret = wasm$1.__wbg_get_searchresult_word(this.__wbg_ptr);
      return WordData.__wrap(ret);
    }
    set word(arg0) {
      _assertClass(arg0, WordData);
      var ptr0 = arg0.__destroy_into_raw();
      wasm$1.__wbg_set_searchresult_word(this.__wbg_ptr, ptr0);
    }
    get matching_forms() {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_searchresult_matching_forms(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU32FromWasm0(r0, r1).slice();
        wasm$1.__wbindgen_free(r0, r1 * 4, 4);
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    set matching_forms(arg0) {
      const ptr0 = passArray32ToWasm0(arg0, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_searchresult_matching_forms(this.__wbg_ptr, ptr0, len0);
    }
    constructor(word, matching_forms) {
      _assertClass(word, WordData);
      var ptr0 = word.__destroy_into_raw();
      const ptr1 = passArray32ToWasm0(matching_forms, wasm$1.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm$1.searchresult_new(ptr0, ptr1, len1);
      this.__wbg_ptr = ret >>> 0;
      return this;
    }
  }
  const WordDataFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_worddata_free(ptr >>> 0));
  class WordData {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(WordData.prototype);
      obj.__wbg_ptr = ptr;
      WordDataFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    static __unwrap(jsValue) {
      if (!(jsValue instanceof WordData)) {
        return 0;
      }
      return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      WordDataFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_worddata_free(ptr);
    }
    get url_id() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_url_id(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set url_id(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_url_id(this.__wbg_ptr, ptr0, len0);
    }
    get word() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_word(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set word(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_word(this.__wbg_ptr, ptr0, len0);
    }
    get word_en() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_word_en(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set word_en(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_word_en(this.__wbg_ptr, ptr0, len0);
    }
    get word_normalized() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_word_normalized(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set word_normalized(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_word_normalized(this.__wbg_ptr, ptr0, len0);
    }
    get transcription() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_transcription(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set transcription(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_transcription(this.__wbg_ptr, ptr0, len0);
    }
    get root() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_root(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set root(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_root(this.__wbg_ptr, ptr0, len0);
    }
    get forms() {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_forms(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm$1.__wbindgen_free(r0, r1 * 4, 4);
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    set forms(arg0) {
      const ptr0 = passArrayJsValueToWasm0(arg0, wasm$1.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_forms(this.__wbg_ptr, ptr0, len0);
    }
    get binyan() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_binyan(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set binyan(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_binyan(this.__wbg_ptr, ptr0, len0);
    }
    get passive() {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_passive(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v1;
        if (r0 !== 0) {
          v1 = getArrayJsValueFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 4, 4);
        }
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    set passive(arg0) {
      var ptr0 = isLikeNone(arg0) ? 0 : passArrayJsValueToWasm0(arg0, wasm$1.__wbindgen_malloc);
      var len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_passive(this.__wbg_ptr, ptr0, len0);
    }
    get passive_binyan() {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_passive_binyan(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v1;
        if (r0 !== 0) {
          v1 = getStringFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 1, 1);
        }
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    set passive_binyan(arg0) {
      var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      var len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_passive_binyan(this.__wbg_ptr, ptr0, len0);
    }
    constructor(url_id, word, word_en, word_normalized, transcription, root, forms, binyan, passive, passive_binyan) {
      const ptr0 = passStringToWasm0(url_id, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(word, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(word_en, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len2 = WASM_VECTOR_LEN;
      const ptr3 = passStringToWasm0(word_normalized, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len3 = WASM_VECTOR_LEN;
      const ptr4 = passStringToWasm0(transcription, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len4 = WASM_VECTOR_LEN;
      const ptr5 = passStringToWasm0(root, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len5 = WASM_VECTOR_LEN;
      const ptr6 = passArrayJsValueToWasm0(forms, wasm$1.__wbindgen_malloc);
      const len6 = WASM_VECTOR_LEN;
      const ptr7 = passStringToWasm0(binyan, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len7 = WASM_VECTOR_LEN;
      var ptr8 = isLikeNone(passive) ? 0 : passArrayJsValueToWasm0(passive, wasm$1.__wbindgen_malloc);
      var len8 = WASM_VECTOR_LEN;
      var ptr9 = isLikeNone(passive_binyan) ? 0 : passStringToWasm0(passive_binyan, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      var len9 = WASM_VECTOR_LEN;
      const ret = wasm$1.worddata_new(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9);
      this.__wbg_ptr = ret >>> 0;
      return this;
    }
  }
  const WordFormFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_wordform_free(ptr >>> 0));
  class WordForm {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(WordForm.prototype);
      obj.__wbg_ptr = ptr;
      WordFormFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    static __unwrap(jsValue) {
      if (!(jsValue instanceof WordForm)) {
        return 0;
      }
      return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      WordFormFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_wordform_free(ptr);
    }
    get tense() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_url_id(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set tense(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_url_id(this.__wbg_ptr, ptr0, len0);
    }
    get person() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_word(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set person(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_word(this.__wbg_ptr, ptr0, len0);
    }
    get number() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_word_en(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set number(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_word_en(this.__wbg_ptr, ptr0, len0);
    }
    get gender() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_word_normalized(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set gender(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_word_normalized(this.__wbg_ptr, ptr0, len0);
    }
    get form() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_transcription(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set form(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_transcription(this.__wbg_ptr, ptr0, len0);
    }
    get form_normalized() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_root(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set form_normalized(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_root(this.__wbg_ptr, ptr0, len0);
    }
    get transcription() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_wordform_transcription(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set transcription(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_wordform_transcription(this.__wbg_ptr, ptr0, len0);
    }
    get meaning() {
      let deferred1_0;
      let deferred1_1;
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_worddata_binyan(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
      }
    }
    set meaning(arg0) {
      const ptr0 = passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_worddata_binyan(this.__wbg_ptr, ptr0, len0);
    }
    get form_vowelled() {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.__wbg_get_wordform_form_vowelled(retptr, this.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v1;
        if (r0 !== 0) {
          v1 = getStringFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 1, 1);
        }
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    set form_vowelled(arg0) {
      var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      var len0 = WASM_VECTOR_LEN;
      wasm$1.__wbg_set_wordform_form_vowelled(this.__wbg_ptr, ptr0, len0);
    }
    constructor(tense, person, number, gender, form, form_normalized, transcription, meaning, form_vowelled) {
      const ptr0 = passStringToWasm0(tense, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(person, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(number, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len2 = WASM_VECTOR_LEN;
      const ptr3 = passStringToWasm0(gender, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len3 = WASM_VECTOR_LEN;
      const ptr4 = passStringToWasm0(form, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len4 = WASM_VECTOR_LEN;
      const ptr5 = passStringToWasm0(form_normalized, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len5 = WASM_VECTOR_LEN;
      const ptr6 = passStringToWasm0(transcription, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len6 = WASM_VECTOR_LEN;
      const ptr7 = passStringToWasm0(meaning, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len7 = WASM_VECTOR_LEN;
      var ptr8 = isLikeNone(form_vowelled) ? 0 : passStringToWasm0(form_vowelled, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      var len8 = WASM_VECTOR_LEN;
      const ret = wasm$1.wordform_new(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8);
      this.__wbg_ptr = ret >>> 0;
      return this;
    }
  }
  typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_wordindex_free(ptr >>> 0));
  function __wbg_wordform_new(arg0) {
    const ret = WordForm.__wrap(arg0);
    return addHeapObject(ret);
  }
  function __wbg_searchresult_new(arg0) {
    const ret = SearchResult.__wrap(arg0);
    return addHeapObject(ret);
  }
  function __wbg_worddata_new(arg0) {
    const ret = WordData.__wrap(arg0);
    return addHeapObject(ret);
  }
  function __wbg_wordform_unwrap(arg0) {
    const ret = WordForm.__unwrap(takeObject(arg0));
    return ret;
  }
  function __wbg_worddata_unwrap(arg0) {
    const ret = WordData.__unwrap(takeObject(arg0));
    return ret;
  }
  function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  }
  URL = globalThis.URL;
  const __vite__wasmModule = await __vite__initWasm({
    "./libpealimrs_bg.js": {
      __wbg_wordform_new,
      __wbg_searchresult_new,
      __wbg_worddata_new,
      __wbg_wordform_unwrap,
      __wbg_worddata_unwrap,
      __wbindgen_throw
    }
  }, __vite__wasmUrl);
  const memory = __vite__wasmModule.memory;
  const __wbg_wordform_free = __vite__wasmModule.__wbg_wordform_free;
  const __wbg_get_wordform_transcription = __vite__wasmModule.__wbg_get_wordform_transcription;
  const __wbg_set_wordform_transcription = __vite__wasmModule.__wbg_set_wordform_transcription;
  const __wbg_get_wordform_form_vowelled = __vite__wasmModule.__wbg_get_wordform_form_vowelled;
  const __wbg_set_wordform_form_vowelled = __vite__wasmModule.__wbg_set_wordform_form_vowelled;
  const wordform_new = __vite__wasmModule.wordform_new;
  const __wbg_worddata_free = __vite__wasmModule.__wbg_worddata_free;
  const __wbg_get_worddata_url_id = __vite__wasmModule.__wbg_get_worddata_url_id;
  const __wbg_set_worddata_url_id = __vite__wasmModule.__wbg_set_worddata_url_id;
  const __wbg_get_worddata_word = __vite__wasmModule.__wbg_get_worddata_word;
  const __wbg_set_worddata_word = __vite__wasmModule.__wbg_set_worddata_word;
  const __wbg_get_worddata_word_en = __vite__wasmModule.__wbg_get_worddata_word_en;
  const __wbg_set_worddata_word_en = __vite__wasmModule.__wbg_set_worddata_word_en;
  const __wbg_get_worddata_word_normalized = __vite__wasmModule.__wbg_get_worddata_word_normalized;
  const __wbg_set_worddata_word_normalized = __vite__wasmModule.__wbg_set_worddata_word_normalized;
  const __wbg_get_worddata_transcription = __vite__wasmModule.__wbg_get_worddata_transcription;
  const __wbg_set_worddata_transcription = __vite__wasmModule.__wbg_set_worddata_transcription;
  const __wbg_get_worddata_root = __vite__wasmModule.__wbg_get_worddata_root;
  const __wbg_set_worddata_root = __vite__wasmModule.__wbg_set_worddata_root;
  const __wbg_get_worddata_forms = __vite__wasmModule.__wbg_get_worddata_forms;
  const __wbg_set_worddata_forms = __vite__wasmModule.__wbg_set_worddata_forms;
  const __wbg_get_worddata_binyan = __vite__wasmModule.__wbg_get_worddata_binyan;
  const __wbg_set_worddata_binyan = __vite__wasmModule.__wbg_set_worddata_binyan;
  const __wbg_get_worddata_passive = __vite__wasmModule.__wbg_get_worddata_passive;
  const __wbg_set_worddata_passive = __vite__wasmModule.__wbg_set_worddata_passive;
  const __wbg_get_worddata_passive_binyan = __vite__wasmModule.__wbg_get_worddata_passive_binyan;
  const __wbg_set_worddata_passive_binyan = __vite__wasmModule.__wbg_set_worddata_passive_binyan;
  const worddata_new = __vite__wasmModule.worddata_new;
  const __wbg_searchresult_free = __vite__wasmModule.__wbg_searchresult_free;
  const __wbg_get_searchresult_word = __vite__wasmModule.__wbg_get_searchresult_word;
  const __wbg_set_searchresult_word = __vite__wasmModule.__wbg_set_searchresult_word;
  const __wbg_get_searchresult_matching_forms = __vite__wasmModule.__wbg_get_searchresult_matching_forms;
  const __wbg_set_searchresult_matching_forms = __vite__wasmModule.__wbg_set_searchresult_matching_forms;
  const searchresult_new = __vite__wasmModule.searchresult_new;
  const __wbg_set_wordform_tense = __vite__wasmModule.__wbg_set_wordform_tense;
  const __wbg_set_wordform_person = __vite__wasmModule.__wbg_set_wordform_person;
  const __wbg_set_wordform_number = __vite__wasmModule.__wbg_set_wordform_number;
  const __wbg_set_wordform_gender = __vite__wasmModule.__wbg_set_wordform_gender;
  const __wbg_set_wordform_form = __vite__wasmModule.__wbg_set_wordform_form;
  const __wbg_set_wordform_form_normalized = __vite__wasmModule.__wbg_set_wordform_form_normalized;
  const __wbg_set_wordform_meaning = __vite__wasmModule.__wbg_set_wordform_meaning;
  const __wbg_get_wordform_tense = __vite__wasmModule.__wbg_get_wordform_tense;
  const __wbg_get_wordform_person = __vite__wasmModule.__wbg_get_wordform_person;
  const __wbg_get_wordform_number = __vite__wasmModule.__wbg_get_wordform_number;
  const __wbg_get_wordform_gender = __vite__wasmModule.__wbg_get_wordform_gender;
  const __wbg_get_wordform_form = __vite__wasmModule.__wbg_get_wordform_form;
  const __wbg_get_wordform_form_normalized = __vite__wasmModule.__wbg_get_wordform_form_normalized;
  const __wbg_get_wordform_meaning = __vite__wasmModule.__wbg_get_wordform_meaning;
  const __wbg_wordindex_free = __vite__wasmModule.__wbg_wordindex_free;
  const wordindex_init_local = __vite__wasmModule.wordindex_init_local;
  const wordindex_build = __vite__wasmModule.wordindex_build;
  const wordindex_get_by_root = __vite__wasmModule.wordindex_get_by_root;
  const wordindex_get = __vite__wasmModule.wordindex_get;
  const wordindex_suggest = __vite__wasmModule.wordindex_suggest;
  const wordindex_suggest_hebrew = __vite__wasmModule.wordindex_suggest_hebrew;
  const wordindex_suggest_by_translation = __vite__wasmModule.wordindex_suggest_by_translation;
  const wordindex_matching_forms = __vite__wasmModule.wordindex_matching_forms;
  const __wbindgen_add_to_stack_pointer = __vite__wasmModule.__wbindgen_add_to_stack_pointer;
  const __wbindgen_free = __vite__wasmModule.__wbindgen_free;
  const __wbindgen_malloc = __vite__wasmModule.__wbindgen_malloc;
  const __wbindgen_realloc = __vite__wasmModule.__wbindgen_realloc;
  const wasm = Object.freeze(Object.defineProperty({
    __proto__: null,
    __wbg_get_searchresult_matching_forms,
    __wbg_get_searchresult_word,
    __wbg_get_worddata_binyan,
    __wbg_get_worddata_forms,
    __wbg_get_worddata_passive,
    __wbg_get_worddata_passive_binyan,
    __wbg_get_worddata_root,
    __wbg_get_worddata_transcription,
    __wbg_get_worddata_url_id,
    __wbg_get_worddata_word,
    __wbg_get_worddata_word_en,
    __wbg_get_worddata_word_normalized,
    __wbg_get_wordform_form,
    __wbg_get_wordform_form_normalized,
    __wbg_get_wordform_form_vowelled,
    __wbg_get_wordform_gender,
    __wbg_get_wordform_meaning,
    __wbg_get_wordform_number,
    __wbg_get_wordform_person,
    __wbg_get_wordform_tense,
    __wbg_get_wordform_transcription,
    __wbg_searchresult_free,
    __wbg_set_searchresult_matching_forms,
    __wbg_set_searchresult_word,
    __wbg_set_worddata_binyan,
    __wbg_set_worddata_forms,
    __wbg_set_worddata_passive,
    __wbg_set_worddata_passive_binyan,
    __wbg_set_worddata_root,
    __wbg_set_worddata_transcription,
    __wbg_set_worddata_url_id,
    __wbg_set_worddata_word,
    __wbg_set_worddata_word_en,
    __wbg_set_worddata_word_normalized,
    __wbg_set_wordform_form,
    __wbg_set_wordform_form_normalized,
    __wbg_set_wordform_form_vowelled,
    __wbg_set_wordform_gender,
    __wbg_set_wordform_meaning,
    __wbg_set_wordform_number,
    __wbg_set_wordform_person,
    __wbg_set_wordform_tense,
    __wbg_set_wordform_transcription,
    __wbg_worddata_free,
    __wbg_wordform_free,
    __wbg_wordindex_free,
    __wbindgen_add_to_stack_pointer,
    __wbindgen_free,
    __wbindgen_malloc,
    __wbindgen_realloc,
    memory,
    searchresult_new,
    worddata_new,
    wordform_new,
    wordindex_build,
    wordindex_get,
    wordindex_get_by_root,
    wordindex_init_local,
    wordindex_matching_forms,
    wordindex_suggest,
    wordindex_suggest_by_translation,
    wordindex_suggest_hebrew
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  __wbg_set_wasm(wasm);
  class IndexClient {
    constructor() {
      __publicField(this, "worker");
      this.worker = new Worker(new URL("/pealim-demo/assets/worker-CJYLiOGb.js", import.meta.url), {
        type: "module"
      });
      console.log("Worker has been initialized.");
    }
    sendMessage(method, params) {
      return new Promise((resolve2, reject) => {
        const id = Math.random().toString(36).substring(2);
        this.worker.postMessage({
          id,
          method,
          params
        });
        const handleMessage = (event) => {
          const { id: responseId, result, error } = event.data;
          if (responseId === id) {
            this.worker.removeEventListener("message", handleMessage);
            if (error) {
              reject(new Error(error));
            } else {
              console.log("sendMessage", result);
              resolve2(this.reconstruct(result));
            }
          }
        };
        this.worker.addEventListener("message", handleMessage);
      });
    }
    async getWordData(word) {
      return this.sendMessage("getWordData", {
        word
      });
    }
    async suggestWordData(prefix, limit) {
      return this.sendMessage("suggestWordData", {
        prefix,
        limit
      });
    }
    async matchingForms(urlId, form) {
      return this.sendMessage("suggestWordData", {
        urlId,
        form
      });
    }
    reconstruct(data) {
      switch (data.type) {
        case "WordData":
          return this.reconstructWordDataArray(data.value);
        case "SearchResult":
          return this.reconstructSearchResultArray(data.value);
        case "WordForm":
          return this.reconstructWordFormArray(data.value);
        default:
          throw new Error(`Unknown type: ${data.type}`);
      }
    }
    reconstructWordDataArray(data) {
      console.log("reconstructWordDataArray", data);
      return data.map((e) => {
        return this.reconstructWordData(e);
      });
    }
    reconstructSearchResultArray(data) {
      console.log("reconstructSearchResultArray", data);
      return data.map((e) => {
        return this.reconstructSearchResult(e);
      });
    }
    reconstructSearchResult(data) {
      console.log("reconstructSearchResult", data);
      return new SearchResult(this.reconstructWordData(data.word), data.matched_forms);
    }
    reconstructWordData(data) {
      console.log("reconstructWordData", data);
      let instance = new WordData(data.url_id, data.word, data.word_en, data.word_normalized, data.transcription, data.root, this.reconstructWordFormArray(data.forms), data.binyan, data.passive ? this.reconstructWordFormArray(data.passive) : void 0, data.passive_binyan);
      console.log("reconstructWordData result", instance, instance.url_id);
      return instance;
    }
    reconstructWordFormArray(forms) {
      return forms.map((form) => {
        return new WordForm(form.tense, form.person, form.number, form.gender, form.form, form.form_normalized, form.transcription, form.meaning, form.form_normalized);
      });
    }
  }
  const doesNotStartWithHebrew = (word) => {
    const hebrewRegex = /^[\u0590-\u05FF]/;
    return !hebrewRegex.test(word);
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var lodash = {
    exports: {}
  };
  lodash.exports;
  (function(module2, exports) {
    (function() {
      var undefined$1;
      var VERSION = "4.17.21";
      var LARGE_ARRAY_SIZE = 200;
      var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var MAX_MEMOIZE_SIZE = 500;
      var PLACEHOLDER = "__lodash_placeholder__";
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
      var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
      var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
      var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
      var wrapFlags = [
        [
          "ary",
          WRAP_ARY_FLAG
        ],
        [
          "bind",
          WRAP_BIND_FLAG
        ],
        [
          "bindKey",
          WRAP_BIND_KEY_FLAG
        ],
        [
          "curry",
          WRAP_CURRY_FLAG
        ],
        [
          "curryRight",
          WRAP_CURRY_RIGHT_FLAG
        ],
        [
          "flip",
          WRAP_FLIP_FLAG
        ],
        [
          "partial",
          WRAP_PARTIAL_FLAG
        ],
        [
          "partialRight",
          WRAP_PARTIAL_RIGHT_FLAG
        ],
        [
          "rearg",
          WRAP_REARG_FLAG
        ]
      ];
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
      var reTrimStart = /^\s+/;
      var reWhitespace = /\s/;
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
      var reEscapeChar = /\\(\\)?/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsOctal = /^0o[0-7]+$/i;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [
        rsNonAstral,
        rsRegional,
        rsSurrPair
      ].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [
        rsDingbat,
        rsRegional,
        rsSurrPair
      ].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [
        rsNonAstral + rsCombo + "?",
        rsCombo,
        rsRegional,
        rsSurrPair,
        rsAstral
      ].join("|") + ")";
      var reApos = RegExp(rsApos, "g");
      var reComboMark = RegExp(rsCombo, "g");
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [
          rsBreak,
          rsUpper,
          "$"
        ].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [
          rsBreak,
          rsUpper + rsMiscLower,
          "$"
        ].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      var contextProps = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ];
      var templateCounter = -1;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var deburredLetters = {
        "\xC0": "A",
        "\xC1": "A",
        "\xC2": "A",
        "\xC3": "A",
        "\xC4": "A",
        "\xC5": "A",
        "\xE0": "a",
        "\xE1": "a",
        "\xE2": "a",
        "\xE3": "a",
        "\xE4": "a",
        "\xE5": "a",
        "\xC7": "C",
        "\xE7": "c",
        "\xD0": "D",
        "\xF0": "d",
        "\xC8": "E",
        "\xC9": "E",
        "\xCA": "E",
        "\xCB": "E",
        "\xE8": "e",
        "\xE9": "e",
        "\xEA": "e",
        "\xEB": "e",
        "\xCC": "I",
        "\xCD": "I",
        "\xCE": "I",
        "\xCF": "I",
        "\xEC": "i",
        "\xED": "i",
        "\xEE": "i",
        "\xEF": "i",
        "\xD1": "N",
        "\xF1": "n",
        "\xD2": "O",
        "\xD3": "O",
        "\xD4": "O",
        "\xD5": "O",
        "\xD6": "O",
        "\xD8": "O",
        "\xF2": "o",
        "\xF3": "o",
        "\xF4": "o",
        "\xF5": "o",
        "\xF6": "o",
        "\xF8": "o",
        "\xD9": "U",
        "\xDA": "U",
        "\xDB": "U",
        "\xDC": "U",
        "\xF9": "u",
        "\xFA": "u",
        "\xFB": "u",
        "\xFC": "u",
        "\xDD": "Y",
        "\xFD": "y",
        "\xFF": "y",
        "\xC6": "Ae",
        "\xE6": "ae",
        "\xDE": "Th",
        "\xFE": "th",
        "\xDF": "ss",
        "\u0100": "A",
        "\u0102": "A",
        "\u0104": "A",
        "\u0101": "a",
        "\u0103": "a",
        "\u0105": "a",
        "\u0106": "C",
        "\u0108": "C",
        "\u010A": "C",
        "\u010C": "C",
        "\u0107": "c",
        "\u0109": "c",
        "\u010B": "c",
        "\u010D": "c",
        "\u010E": "D",
        "\u0110": "D",
        "\u010F": "d",
        "\u0111": "d",
        "\u0112": "E",
        "\u0114": "E",
        "\u0116": "E",
        "\u0118": "E",
        "\u011A": "E",
        "\u0113": "e",
        "\u0115": "e",
        "\u0117": "e",
        "\u0119": "e",
        "\u011B": "e",
        "\u011C": "G",
        "\u011E": "G",
        "\u0120": "G",
        "\u0122": "G",
        "\u011D": "g",
        "\u011F": "g",
        "\u0121": "g",
        "\u0123": "g",
        "\u0124": "H",
        "\u0126": "H",
        "\u0125": "h",
        "\u0127": "h",
        "\u0128": "I",
        "\u012A": "I",
        "\u012C": "I",
        "\u012E": "I",
        "\u0130": "I",
        "\u0129": "i",
        "\u012B": "i",
        "\u012D": "i",
        "\u012F": "i",
        "\u0131": "i",
        "\u0134": "J",
        "\u0135": "j",
        "\u0136": "K",
        "\u0137": "k",
        "\u0138": "k",
        "\u0139": "L",
        "\u013B": "L",
        "\u013D": "L",
        "\u013F": "L",
        "\u0141": "L",
        "\u013A": "l",
        "\u013C": "l",
        "\u013E": "l",
        "\u0140": "l",
        "\u0142": "l",
        "\u0143": "N",
        "\u0145": "N",
        "\u0147": "N",
        "\u014A": "N",
        "\u0144": "n",
        "\u0146": "n",
        "\u0148": "n",
        "\u014B": "n",
        "\u014C": "O",
        "\u014E": "O",
        "\u0150": "O",
        "\u014D": "o",
        "\u014F": "o",
        "\u0151": "o",
        "\u0154": "R",
        "\u0156": "R",
        "\u0158": "R",
        "\u0155": "r",
        "\u0157": "r",
        "\u0159": "r",
        "\u015A": "S",
        "\u015C": "S",
        "\u015E": "S",
        "\u0160": "S",
        "\u015B": "s",
        "\u015D": "s",
        "\u015F": "s",
        "\u0161": "s",
        "\u0162": "T",
        "\u0164": "T",
        "\u0166": "T",
        "\u0163": "t",
        "\u0165": "t",
        "\u0167": "t",
        "\u0168": "U",
        "\u016A": "U",
        "\u016C": "U",
        "\u016E": "U",
        "\u0170": "U",
        "\u0172": "U",
        "\u0169": "u",
        "\u016B": "u",
        "\u016D": "u",
        "\u016F": "u",
        "\u0171": "u",
        "\u0173": "u",
        "\u0174": "W",
        "\u0175": "w",
        "\u0176": "Y",
        "\u0177": "y",
        "\u0178": "Y",
        "\u0179": "Z",
        "\u017B": "Z",
        "\u017D": "Z",
        "\u017A": "z",
        "\u017C": "z",
        "\u017E": "z",
        "\u0132": "IJ",
        "\u0133": "ij",
        "\u0152": "Oe",
        "\u0153": "oe",
        "\u0149": "'n",
        "\u017F": "s"
      };
      var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      var htmlUnescapes = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      var stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      var freeParseFloat = parseFloat, freeParseInt = parseInt;
      var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = exports && !exports.nodeType && exports;
      var freeModule = freeExports && true && module2 && !module2.nodeType && module2;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types = freeModule && freeModule.require && freeModule.require("util").types;
          if (types) {
            return types;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      function arrayAggregator(array, setter, iteratee, accumulator) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          var value = array[index];
          setter(accumulator, value, iteratee(value), array);
        }
        return accumulator;
      }
      function arrayEach(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEachRight(array, iteratee) {
        var length = array == null ? 0 : array.length;
        while (length--) {
          if (iteratee(array[length], length, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEvery(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (!predicate(array[index], index, array)) {
            return false;
          }
        }
        return true;
      }
      function arrayFilter(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function arrayIncludes(array, value) {
        var length = array == null ? 0 : array.length;
        return !!length && baseIndexOf(array, value, 0) > -1;
      }
      function arrayIncludesWith(array, value, comparator2) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (comparator2(value, array[index])) {
            return true;
          }
        }
        return false;
      }
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      function arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1, length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      function arrayReduceRight(array, iteratee, accumulator, initAccum) {
        var length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[--length];
        }
        while (length--) {
          accumulator = iteratee(accumulator, array[length], length, array);
        }
        return accumulator;
      }
      function arraySome(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      var asciiSize = baseProperty("length");
      function asciiToArray(string) {
        return string.split("");
      }
      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }
      function baseFindKey(collection, predicate, eachFunc) {
        var result;
        eachFunc(collection, function(value, key, collection2) {
          if (predicate(value, key, collection2)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index-- : ++index < length) {
          if (predicate(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
      function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
      }
      function baseIndexOfWith(array, value, fromIndex, comparator2) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (comparator2(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function baseIsNaN(value) {
        return value !== value;
      }
      function baseMean(array, iteratee) {
        var length = array == null ? 0 : array.length;
        return length ? baseSum(array, iteratee) / length : NAN;
      }
      function baseProperty(key) {
        return function(object) {
          return object == null ? undefined$1 : object[key];
        };
      }
      function basePropertyOf(object) {
        return function(key) {
          return object == null ? undefined$1 : object[key];
        };
      }
      function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
        eachFunc(collection, function(value, index, collection2) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
        });
        return accumulator;
      }
      function baseSortBy(array, comparer) {
        var length = array.length;
        array.sort(comparer);
        while (length--) {
          array[length] = array[length].value;
        }
        return array;
      }
      function baseSum(array, iteratee) {
        var result, index = -1, length = array.length;
        while (++index < length) {
          var current = iteratee(array[index]);
          if (current !== undefined$1) {
            result = result === undefined$1 ? current : result + current;
          }
        }
        return result;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      function baseToPairs(object, props) {
        return arrayMap(props, function(key) {
          return [
            key,
            object[key]
          ];
        });
      }
      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      function baseValues(object, props) {
        return arrayMap(props, function(key) {
          return object[key];
        });
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      function charsStartIndex(strSymbols, chrSymbols) {
        var index = -1, length = strSymbols.length;
        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function charsEndIndex(strSymbols, chrSymbols) {
        var index = strSymbols.length;
        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function countHolders(array, placeholder) {
        var length = array.length, result = 0;
        while (length--) {
          if (array[length] === placeholder) {
            ++result;
          }
        }
        return result;
      }
      var deburrLetter = basePropertyOf(deburredLetters);
      var escapeHtmlChar = basePropertyOf(htmlEscapes);
      function escapeStringChar(chr) {
        return "\\" + stringEscapes[chr];
      }
      function getValue(object, key) {
        return object == null ? undefined$1 : object[key];
      }
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }
      function iteratorToArray(iterator) {
        var data, result = [];
        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }
      function mapToArray(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [
            key,
            value
          ];
        });
        return result;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      function replaceHolders(array, placeholder) {
        var index = -1, length = array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (value === placeholder || value === PLACEHOLDER) {
            array[index] = PLACEHOLDER;
            result[resIndex++] = index;
          }
        }
        return result;
      }
      function setToArray(set2) {
        var index = -1, result = Array(set2.size);
        set2.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      function setToPairs(set2) {
        var index = -1, result = Array(set2.size);
        set2.forEach(function(value) {
          result[++index] = [
            value,
            value
          ];
        });
        return result;
      }
      function strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
      function strictLastIndexOf(array, value, fromIndex) {
        var index = fromIndex + 1;
        while (index--) {
          if (array[index] === value) {
            return index;
          }
        }
        return index;
      }
      function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
      }
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      function trimmedEndIndex(string) {
        var index = string.length;
        while (index-- && reWhitespace.test(string.charAt(index))) {
        }
        return index;
      }
      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
      function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
          ++result;
        }
        return result;
      }
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }
      var runInContext = function runInContext2(context) {
        context = context == null ? root : _2.defaults(root.Object(), context, _2.pick(root, contextProps));
        var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
        var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
        var coreJsData = context["__core-js_shared__"];
        var funcToString = funcProto.toString;
        var hasOwnProperty2 = objectProto.hasOwnProperty;
        var idCounter = 0;
        var maskSrcKey = function() {
          var uid2 = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
          return uid2 ? "Symbol(src)_1." + uid2 : "";
        }();
        var nativeObjectToString = objectProto.toString;
        var objectCtorString = funcToString.call(Object2);
        var oldDash = root._;
        var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        var Buffer2 = moduleExports ? context.Buffer : undefined$1, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined$1, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined$1, symIterator = Symbol2 ? Symbol2.iterator : undefined$1, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined$1;
        var defineProperty = function() {
          try {
            var func = getNative(Object2, "defineProperty");
            func({}, "", {});
            return func;
          } catch (e) {
          }
        }();
        var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
        var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined$1, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
        var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
        var metaMap = WeakMap2 && new WeakMap2();
        var realNames = {};
        var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
        var symbolProto = Symbol2 ? Symbol2.prototype : undefined$1, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1, symbolToString = symbolProto ? symbolProto.toString : undefined$1;
        function lodash2(value) {
          if (isObjectLike(value) && !isArray2(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
              return value;
            }
            if (hasOwnProperty2.call(value, "__wrapped__")) {
              return wrapperClone(value);
            }
          }
          return new LodashWrapper(value);
        }
        var baseCreate = /* @__PURE__ */ function() {
          function object() {
          }
          return function(proto) {
            if (!isObject2(proto)) {
              return {};
            }
            if (objectCreate) {
              return objectCreate(proto);
            }
            object.prototype = proto;
            var result2 = new object();
            object.prototype = undefined$1;
            return result2;
          };
        }();
        function baseLodash() {
        }
        function LodashWrapper(value, chainAll) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__chain__ = !!chainAll;
          this.__index__ = 0;
          this.__values__ = undefined$1;
        }
        lodash2.templateSettings = {
          "escape": reEscape,
          "evaluate": reEvaluate,
          "interpolate": reInterpolate,
          "variable": "",
          "imports": {
            "_": lodash2
          }
        };
        lodash2.prototype = baseLodash.prototype;
        lodash2.prototype.constructor = lodash2;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        function LazyWrapper(value) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__dir__ = 1;
          this.__filtered__ = false;
          this.__iteratees__ = [];
          this.__takeCount__ = MAX_ARRAY_LENGTH;
          this.__views__ = [];
        }
        function lazyClone() {
          var result2 = new LazyWrapper(this.__wrapped__);
          result2.__actions__ = copyArray(this.__actions__);
          result2.__dir__ = this.__dir__;
          result2.__filtered__ = this.__filtered__;
          result2.__iteratees__ = copyArray(this.__iteratees__);
          result2.__takeCount__ = this.__takeCount__;
          result2.__views__ = copyArray(this.__views__);
          return result2;
        }
        function lazyReverse() {
          if (this.__filtered__) {
            var result2 = new LazyWrapper(this);
            result2.__dir__ = -1;
            result2.__filtered__ = true;
          } else {
            result2 = this.clone();
            result2.__dir__ *= -1;
          }
          return result2;
        }
        function lazyValue() {
          var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray2(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
          if (!isArr || !isRight && arrLength == length && takeCount == length) {
            return baseWrapperValue(array, this.__actions__);
          }
          var result2 = [];
          outer:
            while (length-- && resIndex < takeCount) {
              index += dir;
              var iterIndex = -1, value = array[index];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed2 = iteratee2(value);
                if (type == LAZY_MAP_FLAG) {
                  value = computed2;
                } else if (!computed2) {
                  if (type == LAZY_FILTER_FLAG) {
                    continue outer;
                  } else {
                    break outer;
                  }
                }
              }
              result2[resIndex++] = value;
            }
          return result2;
        }
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        function Hash(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
          this.size = 0;
        }
        function hashDelete(key) {
          var result2 = this.has(key) && delete this.__data__[key];
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function hashGet(key) {
          var data = this.__data__;
          if (nativeCreate) {
            var result2 = data[key];
            return result2 === HASH_UNDEFINED ? undefined$1 : result2;
          }
          return hasOwnProperty2.call(data, key) ? data[key] : undefined$1;
        }
        function hashHas(key) {
          var data = this.__data__;
          return nativeCreate ? data[key] !== undefined$1 : hasOwnProperty2.call(data, key);
        }
        function hashSet(key, value) {
          var data = this.__data__;
          this.size += this.has(key) ? 0 : 1;
          data[key] = nativeCreate && value === undefined$1 ? HASH_UNDEFINED : value;
          return this;
        }
        Hash.prototype.clear = hashClear;
        Hash.prototype["delete"] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;
        function ListCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function listCacheClear() {
          this.__data__ = [];
          this.size = 0;
        }
        function listCacheDelete(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          --this.size;
          return true;
        }
        function listCacheGet(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          return index < 0 ? undefined$1 : data[index][1];
        }
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }
        function listCacheSet(key, value) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            ++this.size;
            data.push([
              key,
              value
            ]);
          } else {
            data[index][1] = value;
          }
          return this;
        }
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype["delete"] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;
        function MapCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function mapCacheClear() {
          this.size = 0;
          this.__data__ = {
            "hash": new Hash(),
            "map": new (Map2 || ListCache)(),
            "string": new Hash()
          };
        }
        function mapCacheDelete(key) {
          var result2 = getMapData(this, key)["delete"](key);
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }
        function mapCacheSet(key, value) {
          var data = getMapData(this, key), size3 = data.size;
          data.set(key, value);
          this.size += data.size == size3 ? 0 : 1;
          return this;
        }
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype["delete"] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;
        function SetCache(values2) {
          var index = -1, length = values2 == null ? 0 : values2.length;
          this.__data__ = new MapCache();
          while (++index < length) {
            this.add(values2[index]);
          }
        }
        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }
        function setCacheHas(value) {
          return this.__data__.has(value);
        }
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;
        function Stack(entries) {
          var data = this.__data__ = new ListCache(entries);
          this.size = data.size;
        }
        function stackClear() {
          this.__data__ = new ListCache();
          this.size = 0;
        }
        function stackDelete(key) {
          var data = this.__data__, result2 = data["delete"](key);
          this.size = data.size;
          return result2;
        }
        function stackGet(key) {
          return this.__data__.get(key);
        }
        function stackHas(key) {
          return this.__data__.has(key);
        }
        function stackSet(key, value) {
          var data = this.__data__;
          if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
              pairs.push([
                key,
                value
              ]);
              this.size = ++data.size;
              return this;
            }
            data = this.__data__ = new MapCache(pairs);
          }
          data.set(key, value);
          this.size = data.size;
          return this;
        }
        Stack.prototype.clear = stackClear;
        Stack.prototype["delete"] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;
        function arrayLikeKeys(value, inherited) {
          var isArr = isArray2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
          for (var key in value) {
            if ((inherited || hasOwnProperty2.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function arraySample(array) {
          var length = array.length;
          return length ? array[baseRandom(0, length - 1)] : undefined$1;
        }
        function arraySampleSize(array, n) {
          return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
        }
        function arrayShuffle(array) {
          return shuffleSelf(copyArray(array));
        }
        function assignMergeValue(object, key, value) {
          if (value !== undefined$1 && !eq(object[key], value) || value === undefined$1 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assignValue(object, key, value) {
          var objValue = object[key];
          if (!(hasOwnProperty2.call(object, key) && eq(objValue, value)) || value === undefined$1 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assocIndexOf(array, key) {
          var length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }
        function baseAggregator(collection, setter, iteratee2, accumulator) {
          baseEach(collection, function(value, key, collection2) {
            setter(accumulator, value, iteratee2(value), collection2);
          });
          return accumulator;
        }
        function baseAssign(object, source) {
          return object && copyObject(source, keys(source), object);
        }
        function baseAssignIn(object, source) {
          return object && copyObject(source, keysIn(source), object);
        }
        function baseAssignValue(object, key, value) {
          if (key == "__proto__" && defineProperty) {
            defineProperty(object, key, {
              "configurable": true,
              "enumerable": true,
              "value": value,
              "writable": true
            });
          } else {
            object[key] = value;
          }
        }
        function baseAt(object, paths) {
          var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
          while (++index < length) {
            result2[index] = skip ? undefined$1 : get2(object, paths[index]);
          }
          return result2;
        }
        function baseClamp(number, lower, upper) {
          if (number === number) {
            if (upper !== undefined$1) {
              number = number <= upper ? number : upper;
            }
            if (lower !== undefined$1) {
              number = number >= lower ? number : lower;
            }
          }
          return number;
        }
        function baseClone(value, bitmask, customizer, key, object, stack2) {
          var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
          if (customizer) {
            result2 = object ? customizer(value, key, object, stack2) : customizer(value);
          }
          if (result2 !== undefined$1) {
            return result2;
          }
          if (!isObject2(value)) {
            return value;
          }
          var isArr = isArray2(value);
          if (isArr) {
            result2 = initCloneArray(value);
            if (!isDeep) {
              return copyArray(value, result2);
            }
          } else {
            var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
            if (isBuffer(value)) {
              return cloneBuffer(value, isDeep);
            }
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
              result2 = isFlat || isFunc ? {} : initCloneObject(value);
              if (!isDeep) {
                return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
              }
            } else {
              if (!cloneableTags[tag]) {
                return object ? value : {};
              }
              result2 = initCloneByTag(value, tag, isDeep);
            }
          }
          stack2 || (stack2 = new Stack());
          var stacked = stack2.get(value);
          if (stacked) {
            return stacked;
          }
          stack2.set(value, result2);
          if (isSet2(value)) {
            value.forEach(function(subValue) {
              result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack2));
            });
          } else if (isMap2(value)) {
            value.forEach(function(subValue, key2) {
              result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack2));
            });
          }
          var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
          var props = isArr ? undefined$1 : keysFunc(value);
          arrayEach(props || value, function(subValue, key2) {
            if (props) {
              key2 = subValue;
              subValue = value[key2];
            }
            assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack2));
          });
          return result2;
        }
        function baseConforms(source) {
          var props = keys(source);
          return function(object) {
            return baseConformsTo(object, source, props);
          };
        }
        function baseConformsTo(object, source, props) {
          var length = props.length;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (length--) {
            var key = props[length], predicate = source[key], value = object[key];
            if (value === undefined$1 && !(key in object) || !predicate(value)) {
              return false;
            }
          }
          return true;
        }
        function baseDelay(func, wait, args) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return setTimeout(function() {
            func.apply(undefined$1, args);
          }, wait);
        }
        function baseDifference(array, values2, iteratee2, comparator2) {
          var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
          if (!length) {
            return result2;
          }
          if (iteratee2) {
            values2 = arrayMap(values2, baseUnary(iteratee2));
          }
          if (comparator2) {
            includes2 = arrayIncludesWith;
            isCommon = false;
          } else if (values2.length >= LARGE_ARRAY_SIZE) {
            includes2 = cacheHas;
            isCommon = false;
            values2 = new SetCache(values2);
          }
          outer:
            while (++index < length) {
              var value = array[index], computed2 = iteratee2 == null ? value : iteratee2(value);
              value = comparator2 || value !== 0 ? value : 0;
              if (isCommon && computed2 === computed2) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values2[valuesIndex] === computed2) {
                    continue outer;
                  }
                }
                result2.push(value);
              } else if (!includes2(values2, computed2, comparator2)) {
                result2.push(value);
              }
            }
          return result2;
        }
        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);
        function baseEvery(collection, predicate) {
          var result2 = true;
          baseEach(collection, function(value, index, collection2) {
            result2 = !!predicate(value, index, collection2);
            return result2;
          });
          return result2;
        }
        function baseExtremum(array, iteratee2, comparator2) {
          var index = -1, length = array.length;
          while (++index < length) {
            var value = array[index], current = iteratee2(value);
            if (current != null && (computed2 === undefined$1 ? current === current && !isSymbol2(current) : comparator2(current, computed2))) {
              var computed2 = current, result2 = value;
            }
          }
          return result2;
        }
        function baseFill(array, value, start, end) {
          var length = array.length;
          start = toInteger(start);
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end === undefined$1 || end > length ? length : toInteger(end);
          if (end < 0) {
            end += length;
          }
          end = start > end ? 0 : toLength(end);
          while (start < end) {
            array[start++] = value;
          }
          return array;
        }
        function baseFilter(collection, predicate) {
          var result2 = [];
          baseEach(collection, function(value, index, collection2) {
            if (predicate(value, index, collection2)) {
              result2.push(value);
            }
          });
          return result2;
        }
        function baseFlatten(array, depth, predicate, isStrict, result2) {
          var index = -1, length = array.length;
          predicate || (predicate = isFlattenable);
          result2 || (result2 = []);
          while (++index < length) {
            var value = array[index];
            if (depth > 0 && predicate(value)) {
              if (depth > 1) {
                baseFlatten(value, depth - 1, predicate, isStrict, result2);
              } else {
                arrayPush(result2, value);
              }
            } else if (!isStrict) {
              result2[result2.length] = value;
            }
          }
          return result2;
        }
        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);
        function baseForOwn(object, iteratee2) {
          return object && baseFor(object, iteratee2, keys);
        }
        function baseForOwnRight(object, iteratee2) {
          return object && baseForRight(object, iteratee2, keys);
        }
        function baseFunctions(object, props) {
          return arrayFilter(props, function(key) {
            return isFunction2(object[key]);
          });
        }
        function baseGet(object, path) {
          path = castPath(path, object);
          var index = 0, length = path.length;
          while (object != null && index < length) {
            object = object[toKey(path[index++])];
          }
          return index && index == length ? object : undefined$1;
        }
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
          var result2 = keysFunc(object);
          return isArray2(object) ? result2 : arrayPush(result2, symbolsFunc(object));
        }
        function baseGetTag(value) {
          if (value == null) {
            return value === undefined$1 ? undefinedTag : nullTag;
          }
          return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString2(value);
        }
        function baseGt(value, other) {
          return value > other;
        }
        function baseHas(object, key) {
          return object != null && hasOwnProperty2.call(object, key);
        }
        function baseHasIn(object, key) {
          return object != null && key in Object2(object);
        }
        function baseInRange(number, start, end) {
          return number >= nativeMin(start, end) && number < nativeMax(start, end);
        }
        function baseIntersection(arrays, iteratee2, comparator2) {
          var includes2 = comparator2 ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
          while (othIndex--) {
            var array = arrays[othIndex];
            if (othIndex && iteratee2) {
              array = arrayMap(array, baseUnary(iteratee2));
            }
            maxLength = nativeMin(array.length, maxLength);
            caches[othIndex] = !comparator2 && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined$1;
          }
          array = arrays[0];
          var index = -1, seen = caches[0];
          outer:
            while (++index < length && result2.length < maxLength) {
              var value = array[index], computed2 = iteratee2 ? iteratee2(value) : value;
              value = comparator2 || value !== 0 ? value : 0;
              if (!(seen ? cacheHas(seen, computed2) : includes2(result2, computed2, comparator2))) {
                othIndex = othLength;
                while (--othIndex) {
                  var cache = caches[othIndex];
                  if (!(cache ? cacheHas(cache, computed2) : includes2(arrays[othIndex], computed2, comparator2))) {
                    continue outer;
                  }
                }
                if (seen) {
                  seen.push(computed2);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseInverter(object, setter, iteratee2, accumulator) {
          baseForOwn(object, function(value, key, object2) {
            setter(accumulator, iteratee2(value), key, object2);
          });
          return accumulator;
        }
        function baseInvoke(object, path, args) {
          path = castPath(path, object);
          object = parent(object, path);
          var func = object == null ? object : object[toKey(last(path))];
          return func == null ? undefined$1 : apply(func, object, args);
        }
        function baseIsArguments(value) {
          return isObjectLike(value) && baseGetTag(value) == argsTag;
        }
        function baseIsArrayBuffer(value) {
          return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
        }
        function baseIsDate(value) {
          return isObjectLike(value) && baseGetTag(value) == dateTag;
        }
        function baseIsEqual(value, other, bitmask, customizer, stack2) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack2);
        }
        function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack2) {
          var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
          objTag = objTag == argsTag ? objectTag : objTag;
          othTag = othTag == argsTag ? objectTag : othTag;
          var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
          if (isSameTag && isBuffer(object)) {
            if (!isBuffer(other)) {
              return false;
            }
            objIsArr = true;
            objIsObj = false;
          }
          if (isSameTag && !objIsObj) {
            stack2 || (stack2 = new Stack());
            return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack2) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack2);
          }
          if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty2.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty2.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
              stack2 || (stack2 = new Stack());
              return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack2);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack2 || (stack2 = new Stack());
          return equalObjects(object, other, bitmask, customizer, equalFunc, stack2);
        }
        function baseIsMap(value) {
          return isObjectLike(value) && getTag(value) == mapTag;
        }
        function baseIsMatch(object, source, matchData, customizer) {
          var index = matchData.length, length = index, noCustomizer = !customizer;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (index--) {
            var data = matchData[index];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
              return false;
            }
          }
          while (++index < length) {
            data = matchData[index];
            var key = data[0], objValue = object[key], srcValue = data[1];
            if (noCustomizer && data[2]) {
              if (objValue === undefined$1 && !(key in object)) {
                return false;
              }
            } else {
              var stack2 = new Stack();
              if (customizer) {
                var result2 = customizer(objValue, srcValue, key, object, source, stack2);
              }
              if (!(result2 === undefined$1 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack2) : result2)) {
                return false;
              }
            }
          }
          return true;
        }
        function baseIsNative(value) {
          if (!isObject2(value) || isMasked(value)) {
            return false;
          }
          var pattern = isFunction2(value) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }
        function baseIsRegExp(value) {
          return isObjectLike(value) && baseGetTag(value) == regexpTag;
        }
        function baseIsSet(value) {
          return isObjectLike(value) && getTag(value) == setTag;
        }
        function baseIsTypedArray(value) {
          return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }
        function baseIteratee(value) {
          if (typeof value == "function") {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == "object") {
            return isArray2(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
          }
          return property(value);
        }
        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result2 = [];
          for (var key in Object2(object)) {
            if (hasOwnProperty2.call(object, key) && key != "constructor") {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseKeysIn(object) {
          if (!isObject2(object)) {
            return nativeKeysIn(object);
          }
          var isProto = isPrototype(object), result2 = [];
          for (var key in object) {
            if (!(key == "constructor" && (isProto || !hasOwnProperty2.call(object, key)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseLt(value, other) {
          return value < other;
        }
        function baseMap(collection, iteratee2) {
          var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value, key, collection2) {
            result2[++index] = iteratee2(value, key, collection2);
          });
          return result2;
        }
        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function(object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }
        function baseMatchesProperty(path, srcValue) {
          if (isKey(path) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path), srcValue);
          }
          return function(object) {
            var objValue = get2(object, path);
            return objValue === undefined$1 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
          };
        }
        function baseMerge(object, source, srcIndex, customizer, stack2) {
          if (object === source) {
            return;
          }
          baseFor(source, function(srcValue, key) {
            stack2 || (stack2 = new Stack());
            if (isObject2(srcValue)) {
              baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack2);
            } else {
              var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack2) : undefined$1;
              if (newValue === undefined$1) {
                newValue = srcValue;
              }
              assignMergeValue(object, key, newValue);
            }
          }, keysIn);
        }
        function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack2) {
          var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack2.get(srcValue);
          if (stacked) {
            assignMergeValue(object, key, stacked);
            return;
          }
          var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack2) : undefined$1;
          var isCommon = newValue === undefined$1;
          if (isCommon) {
            var isArr = isArray2(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
            newValue = srcValue;
            if (isArr || isBuff || isTyped) {
              if (isArray2(objValue)) {
                newValue = objValue;
              } else if (isArrayLikeObject(objValue)) {
                newValue = copyArray(objValue);
              } else if (isBuff) {
                isCommon = false;
                newValue = cloneBuffer(srcValue, true);
              } else if (isTyped) {
                isCommon = false;
                newValue = cloneTypedArray(srcValue, true);
              } else {
                newValue = [];
              }
            } else if (isPlainObject2(srcValue) || isArguments(srcValue)) {
              newValue = objValue;
              if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
              } else if (!isObject2(objValue) || isFunction2(objValue)) {
                newValue = initCloneObject(srcValue);
              }
            } else {
              isCommon = false;
            }
          }
          if (isCommon) {
            stack2.set(srcValue, newValue);
            mergeFunc(newValue, srcValue, srcIndex, customizer, stack2);
            stack2["delete"](srcValue);
          }
          assignMergeValue(object, key, newValue);
        }
        function baseNth(array, n) {
          var length = array.length;
          if (!length) {
            return;
          }
          n += n < 0 ? length : 0;
          return isIndex(n, length) ? array[n] : undefined$1;
        }
        function baseOrderBy(collection, iteratees, orders) {
          if (iteratees.length) {
            iteratees = arrayMap(iteratees, function(iteratee2) {
              if (isArray2(iteratee2)) {
                return function(value) {
                  return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                };
              }
              return iteratee2;
            });
          } else {
            iteratees = [
              identity
            ];
          }
          var index = -1;
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          var result2 = baseMap(collection, function(value, key, collection2) {
            var criteria = arrayMap(iteratees, function(iteratee2) {
              return iteratee2(value);
            });
            return {
              "criteria": criteria,
              "index": ++index,
              "value": value
            };
          });
          return baseSortBy(result2, function(object, other) {
            return compareMultiple(object, other, orders);
          });
        }
        function basePick(object, paths) {
          return basePickBy(object, paths, function(value, path) {
            return hasIn(object, path);
          });
        }
        function basePickBy(object, paths, predicate) {
          var index = -1, length = paths.length, result2 = {};
          while (++index < length) {
            var path = paths[index], value = baseGet(object, path);
            if (predicate(value, path)) {
              baseSet(result2, castPath(path, object), value);
            }
          }
          return result2;
        }
        function basePropertyDeep(path) {
          return function(object) {
            return baseGet(object, path);
          };
        }
        function basePullAll(array, values2, iteratee2, comparator2) {
          var indexOf2 = comparator2 ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
          if (array === values2) {
            values2 = copyArray(values2);
          }
          if (iteratee2) {
            seen = arrayMap(array, baseUnary(iteratee2));
          }
          while (++index < length) {
            var fromIndex = 0, value = values2[index], computed2 = iteratee2 ? iteratee2(value) : value;
            while ((fromIndex = indexOf2(seen, computed2, fromIndex, comparator2)) > -1) {
              if (seen !== array) {
                splice.call(seen, fromIndex, 1);
              }
              splice.call(array, fromIndex, 1);
            }
          }
          return array;
        }
        function basePullAt(array, indexes) {
          var length = array ? indexes.length : 0, lastIndex = length - 1;
          while (length--) {
            var index = indexes[length];
            if (length == lastIndex || index !== previous) {
              var previous = index;
              if (isIndex(index)) {
                splice.call(array, index, 1);
              } else {
                baseUnset(array, index);
              }
            }
          }
          return array;
        }
        function baseRandom(lower, upper) {
          return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
        }
        function baseRange(start, end, step, fromRight) {
          var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
          while (length--) {
            result2[fromRight ? length : ++index] = start;
            start += step;
          }
          return result2;
        }
        function baseRepeat(string, n) {
          var result2 = "";
          if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result2;
          }
          do {
            if (n % 2) {
              result2 += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
              string += string;
            }
          } while (n);
          return result2;
        }
        function baseRest(func, start) {
          return setToString(overRest(func, start, identity), func + "");
        }
        function baseSample(collection) {
          return arraySample(values(collection));
        }
        function baseSampleSize(collection, n) {
          var array = values(collection);
          return shuffleSelf(array, baseClamp(n, 0, array.length));
        }
        function baseSet(object, path, value, customizer) {
          if (!isObject2(object)) {
            return object;
          }
          path = castPath(path, object);
          var index = -1, length = path.length, lastIndex = length - 1, nested = object;
          while (nested != null && ++index < length) {
            var key = toKey(path[index]), newValue = value;
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
              return object;
            }
            if (index != lastIndex) {
              var objValue = nested[key];
              newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
              if (newValue === undefined$1) {
                newValue = isObject2(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
              }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
          }
          return object;
        }
        var baseSetData = !metaMap ? identity : function(func, data) {
          metaMap.set(func, data);
          return func;
        };
        var baseSetToString = !defineProperty ? identity : function(func, string) {
          return defineProperty(func, "toString", {
            "configurable": true,
            "enumerable": false,
            "value": constant(string),
            "writable": true
          });
        };
        function baseShuffle(collection) {
          return shuffleSelf(values(collection));
        }
        function baseSlice(array, start, end) {
          var index = -1, length = array.length;
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end > length ? length : end;
          if (end < 0) {
            end += length;
          }
          length = start > end ? 0 : end - start >>> 0;
          start >>>= 0;
          var result2 = Array2(length);
          while (++index < length) {
            result2[index] = array[index + start];
          }
          return result2;
        }
        function baseSome(collection, predicate) {
          var result2;
          baseEach(collection, function(value, index, collection2) {
            result2 = predicate(value, index, collection2);
            return !result2;
          });
          return !!result2;
        }
        function baseSortedIndex(array, value, retHighest) {
          var low = 0, high = array == null ? low : array.length;
          if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
              var mid = low + high >>> 1, computed2 = array[mid];
              if (computed2 !== null && !isSymbol2(computed2) && (retHighest ? computed2 <= value : computed2 < value)) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return high;
          }
          return baseSortedIndexBy(array, value, identity, retHighest);
        }
        function baseSortedIndexBy(array, value, iteratee2, retHighest) {
          var low = 0, high = array == null ? 0 : array.length;
          if (high === 0) {
            return 0;
          }
          value = iteratee2(value);
          var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol2(value), valIsUndefined = value === undefined$1;
          while (low < high) {
            var mid = nativeFloor((low + high) / 2), computed2 = iteratee2(array[mid]), othIsDefined = computed2 !== undefined$1, othIsNull = computed2 === null, othIsReflexive = computed2 === computed2, othIsSymbol = isSymbol2(computed2);
            if (valIsNaN) {
              var setLow = retHighest || othIsReflexive;
            } else if (valIsUndefined) {
              setLow = othIsReflexive && (retHighest || othIsDefined);
            } else if (valIsNull) {
              setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
            } else if (valIsSymbol) {
              setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
            } else if (othIsNull || othIsSymbol) {
              setLow = false;
            } else {
              setLow = retHighest ? computed2 <= value : computed2 < value;
            }
            if (setLow) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return nativeMin(high, MAX_ARRAY_INDEX);
        }
        function baseSortedUniq(array, iteratee2) {
          var index = -1, length = array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index], computed2 = iteratee2 ? iteratee2(value) : value;
            if (!index || !eq(computed2, seen)) {
              var seen = computed2;
              result2[resIndex++] = value === 0 ? 0 : value;
            }
          }
          return result2;
        }
        function baseToNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol2(value)) {
            return NAN;
          }
          return +value;
        }
        function baseToString(value) {
          if (typeof value == "string") {
            return value;
          }
          if (isArray2(value)) {
            return arrayMap(value, baseToString) + "";
          }
          if (isSymbol2(value)) {
            return symbolToString ? symbolToString.call(value) : "";
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function baseUniq(array, iteratee2, comparator2) {
          var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
          if (comparator2) {
            isCommon = false;
            includes2 = arrayIncludesWith;
          } else if (length >= LARGE_ARRAY_SIZE) {
            var set3 = iteratee2 ? null : createSet(array);
            if (set3) {
              return setToArray(set3);
            }
            isCommon = false;
            includes2 = cacheHas;
            seen = new SetCache();
          } else {
            seen = iteratee2 ? [] : result2;
          }
          outer:
            while (++index < length) {
              var value = array[index], computed2 = iteratee2 ? iteratee2(value) : value;
              value = comparator2 || value !== 0 ? value : 0;
              if (isCommon && computed2 === computed2) {
                var seenIndex = seen.length;
                while (seenIndex--) {
                  if (seen[seenIndex] === computed2) {
                    continue outer;
                  }
                }
                if (iteratee2) {
                  seen.push(computed2);
                }
                result2.push(value);
              } else if (!includes2(seen, computed2, comparator2)) {
                if (seen !== result2) {
                  seen.push(computed2);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseUnset(object, path) {
          path = castPath(path, object);
          object = parent(object, path);
          return object == null || delete object[toKey(last(path))];
        }
        function baseUpdate(object, path, updater, customizer) {
          return baseSet(object, path, updater(baseGet(object, path)), customizer);
        }
        function baseWhile(array, predicate, isDrop, fromRight) {
          var length = array.length, index = fromRight ? length : -1;
          while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
          }
          return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
        }
        function baseWrapperValue(value, actions) {
          var result2 = value;
          if (result2 instanceof LazyWrapper) {
            result2 = result2.value();
          }
          return arrayReduce(actions, function(result3, action) {
            return action.func.apply(action.thisArg, arrayPush([
              result3
            ], action.args));
          }, result2);
        }
        function baseXor(arrays, iteratee2, comparator2) {
          var length = arrays.length;
          if (length < 2) {
            return length ? baseUniq(arrays[0]) : [];
          }
          var index = -1, result2 = Array2(length);
          while (++index < length) {
            var array = arrays[index], othIndex = -1;
            while (++othIndex < length) {
              if (othIndex != index) {
                result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator2);
              }
            }
          }
          return baseUniq(baseFlatten(result2, 1), iteratee2, comparator2);
        }
        function baseZipObject(props, values2, assignFunc) {
          var index = -1, length = props.length, valsLength = values2.length, result2 = {};
          while (++index < length) {
            var value = index < valsLength ? values2[index] : undefined$1;
            assignFunc(result2, props[index], value);
          }
          return result2;
        }
        function castArrayLikeObject(value) {
          return isArrayLikeObject(value) ? value : [];
        }
        function castFunction(value) {
          return typeof value == "function" ? value : identity;
        }
        function castPath(value, object) {
          if (isArray2(value)) {
            return value;
          }
          return isKey(value, object) ? [
            value
          ] : stringToPath(toString(value));
        }
        var castRest = baseRest;
        function castSlice(array, start, end) {
          var length = array.length;
          end = end === undefined$1 ? length : end;
          return !start && end >= length ? array : baseSlice(array, start, end);
        }
        var clearTimeout2 = ctxClearTimeout || function(id) {
          return root.clearTimeout(id);
        };
        function cloneBuffer(buffer, isDeep) {
          if (isDeep) {
            return buffer.slice();
          }
          var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
          buffer.copy(result2);
          return result2;
        }
        function cloneArrayBuffer(arrayBuffer) {
          var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
          new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
          return result2;
        }
        function cloneDataView(dataView, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
          return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }
        function cloneRegExp(regexp) {
          var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
          result2.lastIndex = regexp.lastIndex;
          return result2;
        }
        function cloneSymbol(symbol) {
          return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
        }
        function cloneTypedArray(typedArray, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
          return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }
        function compareAscending(value, other) {
          if (value !== other) {
            var valIsDefined = value !== undefined$1, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol2(value);
            var othIsDefined = other !== undefined$1, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol2(other);
            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
              return 1;
            }
            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
              return -1;
            }
          }
          return 0;
        }
        function compareMultiple(object, other, orders) {
          var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
          while (++index < length) {
            var result2 = compareAscending(objCriteria[index], othCriteria[index]);
            if (result2) {
              if (index >= ordersLength) {
                return result2;
              }
              var order = orders[index];
              return result2 * (order == "desc" ? -1 : 1);
            }
          }
          return object.index - other.index;
        }
        function composeArgs(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
          while (++leftIndex < leftLength) {
            result2[leftIndex] = partials[leftIndex];
          }
          while (++argsIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[holders[argsIndex]] = args[argsIndex];
            }
          }
          while (rangeLength--) {
            result2[leftIndex++] = args[argsIndex++];
          }
          return result2;
        }
        function composeArgsRight(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
          while (++argsIndex < rangeLength) {
            result2[argsIndex] = args[argsIndex];
          }
          var offset = argsIndex;
          while (++rightIndex < rightLength) {
            result2[offset + rightIndex] = partials[rightIndex];
          }
          while (++holdersIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[offset + holders[holdersIndex]] = args[argsIndex++];
            }
          }
          return result2;
        }
        function copyArray(source, array) {
          var index = -1, length = source.length;
          array || (array = Array2(length));
          while (++index < length) {
            array[index] = source[index];
          }
          return array;
        }
        function copyObject(source, props, object, customizer) {
          var isNew = !object;
          object || (object = {});
          var index = -1, length = props.length;
          while (++index < length) {
            var key = props[index];
            var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined$1;
            if (newValue === undefined$1) {
              newValue = source[key];
            }
            if (isNew) {
              baseAssignValue(object, key, newValue);
            } else {
              assignValue(object, key, newValue);
            }
          }
          return object;
        }
        function copySymbols(source, object) {
          return copyObject(source, getSymbols(source), object);
        }
        function copySymbolsIn(source, object) {
          return copyObject(source, getSymbolsIn(source), object);
        }
        function createAggregator(setter, initializer) {
          return function(collection, iteratee2) {
            var func = isArray2(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
            return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
          };
        }
        function createAssigner(assigner) {
          return baseRest(function(object, sources) {
            var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined$1, guard = length > 2 ? sources[2] : undefined$1;
            customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined$1;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              customizer = length < 3 ? undefined$1 : customizer;
              length = 1;
            }
            object = Object2(object);
            while (++index < length) {
              var source = sources[index];
              if (source) {
                assigner(object, source, index, customizer);
              }
            }
            return object;
          });
        }
        function createBaseEach(eachFunc, fromRight) {
          return function(collection, iteratee2) {
            if (collection == null) {
              return collection;
            }
            if (!isArrayLike(collection)) {
              return eachFunc(collection, iteratee2);
            }
            var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
            while (fromRight ? index-- : ++index < length) {
              if (iteratee2(iterable[index], index, iterable) === false) {
                break;
              }
            }
            return collection;
          };
        }
        function createBaseFor(fromRight) {
          return function(object, iteratee2, keysFunc) {
            var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
            while (length--) {
              var key = props[fromRight ? length : ++index];
              if (iteratee2(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }
        function createBind(func, bitmask, thisArg) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, arguments);
          }
          return wrapper;
        }
        function createCaseFirst(methodName) {
          return function(string) {
            string = toString(string);
            var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined$1;
            var chr = strSymbols ? strSymbols[0] : string.charAt(0);
            var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
            return chr[methodName]() + trailing;
          };
        }
        function createCompounder(callback) {
          return function(string) {
            return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
          };
        }
        function createCtor(Ctor) {
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
            return isObject2(result2) ? result2 : thisBinding;
          };
        }
        function createCurry(func, bitmask, arity) {
          var Ctor = createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
            while (index--) {
              args[index] = arguments[index];
            }
            var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
            length -= holders.length;
            if (length < arity) {
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined$1, args, holders, undefined$1, undefined$1, arity - length);
            }
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return apply(fn, this, args);
          }
          return wrapper;
        }
        function createFind(findIndexFunc) {
          return function(collection, predicate, fromIndex) {
            var iterable = Object2(collection);
            if (!isArrayLike(collection)) {
              var iteratee2 = getIteratee(predicate, 3);
              collection = keys(collection);
              predicate = function(key) {
                return iteratee2(iterable[key], key, iterable);
              };
            }
            var index = findIndexFunc(collection, predicate, fromIndex);
            return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined$1;
          };
        }
        function createFlow(fromRight) {
          return flatRest(function(funcs) {
            var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
            if (fromRight) {
              funcs.reverse();
            }
            while (index--) {
              var func = funcs[index];
              if (typeof func != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                var wrapper = new LodashWrapper([], true);
              }
            }
            index = wrapper ? index : length;
            while (++index < length) {
              func = funcs[index];
              var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined$1;
              if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
              } else {
                wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
              }
            }
            return function() {
              var args = arguments, value = args[0];
              if (wrapper && args.length == 1 && isArray2(value)) {
                return wrapper.plant(value).value();
              }
              var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
              while (++index2 < length) {
                result2 = funcs[index2].call(this, result2);
              }
              return result2;
            };
          });
        }
        function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
          var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined$1 : createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length;
            while (index--) {
              args[index] = arguments[index];
            }
            if (isCurried) {
              var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
            }
            if (partials) {
              args = composeArgs(args, partials, holders, isCurried);
            }
            if (partialsRight) {
              args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
            }
            length -= holdersCount;
            if (isCurried && length < arity) {
              var newHolders = replaceHolders(args, placeholder);
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
            }
            var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
            length = args.length;
            if (argPos) {
              args = reorder(args, argPos);
            } else if (isFlip && length > 1) {
              args.reverse();
            }
            if (isAry && ary2 < length) {
              args.length = ary2;
            }
            if (this && this !== root && this instanceof wrapper) {
              fn = Ctor || createCtor(fn);
            }
            return fn.apply(thisBinding, args);
          }
          return wrapper;
        }
        function createInverter(setter, toIteratee) {
          return function(object, iteratee2) {
            return baseInverter(object, setter, toIteratee(iteratee2), {});
          };
        }
        function createMathOperation(operator, defaultValue) {
          return function(value, other) {
            var result2;
            if (value === undefined$1 && other === undefined$1) {
              return defaultValue;
            }
            if (value !== undefined$1) {
              result2 = value;
            }
            if (other !== undefined$1) {
              if (result2 === undefined$1) {
                return other;
              }
              if (typeof value == "string" || typeof other == "string") {
                value = baseToString(value);
                other = baseToString(other);
              } else {
                value = baseToNumber(value);
                other = baseToNumber(other);
              }
              result2 = operator(value, other);
            }
            return result2;
          };
        }
        function createOver(arrayFunc) {
          return flatRest(function(iteratees) {
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            return baseRest(function(args) {
              var thisArg = this;
              return arrayFunc(iteratees, function(iteratee2) {
                return apply(iteratee2, thisArg, args);
              });
            });
          });
        }
        function createPadding(length, chars) {
          chars = chars === undefined$1 ? " " : baseToString(chars);
          var charsLength = chars.length;
          if (charsLength < 2) {
            return charsLength ? baseRepeat(chars, length) : chars;
          }
          var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
          return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
        }
        function createPartial(func, bitmask, thisArg, partials) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            while (++leftIndex < leftLength) {
              args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
              args[leftIndex++] = arguments[++argsIndex];
            }
            return apply(fn, isBind ? thisArg : this, args);
          }
          return wrapper;
        }
        function createRange(fromRight) {
          return function(start, end, step) {
            if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
              end = step = undefined$1;
            }
            start = toFinite(start);
            if (end === undefined$1) {
              end = start;
              start = 0;
            } else {
              end = toFinite(end);
            }
            step = step === undefined$1 ? start < end ? 1 : -1 : toFinite(step);
            return baseRange(start, end, step, fromRight);
          };
        }
        function createRelationalOperation(operator) {
          return function(value, other) {
            if (!(typeof value == "string" && typeof other == "string")) {
              value = toNumber(value);
              other = toNumber(other);
            }
            return operator(value, other);
          };
        }
        function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
          var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined$1, newHoldersRight = isCurry ? undefined$1 : holders, newPartials = isCurry ? partials : undefined$1, newPartialsRight = isCurry ? undefined$1 : partials;
          bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
          bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
          if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
            bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
          }
          var newData = [
            func,
            bitmask,
            thisArg,
            newPartials,
            newHolders,
            newPartialsRight,
            newHoldersRight,
            argPos,
            ary2,
            arity
          ];
          var result2 = wrapFunc.apply(undefined$1, newData);
          if (isLaziable(func)) {
            setData(result2, newData);
          }
          result2.placeholder = placeholder;
          return setWrapToString(result2, func, bitmask);
        }
        function createRound(methodName) {
          var func = Math2[methodName];
          return function(number, precision) {
            number = toNumber(number);
            precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
            if (precision && nativeIsFinite(number)) {
              var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
              pair = (toString(value) + "e").split("e");
              return +(pair[0] + "e" + (+pair[1] - precision));
            }
            return func(number);
          };
        }
        var createSet = !(Set2 && 1 / setToArray(new Set2([
          ,
          -0
        ]))[1] == INFINITY) ? noop2 : function(values2) {
          return new Set2(values2);
        };
        function createToPairs(keysFunc) {
          return function(object) {
            var tag = getTag(object);
            if (tag == mapTag) {
              return mapToArray(object);
            }
            if (tag == setTag) {
              return setToPairs(object);
            }
            return baseToPairs(object, keysFunc(object));
          };
        }
        function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
          var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
          if (!isBindKey && typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var length = partials ? partials.length : 0;
          if (!length) {
            bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
            partials = holders = undefined$1;
          }
          ary2 = ary2 === undefined$1 ? ary2 : nativeMax(toInteger(ary2), 0);
          arity = arity === undefined$1 ? arity : toInteger(arity);
          length -= holders ? holders.length : 0;
          if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials, holdersRight = holders;
            partials = holders = undefined$1;
          }
          var data = isBindKey ? undefined$1 : getData(func);
          var newData = [
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            partialsRight,
            holdersRight,
            argPos,
            ary2,
            arity
          ];
          if (data) {
            mergeData(newData, data);
          }
          func = newData[0];
          bitmask = newData[1];
          thisArg = newData[2];
          partials = newData[3];
          holders = newData[4];
          arity = newData[9] = newData[9] === undefined$1 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
          if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
            bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
          }
          if (!bitmask || bitmask == WRAP_BIND_FLAG) {
            var result2 = createBind(func, bitmask, thisArg);
          } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
            result2 = createCurry(func, bitmask, arity);
          } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
            result2 = createPartial(func, bitmask, thisArg, partials);
          } else {
            result2 = createHybrid.apply(undefined$1, newData);
          }
          var setter = data ? baseSetData : setData;
          return setWrapToString(setter(result2, newData), func, bitmask);
        }
        function customDefaultsAssignIn(objValue, srcValue, key, object) {
          if (objValue === undefined$1 || eq(objValue, objectProto[key]) && !hasOwnProperty2.call(object, key)) {
            return srcValue;
          }
          return objValue;
        }
        function customDefaultsMerge(objValue, srcValue, key, object, source, stack2) {
          if (isObject2(objValue) && isObject2(srcValue)) {
            stack2.set(srcValue, objValue);
            baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack2);
            stack2["delete"](srcValue);
          }
          return objValue;
        }
        function customOmitClone(value) {
          return isPlainObject2(value) ? undefined$1 : value;
        }
        function equalArrays(array, other, bitmask, customizer, equalFunc, stack2) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          var arrStacked = stack2.get(array);
          var othStacked = stack2.get(other);
          if (arrStacked && othStacked) {
            return arrStacked == other && othStacked == array;
          }
          var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined$1;
          stack2.set(array, other);
          stack2.set(other, array);
          while (++index < arrLength) {
            var arrValue = array[index], othValue = other[index];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack2) : customizer(arrValue, othValue, index, array, other, stack2);
            }
            if (compared !== undefined$1) {
              if (compared) {
                continue;
              }
              result2 = false;
              break;
            }
            if (seen) {
              if (!arraySome(other, function(othValue2, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack2))) {
                  return seen.push(othIndex);
                }
              })) {
                result2 = false;
                break;
              }
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack2))) {
              result2 = false;
              break;
            }
          }
          stack2["delete"](array);
          stack2["delete"](other);
          return result2;
        }
        function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack2) {
          switch (tag) {
            case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;
            case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                return false;
              }
              return true;
            case boolTag:
            case dateTag:
            case numberTag:
              return eq(+object, +other);
            case errorTag:
              return object.name == other.name && object.message == other.message;
            case regexpTag:
            case stringTag:
              return object == other + "";
            case mapTag:
              var convert = mapToArray;
            case setTag:
              var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) {
                return false;
              }
              var stacked = stack2.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= COMPARE_UNORDERED_FLAG;
              stack2.set(object, other);
              var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack2);
              stack2["delete"](object);
              return result2;
            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }
        function equalObjects(object, other, bitmask, customizer, equalFunc, stack2) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index = objLength;
          while (index--) {
            var key = objProps[index];
            if (!(isPartial ? key in other : hasOwnProperty2.call(other, key))) {
              return false;
            }
          }
          var objStacked = stack2.get(object);
          var othStacked = stack2.get(other);
          if (objStacked && othStacked) {
            return objStacked == other && othStacked == object;
          }
          var result2 = true;
          stack2.set(object, other);
          stack2.set(other, object);
          var skipCtor = isPartial;
          while (++index < objLength) {
            key = objProps[index];
            var objValue = object[key], othValue = other[key];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack2) : customizer(objValue, othValue, key, object, other, stack2);
            }
            if (!(compared === undefined$1 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack2) : compared)) {
              result2 = false;
              break;
            }
            skipCtor || (skipCtor = key == "constructor");
          }
          if (result2 && !skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
              result2 = false;
            }
          }
          stack2["delete"](object);
          stack2["delete"](other);
          return result2;
        }
        function flatRest(func) {
          return setToString(overRest(func, undefined$1, flatten), func + "");
        }
        function getAllKeys(object) {
          return baseGetAllKeys(object, keys, getSymbols);
        }
        function getAllKeysIn(object) {
          return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }
        var getData = !metaMap ? noop2 : function(func) {
          return metaMap.get(func);
        };
        function getFuncName(func) {
          var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty2.call(realNames, result2) ? array.length : 0;
          while (length--) {
            var data = array[length], otherFunc = data.func;
            if (otherFunc == null || otherFunc == func) {
              return data.name;
            }
          }
          return result2;
        }
        function getHolder(func) {
          var object = hasOwnProperty2.call(lodash2, "placeholder") ? lodash2 : func;
          return object.placeholder;
        }
        function getIteratee() {
          var result2 = lodash2.iteratee || iteratee;
          result2 = result2 === iteratee ? baseIteratee : result2;
          return arguments.length ? result2(arguments[0], arguments[1]) : result2;
        }
        function getMapData(map2, key) {
          var data = map2.__data__;
          return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
        }
        function getMatchData(object) {
          var result2 = keys(object), length = result2.length;
          while (length--) {
            var key = result2[length], value = object[key];
            result2[length] = [
              key,
              value,
              isStrictComparable(value)
            ];
          }
          return result2;
        }
        function getNative(object, key) {
          var value = getValue(object, key);
          return baseIsNative(value) ? value : undefined$1;
        }
        function getRawTag(value) {
          var isOwn = hasOwnProperty2.call(value, symToStringTag), tag = value[symToStringTag];
          try {
            value[symToStringTag] = undefined$1;
            var unmasked = true;
          } catch (e) {
          }
          var result2 = nativeObjectToString.call(value);
          if (unmasked) {
            if (isOwn) {
              value[symToStringTag] = tag;
            } else {
              delete value[symToStringTag];
            }
          }
          return result2;
        }
        var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
          if (object == null) {
            return [];
          }
          object = Object2(object);
          return arrayFilter(nativeGetSymbols(object), function(symbol) {
            return propertyIsEnumerable.call(object, symbol);
          });
        };
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
          var result2 = [];
          while (object) {
            arrayPush(result2, getSymbols(object));
            object = getPrototype(object);
          }
          return result2;
        };
        var getTag = baseGetTag;
        if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
          getTag = function(value) {
            var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined$1, ctorString = Ctor ? toSource(Ctor) : "";
            if (ctorString) {
              switch (ctorString) {
                case dataViewCtorString:
                  return dataViewTag;
                case mapCtorString:
                  return mapTag;
                case promiseCtorString:
                  return promiseTag;
                case setCtorString:
                  return setTag;
                case weakMapCtorString:
                  return weakMapTag;
              }
            }
            return result2;
          };
        }
        function getView(start, end, transforms) {
          var index = -1, length = transforms.length;
          while (++index < length) {
            var data = transforms[index], size3 = data.size;
            switch (data.type) {
              case "drop":
                start += size3;
                break;
              case "dropRight":
                end -= size3;
                break;
              case "take":
                end = nativeMin(end, start + size3);
                break;
              case "takeRight":
                start = nativeMax(start, end - size3);
                break;
            }
          }
          return {
            "start": start,
            "end": end
          };
        }
        function getWrapDetails(source) {
          var match = source.match(reWrapDetails);
          return match ? match[1].split(reSplitDetails) : [];
        }
        function hasPath(object, path, hasFunc) {
          path = castPath(path, object);
          var index = -1, length = path.length, result2 = false;
          while (++index < length) {
            var key = toKey(path[index]);
            if (!(result2 = object != null && hasFunc(object, key))) {
              break;
            }
            object = object[key];
          }
          if (result2 || ++index != length) {
            return result2;
          }
          length = object == null ? 0 : object.length;
          return !!length && isLength(length) && isIndex(key, length) && (isArray2(object) || isArguments(object));
        }
        function initCloneArray(array) {
          var length = array.length, result2 = new array.constructor(length);
          if (length && typeof array[0] == "string" && hasOwnProperty2.call(array, "index")) {
            result2.index = array.index;
            result2.input = array.input;
          }
          return result2;
        }
        function initCloneObject(object) {
          return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }
        function initCloneByTag(object, tag, isDeep) {
          var Ctor = object.constructor;
          switch (tag) {
            case arrayBufferTag:
              return cloneArrayBuffer(object);
            case boolTag:
            case dateTag:
              return new Ctor(+object);
            case dataViewTag:
              return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
              return cloneTypedArray(object, isDeep);
            case mapTag:
              return new Ctor();
            case numberTag:
            case stringTag:
              return new Ctor(object);
            case regexpTag:
              return cloneRegExp(object);
            case setTag:
              return new Ctor();
            case symbolTag:
              return cloneSymbol(object);
          }
        }
        function insertWrapDetails(source, details) {
          var length = details.length;
          if (!length) {
            return source;
          }
          var lastIndex = length - 1;
          details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
          details = details.join(length > 2 ? ", " : " ");
          return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
        }
        function isFlattenable(value) {
          return isArray2(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
        }
        function isIndex(value, length) {
          var type = typeof value;
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
        }
        function isIterateeCall(value, index, object) {
          if (!isObject2(object)) {
            return false;
          }
          var type = typeof index;
          if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
            return eq(object[index], value);
          }
          return false;
        }
        function isKey(value, object) {
          if (isArray2(value)) {
            return false;
          }
          var type = typeof value;
          if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol2(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
        }
        function isKeyable(value) {
          var type = typeof value;
          return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
        }
        function isLaziable(func) {
          var funcName = getFuncName(func), other = lodash2[funcName];
          if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
            return false;
          }
          if (func === other) {
            return true;
          }
          var data = getData(other);
          return !!data && func === data[0];
        }
        function isMasked(func) {
          return !!maskSrcKey && maskSrcKey in func;
        }
        var isMaskable = coreJsData ? isFunction2 : stubFalse;
        function isPrototype(value) {
          var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
          return value === proto;
        }
        function isStrictComparable(value) {
          return value === value && !isObject2(value);
        }
        function matchesStrictComparable(key, srcValue) {
          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key] === srcValue && (srcValue !== undefined$1 || key in Object2(object));
          };
        }
        function memoizeCapped(func) {
          var result2 = memoize(func, function(key) {
            if (cache.size === MAX_MEMOIZE_SIZE) {
              cache.clear();
            }
            return key;
          });
          var cache = result2.cache;
          return result2;
        }
        function mergeData(data, source) {
          var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
          var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
          if (!(isCommon || isCombo)) {
            return data;
          }
          if (srcBitmask & WRAP_BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
          }
          var value = source[3];
          if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : value;
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
          }
          value = source[5];
          if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
          }
          value = source[7];
          if (value) {
            data[7] = value;
          }
          if (srcBitmask & WRAP_ARY_FLAG) {
            data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
          }
          if (data[9] == null) {
            data[9] = source[9];
          }
          data[0] = source[0];
          data[1] = newBitmask;
          return data;
        }
        function nativeKeysIn(object) {
          var result2 = [];
          if (object != null) {
            for (var key in Object2(object)) {
              result2.push(key);
            }
          }
          return result2;
        }
        function objectToString2(value) {
          return nativeObjectToString.call(value);
        }
        function overRest(func, start, transform2) {
          start = nativeMax(start === undefined$1 ? func.length - 1 : start, 0);
          return function() {
            var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
            while (++index < length) {
              array[index] = args[start + index];
            }
            index = -1;
            var otherArgs = Array2(start + 1);
            while (++index < start) {
              otherArgs[index] = args[index];
            }
            otherArgs[start] = transform2(array);
            return apply(func, this, otherArgs);
          };
        }
        function parent(object, path) {
          return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
        }
        function reorder(array, indexes) {
          var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
          while (length--) {
            var index = indexes[length];
            array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined$1;
          }
          return array;
        }
        function safeGet(object, key) {
          if (key === "constructor" && typeof object[key] === "function") {
            return;
          }
          if (key == "__proto__") {
            return;
          }
          return object[key];
        }
        var setData = shortOut(baseSetData);
        var setTimeout = ctxSetTimeout || function(func, wait) {
          return root.setTimeout(func, wait);
        };
        var setToString = shortOut(baseSetToString);
        function setWrapToString(wrapper, reference, bitmask) {
          var source = reference + "";
          return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
        }
        function shortOut(func) {
          var count = 0, lastCalled = 0;
          return function() {
            var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
              if (++count >= HOT_COUNT) {
                return arguments[0];
              }
            } else {
              count = 0;
            }
            return func.apply(undefined$1, arguments);
          };
        }
        function shuffleSelf(array, size3) {
          var index = -1, length = array.length, lastIndex = length - 1;
          size3 = size3 === undefined$1 ? length : size3;
          while (++index < size3) {
            var rand = baseRandom(index, lastIndex), value = array[rand];
            array[rand] = array[index];
            array[index] = value;
          }
          array.length = size3;
          return array;
        }
        var stringToPath = memoizeCapped(function(string) {
          var result2 = [];
          if (string.charCodeAt(0) === 46) {
            result2.push("");
          }
          string.replace(rePropName, function(match, number, quote, subString) {
            result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
          });
          return result2;
        });
        function toKey(value) {
          if (typeof value == "string" || isSymbol2(value)) {
            return value;
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {
            }
            try {
              return func + "";
            } catch (e) {
            }
          }
          return "";
        }
        function updateWrapDetails(details, bitmask) {
          arrayEach(wrapFlags, function(pair) {
            var value = "_." + pair[0];
            if (bitmask & pair[1] && !arrayIncludes(details, value)) {
              details.push(value);
            }
          });
          return details.sort();
        }
        function wrapperClone(wrapper) {
          if (wrapper instanceof LazyWrapper) {
            return wrapper.clone();
          }
          var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
          result2.__actions__ = copyArray(wrapper.__actions__);
          result2.__index__ = wrapper.__index__;
          result2.__values__ = wrapper.__values__;
          return result2;
        }
        function chunk(array, size3, guard) {
          if (guard ? isIterateeCall(array, size3, guard) : size3 === undefined$1) {
            size3 = 1;
          } else {
            size3 = nativeMax(toInteger(size3), 0);
          }
          var length = array == null ? 0 : array.length;
          if (!length || size3 < 1) {
            return [];
          }
          var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size3));
          while (index < length) {
            result2[resIndex++] = baseSlice(array, index, index += size3);
          }
          return result2;
        }
        function compact(array) {
          var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index];
            if (value) {
              result2[resIndex++] = value;
            }
          }
          return result2;
        }
        function concat() {
          var length = arguments.length;
          if (!length) {
            return [];
          }
          var args = Array2(length - 1), array = arguments[0], index = length;
          while (index--) {
            args[index - 1] = arguments[index];
          }
          return arrayPush(isArray2(array) ? copyArray(array) : [
            array
          ], baseFlatten(args, 1));
        }
        var difference = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
        });
        var differenceBy = baseRest(function(array, values2) {
          var iteratee2 = last(values2);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined$1;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
        });
        var differenceWith = baseRest(function(array, values2) {
          var comparator2 = last(values2);
          if (isArrayLikeObject(comparator2)) {
            comparator2 = undefined$1;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined$1, comparator2) : [];
        });
        function drop(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined$1 ? 1 : toInteger(n);
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function dropRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined$1 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function dropRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
        }
        function dropWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
        }
        function fill(array, value, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
            start = 0;
            end = length;
          }
          return baseFill(array, value, start, end);
        }
        function findIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index);
        }
        function findLastIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length - 1;
          if (fromIndex !== undefined$1) {
            index = toInteger(fromIndex);
            index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index, true);
        }
        function flatten(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, 1) : [];
        }
        function flattenDeep(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, INFINITY) : [];
        }
        function flattenDepth(array, depth) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          depth = depth === undefined$1 ? 1 : toInteger(depth);
          return baseFlatten(array, depth);
        }
        function fromPairs(pairs) {
          var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
          while (++index < length) {
            var pair = pairs[index];
            result2[pair[0]] = pair[1];
          }
          return result2;
        }
        function head(array) {
          return array && array.length ? array[0] : undefined$1;
        }
        function indexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseIndexOf(array, value, index);
        }
        function initial(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 0, -1) : [];
        }
        var intersection = baseRest(function(arrays) {
          var mapped = arrayMap(arrays, castArrayLikeObject);
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
        });
        var intersectionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          if (iteratee2 === last(mapped)) {
            iteratee2 = undefined$1;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
        });
        var intersectionWith = baseRest(function(arrays) {
          var comparator2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          comparator2 = typeof comparator2 == "function" ? comparator2 : undefined$1;
          if (comparator2) {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined$1, comparator2) : [];
        });
        function join(array, separator) {
          return array == null ? "" : nativeJoin.call(array, separator);
        }
        function last(array) {
          var length = array == null ? 0 : array.length;
          return length ? array[length - 1] : undefined$1;
        }
        function lastIndexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length;
          if (fromIndex !== undefined$1) {
            index = toInteger(fromIndex);
            index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
        }
        function nth(array, n) {
          return array && array.length ? baseNth(array, toInteger(n)) : undefined$1;
        }
        var pull = baseRest(pullAll);
        function pullAll(array, values2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
        }
        function pullAllBy(array, values2, iteratee2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
        }
        function pullAllWith(array, values2, comparator2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined$1, comparator2) : array;
        }
        var pullAt = flatRest(function(array, indexes) {
          var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
          basePullAt(array, arrayMap(indexes, function(index) {
            return isIndex(index, length) ? +index : index;
          }).sort(compareAscending));
          return result2;
        });
        function remove2(array, predicate) {
          var result2 = [];
          if (!(array && array.length)) {
            return result2;
          }
          var index = -1, indexes = [], length = array.length;
          predicate = getIteratee(predicate, 3);
          while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
              result2.push(value);
              indexes.push(index);
            }
          }
          basePullAt(array, indexes);
          return result2;
        }
        function reverse(array) {
          return array == null ? array : nativeReverse.call(array);
        }
        function slice(array, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
            start = 0;
            end = length;
          } else {
            start = start == null ? 0 : toInteger(start);
            end = end === undefined$1 ? length : toInteger(end);
          }
          return baseSlice(array, start, end);
        }
        function sortedIndex(array, value) {
          return baseSortedIndex(array, value);
        }
        function sortedIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
        }
        function sortedIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value);
            if (index < length && eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedLastIndex(array, value) {
          return baseSortedIndex(array, value, true);
        }
        function sortedLastIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
        }
        function sortedLastIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value, true) - 1;
            if (eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedUniq(array) {
          return array && array.length ? baseSortedUniq(array) : [];
        }
        function sortedUniqBy(array, iteratee2) {
          return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function tail(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 1, length) : [];
        }
        function take(array, n, guard) {
          if (!(array && array.length)) {
            return [];
          }
          n = guard || n === undefined$1 ? 1 : toInteger(n);
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function takeRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined$1 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function takeRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
        }
        function takeWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
        }
        var union = baseRest(function(arrays) {
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
        });
        var unionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined$1;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
        });
        var unionWith = baseRest(function(arrays) {
          var comparator2 = last(arrays);
          comparator2 = typeof comparator2 == "function" ? comparator2 : undefined$1;
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator2);
        });
        function uniq(array) {
          return array && array.length ? baseUniq(array) : [];
        }
        function uniqBy(array, iteratee2) {
          return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function uniqWith(array, comparator2) {
          comparator2 = typeof comparator2 == "function" ? comparator2 : undefined$1;
          return array && array.length ? baseUniq(array, undefined$1, comparator2) : [];
        }
        function unzip(array) {
          if (!(array && array.length)) {
            return [];
          }
          var length = 0;
          array = arrayFilter(array, function(group) {
            if (isArrayLikeObject(group)) {
              length = nativeMax(group.length, length);
              return true;
            }
          });
          return baseTimes(length, function(index) {
            return arrayMap(array, baseProperty(index));
          });
        }
        function unzipWith(array, iteratee2) {
          if (!(array && array.length)) {
            return [];
          }
          var result2 = unzip(array);
          if (iteratee2 == null) {
            return result2;
          }
          return arrayMap(result2, function(group) {
            return apply(iteratee2, undefined$1, group);
          });
        }
        var without = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
        });
        var xor = baseRest(function(arrays) {
          return baseXor(arrayFilter(arrays, isArrayLikeObject));
        });
        var xorBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined$1;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
        });
        var xorWith = baseRest(function(arrays) {
          var comparator2 = last(arrays);
          comparator2 = typeof comparator2 == "function" ? comparator2 : undefined$1;
          return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator2);
        });
        var zip = baseRest(unzip);
        function zipObject(props, values2) {
          return baseZipObject(props || [], values2 || [], assignValue);
        }
        function zipObjectDeep(props, values2) {
          return baseZipObject(props || [], values2 || [], baseSet);
        }
        var zipWith = baseRest(function(arrays) {
          var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined$1;
          iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined$1;
          return unzipWith(arrays, iteratee2);
        });
        function chain(value) {
          var result2 = lodash2(value);
          result2.__chain__ = true;
          return result2;
        }
        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }
        function thru(value, interceptor) {
          return interceptor(value);
        }
        var wrapperAt = flatRest(function(paths) {
          var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
            return baseAt(object, paths);
          };
          if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
            return this.thru(interceptor);
          }
          value = value.slice(start, +start + (length ? 1 : 0));
          value.__actions__.push({
            "func": thru,
            "args": [
              interceptor
            ],
            "thisArg": undefined$1
          });
          return new LodashWrapper(value, this.__chain__).thru(function(array) {
            if (length && !array.length) {
              array.push(undefined$1);
            }
            return array;
          });
        });
        function wrapperChain() {
          return chain(this);
        }
        function wrapperCommit() {
          return new LodashWrapper(this.value(), this.__chain__);
        }
        function wrapperNext() {
          if (this.__values__ === undefined$1) {
            this.__values__ = toArray(this.value());
          }
          var done = this.__index__ >= this.__values__.length, value = done ? undefined$1 : this.__values__[this.__index__++];
          return {
            "done": done,
            "value": value
          };
        }
        function wrapperToIterator() {
          return this;
        }
        function wrapperPlant(value) {
          var result2, parent2 = this;
          while (parent2 instanceof baseLodash) {
            var clone2 = wrapperClone(parent2);
            clone2.__index__ = 0;
            clone2.__values__ = undefined$1;
            if (result2) {
              previous.__wrapped__ = clone2;
            } else {
              result2 = clone2;
            }
            var previous = clone2;
            parent2 = parent2.__wrapped__;
          }
          previous.__wrapped__ = value;
          return result2;
        }
        function wrapperReverse() {
          var value = this.__wrapped__;
          if (value instanceof LazyWrapper) {
            var wrapped = value;
            if (this.__actions__.length) {
              wrapped = new LazyWrapper(this);
            }
            wrapped = wrapped.reverse();
            wrapped.__actions__.push({
              "func": thru,
              "args": [
                reverse
              ],
              "thisArg": undefined$1
            });
            return new LodashWrapper(wrapped, this.__chain__);
          }
          return this.thru(reverse);
        }
        function wrapperValue() {
          return baseWrapperValue(this.__wrapped__, this.__actions__);
        }
        var countBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty2.call(result2, key)) {
            ++result2[key];
          } else {
            baseAssignValue(result2, key, 1);
          }
        });
        function every(collection, predicate, guard) {
          var func = isArray2(collection) ? arrayEvery : baseEvery;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined$1;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        function filter(collection, predicate) {
          var func = isArray2(collection) ? arrayFilter : baseFilter;
          return func(collection, getIteratee(predicate, 3));
        }
        var find = createFind(findIndex);
        var findLast = createFind(findLastIndex);
        function flatMap(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), 1);
        }
        function flatMapDeep(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), INFINITY);
        }
        function flatMapDepth(collection, iteratee2, depth) {
          depth = depth === undefined$1 ? 1 : toInteger(depth);
          return baseFlatten(map(collection, iteratee2), depth);
        }
        function forEach(collection, iteratee2) {
          var func = isArray2(collection) ? arrayEach : baseEach;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function forEachRight(collection, iteratee2) {
          var func = isArray2(collection) ? arrayEachRight : baseEachRight;
          return func(collection, getIteratee(iteratee2, 3));
        }
        var groupBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty2.call(result2, key)) {
            result2[key].push(value);
          } else {
            baseAssignValue(result2, key, [
              value
            ]);
          }
        });
        function includes(collection, value, fromIndex, guard) {
          collection = isArrayLike(collection) ? collection : values(collection);
          fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
          var length = collection.length;
          if (fromIndex < 0) {
            fromIndex = nativeMax(length + fromIndex, 0);
          }
          return isString2(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
        }
        var invokeMap = baseRest(function(collection, path, args) {
          var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value) {
            result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
          });
          return result2;
        });
        var keyBy = createAggregator(function(result2, value, key) {
          baseAssignValue(result2, key, value);
        });
        function map(collection, iteratee2) {
          var func = isArray2(collection) ? arrayMap : baseMap;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function orderBy(collection, iteratees, orders, guard) {
          if (collection == null) {
            return [];
          }
          if (!isArray2(iteratees)) {
            iteratees = iteratees == null ? [] : [
              iteratees
            ];
          }
          orders = guard ? undefined$1 : orders;
          if (!isArray2(orders)) {
            orders = orders == null ? [] : [
              orders
            ];
          }
          return baseOrderBy(collection, iteratees, orders);
        }
        var partition = createAggregator(function(result2, value, key) {
          result2[key ? 0 : 1].push(value);
        }, function() {
          return [
            [],
            []
          ];
        });
        function reduce(collection, iteratee2, accumulator) {
          var func = isArray2(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
        }
        function reduceRight(collection, iteratee2, accumulator) {
          var func = isArray2(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
        }
        function reject(collection, predicate) {
          var func = isArray2(collection) ? arrayFilter : baseFilter;
          return func(collection, negate(getIteratee(predicate, 3)));
        }
        function sample(collection) {
          var func = isArray2(collection) ? arraySample : baseSample;
          return func(collection);
        }
        function sampleSize(collection, n, guard) {
          if (guard ? isIterateeCall(collection, n, guard) : n === undefined$1) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          var func = isArray2(collection) ? arraySampleSize : baseSampleSize;
          return func(collection, n);
        }
        function shuffle(collection) {
          var func = isArray2(collection) ? arrayShuffle : baseShuffle;
          return func(collection);
        }
        function size2(collection) {
          if (collection == null) {
            return 0;
          }
          if (isArrayLike(collection)) {
            return isString2(collection) ? stringSize(collection) : collection.length;
          }
          var tag = getTag(collection);
          if (tag == mapTag || tag == setTag) {
            return collection.size;
          }
          return baseKeys(collection).length;
        }
        function some(collection, predicate, guard) {
          var func = isArray2(collection) ? arraySome : baseSome;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined$1;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        var sortBy = baseRest(function(collection, iteratees) {
          if (collection == null) {
            return [];
          }
          var length = iteratees.length;
          if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
            iteratees = [];
          } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
            iteratees = [
              iteratees[0]
            ];
          }
          return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
        });
        var now = ctxNow || function() {
          return root.Date.now();
        };
        function after(n, func) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n < 1) {
              return func.apply(this, arguments);
            }
          };
        }
        function ary(func, n, guard) {
          n = guard ? undefined$1 : n;
          n = func && n == null ? func.length : n;
          return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n);
        }
        function before(n, func) {
          var result2;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n > 0) {
              result2 = func.apply(this, arguments);
            }
            if (n <= 1) {
              func = undefined$1;
            }
            return result2;
          };
        }
        var bind = baseRest(function(func, thisArg, partials) {
          var bitmask = WRAP_BIND_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bind));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(func, bitmask, thisArg, partials, holders);
        });
        var bindKey = baseRest(function(object, key, partials) {
          var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bindKey));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(key, bitmask, object, partials, holders);
        });
        function curry(func, arity, guard) {
          arity = guard ? undefined$1 : arity;
          var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
          result2.placeholder = curry.placeholder;
          return result2;
        }
        function curryRight(func, arity, guard) {
          arity = guard ? undefined$1 : arity;
          var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
          result2.placeholder = curryRight.placeholder;
          return result2;
        }
        function debounce(func, wait, options) {
          var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          wait = toNumber(wait) || 0;
          if (isObject2(options)) {
            leading = !!options.leading;
            maxing = "maxWait" in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = undefined$1;
            lastInvokeTime = time;
            result2 = func.apply(thisArg, args);
            return result2;
          }
          function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result2;
          }
          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
            return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
          }
          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === undefined$1 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }
          function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
              return trailingEdge(time);
            }
            timerId = setTimeout(timerExpired, remainingWait(time));
          }
          function trailingEdge(time) {
            timerId = undefined$1;
            if (trailing && lastArgs) {
              return invokeFunc(time);
            }
            lastArgs = lastThis = undefined$1;
            return result2;
          }
          function cancel() {
            if (timerId !== undefined$1) {
              clearTimeout2(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined$1;
          }
          function flush() {
            return timerId === undefined$1 ? result2 : trailingEdge(now());
          }
          function debounced() {
            var time = now(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
              if (timerId === undefined$1) {
                return leadingEdge(lastCallTime);
              }
              if (maxing) {
                clearTimeout2(timerId);
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }
            if (timerId === undefined$1) {
              timerId = setTimeout(timerExpired, wait);
            }
            return result2;
          }
          debounced.cancel = cancel;
          debounced.flush = flush;
          return debounced;
        }
        var defer = baseRest(function(func, args) {
          return baseDelay(func, 1, args);
        });
        var delay = baseRest(function(func, wait, args) {
          return baseDelay(func, toNumber(wait) || 0, args);
        });
        function flip(func) {
          return createWrap(func, WRAP_FLIP_FLAG);
        }
        function memoize(func, resolver) {
          if (typeof func != "function" || resolver != null && typeof resolver != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
            if (cache.has(key)) {
              return cache.get(key);
            }
            var result2 = func.apply(this, args);
            memoized.cache = cache.set(key, result2) || cache;
            return result2;
          };
          memoized.cache = new (memoize.Cache || MapCache)();
          return memoized;
        }
        memoize.Cache = MapCache;
        function negate(predicate) {
          if (typeof predicate != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return !predicate.call(this);
              case 1:
                return !predicate.call(this, args[0]);
              case 2:
                return !predicate.call(this, args[0], args[1]);
              case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
            }
            return !predicate.apply(this, args);
          };
        }
        function once(func) {
          return before(2, func);
        }
        var overArgs = castRest(function(func, transforms) {
          transforms = transforms.length == 1 && isArray2(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
          var funcsLength = transforms.length;
          return baseRest(function(args) {
            var index = -1, length = nativeMin(args.length, funcsLength);
            while (++index < length) {
              args[index] = transforms[index].call(this, args[index]);
            }
            return apply(func, this, args);
          });
        });
        var partial = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partial));
          return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
        });
        var partialRight = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partialRight));
          return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
        });
        var rearg = flatRest(function(func, indexes) {
          return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
        });
        function rest(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start === undefined$1 ? start : toInteger(start);
          return baseRest(func, start);
        }
        function spread(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start == null ? 0 : nativeMax(toInteger(start), 0);
          return baseRest(function(args) {
            var array = args[start], otherArgs = castSlice(args, 0, start);
            if (array) {
              arrayPush(otherArgs, array);
            }
            return apply(func, this, otherArgs);
          });
        }
        function throttle(func, wait, options) {
          var leading = true, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          if (isObject2(options)) {
            leading = "leading" in options ? !!options.leading : leading;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          return debounce(func, wait, {
            "leading": leading,
            "maxWait": wait,
            "trailing": trailing
          });
        }
        function unary(func) {
          return ary(func, 1);
        }
        function wrap(value, wrapper) {
          return partial(castFunction(wrapper), value);
        }
        function castArray() {
          if (!arguments.length) {
            return [];
          }
          var value = arguments[0];
          return isArray2(value) ? value : [
            value
          ];
        }
        function clone(value) {
          return baseClone(value, CLONE_SYMBOLS_FLAG);
        }
        function cloneWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
        }
        function cloneDeep(value) {
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }
        function cloneDeepWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
        }
        function conformsTo(object, source) {
          return source == null || baseConformsTo(object, source, keys(source));
        }
        function eq(value, other) {
          return value === other || value !== value && other !== other;
        }
        var gt = createRelationalOperation(baseGt);
        var gte = createRelationalOperation(function(value, other) {
          return value >= other;
        });
        var isArguments = baseIsArguments(/* @__PURE__ */ function() {
          return arguments;
        }()) ? baseIsArguments : function(value) {
          return isObjectLike(value) && hasOwnProperty2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
        };
        var isArray2 = Array2.isArray;
        var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction2(value);
        }
        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }
        function isBoolean(value) {
          return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
        }
        var isBuffer = nativeIsBuffer || stubFalse;
        var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
        function isElement(value) {
          return isObjectLike(value) && value.nodeType === 1 && !isPlainObject2(value);
        }
        function isEmpty(value) {
          if (value == null) {
            return true;
          }
          if (isArrayLike(value) && (isArray2(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
            return !value.length;
          }
          var tag = getTag(value);
          if (tag == mapTag || tag == setTag) {
            return !value.size;
          }
          if (isPrototype(value)) {
            return !baseKeys(value).length;
          }
          for (var key in value) {
            if (hasOwnProperty2.call(value, key)) {
              return false;
            }
          }
          return true;
        }
        function isEqual(value, other) {
          return baseIsEqual(value, other);
        }
        function isEqualWith(value, other, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          var result2 = customizer ? customizer(value, other) : undefined$1;
          return result2 === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result2;
        }
        function isError(value) {
          if (!isObjectLike(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject2(value);
        }
        function isFinite2(value) {
          return typeof value == "number" && nativeIsFinite(value);
        }
        function isFunction2(value) {
          if (!isObject2(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }
        function isInteger(value) {
          return typeof value == "number" && value == toInteger(value);
        }
        function isLength(value) {
          return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        function isObject2(value) {
          var type = typeof value;
          return value != null && (type == "object" || type == "function");
        }
        function isObjectLike(value) {
          return value != null && typeof value == "object";
        }
        var isMap2 = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
        function isMatch(object, source) {
          return object === source || baseIsMatch(object, source, getMatchData(source));
        }
        function isMatchWith(object, source, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return baseIsMatch(object, source, getMatchData(source), customizer);
        }
        function isNaN2(value) {
          return isNumber(value) && value != +value;
        }
        function isNative(value) {
          if (isMaskable(value)) {
            throw new Error2(CORE_ERROR_TEXT);
          }
          return baseIsNative(value);
        }
        function isNull(value) {
          return value === null;
        }
        function isNil(value) {
          return value == null;
        }
        function isNumber(value) {
          return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
        }
        function isPlainObject2(value) {
          if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
            return false;
          }
          var proto = getPrototype(value);
          if (proto === null) {
            return true;
          }
          var Ctor = hasOwnProperty2.call(proto, "constructor") && proto.constructor;
          return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }
        var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
        function isSafeInteger(value) {
          return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
        }
        var isSet2 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
        function isString2(value) {
          return typeof value == "string" || !isArray2(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
        }
        function isSymbol2(value) {
          return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
        }
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
        function isUndefined(value) {
          return value === undefined$1;
        }
        function isWeakMap(value) {
          return isObjectLike(value) && getTag(value) == weakMapTag;
        }
        function isWeakSet(value) {
          return isObjectLike(value) && baseGetTag(value) == weakSetTag;
        }
        var lt = createRelationalOperation(baseLt);
        var lte = createRelationalOperation(function(value, other) {
          return value <= other;
        });
        function toArray(value) {
          if (!value) {
            return [];
          }
          if (isArrayLike(value)) {
            return isString2(value) ? stringToArray(value) : copyArray(value);
          }
          if (symIterator && value[symIterator]) {
            return iteratorToArray(value[symIterator]());
          }
          var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
          return func(value);
        }
        function toFinite(value) {
          if (!value) {
            return value === 0 ? value : 0;
          }
          value = toNumber(value);
          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }
          return value === value ? value : 0;
        }
        function toInteger(value) {
          var result2 = toFinite(value), remainder = result2 % 1;
          return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
        }
        function toLength(value) {
          return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
        }
        function toNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol2(value)) {
            return NAN;
          }
          if (isObject2(value)) {
            var other = typeof value.valueOf == "function" ? value.valueOf() : value;
            value = isObject2(other) ? other + "" : other;
          }
          if (typeof value != "string") {
            return value === 0 ? value : +value;
          }
          value = baseTrim(value);
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }
        function toPlainObject(value) {
          return copyObject(value, keysIn(value));
        }
        function toSafeInteger(value) {
          return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
        }
        function toString(value) {
          return value == null ? "" : baseToString(value);
        }
        var assign2 = createAssigner(function(object, source) {
          if (isPrototype(source) || isArrayLike(source)) {
            copyObject(source, keys(source), object);
            return;
          }
          for (var key in source) {
            if (hasOwnProperty2.call(source, key)) {
              assignValue(object, key, source[key]);
            }
          }
        });
        var assignIn = createAssigner(function(object, source) {
          copyObject(source, keysIn(source), object);
        });
        var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keysIn(source), object, customizer);
        });
        var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keys(source), object, customizer);
        });
        var at = flatRest(baseAt);
        function create(prototype, properties) {
          var result2 = baseCreate(prototype);
          return properties == null ? result2 : baseAssign(result2, properties);
        }
        var defaults = baseRest(function(object, sources) {
          object = Object2(object);
          var index = -1;
          var length = sources.length;
          var guard = length > 2 ? sources[2] : undefined$1;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            length = 1;
          }
          while (++index < length) {
            var source = sources[index];
            var props = keysIn(source);
            var propsIndex = -1;
            var propsLength = props.length;
            while (++propsIndex < propsLength) {
              var key = props[propsIndex];
              var value = object[key];
              if (value === undefined$1 || eq(value, objectProto[key]) && !hasOwnProperty2.call(object, key)) {
                object[key] = source[key];
              }
            }
          }
          return object;
        });
        var defaultsDeep = baseRest(function(args) {
          args.push(undefined$1, customDefaultsMerge);
          return apply(mergeWith, undefined$1, args);
        });
        function findKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
        }
        function findLastKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
        }
        function forIn(object, iteratee2) {
          return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forInRight(object, iteratee2) {
          return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forOwn(object, iteratee2) {
          return object && baseForOwn(object, getIteratee(iteratee2, 3));
        }
        function forOwnRight(object, iteratee2) {
          return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
        }
        function functions(object) {
          return object == null ? [] : baseFunctions(object, keys(object));
        }
        function functionsIn(object) {
          return object == null ? [] : baseFunctions(object, keysIn(object));
        }
        function get2(object, path, defaultValue) {
          var result2 = object == null ? undefined$1 : baseGet(object, path);
          return result2 === undefined$1 ? defaultValue : result2;
        }
        function has2(object, path) {
          return object != null && hasPath(object, path, baseHas);
        }
        function hasIn(object, path) {
          return object != null && hasPath(object, path, baseHasIn);
        }
        var invert = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          result2[value] = key;
        }, constant(identity));
        var invertBy = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          if (hasOwnProperty2.call(result2, value)) {
            result2[value].push(key);
          } else {
            result2[value] = [
              key
            ];
          }
        }, getIteratee);
        var invoke = baseRest(baseInvoke);
        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }
        function keysIn(object) {
          return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }
        function mapKeys(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, iteratee2(value, key, object2), value);
          });
          return result2;
        }
        function mapValues(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, key, iteratee2(value, key, object2));
          });
          return result2;
        }
        var merge = createAssigner(function(object, source, srcIndex) {
          baseMerge(object, source, srcIndex);
        });
        var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
          baseMerge(object, source, srcIndex, customizer);
        });
        var omit = flatRest(function(object, paths) {
          var result2 = {};
          if (object == null) {
            return result2;
          }
          var isDeep = false;
          paths = arrayMap(paths, function(path) {
            path = castPath(path, object);
            isDeep || (isDeep = path.length > 1);
            return path;
          });
          copyObject(object, getAllKeysIn(object), result2);
          if (isDeep) {
            result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
          }
          var length = paths.length;
          while (length--) {
            baseUnset(result2, paths[length]);
          }
          return result2;
        });
        function omitBy(object, predicate) {
          return pickBy(object, negate(getIteratee(predicate)));
        }
        var pick = flatRest(function(object, paths) {
          return object == null ? {} : basePick(object, paths);
        });
        function pickBy(object, predicate) {
          if (object == null) {
            return {};
          }
          var props = arrayMap(getAllKeysIn(object), function(prop) {
            return [
              prop
            ];
          });
          predicate = getIteratee(predicate);
          return basePickBy(object, props, function(value, path) {
            return predicate(value, path[0]);
          });
        }
        function result(object, path, defaultValue) {
          path = castPath(path, object);
          var index = -1, length = path.length;
          if (!length) {
            length = 1;
            object = undefined$1;
          }
          while (++index < length) {
            var value = object == null ? undefined$1 : object[toKey(path[index])];
            if (value === undefined$1) {
              index = length;
              value = defaultValue;
            }
            object = isFunction2(value) ? value.call(object) : value;
          }
          return object;
        }
        function set2(object, path, value) {
          return object == null ? object : baseSet(object, path, value);
        }
        function setWith(object, path, value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return object == null ? object : baseSet(object, path, value, customizer);
        }
        var toPairs = createToPairs(keys);
        var toPairsIn = createToPairs(keysIn);
        function transform(object, iteratee2, accumulator) {
          var isArr = isArray2(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
          iteratee2 = getIteratee(iteratee2, 4);
          if (accumulator == null) {
            var Ctor = object && object.constructor;
            if (isArrLike) {
              accumulator = isArr ? new Ctor() : [];
            } else if (isObject2(object)) {
              accumulator = isFunction2(Ctor) ? baseCreate(getPrototype(object)) : {};
            } else {
              accumulator = {};
            }
          }
          (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
            return iteratee2(accumulator, value, index, object2);
          });
          return accumulator;
        }
        function unset(object, path) {
          return object == null ? true : baseUnset(object, path);
        }
        function update(object, path, updater) {
          return object == null ? object : baseUpdate(object, path, castFunction(updater));
        }
        function updateWith(object, path, updater, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
        }
        function values(object) {
          return object == null ? [] : baseValues(object, keys(object));
        }
        function valuesIn(object) {
          return object == null ? [] : baseValues(object, keysIn(object));
        }
        function clamp(number, lower, upper) {
          if (upper === undefined$1) {
            upper = lower;
            lower = undefined$1;
          }
          if (upper !== undefined$1) {
            upper = toNumber(upper);
            upper = upper === upper ? upper : 0;
          }
          if (lower !== undefined$1) {
            lower = toNumber(lower);
            lower = lower === lower ? lower : 0;
          }
          return baseClamp(toNumber(number), lower, upper);
        }
        function inRange(number, start, end) {
          start = toFinite(start);
          if (end === undefined$1) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          number = toNumber(number);
          return baseInRange(number, start, end);
        }
        function random(lower, upper, floating) {
          if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
            upper = floating = undefined$1;
          }
          if (floating === undefined$1) {
            if (typeof upper == "boolean") {
              floating = upper;
              upper = undefined$1;
            } else if (typeof lower == "boolean") {
              floating = lower;
              lower = undefined$1;
            }
          }
          if (lower === undefined$1 && upper === undefined$1) {
            lower = 0;
            upper = 1;
          } else {
            lower = toFinite(lower);
            if (upper === undefined$1) {
              upper = lower;
              lower = 0;
            } else {
              upper = toFinite(upper);
            }
          }
          if (lower > upper) {
            var temp = lower;
            lower = upper;
            upper = temp;
          }
          if (floating || lower % 1 || upper % 1) {
            var rand = nativeRandom();
            return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
          }
          return baseRandom(lower, upper);
        }
        var camelCase = createCompounder(function(result2, word, index) {
          word = word.toLowerCase();
          return result2 + (index ? capitalize2(word) : word);
        });
        function capitalize2(string) {
          return upperFirst(toString(string).toLowerCase());
        }
        function deburr(string) {
          string = toString(string);
          return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
        }
        function endsWith(string, target, position) {
          string = toString(string);
          target = baseToString(target);
          var length = string.length;
          position = position === undefined$1 ? length : baseClamp(toInteger(position), 0, length);
          var end = position;
          position -= target.length;
          return position >= 0 && string.slice(position, end) == target;
        }
        function escape(string) {
          string = toString(string);
          return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }
        function escapeRegExp(string) {
          string = toString(string);
          return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
        }
        var kebabCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "-" : "") + word.toLowerCase();
        });
        var lowerCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toLowerCase();
        });
        var lowerFirst = createCaseFirst("toLowerCase");
        function pad(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          if (!length || strLength >= length) {
            return string;
          }
          var mid = (length - strLength) / 2;
          return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
        }
        function padEnd(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
        }
        function padStart(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
        }
        function parseInt2(string, radix, guard) {
          if (guard || radix == null) {
            radix = 0;
          } else if (radix) {
            radix = +radix;
          }
          return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
        }
        function repeat(string, n, guard) {
          if (guard ? isIterateeCall(string, n, guard) : n === undefined$1) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          return baseRepeat(toString(string), n);
        }
        function replace() {
          var args = arguments, string = toString(args[0]);
          return args.length < 3 ? string : string.replace(args[1], args[2]);
        }
        var snakeCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "_" : "") + word.toLowerCase();
        });
        function split(string, separator, limit) {
          if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
            separator = limit = undefined$1;
          }
          limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
          if (!limit) {
            return [];
          }
          string = toString(string);
          if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
            separator = baseToString(separator);
            if (!separator && hasUnicode(string)) {
              return castSlice(stringToArray(string), 0, limit);
            }
          }
          return string.split(separator, limit);
        }
        var startCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + upperFirst(word);
        });
        function startsWith(string, target, position) {
          string = toString(string);
          position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
          target = baseToString(target);
          return string.slice(position, position + target.length) == target;
        }
        function template(string, options, guard) {
          var settings = lodash2.templateSettings;
          if (guard && isIterateeCall(string, options, guard)) {
            options = undefined$1;
          }
          string = toString(string);
          options = assignInWith({}, options, settings, customDefaultsAssignIn);
          var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
          var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
          var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
          var sourceURL = "//# sourceURL=" + (hasOwnProperty2.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
          string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              isEscaping = true;
              source += "' +\n__e(" + escapeValue + ") +\n'";
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += "';\n" + evaluateValue + ";\n__p += '";
            }
            if (interpolateValue) {
              source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
            }
            index = offset + match.length;
            return match;
          });
          source += "';\n";
          var variable = hasOwnProperty2.call(options, "variable") && options.variable;
          if (!variable) {
            source = "with (obj) {\n" + source + "\n}\n";
          } else if (reForbiddenIdentifierChars.test(variable)) {
            throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
          source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
          var result2 = attempt(function() {
            return Function2(importsKeys, sourceURL + "return " + source).apply(undefined$1, importsValues);
          });
          result2.source = source;
          if (isError(result2)) {
            throw result2;
          }
          return result2;
        }
        function toLower(value) {
          return toString(value).toLowerCase();
        }
        function toUpper(value) {
          return toString(value).toUpperCase();
        }
        function trim(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined$1)) {
            return baseTrim(string);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
          return castSlice(strSymbols, start, end).join("");
        }
        function trimEnd(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined$1)) {
            return string.slice(0, trimmedEndIndex(string) + 1);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
          return castSlice(strSymbols, 0, end).join("");
        }
        function trimStart(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined$1)) {
            return string.replace(reTrimStart, "");
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
          return castSlice(strSymbols, start).join("");
        }
        function truncate(string, options) {
          var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
          if (isObject2(options)) {
            var separator = "separator" in options ? options.separator : separator;
            length = "length" in options ? toInteger(options.length) : length;
            omission = "omission" in options ? baseToString(options.omission) : omission;
          }
          string = toString(string);
          var strLength = string.length;
          if (hasUnicode(string)) {
            var strSymbols = stringToArray(string);
            strLength = strSymbols.length;
          }
          if (length >= strLength) {
            return string;
          }
          var end = length - stringSize(omission);
          if (end < 1) {
            return omission;
          }
          var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
          if (separator === undefined$1) {
            return result2 + omission;
          }
          if (strSymbols) {
            end += result2.length - end;
          }
          if (isRegExp(separator)) {
            if (string.slice(end).search(separator)) {
              var match, substring = result2;
              if (!separator.global) {
                separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
              }
              separator.lastIndex = 0;
              while (match = separator.exec(substring)) {
                var newEnd = match.index;
              }
              result2 = result2.slice(0, newEnd === undefined$1 ? end : newEnd);
            }
          } else if (string.indexOf(baseToString(separator), end) != end) {
            var index = result2.lastIndexOf(separator);
            if (index > -1) {
              result2 = result2.slice(0, index);
            }
          }
          return result2 + omission;
        }
        function unescape(string) {
          string = toString(string);
          return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }
        var upperCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toUpperCase();
        });
        var upperFirst = createCaseFirst("toUpperCase");
        function words(string, pattern, guard) {
          string = toString(string);
          pattern = guard ? undefined$1 : pattern;
          if (pattern === undefined$1) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
          }
          return string.match(pattern) || [];
        }
        var attempt = baseRest(function(func, args) {
          try {
            return apply(func, undefined$1, args);
          } catch (e) {
            return isError(e) ? e : new Error2(e);
          }
        });
        var bindAll = flatRest(function(object, methodNames) {
          arrayEach(methodNames, function(key) {
            key = toKey(key);
            baseAssignValue(object, key, bind(object[key], object));
          });
          return object;
        });
        function cond(pairs) {
          var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
          pairs = !length ? [] : arrayMap(pairs, function(pair) {
            if (typeof pair[1] != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return [
              toIteratee(pair[0]),
              pair[1]
            ];
          });
          return baseRest(function(args) {
            var index = -1;
            while (++index < length) {
              var pair = pairs[index];
              if (apply(pair[0], this, args)) {
                return apply(pair[1], this, args);
              }
            }
          });
        }
        function conforms(source) {
          return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
        }
        function constant(value) {
          return function() {
            return value;
          };
        }
        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }
        var flow = createFlow();
        var flowRight = createFlow(true);
        function identity(value) {
          return value;
        }
        function iteratee(func) {
          return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
        }
        function matches(source) {
          return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
        }
        function matchesProperty(path, srcValue) {
          return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
        }
        var method = baseRest(function(path, args) {
          return function(object) {
            return baseInvoke(object, path, args);
          };
        });
        var methodOf = baseRest(function(object, args) {
          return function(path) {
            return baseInvoke(object, path, args);
          };
        });
        function mixin(object, source, options) {
          var props = keys(source), methodNames = baseFunctions(source, props);
          if (options == null && !(isObject2(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
          }
          var chain2 = !(isObject2(options) && "chain" in options) || !!options.chain, isFunc = isFunction2(object);
          arrayEach(methodNames, function(methodName) {
            var func = source[methodName];
            object[methodName] = func;
            if (isFunc) {
              object.prototype[methodName] = function() {
                var chainAll = this.__chain__;
                if (chain2 || chainAll) {
                  var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                  actions.push({
                    "func": func,
                    "args": arguments,
                    "thisArg": object
                  });
                  result2.__chain__ = chainAll;
                  return result2;
                }
                return func.apply(object, arrayPush([
                  this.value()
                ], arguments));
              };
            }
          });
          return object;
        }
        function noConflict() {
          if (root._ === this) {
            root._ = oldDash;
          }
          return this;
        }
        function noop2() {
        }
        function nthArg(n) {
          n = toInteger(n);
          return baseRest(function(args) {
            return baseNth(args, n);
          });
        }
        var over = createOver(arrayMap);
        var overEvery = createOver(arrayEvery);
        var overSome = createOver(arraySome);
        function property(path) {
          return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }
        function propertyOf(object) {
          return function(path) {
            return object == null ? undefined$1 : baseGet(object, path);
          };
        }
        var range = createRange();
        var rangeRight = createRange(true);
        function stubArray() {
          return [];
        }
        function stubFalse() {
          return false;
        }
        function stubObject() {
          return {};
        }
        function stubString() {
          return "";
        }
        function stubTrue() {
          return true;
        }
        function times(n, iteratee2) {
          n = toInteger(n);
          if (n < 1 || n > MAX_SAFE_INTEGER) {
            return [];
          }
          var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
          iteratee2 = getIteratee(iteratee2);
          n -= MAX_ARRAY_LENGTH;
          var result2 = baseTimes(length, iteratee2);
          while (++index < n) {
            iteratee2(index);
          }
          return result2;
        }
        function toPath(value) {
          if (isArray2(value)) {
            return arrayMap(value, toKey);
          }
          return isSymbol2(value) ? [
            value
          ] : copyArray(stringToPath(toString(value)));
        }
        function uniqueId(prefix) {
          var id = ++idCounter;
          return toString(prefix) + id;
        }
        var add2 = createMathOperation(function(augend, addend) {
          return augend + addend;
        }, 0);
        var ceil = createRound("ceil");
        var divide = createMathOperation(function(dividend, divisor) {
          return dividend / divisor;
        }, 1);
        var floor = createRound("floor");
        function max(array) {
          return array && array.length ? baseExtremum(array, identity, baseGt) : undefined$1;
        }
        function maxBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined$1;
        }
        function mean(array) {
          return baseMean(array, identity);
        }
        function meanBy(array, iteratee2) {
          return baseMean(array, getIteratee(iteratee2, 2));
        }
        function min(array) {
          return array && array.length ? baseExtremum(array, identity, baseLt) : undefined$1;
        }
        function minBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined$1;
        }
        var multiply = createMathOperation(function(multiplier, multiplicand) {
          return multiplier * multiplicand;
        }, 1);
        var round = createRound("round");
        var subtract = createMathOperation(function(minuend, subtrahend) {
          return minuend - subtrahend;
        }, 0);
        function sum(array) {
          return array && array.length ? baseSum(array, identity) : 0;
        }
        function sumBy(array, iteratee2) {
          return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
        }
        lodash2.after = after;
        lodash2.ary = ary;
        lodash2.assign = assign2;
        lodash2.assignIn = assignIn;
        lodash2.assignInWith = assignInWith;
        lodash2.assignWith = assignWith;
        lodash2.at = at;
        lodash2.before = before;
        lodash2.bind = bind;
        lodash2.bindAll = bindAll;
        lodash2.bindKey = bindKey;
        lodash2.castArray = castArray;
        lodash2.chain = chain;
        lodash2.chunk = chunk;
        lodash2.compact = compact;
        lodash2.concat = concat;
        lodash2.cond = cond;
        lodash2.conforms = conforms;
        lodash2.constant = constant;
        lodash2.countBy = countBy;
        lodash2.create = create;
        lodash2.curry = curry;
        lodash2.curryRight = curryRight;
        lodash2.debounce = debounce;
        lodash2.defaults = defaults;
        lodash2.defaultsDeep = defaultsDeep;
        lodash2.defer = defer;
        lodash2.delay = delay;
        lodash2.difference = difference;
        lodash2.differenceBy = differenceBy;
        lodash2.differenceWith = differenceWith;
        lodash2.drop = drop;
        lodash2.dropRight = dropRight;
        lodash2.dropRightWhile = dropRightWhile;
        lodash2.dropWhile = dropWhile;
        lodash2.fill = fill;
        lodash2.filter = filter;
        lodash2.flatMap = flatMap;
        lodash2.flatMapDeep = flatMapDeep;
        lodash2.flatMapDepth = flatMapDepth;
        lodash2.flatten = flatten;
        lodash2.flattenDeep = flattenDeep;
        lodash2.flattenDepth = flattenDepth;
        lodash2.flip = flip;
        lodash2.flow = flow;
        lodash2.flowRight = flowRight;
        lodash2.fromPairs = fromPairs;
        lodash2.functions = functions;
        lodash2.functionsIn = functionsIn;
        lodash2.groupBy = groupBy;
        lodash2.initial = initial;
        lodash2.intersection = intersection;
        lodash2.intersectionBy = intersectionBy;
        lodash2.intersectionWith = intersectionWith;
        lodash2.invert = invert;
        lodash2.invertBy = invertBy;
        lodash2.invokeMap = invokeMap;
        lodash2.iteratee = iteratee;
        lodash2.keyBy = keyBy;
        lodash2.keys = keys;
        lodash2.keysIn = keysIn;
        lodash2.map = map;
        lodash2.mapKeys = mapKeys;
        lodash2.mapValues = mapValues;
        lodash2.matches = matches;
        lodash2.matchesProperty = matchesProperty;
        lodash2.memoize = memoize;
        lodash2.merge = merge;
        lodash2.mergeWith = mergeWith;
        lodash2.method = method;
        lodash2.methodOf = methodOf;
        lodash2.mixin = mixin;
        lodash2.negate = negate;
        lodash2.nthArg = nthArg;
        lodash2.omit = omit;
        lodash2.omitBy = omitBy;
        lodash2.once = once;
        lodash2.orderBy = orderBy;
        lodash2.over = over;
        lodash2.overArgs = overArgs;
        lodash2.overEvery = overEvery;
        lodash2.overSome = overSome;
        lodash2.partial = partial;
        lodash2.partialRight = partialRight;
        lodash2.partition = partition;
        lodash2.pick = pick;
        lodash2.pickBy = pickBy;
        lodash2.property = property;
        lodash2.propertyOf = propertyOf;
        lodash2.pull = pull;
        lodash2.pullAll = pullAll;
        lodash2.pullAllBy = pullAllBy;
        lodash2.pullAllWith = pullAllWith;
        lodash2.pullAt = pullAt;
        lodash2.range = range;
        lodash2.rangeRight = rangeRight;
        lodash2.rearg = rearg;
        lodash2.reject = reject;
        lodash2.remove = remove2;
        lodash2.rest = rest;
        lodash2.reverse = reverse;
        lodash2.sampleSize = sampleSize;
        lodash2.set = set2;
        lodash2.setWith = setWith;
        lodash2.shuffle = shuffle;
        lodash2.slice = slice;
        lodash2.sortBy = sortBy;
        lodash2.sortedUniq = sortedUniq;
        lodash2.sortedUniqBy = sortedUniqBy;
        lodash2.split = split;
        lodash2.spread = spread;
        lodash2.tail = tail;
        lodash2.take = take;
        lodash2.takeRight = takeRight;
        lodash2.takeRightWhile = takeRightWhile;
        lodash2.takeWhile = takeWhile;
        lodash2.tap = tap;
        lodash2.throttle = throttle;
        lodash2.thru = thru;
        lodash2.toArray = toArray;
        lodash2.toPairs = toPairs;
        lodash2.toPairsIn = toPairsIn;
        lodash2.toPath = toPath;
        lodash2.toPlainObject = toPlainObject;
        lodash2.transform = transform;
        lodash2.unary = unary;
        lodash2.union = union;
        lodash2.unionBy = unionBy;
        lodash2.unionWith = unionWith;
        lodash2.uniq = uniq;
        lodash2.uniqBy = uniqBy;
        lodash2.uniqWith = uniqWith;
        lodash2.unset = unset;
        lodash2.unzip = unzip;
        lodash2.unzipWith = unzipWith;
        lodash2.update = update;
        lodash2.updateWith = updateWith;
        lodash2.values = values;
        lodash2.valuesIn = valuesIn;
        lodash2.without = without;
        lodash2.words = words;
        lodash2.wrap = wrap;
        lodash2.xor = xor;
        lodash2.xorBy = xorBy;
        lodash2.xorWith = xorWith;
        lodash2.zip = zip;
        lodash2.zipObject = zipObject;
        lodash2.zipObjectDeep = zipObjectDeep;
        lodash2.zipWith = zipWith;
        lodash2.entries = toPairs;
        lodash2.entriesIn = toPairsIn;
        lodash2.extend = assignIn;
        lodash2.extendWith = assignInWith;
        mixin(lodash2, lodash2);
        lodash2.add = add2;
        lodash2.attempt = attempt;
        lodash2.camelCase = camelCase;
        lodash2.capitalize = capitalize2;
        lodash2.ceil = ceil;
        lodash2.clamp = clamp;
        lodash2.clone = clone;
        lodash2.cloneDeep = cloneDeep;
        lodash2.cloneDeepWith = cloneDeepWith;
        lodash2.cloneWith = cloneWith;
        lodash2.conformsTo = conformsTo;
        lodash2.deburr = deburr;
        lodash2.defaultTo = defaultTo;
        lodash2.divide = divide;
        lodash2.endsWith = endsWith;
        lodash2.eq = eq;
        lodash2.escape = escape;
        lodash2.escapeRegExp = escapeRegExp;
        lodash2.every = every;
        lodash2.find = find;
        lodash2.findIndex = findIndex;
        lodash2.findKey = findKey;
        lodash2.findLast = findLast;
        lodash2.findLastIndex = findLastIndex;
        lodash2.findLastKey = findLastKey;
        lodash2.floor = floor;
        lodash2.forEach = forEach;
        lodash2.forEachRight = forEachRight;
        lodash2.forIn = forIn;
        lodash2.forInRight = forInRight;
        lodash2.forOwn = forOwn;
        lodash2.forOwnRight = forOwnRight;
        lodash2.get = get2;
        lodash2.gt = gt;
        lodash2.gte = gte;
        lodash2.has = has2;
        lodash2.hasIn = hasIn;
        lodash2.head = head;
        lodash2.identity = identity;
        lodash2.includes = includes;
        lodash2.indexOf = indexOf;
        lodash2.inRange = inRange;
        lodash2.invoke = invoke;
        lodash2.isArguments = isArguments;
        lodash2.isArray = isArray2;
        lodash2.isArrayBuffer = isArrayBuffer;
        lodash2.isArrayLike = isArrayLike;
        lodash2.isArrayLikeObject = isArrayLikeObject;
        lodash2.isBoolean = isBoolean;
        lodash2.isBuffer = isBuffer;
        lodash2.isDate = isDate;
        lodash2.isElement = isElement;
        lodash2.isEmpty = isEmpty;
        lodash2.isEqual = isEqual;
        lodash2.isEqualWith = isEqualWith;
        lodash2.isError = isError;
        lodash2.isFinite = isFinite2;
        lodash2.isFunction = isFunction2;
        lodash2.isInteger = isInteger;
        lodash2.isLength = isLength;
        lodash2.isMap = isMap2;
        lodash2.isMatch = isMatch;
        lodash2.isMatchWith = isMatchWith;
        lodash2.isNaN = isNaN2;
        lodash2.isNative = isNative;
        lodash2.isNil = isNil;
        lodash2.isNull = isNull;
        lodash2.isNumber = isNumber;
        lodash2.isObject = isObject2;
        lodash2.isObjectLike = isObjectLike;
        lodash2.isPlainObject = isPlainObject2;
        lodash2.isRegExp = isRegExp;
        lodash2.isSafeInteger = isSafeInteger;
        lodash2.isSet = isSet2;
        lodash2.isString = isString2;
        lodash2.isSymbol = isSymbol2;
        lodash2.isTypedArray = isTypedArray;
        lodash2.isUndefined = isUndefined;
        lodash2.isWeakMap = isWeakMap;
        lodash2.isWeakSet = isWeakSet;
        lodash2.join = join;
        lodash2.kebabCase = kebabCase;
        lodash2.last = last;
        lodash2.lastIndexOf = lastIndexOf;
        lodash2.lowerCase = lowerCase;
        lodash2.lowerFirst = lowerFirst;
        lodash2.lt = lt;
        lodash2.lte = lte;
        lodash2.max = max;
        lodash2.maxBy = maxBy;
        lodash2.mean = mean;
        lodash2.meanBy = meanBy;
        lodash2.min = min;
        lodash2.minBy = minBy;
        lodash2.stubArray = stubArray;
        lodash2.stubFalse = stubFalse;
        lodash2.stubObject = stubObject;
        lodash2.stubString = stubString;
        lodash2.stubTrue = stubTrue;
        lodash2.multiply = multiply;
        lodash2.nth = nth;
        lodash2.noConflict = noConflict;
        lodash2.noop = noop2;
        lodash2.now = now;
        lodash2.pad = pad;
        lodash2.padEnd = padEnd;
        lodash2.padStart = padStart;
        lodash2.parseInt = parseInt2;
        lodash2.random = random;
        lodash2.reduce = reduce;
        lodash2.reduceRight = reduceRight;
        lodash2.repeat = repeat;
        lodash2.replace = replace;
        lodash2.result = result;
        lodash2.round = round;
        lodash2.runInContext = runInContext2;
        lodash2.sample = sample;
        lodash2.size = size2;
        lodash2.snakeCase = snakeCase;
        lodash2.some = some;
        lodash2.sortedIndex = sortedIndex;
        lodash2.sortedIndexBy = sortedIndexBy;
        lodash2.sortedIndexOf = sortedIndexOf;
        lodash2.sortedLastIndex = sortedLastIndex;
        lodash2.sortedLastIndexBy = sortedLastIndexBy;
        lodash2.sortedLastIndexOf = sortedLastIndexOf;
        lodash2.startCase = startCase;
        lodash2.startsWith = startsWith;
        lodash2.subtract = subtract;
        lodash2.sum = sum;
        lodash2.sumBy = sumBy;
        lodash2.template = template;
        lodash2.times = times;
        lodash2.toFinite = toFinite;
        lodash2.toInteger = toInteger;
        lodash2.toLength = toLength;
        lodash2.toLower = toLower;
        lodash2.toNumber = toNumber;
        lodash2.toSafeInteger = toSafeInteger;
        lodash2.toString = toString;
        lodash2.toUpper = toUpper;
        lodash2.trim = trim;
        lodash2.trimEnd = trimEnd;
        lodash2.trimStart = trimStart;
        lodash2.truncate = truncate;
        lodash2.unescape = unescape;
        lodash2.uniqueId = uniqueId;
        lodash2.upperCase = upperCase;
        lodash2.upperFirst = upperFirst;
        lodash2.each = forEach;
        lodash2.eachRight = forEachRight;
        lodash2.first = head;
        mixin(lodash2, function() {
          var source = {};
          baseForOwn(lodash2, function(func, methodName) {
            if (!hasOwnProperty2.call(lodash2.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        }(), {
          "chain": false
        });
        lodash2.VERSION = VERSION;
        arrayEach([
          "bind",
          "bindKey",
          "curry",
          "curryRight",
          "partial",
          "partialRight"
        ], function(methodName) {
          lodash2[methodName].placeholder = lodash2;
        });
        arrayEach([
          "drop",
          "take"
        ], function(methodName, index) {
          LazyWrapper.prototype[methodName] = function(n) {
            n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);
            var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
            if (result2.__filtered__) {
              result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
            } else {
              result2.__views__.push({
                "size": nativeMin(n, MAX_ARRAY_LENGTH),
                "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
              });
            }
            return result2;
          };
          LazyWrapper.prototype[methodName + "Right"] = function(n) {
            return this.reverse()[methodName](n).reverse();
          };
        });
        arrayEach([
          "filter",
          "map",
          "takeWhile"
        ], function(methodName, index) {
          var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
          LazyWrapper.prototype[methodName] = function(iteratee2) {
            var result2 = this.clone();
            result2.__iteratees__.push({
              "iteratee": getIteratee(iteratee2, 3),
              "type": type
            });
            result2.__filtered__ = result2.__filtered__ || isFilter;
            return result2;
          };
        });
        arrayEach([
          "head",
          "last"
        ], function(methodName, index) {
          var takeName = "take" + (index ? "Right" : "");
          LazyWrapper.prototype[methodName] = function() {
            return this[takeName](1).value()[0];
          };
        });
        arrayEach([
          "initial",
          "tail"
        ], function(methodName, index) {
          var dropName = "drop" + (index ? "" : "Right");
          LazyWrapper.prototype[methodName] = function() {
            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
          };
        });
        LazyWrapper.prototype.compact = function() {
          return this.filter(identity);
        };
        LazyWrapper.prototype.find = function(predicate) {
          return this.filter(predicate).head();
        };
        LazyWrapper.prototype.findLast = function(predicate) {
          return this.reverse().find(predicate);
        };
        LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
          if (typeof path == "function") {
            return new LazyWrapper(this);
          }
          return this.map(function(value) {
            return baseInvoke(value, path, args);
          });
        });
        LazyWrapper.prototype.reject = function(predicate) {
          return this.filter(negate(getIteratee(predicate)));
        };
        LazyWrapper.prototype.slice = function(start, end) {
          start = toInteger(start);
          var result2 = this;
          if (result2.__filtered__ && (start > 0 || end < 0)) {
            return new LazyWrapper(result2);
          }
          if (start < 0) {
            result2 = result2.takeRight(-start);
          } else if (start) {
            result2 = result2.drop(start);
          }
          if (end !== undefined$1) {
            end = toInteger(end);
            result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
          }
          return result2;
        };
        LazyWrapper.prototype.takeRightWhile = function(predicate) {
          return this.reverse().takeWhile(predicate).reverse();
        };
        LazyWrapper.prototype.toArray = function() {
          return this.take(MAX_ARRAY_LENGTH);
        };
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash2[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
          if (!lodashFunc) {
            return;
          }
          lodash2.prototype[methodName] = function() {
            var value = this.__wrapped__, args = isTaker ? [
              1
            ] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray2(value);
            var interceptor = function(value2) {
              var result3 = lodashFunc.apply(lodash2, arrayPush([
                value2
              ], args));
              return isTaker && chainAll ? result3[0] : result3;
            };
            if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
              isLazy = useLazy = false;
            }
            var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
            if (!retUnwrapped && useLazy) {
              value = onlyLazy ? value : new LazyWrapper(this);
              var result2 = func.apply(value, args);
              result2.__actions__.push({
                "func": thru,
                "args": [
                  interceptor
                ],
                "thisArg": undefined$1
              });
              return new LodashWrapper(result2, chainAll);
            }
            if (isUnwrapped && onlyLazy) {
              return func.apply(this, args);
            }
            result2 = this.thru(interceptor);
            return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
          };
        });
        arrayEach([
          "pop",
          "push",
          "shift",
          "sort",
          "splice",
          "unshift"
        ], function(methodName) {
          var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
          lodash2.prototype[methodName] = function() {
            var args = arguments;
            if (retUnwrapped && !this.__chain__) {
              var value = this.value();
              return func.apply(isArray2(value) ? value : [], args);
            }
            return this[chainName](function(value2) {
              return func.apply(isArray2(value2) ? value2 : [], args);
            });
          };
        });
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var lodashFunc = lodash2[methodName];
          if (lodashFunc) {
            var key = lodashFunc.name + "";
            if (!hasOwnProperty2.call(realNames, key)) {
              realNames[key] = [];
            }
            realNames[key].push({
              "name": methodName,
              "func": lodashFunc
            });
          }
        });
        realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [
          {
            "name": "wrapper",
            "func": undefined$1
          }
        ];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash2.prototype.at = wrapperAt;
        lodash2.prototype.chain = wrapperChain;
        lodash2.prototype.commit = wrapperCommit;
        lodash2.prototype.next = wrapperNext;
        lodash2.prototype.plant = wrapperPlant;
        lodash2.prototype.reverse = wrapperReverse;
        lodash2.prototype.toJSON = lodash2.prototype.valueOf = lodash2.prototype.value = wrapperValue;
        lodash2.prototype.first = lodash2.prototype.head;
        if (symIterator) {
          lodash2.prototype[symIterator] = wrapperToIterator;
        }
        return lodash2;
      };
      var _2 = runInContext();
      if (freeModule) {
        (freeModule.exports = _2)._ = _2;
        freeExports._ = _2;
      } else {
        root._ = _2;
      }
    }).call(commonjsGlobal);
  })(lodash, lodash.exports);
  var lodashExports = lodash.exports;
  const _ = getDefaultExportFromCjs(lodashExports);
  const translate = async (word, lang_from, lang_to) => {
    if (_.isEmpty(word)) {
      return "";
    }
    let payload = {
      client: "gtx",
      dt: "t",
      sl: lang_from,
      tl: lang_to,
      q: word
    };
    try {
      const apiUrl = "https://translate.googleapis.com/translate_a/single";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(payload)
      });
      if (!response.ok)
        throw new Error("Failed to translate");
      const json = await response.json();
      console.log("json[0][0][0]", json[0][0][0]);
      return json[0][0][0];
    } catch (error) {
      console.error("Translation error:", error);
      return "";
    }
  };
  const _withScopeId$1 = (n) => (pushScopeId("data-v-d6d40007"), n = n(), popScopeId(), n);
  const _hoisted_1$2 = {
    key: 0,
    class: "word-data-view"
  };
  const _hoisted_2$1 = _withScopeId$1(() => createBaseVNode("thead", null, [
    createBaseVNode("tr", null, [
      createBaseVNode("th", {
        rowspan: "2"
      }, "Verb form"),
      createBaseVNode("th", {
        rowspan: "2"
      }, "Person"),
      createBaseVNode("th", {
        class: "column-header",
        colspan: "2"
      }, "Singular"),
      createBaseVNode("th", {
        class: "column-header",
        colspan: "2"
      }, "Plural")
    ]),
    createBaseVNode("tr", null, [
      createBaseVNode("th", {
        class: "column-header"
      }, "Masculine"),
      createBaseVNode("th", {
        class: "column-header"
      }, "Feminine"),
      createBaseVNode("th", {
        class: "column-header"
      }, "Masculine"),
      createBaseVNode("th", {
        class: "column-header"
      }, "Feminine")
    ])
  ], -1));
  const _hoisted_3$1 = [
    "rowspan"
  ];
  const _hoisted_4$1 = [
    "colspan"
  ];
  const _hoisted_5$1 = {
    key: 1
  };
  const _hoisted_6$1 = _withScopeId$1(() => createBaseVNode("p", null, "No word data available.", -1));
  const _hoisted_7$1 = [
    _hoisted_6$1
  ];
  const _sfc_main$3 = defineComponent({
    __name: "WordDataView",
    props: {
      wordData: {
        type: WordData,
        required: true
      }
    },
    setup(__props) {
      const props = __props;
      const rowsByTense = computed(() => {
        const t0 = performance.now();
        const groupedByTense = _.cloneDeep(props.wordData.forms).reduce((acc, form) => {
          if (!acc.has(form.tense)) {
            acc.set(form.tense, []);
          }
          acc.get(form.tense).push(form);
          return acc;
        }, /* @__PURE__ */ new Map());
        let reduce = /* @__PURE__ */ new Map();
        groupedByTense.forEach((forms, tense) => {
          const groupedByPerson = forms.reduce((acc, form) => {
            if (!acc.has(form.person)) {
              acc.set(form.person, []);
            }
            acc.get(form.person).push(form);
            return acc;
          }, /* @__PURE__ */ new Map());
          reduce.set(tense, groupedByPerson);
        });
        const t1 = performance.now();
        console.log(`rowsByTense took ${(t1 - t0).toFixed(2)} milliseconds.`);
        return reduce;
      });
      const getColspan = (rowGroup) => {
        return rowGroup.length === 4 ? 1 : 2;
      };
      return (_ctx, _cache) => {
        return __props.wordData ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
          createBaseVNode("h2", null, toDisplayString(__props.wordData.word_normalized), 1),
          createBaseVNode("p", null, "Vowelled: " + toDisplayString(__props.wordData.word), 1),
          createBaseVNode("p", null, "Root: " + toDisplayString(unref(_).cloneDeep(__props.wordData.root).split("").join("-")), 1),
          createBaseVNode("p", null, "Transcription: " + toDisplayString(__props.wordData.transcription), 1),
          createBaseVNode("p", null, "Meaning: " + toDisplayString(__props.wordData.word_en), 1),
          createBaseVNode("p", null, "Binyan: " + toDisplayString(__props.wordData.binyan), 1),
          createBaseVNode("p", null, "URL ID: " + toDisplayString(__props.wordData.url_id), 1),
          createBaseVNode("div", null, [
            createBaseVNode("table", null, [
              _hoisted_2$1,
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(rowsByTense.value, ([tense, tenseGroup], tenseIndex) => {
                  return openBlock(), createElementBlock(Fragment, {
                    key: tense
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(tenseGroup, ([person, wordDatas], rowIndex) => {
                      return openBlock(), createElementBlock("tr", null, [
                        rowIndex == 0 ? (openBlock(), createElementBlock("th", {
                          key: 0,
                          rowspan: tenseGroup.size
                        }, toDisplayString(tense), 9, _hoisted_3$1)) : createCommentVNode("", true),
                        createBaseVNode("th", null, toDisplayString(person == "all" ? "" : person), 1),
                        (openBlock(true), createElementBlock(Fragment, null, renderList(wordDatas, (row) => {
                          return openBlock(), createElementBlock("td", {
                            colspan: getColspan(wordDatas)
                          }, [
                            createBaseVNode("p", null, [
                              createBaseVNode("span", null, toDisplayString(row.form_normalized), 1)
                            ]),
                            createBaseVNode("p", null, [
                              createBaseVNode("span", null, toDisplayString(row.form), 1)
                            ]),
                            createBaseVNode("p", null, [
                              createBaseVNode("span", null, toDisplayString(row.transcription), 1)
                            ]),
                            createBaseVNode("p", null, [
                              createBaseVNode("span", null, toDisplayString(row.meaning), 1)
                            ])
                          ], 8, _hoisted_4$1);
                        }), 256))
                      ]);
                    }), 256))
                  ], 64);
                }), 128))
              ])
            ])
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_5$1, _hoisted_7$1));
      };
    }
  });
  const WordDataView = _export_sfc(_sfc_main$3, [
    [
      "__scopeId",
      "data-v-d6d40007"
    ]
  ]);
  var build = {
    exports: {}
  };
  (function(module2, exports) {
    !function(t, e) {
      module2.exports = e();
    }(commonjsGlobal, function() {
      return function() {
        var t = {
          9306: function(t2, e2, n2) {
            var o2 = n2(4901), r = n2(6823), i = TypeError;
            t2.exports = function(t3) {
              if (o2(t3))
                return t3;
              throw new i(r(t3) + " is not a function");
            };
          },
          5548: function(t2, e2, n2) {
            var o2 = n2(3517), r = n2(6823), i = TypeError;
            t2.exports = function(t3) {
              if (o2(t3))
                return t3;
              throw new i(r(t3) + " is not a constructor");
            };
          },
          3506: function(t2, e2, n2) {
            var o2 = n2(3925), r = String, i = TypeError;
            t2.exports = function(t3) {
              if (o2(t3))
                return t3;
              throw new i("Can't set " + r(t3) + " as a prototype");
            };
          },
          6469: function(t2, e2, n2) {
            var o2 = n2(8227), r = n2(2360), i = n2(4913).f, a = o2("unscopables"), s = Array.prototype;
            void 0 === s[a] && i(s, a, {
              configurable: true,
              value: r(null)
            }), t2.exports = function(t3) {
              s[a][t3] = true;
            };
          },
          7829: function(t2, e2, n2) {
            var o2 = n2(8183).charAt;
            t2.exports = function(t3, e3, n3) {
              return e3 + (n3 ? o2(t3, e3).length : 1);
            };
          },
          8551: function(t2, e2, n2) {
            var o2 = n2(34), r = String, i = TypeError;
            t2.exports = function(t3) {
              if (o2(t3))
                return t3;
              throw new i(r(t3) + " is not an object");
            };
          },
          235: function(t2, e2, n2) {
            var o2 = n2(9213).forEach, r = n2(4598)("forEach");
            t2.exports = r ? [].forEach : function(t3) {
              return o2(this, t3, arguments.length > 1 ? arguments[1] : void 0);
            };
          },
          7916: function(t2, e2, n2) {
            var o2 = n2(6080), r = n2(9565), i = n2(8981), a = n2(6319), s = n2(4209), u = n2(3517), c = n2(6198), l = n2(4659), f = n2(81), d = n2(851), p2 = Array;
            t2.exports = function(t3) {
              var e3 = i(t3), n3 = u(this), h2 = arguments.length, v = h2 > 1 ? arguments[1] : void 0, y = void 0 !== v;
              y && (v = o2(v, h2 > 2 ? arguments[2] : void 0));
              var g, m, b, x, w, E, O = d(e3), S = 0;
              if (!O || this === p2 && s(O))
                for (g = c(e3), m = n3 ? new this(g) : p2(g); g > S; S++)
                  E = y ? v(e3[S], S) : e3[S], l(m, S, E);
              else
                for (m = n3 ? new this() : [], w = (x = f(e3, O)).next; !(b = r(w, x)).done; S++)
                  E = y ? a(x, v, [
                    b.value,
                    S
                  ], true) : b.value, l(m, S, E);
              return m.length = S, m;
            };
          },
          9617: function(t2, e2, n2) {
            var o2 = n2(5397), r = n2(5610), i = n2(6198), a = function(t3) {
              return function(e3, n3, a2) {
                var s = o2(e3), u = i(s);
                if (0 === u)
                  return !t3 && -1;
                var c, l = r(a2, u);
                if (t3 && n3 != n3) {
                  for (; u > l; )
                    if ((c = s[l++]) != c)
                      return true;
                } else
                  for (; u > l; l++)
                    if ((t3 || l in s) && s[l] === n3)
                      return t3 || l || 0;
                return !t3 && -1;
              };
            };
            t2.exports = {
              includes: a(true),
              indexOf: a(false)
            };
          },
          9213: function(t2, e2, n2) {
            var o2 = n2(6080), r = n2(9504), i = n2(7055), a = n2(8981), s = n2(6198), u = n2(1469), c = r([].push), l = function(t3) {
              var e3 = 1 === t3, n3 = 2 === t3, r2 = 3 === t3, l2 = 4 === t3, f = 6 === t3, d = 7 === t3, p2 = 5 === t3 || f;
              return function(h2, v, y, g) {
                for (var m, b, x = a(h2), w = i(x), E = s(w), O = o2(v, y), S = 0, k = g || u, P = e3 ? k(h2, E) : n3 || d ? k(h2, 0) : void 0; E > S; S++)
                  if ((p2 || S in w) && (b = O(m = w[S], S, x), t3))
                    if (e3)
                      P[S] = b;
                    else if (b)
                      switch (t3) {
                        case 3:
                          return true;
                        case 5:
                          return m;
                        case 6:
                          return S;
                        case 2:
                          c(P, m);
                      }
                    else
                      switch (t3) {
                        case 4:
                          return false;
                        case 7:
                          c(P, m);
                      }
                return f ? -1 : r2 || l2 ? l2 : P;
              };
            };
            t2.exports = {
              forEach: l(0),
              map: l(1),
              filter: l(2),
              some: l(3),
              every: l(4),
              find: l(5),
              findIndex: l(6),
              filterReject: l(7)
            };
          },
          597: function(t2, e2, n2) {
            var o2 = n2(9039), r = n2(8227), i = n2(7388), a = r("species");
            t2.exports = function(t3) {
              return i >= 51 || !o2(function() {
                var e3 = [];
                return (e3.constructor = {})[a] = function() {
                  return {
                    foo: 1
                  };
                }, 1 !== e3[t3](Boolean).foo;
              });
            };
          },
          4598: function(t2, e2, n2) {
            var o2 = n2(9039);
            t2.exports = function(t3, e3) {
              var n3 = [][t3];
              return !!n3 && o2(function() {
                n3.call(null, e3 || function() {
                  return 1;
                }, 1);
              });
            };
          },
          926: function(t2, e2, n2) {
            var o2 = n2(9306), r = n2(8981), i = n2(7055), a = n2(6198), s = TypeError, u = "Reduce of empty array with no initial value", c = function(t3) {
              return function(e3, n3, c2, l) {
                var f = r(e3), d = i(f), p2 = a(f);
                if (o2(n3), 0 === p2 && c2 < 2)
                  throw new s(u);
                var h2 = t3 ? p2 - 1 : 0, v = t3 ? -1 : 1;
                if (c2 < 2)
                  for (; ; ) {
                    if (h2 in d) {
                      l = d[h2], h2 += v;
                      break;
                    }
                    if (h2 += v, t3 ? h2 < 0 : p2 <= h2)
                      throw new s(u);
                  }
                for (; t3 ? h2 >= 0 : p2 > h2; h2 += v)
                  h2 in d && (l = n3(l, d[h2], h2, f));
                return l;
              };
            };
            t2.exports = {
              left: c(false),
              right: c(true)
            };
          },
          4527: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(4376), i = TypeError, a = Object.getOwnPropertyDescriptor, s = o2 && !function() {
              if (void 0 !== this)
                return true;
              try {
                Object.defineProperty([], "length", {
                  writable: false
                }).length = 1;
              } catch (t3) {
                return t3 instanceof TypeError;
              }
            }();
            t2.exports = s ? function(t3, e3) {
              if (r(t3) && !a(t3, "length").writable)
                throw new i("Cannot set read only .length");
              return t3.length = e3;
            } : function(t3, e3) {
              return t3.length = e3;
            };
          },
          7680: function(t2, e2, n2) {
            var o2 = n2(9504);
            t2.exports = o2([].slice);
          },
          4488: function(t2, e2, n2) {
            var o2 = n2(7680), r = Math.floor, i = function(t3, e3) {
              var n3 = t3.length;
              if (n3 < 8)
                for (var a, s, u = 1; u < n3; ) {
                  for (s = u, a = t3[u]; s && e3(t3[s - 1], a) > 0; )
                    t3[s] = t3[--s];
                  s !== u++ && (t3[s] = a);
                }
              else
                for (var c = r(n3 / 2), l = i(o2(t3, 0, c), e3), f = i(o2(t3, c), e3), d = l.length, p2 = f.length, h2 = 0, v = 0; h2 < d || v < p2; )
                  t3[h2 + v] = h2 < d && v < p2 ? e3(l[h2], f[v]) <= 0 ? l[h2++] : f[v++] : h2 < d ? l[h2++] : f[v++];
              return t3;
            };
            t2.exports = i;
          },
          7433: function(t2, e2, n2) {
            var o2 = n2(4376), r = n2(3517), i = n2(34), a = n2(8227)("species"), s = Array;
            t2.exports = function(t3) {
              var e3;
              return o2(t3) && (e3 = t3.constructor, (r(e3) && (e3 === s || o2(e3.prototype)) || i(e3) && null === (e3 = e3[a])) && (e3 = void 0)), void 0 === e3 ? s : e3;
            };
          },
          1469: function(t2, e2, n2) {
            var o2 = n2(7433);
            t2.exports = function(t3, e3) {
              return new (o2(t3))(0 === e3 ? 0 : e3);
            };
          },
          6319: function(t2, e2, n2) {
            var o2 = n2(8551), r = n2(9539);
            t2.exports = function(t3, e3, n3, i) {
              try {
                return i ? e3(o2(n3)[0], n3[1]) : e3(n3);
              } catch (e4) {
                r(t3, "throw", e4);
              }
            };
          },
          4428: function(t2, e2, n2) {
            var o2 = n2(8227)("iterator"), r = false;
            try {
              var i = 0, a = {
                next: function() {
                  return {
                    done: !!i++
                  };
                },
                return: function() {
                  r = true;
                }
              };
              a[o2] = function() {
                return this;
              }, Array.from(a, function() {
                throw 2;
              });
            } catch (t3) {
            }
            t2.exports = function(t3, e3) {
              try {
                if (!e3 && !r)
                  return false;
              } catch (t4) {
                return false;
              }
              var n3 = false;
              try {
                var i2 = {};
                i2[o2] = function() {
                  return {
                    next: function() {
                      return {
                        done: n3 = true
                      };
                    }
                  };
                }, t3(i2);
              } catch (t4) {
              }
              return n3;
            };
          },
          4576: function(t2, e2, n2) {
            var o2 = n2(9504), r = o2({}.toString), i = o2("".slice);
            t2.exports = function(t3) {
              return i(r(t3), 8, -1);
            };
          },
          6955: function(t2, e2, n2) {
            var o2 = n2(2140), r = n2(4901), i = n2(4576), a = n2(8227)("toStringTag"), s = Object, u = "Arguments" === i(/* @__PURE__ */ function() {
              return arguments;
            }());
            t2.exports = o2 ? i : function(t3) {
              var e3, n3, o3;
              return void 0 === t3 ? "Undefined" : null === t3 ? "Null" : "string" == typeof (n3 = function(t4, e4) {
                try {
                  return t4[e4];
                } catch (t5) {
                }
              }(e3 = s(t3), a)) ? n3 : u ? i(e3) : "Object" === (o3 = i(e3)) && r(e3.callee) ? "Arguments" : o3;
            };
          },
          7740: function(t2, e2, n2) {
            var o2 = n2(9297), r = n2(5031), i = n2(7347), a = n2(4913);
            t2.exports = function(t3, e3, n3) {
              for (var s = r(e3), u = a.f, c = i.f, l = 0; l < s.length; l++) {
                var f = s[l];
                o2(t3, f) || n3 && o2(n3, f) || u(t3, f, c(e3, f));
              }
            };
          },
          1436: function(t2, e2, n2) {
            var o2 = n2(8227)("match");
            t2.exports = function(t3) {
              var e3 = /./;
              try {
                "/./"[t3](e3);
              } catch (n3) {
                try {
                  return e3[o2] = false, "/./"[t3](e3);
                } catch (t4) {
                }
              }
              return false;
            };
          },
          2211: function(t2, e2, n2) {
            var o2 = n2(9039);
            t2.exports = !o2(function() {
              function t3() {
              }
              return t3.prototype.constructor = null, Object.getPrototypeOf(new t3()) !== t3.prototype;
            });
          },
          2529: function(t2) {
            t2.exports = function(t3, e2) {
              return {
                value: t3,
                done: e2
              };
            };
          },
          6699: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(4913), i = n2(6980);
            t2.exports = o2 ? function(t3, e3, n3) {
              return r.f(t3, e3, i(1, n3));
            } : function(t3, e3, n3) {
              return t3[e3] = n3, t3;
            };
          },
          6980: function(t2) {
            t2.exports = function(t3, e2) {
              return {
                enumerable: !(1 & t3),
                configurable: !(2 & t3),
                writable: !(4 & t3),
                value: e2
              };
            };
          },
          4659: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(4913), i = n2(6980);
            t2.exports = function(t3, e3, n3) {
              o2 ? r.f(t3, e3, i(0, n3)) : t3[e3] = n3;
            };
          },
          3640: function(t2, e2, n2) {
            var o2 = n2(8551), r = n2(4270), i = TypeError;
            t2.exports = function(t3) {
              if (o2(this), "string" === t3 || "default" === t3)
                t3 = "string";
              else if ("number" !== t3)
                throw new i("Incorrect hint");
              return r(this, t3);
            };
          },
          2106: function(t2, e2, n2) {
            var o2 = n2(283), r = n2(4913);
            t2.exports = function(t3, e3, n3) {
              return n3.get && o2(n3.get, e3, {
                getter: true
              }), n3.set && o2(n3.set, e3, {
                setter: true
              }), r.f(t3, e3, n3);
            };
          },
          6840: function(t2, e2, n2) {
            var o2 = n2(4901), r = n2(4913), i = n2(283), a = n2(9433);
            t2.exports = function(t3, e3, n3, s) {
              s || (s = {});
              var u = s.enumerable, c = void 0 !== s.name ? s.name : e3;
              if (o2(n3) && i(n3, c, s), s.global)
                u ? t3[e3] = n3 : a(e3, n3);
              else {
                try {
                  s.unsafe ? t3[e3] && (u = true) : delete t3[e3];
                } catch (t4) {
                }
                u ? t3[e3] = n3 : r.f(t3, e3, {
                  value: n3,
                  enumerable: false,
                  configurable: !s.nonConfigurable,
                  writable: !s.nonWritable
                });
              }
              return t3;
            };
          },
          9433: function(t2, e2, n2) {
            var o2 = n2(4475), r = Object.defineProperty;
            t2.exports = function(t3, e3) {
              try {
                r(o2, t3, {
                  value: e3,
                  configurable: true,
                  writable: true
                });
              } catch (n3) {
                o2[t3] = e3;
              }
              return e3;
            };
          },
          4606: function(t2, e2, n2) {
            var o2 = n2(6823), r = TypeError;
            t2.exports = function(t3, e3) {
              if (!delete t3[e3])
                throw new r("Cannot delete property " + o2(e3) + " of " + o2(t3));
            };
          },
          3724: function(t2, e2, n2) {
            var o2 = n2(9039);
            t2.exports = !o2(function() {
              return 7 !== Object.defineProperty({}, 1, {
                get: function() {
                  return 7;
                }
              })[1];
            });
          },
          4055: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(34), i = o2.document, a = r(i) && r(i.createElement);
            t2.exports = function(t3) {
              return a ? i.createElement(t3) : {};
            };
          },
          6837: function(t2) {
            var e2 = TypeError;
            t2.exports = function(t3) {
              if (t3 > 9007199254740991)
                throw e2("Maximum allowed index exceeded");
              return t3;
            };
          },
          7400: function(t2) {
            t2.exports = {
              CSSRuleList: 0,
              CSSStyleDeclaration: 0,
              CSSValueList: 0,
              ClientRectList: 0,
              DOMRectList: 0,
              DOMStringList: 0,
              DOMTokenList: 1,
              DataTransferItemList: 0,
              FileList: 0,
              HTMLAllCollection: 0,
              HTMLCollection: 0,
              HTMLFormElement: 0,
              HTMLSelectElement: 0,
              MediaList: 0,
              MimeTypeArray: 0,
              NamedNodeMap: 0,
              NodeList: 1,
              PaintRequestList: 0,
              Plugin: 0,
              PluginArray: 0,
              SVGLengthList: 0,
              SVGNumberList: 0,
              SVGPathSegList: 0,
              SVGPointList: 0,
              SVGStringList: 0,
              SVGTransformList: 0,
              SourceBufferList: 0,
              StyleSheetList: 0,
              TextTrackCueList: 0,
              TextTrackList: 0,
              TouchList: 0
            };
          },
          9296: function(t2, e2, n2) {
            var o2 = n2(4055)("span").classList, r = o2 && o2.constructor && o2.constructor.prototype;
            t2.exports = r === Object.prototype ? void 0 : r;
          },
          8834: function(t2, e2, n2) {
            var o2 = n2(9392).match(/firefox\/(\d+)/i);
            t2.exports = !!o2 && +o2[1];
          },
          3202: function(t2, e2, n2) {
            var o2 = n2(9392);
            t2.exports = /MSIE|Trident/.test(o2);
          },
          9088: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(4576);
            t2.exports = "process" === r(o2.process);
          },
          9392: function(t2) {
            t2.exports = "undefined" != typeof navigator && String(navigator.userAgent) || "";
          },
          7388: function(t2, e2, n2) {
            var o2, r, i = n2(4475), a = n2(9392), s = i.process, u = i.Deno, c = s && s.versions || u && u.version, l = c && c.v8;
            l && (r = (o2 = l.split("."))[0] > 0 && o2[0] < 4 ? 1 : +(o2[0] + o2[1])), !r && a && (!(o2 = a.match(/Edge\/(\d+)/)) || o2[1] >= 74) && (o2 = a.match(/Chrome\/(\d+)/)) && (r = +o2[1]), t2.exports = r;
          },
          9160: function(t2, e2, n2) {
            var o2 = n2(9392).match(/AppleWebKit\/(\d+)\./);
            t2.exports = !!o2 && +o2[1];
          },
          8727: function(t2) {
            t2.exports = [
              "constructor",
              "hasOwnProperty",
              "isPrototypeOf",
              "propertyIsEnumerable",
              "toLocaleString",
              "toString",
              "valueOf"
            ];
          },
          6518: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(7347).f, i = n2(6699), a = n2(6840), s = n2(9433), u = n2(7740), c = n2(2796);
            t2.exports = function(t3, e3) {
              var n3, l, f, d, p2, h2 = t3.target, v = t3.global, y = t3.stat;
              if (n3 = v ? o2 : y ? o2[h2] || s(h2, {}) : o2[h2] && o2[h2].prototype)
                for (l in e3) {
                  if (d = e3[l], f = t3.dontCallGetSet ? (p2 = r(n3, l)) && p2.value : n3[l], !c(v ? l : h2 + (y ? "." : "#") + l, t3.forced) && void 0 !== f) {
                    if (typeof d == typeof f)
                      continue;
                    u(d, f);
                  }
                  (t3.sham || f && f.sham) && i(d, "sham", true), a(n3, l, d, t3);
                }
            };
          },
          9039: function(t2) {
            t2.exports = function(t3) {
              try {
                return !!t3();
              } catch (t4) {
                return true;
              }
            };
          },
          9228: function(t2, e2, n2) {
            n2(7495);
            var o2 = n2(9565), r = n2(6840), i = n2(7323), a = n2(9039), s = n2(8227), u = n2(6699), c = s("species"), l = RegExp.prototype;
            t2.exports = function(t3, e3, n3, f) {
              var d = s(t3), p2 = !a(function() {
                var e4 = {};
                return e4[d] = function() {
                  return 7;
                }, 7 !== ""[t3](e4);
              }), h2 = p2 && !a(function() {
                var e4 = false, n4 = /a/;
                return "split" === t3 && ((n4 = {}).constructor = {}, n4.constructor[c] = function() {
                  return n4;
                }, n4.flags = "", n4[d] = /./[d]), n4.exec = function() {
                  return e4 = true, null;
                }, n4[d](""), !e4;
              });
              if (!p2 || !h2 || n3) {
                var v = /./[d], y = e3(d, ""[t3], function(t4, e4, n4, r2, a2) {
                  var s2 = e4.exec;
                  return s2 === i || s2 === l.exec ? p2 && !a2 ? {
                    done: true,
                    value: o2(v, e4, n4, r2)
                  } : {
                    done: true,
                    value: o2(t4, n4, e4, r2)
                  } : {
                    done: false
                  };
                });
                r(String.prototype, t3, y[0]), r(l, d, y[1]);
              }
              f && u(l[d], "sham", true);
            };
          },
          8745: function(t2, e2, n2) {
            var o2 = n2(616), r = Function.prototype, i = r.apply, a = r.call;
            t2.exports = "object" == typeof Reflect && Reflect.apply || (o2 ? a.bind(i) : function() {
              return a.apply(i, arguments);
            });
          },
          6080: function(t2, e2, n2) {
            var o2 = n2(7476), r = n2(9306), i = n2(616), a = o2(o2.bind);
            t2.exports = function(t3, e3) {
              return r(t3), void 0 === e3 ? t3 : i ? a(t3, e3) : function() {
                return t3.apply(e3, arguments);
              };
            };
          },
          616: function(t2, e2, n2) {
            var o2 = n2(9039);
            t2.exports = !o2(function() {
              var t3 = (function() {
              }).bind();
              return "function" != typeof t3 || t3.hasOwnProperty("prototype");
            });
          },
          9565: function(t2, e2, n2) {
            var o2 = n2(616), r = Function.prototype.call;
            t2.exports = o2 ? r.bind(r) : function() {
              return r.apply(r, arguments);
            };
          },
          350: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(9297), i = Function.prototype, a = o2 && Object.getOwnPropertyDescriptor, s = r(i, "name"), u = s && "something" === (function() {
            }).name, c = s && (!o2 || o2 && a(i, "name").configurable);
            t2.exports = {
              EXISTS: s,
              PROPER: u,
              CONFIGURABLE: c
            };
          },
          6706: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(9306);
            t2.exports = function(t3, e3, n3) {
              try {
                return o2(r(Object.getOwnPropertyDescriptor(t3, e3)[n3]));
              } catch (t4) {
              }
            };
          },
          7476: function(t2, e2, n2) {
            var o2 = n2(4576), r = n2(9504);
            t2.exports = function(t3) {
              if ("Function" === o2(t3))
                return r(t3);
            };
          },
          9504: function(t2, e2, n2) {
            var o2 = n2(616), r = Function.prototype, i = r.call, a = o2 && r.bind.bind(i, i);
            t2.exports = o2 ? a : function(t3) {
              return function() {
                return i.apply(t3, arguments);
              };
            };
          },
          7751: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(4901);
            t2.exports = function(t3, e3) {
              return arguments.length < 2 ? (n3 = o2[t3], r(n3) ? n3 : void 0) : o2[t3] && o2[t3][e3];
              var n3;
            };
          },
          851: function(t2, e2, n2) {
            var o2 = n2(6955), r = n2(5966), i = n2(4117), a = n2(6269), s = n2(8227)("iterator");
            t2.exports = function(t3) {
              if (!i(t3))
                return r(t3, s) || r(t3, "@@iterator") || a[o2(t3)];
            };
          },
          81: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(9306), i = n2(8551), a = n2(6823), s = n2(851), u = TypeError;
            t2.exports = function(t3, e3) {
              var n3 = arguments.length < 2 ? s(t3) : e3;
              if (r(n3))
                return i(o2(n3, t3));
              throw new u(a(t3) + " is not iterable");
            };
          },
          6933: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(4376), i = n2(4901), a = n2(4576), s = n2(655), u = o2([].push);
            t2.exports = function(t3) {
              if (i(t3))
                return t3;
              if (r(t3)) {
                for (var e3 = t3.length, n3 = [], o3 = 0; o3 < e3; o3++) {
                  var c = t3[o3];
                  "string" == typeof c ? u(n3, c) : "number" != typeof c && "Number" !== a(c) && "String" !== a(c) || u(n3, s(c));
                }
                var l = n3.length, f = true;
                return function(t4, e4) {
                  if (f)
                    return f = false, e4;
                  if (r(this))
                    return e4;
                  for (var o4 = 0; o4 < l; o4++)
                    if (n3[o4] === t4)
                      return e4;
                };
              }
            };
          },
          5966: function(t2, e2, n2) {
            var o2 = n2(9306), r = n2(4117);
            t2.exports = function(t3, e3) {
              var n3 = t3[e3];
              return r(n3) ? void 0 : o2(n3);
            };
          },
          2478: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(8981), i = Math.floor, a = o2("".charAt), s = o2("".replace), u = o2("".slice), c = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, l = /\$([$&'`]|\d{1,2})/g;
            t2.exports = function(t3, e3, n3, o3, f, d) {
              var p2 = n3 + t3.length, h2 = o3.length, v = l;
              return void 0 !== f && (f = r(f), v = c), s(d, v, function(r2, s2) {
                var c2;
                switch (a(s2, 0)) {
                  case "$":
                    return "$";
                  case "&":
                    return t3;
                  case "`":
                    return u(e3, 0, n3);
                  case "'":
                    return u(e3, p2);
                  case "<":
                    c2 = f[u(s2, 1, -1)];
                    break;
                  default:
                    var l2 = +s2;
                    if (0 === l2)
                      return r2;
                    if (l2 > h2) {
                      var d2 = i(l2 / 10);
                      return 0 === d2 ? r2 : d2 <= h2 ? void 0 === o3[d2 - 1] ? a(s2, 1) : o3[d2 - 1] + a(s2, 1) : r2;
                    }
                    c2 = o3[l2 - 1];
                }
                return void 0 === c2 ? "" : c2;
              });
            };
          },
          4475: function(t2, e2, n2) {
            var o2 = function(t3) {
              return t3 && t3.Math === Math && t3;
            };
            t2.exports = o2("object" == typeof globalThis && globalThis) || o2("object" == typeof window && window) || o2("object" == typeof self && self) || o2("object" == typeof n2.g && n2.g) || o2("object" == typeof this && this) || /* @__PURE__ */ function() {
              return this;
            }() || Function("return this")();
          },
          9297: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(8981), i = o2({}.hasOwnProperty);
            t2.exports = Object.hasOwn || function(t3, e3) {
              return i(r(t3), e3);
            };
          },
          421: function(t2) {
            t2.exports = {};
          },
          397: function(t2, e2, n2) {
            var o2 = n2(7751);
            t2.exports = o2("document", "documentElement");
          },
          5917: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(9039), i = n2(4055);
            t2.exports = !o2 && !r(function() {
              return 7 !== Object.defineProperty(i("div"), "a", {
                get: function() {
                  return 7;
                }
              }).a;
            });
          },
          7055: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(9039), i = n2(4576), a = Object, s = o2("".split);
            t2.exports = r(function() {
              return !a("z").propertyIsEnumerable(0);
            }) ? function(t3) {
              return "String" === i(t3) ? s(t3, "") : a(t3);
            } : a;
          },
          3167: function(t2, e2, n2) {
            var o2 = n2(4901), r = n2(34), i = n2(2967);
            t2.exports = function(t3, e3, n3) {
              var a, s;
              return i && o2(a = e3.constructor) && a !== n3 && r(s = a.prototype) && s !== n3.prototype && i(t3, s), t3;
            };
          },
          3706: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(4901), i = n2(7629), a = o2(Function.toString);
            r(i.inspectSource) || (i.inspectSource = function(t3) {
              return a(t3);
            }), t2.exports = i.inspectSource;
          },
          1181: function(t2, e2, n2) {
            var o2, r, i, a = n2(8622), s = n2(4475), u = n2(34), c = n2(6699), l = n2(9297), f = n2(7629), d = n2(6119), p2 = n2(421), h2 = "Object already initialized", v = s.TypeError, y = s.WeakMap;
            if (a || f.state) {
              var g = f.state || (f.state = new y());
              g.get = g.get, g.has = g.has, g.set = g.set, o2 = function(t3, e3) {
                if (g.has(t3))
                  throw new v(h2);
                return e3.facade = t3, g.set(t3, e3), e3;
              }, r = function(t3) {
                return g.get(t3) || {};
              }, i = function(t3) {
                return g.has(t3);
              };
            } else {
              var m = d("state");
              p2[m] = true, o2 = function(t3, e3) {
                if (l(t3, m))
                  throw new v(h2);
                return e3.facade = t3, c(t3, m, e3), e3;
              }, r = function(t3) {
                return l(t3, m) ? t3[m] : {};
              }, i = function(t3) {
                return l(t3, m);
              };
            }
            t2.exports = {
              set: o2,
              get: r,
              has: i,
              enforce: function(t3) {
                return i(t3) ? r(t3) : o2(t3, {});
              },
              getterFor: function(t3) {
                return function(e3) {
                  var n3;
                  if (!u(e3) || (n3 = r(e3)).type !== t3)
                    throw new v("Incompatible receiver, " + t3 + " required");
                  return n3;
                };
              }
            };
          },
          4209: function(t2, e2, n2) {
            var o2 = n2(8227), r = n2(6269), i = o2("iterator"), a = Array.prototype;
            t2.exports = function(t3) {
              return void 0 !== t3 && (r.Array === t3 || a[i] === t3);
            };
          },
          4376: function(t2, e2, n2) {
            var o2 = n2(4576);
            t2.exports = Array.isArray || function(t3) {
              return "Array" === o2(t3);
            };
          },
          4901: function(t2) {
            var e2 = "object" == typeof document && document.all;
            t2.exports = void 0 === e2 && void 0 !== e2 ? function(t3) {
              return "function" == typeof t3 || t3 === e2;
            } : function(t3) {
              return "function" == typeof t3;
            };
          },
          3517: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(9039), i = n2(4901), a = n2(6955), s = n2(7751), u = n2(3706), c = function() {
            }, l = s("Reflect", "construct"), f = /^\s*(?:class|function)\b/, d = o2(f.exec), p2 = !f.test(c), h2 = function(t3) {
              if (!i(t3))
                return false;
              try {
                return l(c, [], t3), true;
              } catch (t4) {
                return false;
              }
            }, v = function(t3) {
              if (!i(t3))
                return false;
              switch (a(t3)) {
                case "AsyncFunction":
                case "GeneratorFunction":
                case "AsyncGeneratorFunction":
                  return false;
              }
              try {
                return p2 || !!d(f, u(t3));
              } catch (t4) {
                return true;
              }
            };
            v.sham = true, t2.exports = !l || r(function() {
              var t3;
              return h2(h2.call) || !h2(Object) || !h2(function() {
                t3 = true;
              }) || t3;
            }) ? v : h2;
          },
          2796: function(t2, e2, n2) {
            var o2 = n2(9039), r = n2(4901), i = /#|\.prototype\./, a = function(t3, e3) {
              var n3 = u[s(t3)];
              return n3 === l || n3 !== c && (r(e3) ? o2(e3) : !!e3);
            }, s = a.normalize = function(t3) {
              return String(t3).replace(i, ".").toLowerCase();
            }, u = a.data = {}, c = a.NATIVE = "N", l = a.POLYFILL = "P";
            t2.exports = a;
          },
          2087: function(t2, e2, n2) {
            var o2 = n2(34), r = Math.floor;
            t2.exports = Number.isInteger || function(t3) {
              return !o2(t3) && isFinite(t3) && r(t3) === t3;
            };
          },
          4117: function(t2) {
            t2.exports = function(t3) {
              return null == t3;
            };
          },
          34: function(t2, e2, n2) {
            var o2 = n2(4901);
            t2.exports = function(t3) {
              return "object" == typeof t3 ? null !== t3 : o2(t3);
            };
          },
          3925: function(t2, e2, n2) {
            var o2 = n2(34);
            t2.exports = function(t3) {
              return o2(t3) || null === t3;
            };
          },
          6395: function(t2) {
            t2.exports = false;
          },
          788: function(t2, e2, n2) {
            var o2 = n2(34), r = n2(4576), i = n2(8227)("match");
            t2.exports = function(t3) {
              var e3;
              return o2(t3) && (void 0 !== (e3 = t3[i]) ? !!e3 : "RegExp" === r(t3));
            };
          },
          757: function(t2, e2, n2) {
            var o2 = n2(7751), r = n2(4901), i = n2(1625), a = n2(7040), s = Object;
            t2.exports = a ? function(t3) {
              return "symbol" == typeof t3;
            } : function(t3) {
              var e3 = o2("Symbol");
              return r(e3) && i(e3.prototype, s(t3));
            };
          },
          9539: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(8551), i = n2(5966);
            t2.exports = function(t3, e3, n3) {
              var a, s;
              r(t3);
              try {
                if (!(a = i(t3, "return"))) {
                  if ("throw" === e3)
                    throw n3;
                  return n3;
                }
                a = o2(a, t3);
              } catch (t4) {
                s = true, a = t4;
              }
              if ("throw" === e3)
                throw n3;
              if (s)
                throw a;
              return r(a), n3;
            };
          },
          3994: function(t2, e2, n2) {
            var o2 = n2(7657).IteratorPrototype, r = n2(2360), i = n2(6980), a = n2(687), s = n2(6269), u = function() {
              return this;
            };
            t2.exports = function(t3, e3, n3, c) {
              var l = e3 + " Iterator";
              return t3.prototype = r(o2, {
                next: i(+!c, n3)
              }), a(t3, l, false, true), s[l] = u, t3;
            };
          },
          1088: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9565), i = n2(6395), a = n2(350), s = n2(4901), u = n2(3994), c = n2(2787), l = n2(2967), f = n2(687), d = n2(6699), p2 = n2(6840), h2 = n2(8227), v = n2(6269), y = n2(7657), g = a.PROPER, m = a.CONFIGURABLE, b = y.IteratorPrototype, x = y.BUGGY_SAFARI_ITERATORS, w = h2("iterator"), E = "keys", O = "values", S = "entries", k = function() {
              return this;
            };
            t2.exports = function(t3, e3, n3, a2, h3, y2, P) {
              u(n3, e3, a2);
              var I, C, A, M = function(t4) {
                if (t4 === h3 && R)
                  return R;
                if (!x && t4 && t4 in N)
                  return N[t4];
                switch (t4) {
                  case E:
                  case O:
                  case S:
                    return function() {
                      return new n3(this, t4);
                    };
                }
                return function() {
                  return new n3(this);
                };
              }, T = e3 + " Iterator", D = false, N = t3.prototype, j = N[w] || N["@@iterator"] || h3 && N[h3], R = !x && j || M(h3), L = "Array" === e3 && N.entries || j;
              if (L && (I = c(L.call(new t3()))) !== Object.prototype && I.next && (i || c(I) === b || (l ? l(I, b) : s(I[w]) || p2(I, w, k)), f(I, T, true, true), i && (v[T] = k)), g && h3 === O && j && j.name !== O && (!i && m ? d(N, "name", O) : (D = true, R = function() {
                return r(j, this);
              })), h3)
                if (C = {
                  values: M(O),
                  keys: y2 ? R : M(E),
                  entries: M(S)
                }, P)
                  for (A in C)
                    (x || D || !(A in N)) && p2(N, A, C[A]);
                else
                  o2({
                    target: e3,
                    proto: true,
                    forced: x || D
                  }, C);
              return i && !P || N[w] === R || p2(N, w, R, {
                name: h3
              }), v[e3] = R, C;
            };
          },
          7657: function(t2, e2, n2) {
            var o2, r, i, a = n2(9039), s = n2(4901), u = n2(34), c = n2(2360), l = n2(2787), f = n2(6840), d = n2(8227), p2 = n2(6395), h2 = d("iterator"), v = false;
            [].keys && ("next" in (i = [].keys()) ? (r = l(l(i))) !== Object.prototype && (o2 = r) : v = true), !u(o2) || a(function() {
              var t3 = {};
              return o2[h2].call(t3) !== t3;
            }) ? o2 = {} : p2 && (o2 = c(o2)), s(o2[h2]) || f(o2, h2, function() {
              return this;
            }), t2.exports = {
              IteratorPrototype: o2,
              BUGGY_SAFARI_ITERATORS: v
            };
          },
          6269: function(t2) {
            t2.exports = {};
          },
          6198: function(t2, e2, n2) {
            var o2 = n2(8014);
            t2.exports = function(t3) {
              return o2(t3.length);
            };
          },
          283: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(9039), i = n2(4901), a = n2(9297), s = n2(3724), u = n2(350).CONFIGURABLE, c = n2(3706), l = n2(1181), f = l.enforce, d = l.get, p2 = String, h2 = Object.defineProperty, v = o2("".slice), y = o2("".replace), g = o2([].join), m = s && !r(function() {
              return 8 !== h2(function() {
              }, "length", {
                value: 8
              }).length;
            }), b = String(String).split("String"), x = t2.exports = function(t3, e3, n3) {
              "Symbol(" === v(p2(e3), 0, 7) && (e3 = "[" + y(p2(e3), /^Symbol\(([^)]*)\).*$/, "$1") + "]"), n3 && n3.getter && (e3 = "get " + e3), n3 && n3.setter && (e3 = "set " + e3), (!a(t3, "name") || u && t3.name !== e3) && (s ? h2(t3, "name", {
                value: e3,
                configurable: true
              }) : t3.name = e3), m && n3 && a(n3, "arity") && t3.length !== n3.arity && h2(t3, "length", {
                value: n3.arity
              });
              try {
                n3 && a(n3, "constructor") && n3.constructor ? s && h2(t3, "prototype", {
                  writable: false
                }) : t3.prototype && (t3.prototype = void 0);
              } catch (t4) {
              }
              var o3 = f(t3);
              return a(o3, "source") || (o3.source = g(b, "string" == typeof e3 ? e3 : "")), t3;
            };
            Function.prototype.toString = x(function() {
              return i(this) && d(this).source || c(this);
            }, "toString");
          },
          741: function(t2) {
            var e2 = Math.ceil, n2 = Math.floor;
            t2.exports = Math.trunc || function(t3) {
              var o2 = +t3;
              return (o2 > 0 ? n2 : e2)(o2);
            };
          },
          5749: function(t2, e2, n2) {
            var o2 = n2(788), r = TypeError;
            t2.exports = function(t3) {
              if (o2(t3))
                throw new r("The method doesn't accept regular expressions");
              return t3;
            };
          },
          4213: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(9504), i = n2(9565), a = n2(9039), s = n2(1072), u = n2(3717), c = n2(8773), l = n2(8981), f = n2(7055), d = Object.assign, p2 = Object.defineProperty, h2 = r([].concat);
            t2.exports = !d || a(function() {
              if (o2 && 1 !== d({
                b: 1
              }, d(p2({}, "a", {
                enumerable: true,
                get: function() {
                  p2(this, "b", {
                    value: 3,
                    enumerable: false
                  });
                }
              }), {
                b: 2
              })).b)
                return true;
              var t3 = {}, e3 = {}, n3 = Symbol("assign detection"), r2 = "abcdefghijklmnopqrst";
              return t3[n3] = 7, r2.split("").forEach(function(t4) {
                e3[t4] = t4;
              }), 7 !== d({}, t3)[n3] || s(d({}, e3)).join("") !== r2;
            }) ? function(t3, e3) {
              for (var n3 = l(t3), r2 = arguments.length, a2 = 1, d2 = u.f, p3 = c.f; r2 > a2; )
                for (var v, y = f(arguments[a2++]), g = d2 ? h2(s(y), d2(y)) : s(y), m = g.length, b = 0; m > b; )
                  v = g[b++], o2 && !i(p3, y, v) || (n3[v] = y[v]);
              return n3;
            } : d;
          },
          2360: function(t2, e2, n2) {
            var o2, r = n2(8551), i = n2(6801), a = n2(8727), s = n2(421), u = n2(397), c = n2(4055), l = n2(6119), f = "prototype", d = "script", p2 = l("IE_PROTO"), h2 = function() {
            }, v = function(t3) {
              return "<" + d + ">" + t3 + "</" + d + ">";
            }, y = function(t3) {
              t3.write(v("")), t3.close();
              var e3 = t3.parentWindow.Object;
              return t3 = null, e3;
            }, g = function() {
              try {
                o2 = new ActiveXObject("htmlfile");
              } catch (t4) {
              }
              var t3, e3, n3;
              g = "undefined" != typeof document ? document.domain && o2 ? y(o2) : (e3 = c("iframe"), n3 = "java" + d + ":", e3.style.display = "none", u.appendChild(e3), e3.src = String(n3), (t3 = e3.contentWindow.document).open(), t3.write(v("document.F=Object")), t3.close(), t3.F) : y(o2);
              for (var r2 = a.length; r2--; )
                delete g[f][a[r2]];
              return g();
            };
            s[p2] = true, t2.exports = Object.create || function(t3, e3) {
              var n3;
              return null !== t3 ? (h2[f] = r(t3), n3 = new h2(), h2[f] = null, n3[p2] = t3) : n3 = g(), void 0 === e3 ? n3 : i.f(n3, e3);
            };
          },
          6801: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(8686), i = n2(4913), a = n2(8551), s = n2(5397), u = n2(1072);
            e2.f = o2 && !r ? Object.defineProperties : function(t3, e3) {
              a(t3);
              for (var n3, o3 = s(e3), r2 = u(e3), c = r2.length, l = 0; c > l; )
                i.f(t3, n3 = r2[l++], o3[n3]);
              return t3;
            };
          },
          4913: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(5917), i = n2(8686), a = n2(8551), s = n2(6969), u = TypeError, c = Object.defineProperty, l = Object.getOwnPropertyDescriptor, f = "enumerable", d = "configurable", p2 = "writable";
            e2.f = o2 ? i ? function(t3, e3, n3) {
              if (a(t3), e3 = s(e3), a(n3), "function" == typeof t3 && "prototype" === e3 && "value" in n3 && p2 in n3 && !n3[p2]) {
                var o3 = l(t3, e3);
                o3 && o3[p2] && (t3[e3] = n3.value, n3 = {
                  configurable: d in n3 ? n3[d] : o3[d],
                  enumerable: f in n3 ? n3[f] : o3[f],
                  writable: false
                });
              }
              return c(t3, e3, n3);
            } : c : function(t3, e3, n3) {
              if (a(t3), e3 = s(e3), a(n3), r)
                try {
                  return c(t3, e3, n3);
                } catch (t4) {
                }
              if ("get" in n3 || "set" in n3)
                throw new u("Accessors not supported");
              return "value" in n3 && (t3[e3] = n3.value), t3;
            };
          },
          7347: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(9565), i = n2(8773), a = n2(6980), s = n2(5397), u = n2(6969), c = n2(9297), l = n2(5917), f = Object.getOwnPropertyDescriptor;
            e2.f = o2 ? f : function(t3, e3) {
              if (t3 = s(t3), e3 = u(e3), l)
                try {
                  return f(t3, e3);
                } catch (t4) {
                }
              if (c(t3, e3))
                return a(!r(i.f, t3, e3), t3[e3]);
            };
          },
          298: function(t2, e2, n2) {
            var o2 = n2(4576), r = n2(5397), i = n2(8480).f, a = n2(7680), s = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
            t2.exports.f = function(t3) {
              return s && "Window" === o2(t3) ? function(t4) {
                try {
                  return i(t4);
                } catch (t5) {
                  return a(s);
                }
              }(t3) : i(r(t3));
            };
          },
          8480: function(t2, e2, n2) {
            var o2 = n2(1828), r = n2(8727).concat("length", "prototype");
            e2.f = Object.getOwnPropertyNames || function(t3) {
              return o2(t3, r);
            };
          },
          3717: function(t2, e2) {
            e2.f = Object.getOwnPropertySymbols;
          },
          2787: function(t2, e2, n2) {
            var o2 = n2(9297), r = n2(4901), i = n2(8981), a = n2(6119), s = n2(2211), u = a("IE_PROTO"), c = Object, l = c.prototype;
            t2.exports = s ? c.getPrototypeOf : function(t3) {
              var e3 = i(t3);
              if (o2(e3, u))
                return e3[u];
              var n3 = e3.constructor;
              return r(n3) && e3 instanceof n3 ? n3.prototype : e3 instanceof c ? l : null;
            };
          },
          1625: function(t2, e2, n2) {
            var o2 = n2(9504);
            t2.exports = o2({}.isPrototypeOf);
          },
          1828: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(9297), i = n2(5397), a = n2(9617).indexOf, s = n2(421), u = o2([].push);
            t2.exports = function(t3, e3) {
              var n3, o3 = i(t3), c = 0, l = [];
              for (n3 in o3)
                !r(s, n3) && r(o3, n3) && u(l, n3);
              for (; e3.length > c; )
                r(o3, n3 = e3[c++]) && (~a(l, n3) || u(l, n3));
              return l;
            };
          },
          1072: function(t2, e2, n2) {
            var o2 = n2(1828), r = n2(8727);
            t2.exports = Object.keys || function(t3) {
              return o2(t3, r);
            };
          },
          8773: function(t2, e2) {
            var n2 = {}.propertyIsEnumerable, o2 = Object.getOwnPropertyDescriptor, r = o2 && !n2.call({
              1: 2
            }, 1);
            e2.f = r ? function(t3) {
              var e3 = o2(this, t3);
              return !!e3 && e3.enumerable;
            } : n2;
          },
          2551: function(t2, e2, n2) {
            var o2 = n2(6395), r = n2(4475), i = n2(9039), a = n2(9160);
            t2.exports = o2 || !i(function() {
              if (!(a && a < 535)) {
                var t3 = Math.random();
                __defineSetter__.call(null, t3, function() {
                }), delete r[t3];
              }
            });
          },
          2967: function(t2, e2, n2) {
            var o2 = n2(6706), r = n2(34), i = n2(7750), a = n2(3506);
            t2.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
              var t3, e3 = false, n3 = {};
              try {
                (t3 = o2(Object.prototype, "__proto__", "set"))(n3, []), e3 = n3 instanceof Array;
              } catch (t4) {
              }
              return function(n4, o3) {
                return i(n4), a(o3), r(n4) ? (e3 ? t3(n4, o3) : n4.__proto__ = o3, n4) : n4;
              };
            }() : void 0);
          },
          3179: function(t2, e2, n2) {
            var o2 = n2(2140), r = n2(6955);
            t2.exports = o2 ? {}.toString : function() {
              return "[object " + r(this) + "]";
            };
          },
          4270: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(4901), i = n2(34), a = TypeError;
            t2.exports = function(t3, e3) {
              var n3, s;
              if ("string" === e3 && r(n3 = t3.toString) && !i(s = o2(n3, t3)))
                return s;
              if (r(n3 = t3.valueOf) && !i(s = o2(n3, t3)))
                return s;
              if ("string" !== e3 && r(n3 = t3.toString) && !i(s = o2(n3, t3)))
                return s;
              throw new a("Can't convert object to primitive value");
            };
          },
          5031: function(t2, e2, n2) {
            var o2 = n2(7751), r = n2(9504), i = n2(8480), a = n2(3717), s = n2(8551), u = r([].concat);
            t2.exports = o2("Reflect", "ownKeys") || function(t3) {
              var e3 = i.f(s(t3)), n3 = a.f;
              return n3 ? u(e3, n3(t3)) : e3;
            };
          },
          9167: function(t2, e2, n2) {
            var o2 = n2(4475);
            t2.exports = o2;
          },
          1056: function(t2, e2, n2) {
            var o2 = n2(4913).f;
            t2.exports = function(t3, e3, n3) {
              n3 in t3 || o2(t3, n3, {
                configurable: true,
                get: function() {
                  return e3[n3];
                },
                set: function(t4) {
                  e3[n3] = t4;
                }
              });
            };
          },
          6682: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(8551), i = n2(4901), a = n2(4576), s = n2(7323), u = TypeError;
            t2.exports = function(t3, e3) {
              var n3 = t3.exec;
              if (i(n3)) {
                var c = o2(n3, t3, e3);
                return null !== c && r(c), c;
              }
              if ("RegExp" === a(t3))
                return o2(s, t3, e3);
              throw new u("RegExp#exec called on incompatible receiver");
            };
          },
          7323: function(t2, e2, n2) {
            var o2, r, i = n2(9565), a = n2(9504), s = n2(655), u = n2(7979), c = n2(8429), l = n2(5745), f = n2(2360), d = n2(1181).get, p2 = n2(3635), h2 = n2(8814), v = l("native-string-replace", String.prototype.replace), y = RegExp.prototype.exec, g = y, m = a("".charAt), b = a("".indexOf), x = a("".replace), w = a("".slice), E = (r = /b*/g, i(y, o2 = /a/, "a"), i(y, r, "a"), 0 !== o2.lastIndex || 0 !== r.lastIndex), O = c.BROKEN_CARET, S = void 0 !== /()??/.exec("")[1];
            (E || S || O || p2 || h2) && (g = function(t3) {
              var e3, n3, o3, r2, a2, c2, l2, p3 = this, h3 = d(p3), k = s(t3), P = h3.raw;
              if (P)
                return P.lastIndex = p3.lastIndex, e3 = i(g, P, k), p3.lastIndex = P.lastIndex, e3;
              var I = h3.groups, C = O && p3.sticky, A = i(u, p3), M = p3.source, T = 0, D = k;
              if (C && (A = x(A, "y", ""), -1 === b(A, "g") && (A += "g"), D = w(k, p3.lastIndex), p3.lastIndex > 0 && (!p3.multiline || p3.multiline && "\n" !== m(k, p3.lastIndex - 1)) && (M = "(?: " + M + ")", D = " " + D, T++), n3 = new RegExp("^(?:" + M + ")", A)), S && (n3 = new RegExp("^" + M + "$(?!\\s)", A)), E && (o3 = p3.lastIndex), r2 = i(y, C ? n3 : p3, D), C ? r2 ? (r2.input = w(r2.input, T), r2[0] = w(r2[0], T), r2.index = p3.lastIndex, p3.lastIndex += r2[0].length) : p3.lastIndex = 0 : E && r2 && (p3.lastIndex = p3.global ? r2.index + r2[0].length : o3), S && r2 && r2.length > 1 && i(v, r2[0], n3, function() {
                for (a2 = 1; a2 < arguments.length - 2; a2++)
                  void 0 === arguments[a2] && (r2[a2] = void 0);
              }), r2 && I)
                for (r2.groups = c2 = f(null), a2 = 0; a2 < I.length; a2++)
                  c2[(l2 = I[a2])[0]] = r2[l2[1]];
              return r2;
            }), t2.exports = g;
          },
          7979: function(t2, e2, n2) {
            var o2 = n2(8551);
            t2.exports = function() {
              var t3 = o2(this), e3 = "";
              return t3.hasIndices && (e3 += "d"), t3.global && (e3 += "g"), t3.ignoreCase && (e3 += "i"), t3.multiline && (e3 += "m"), t3.dotAll && (e3 += "s"), t3.unicode && (e3 += "u"), t3.unicodeSets && (e3 += "v"), t3.sticky && (e3 += "y"), e3;
            };
          },
          1034: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(9297), i = n2(1625), a = n2(7979), s = RegExp.prototype;
            t2.exports = function(t3) {
              var e3 = t3.flags;
              return void 0 !== e3 || "flags" in s || r(t3, "flags") || !i(s, t3) ? e3 : o2(a, t3);
            };
          },
          8429: function(t2, e2, n2) {
            var o2 = n2(9039), r = n2(4475).RegExp, i = o2(function() {
              var t3 = r("a", "y");
              return t3.lastIndex = 2, null !== t3.exec("abcd");
            }), a = i || o2(function() {
              return !r("a", "y").sticky;
            }), s = i || o2(function() {
              var t3 = r("^r", "gy");
              return t3.lastIndex = 2, null !== t3.exec("str");
            });
            t2.exports = {
              BROKEN_CARET: s,
              MISSED_STICKY: a,
              UNSUPPORTED_Y: i
            };
          },
          3635: function(t2, e2, n2) {
            var o2 = n2(9039), r = n2(4475).RegExp;
            t2.exports = o2(function() {
              var t3 = r(".", "s");
              return !(t3.dotAll && t3.test("\n") && "s" === t3.flags);
            });
          },
          8814: function(t2, e2, n2) {
            var o2 = n2(9039), r = n2(4475).RegExp;
            t2.exports = o2(function() {
              var t3 = r("(?<a>b)", "g");
              return "b" !== t3.exec("b").groups.a || "bc" !== "b".replace(t3, "$<a>c");
            });
          },
          7750: function(t2, e2, n2) {
            var o2 = n2(4117), r = TypeError;
            t2.exports = function(t3) {
              if (o2(t3))
                throw new r("Can't call method on " + t3);
              return t3;
            };
          },
          7633: function(t2, e2, n2) {
            var o2 = n2(7751), r = n2(2106), i = n2(8227), a = n2(3724), s = i("species");
            t2.exports = function(t3) {
              var e3 = o2(t3);
              a && e3 && !e3[s] && r(e3, s, {
                configurable: true,
                get: function() {
                  return this;
                }
              });
            };
          },
          687: function(t2, e2, n2) {
            var o2 = n2(4913).f, r = n2(9297), i = n2(8227)("toStringTag");
            t2.exports = function(t3, e3, n3) {
              t3 && !n3 && (t3 = t3.prototype), t3 && !r(t3, i) && o2(t3, i, {
                configurable: true,
                value: e3
              });
            };
          },
          6119: function(t2, e2, n2) {
            var o2 = n2(5745), r = n2(3392), i = o2("keys");
            t2.exports = function(t3) {
              return i[t3] || (i[t3] = r(t3));
            };
          },
          7629: function(t2, e2, n2) {
            var o2 = n2(6395), r = n2(4475), i = n2(9433), a = "__core-js_shared__", s = t2.exports = r[a] || i(a, {});
            (s.versions || (s.versions = [])).push({
              version: "3.37.0",
              mode: o2 ? "pure" : "global",
              copyright: "\xA9 2014-2024 Denis Pushkarev (zloirock.ru)",
              license: "https://github.com/zloirock/core-js/blob/v3.37.0/LICENSE",
              source: "https://github.com/zloirock/core-js"
            });
          },
          5745: function(t2, e2, n2) {
            var o2 = n2(7629);
            t2.exports = function(t3, e3) {
              return o2[t3] || (o2[t3] = e3 || {});
            };
          },
          2293: function(t2, e2, n2) {
            var o2 = n2(8551), r = n2(5548), i = n2(4117), a = n2(8227)("species");
            t2.exports = function(t3, e3) {
              var n3, s = o2(t3).constructor;
              return void 0 === s || i(n3 = o2(s)[a]) ? e3 : r(n3);
            };
          },
          8183: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(1291), i = n2(655), a = n2(7750), s = o2("".charAt), u = o2("".charCodeAt), c = o2("".slice), l = function(t3) {
              return function(e3, n3) {
                var o3, l2, f = i(a(e3)), d = r(n3), p2 = f.length;
                return d < 0 || d >= p2 ? t3 ? "" : void 0 : (o3 = u(f, d)) < 55296 || o3 > 56319 || d + 1 === p2 || (l2 = u(f, d + 1)) < 56320 || l2 > 57343 ? t3 ? s(f, d) : o3 : t3 ? c(f, d, d + 2) : l2 - 56320 + (o3 - 55296 << 10) + 65536;
              };
            };
            t2.exports = {
              codeAt: l(false),
              charAt: l(true)
            };
          },
          706: function(t2, e2, n2) {
            var o2 = n2(350).PROPER, r = n2(9039), i = n2(7452);
            t2.exports = function(t3) {
              return r(function() {
                return !!i[t3]() || "\u200B\x85\u180E" !== "\u200B\x85\u180E"[t3]() || o2 && i[t3].name !== t3;
              });
            };
          },
          3802: function(t2, e2, n2) {
            var o2 = n2(9504), r = n2(7750), i = n2(655), a = n2(7452), s = o2("".replace), u = RegExp("^[" + a + "]+"), c = RegExp("(^|[^" + a + "])[" + a + "]+$"), l = function(t3) {
              return function(e3) {
                var n3 = i(r(e3));
                return 1 & t3 && (n3 = s(n3, u, "")), 2 & t3 && (n3 = s(n3, c, "$1")), n3;
              };
            };
            t2.exports = {
              start: l(1),
              end: l(2),
              trim: l(3)
            };
          },
          4495: function(t2, e2, n2) {
            var o2 = n2(7388), r = n2(9039), i = n2(4475).String;
            t2.exports = !!Object.getOwnPropertySymbols && !r(function() {
              var t3 = Symbol("symbol detection");
              return !i(t3) || !(Object(t3) instanceof Symbol) || !Symbol.sham && o2 && o2 < 41;
            });
          },
          8242: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(7751), i = n2(8227), a = n2(6840);
            t2.exports = function() {
              var t3 = r("Symbol"), e3 = t3 && t3.prototype, n3 = e3 && e3.valueOf, s = i("toPrimitive");
              e3 && !e3[s] && a(e3, s, function(t4) {
                return o2(n3, this);
              }, {
                arity: 1
              });
            };
          },
          1296: function(t2, e2, n2) {
            var o2 = n2(4495);
            t2.exports = o2 && !!Symbol.for && !!Symbol.keyFor;
          },
          1240: function(t2, e2, n2) {
            var o2 = n2(9504);
            t2.exports = o2(1 .valueOf);
          },
          5610: function(t2, e2, n2) {
            var o2 = n2(1291), r = Math.max, i = Math.min;
            t2.exports = function(t3, e3) {
              var n3 = o2(t3);
              return n3 < 0 ? r(n3 + e3, 0) : i(n3, e3);
            };
          },
          5397: function(t2, e2, n2) {
            var o2 = n2(7055), r = n2(7750);
            t2.exports = function(t3) {
              return o2(r(t3));
            };
          },
          1291: function(t2, e2, n2) {
            var o2 = n2(741);
            t2.exports = function(t3) {
              var e3 = +t3;
              return e3 != e3 || 0 === e3 ? 0 : o2(e3);
            };
          },
          8014: function(t2, e2, n2) {
            var o2 = n2(1291), r = Math.min;
            t2.exports = function(t3) {
              var e3 = o2(t3);
              return e3 > 0 ? r(e3, 9007199254740991) : 0;
            };
          },
          8981: function(t2, e2, n2) {
            var o2 = n2(7750), r = Object;
            t2.exports = function(t3) {
              return r(o2(t3));
            };
          },
          2777: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(34), i = n2(757), a = n2(5966), s = n2(4270), u = n2(8227), c = TypeError, l = u("toPrimitive");
            t2.exports = function(t3, e3) {
              if (!r(t3) || i(t3))
                return t3;
              var n3, u2 = a(t3, l);
              if (u2) {
                if (void 0 === e3 && (e3 = "default"), n3 = o2(u2, t3, e3), !r(n3) || i(n3))
                  return n3;
                throw new c("Can't convert object to primitive value");
              }
              return void 0 === e3 && (e3 = "number"), s(t3, e3);
            };
          },
          6969: function(t2, e2, n2) {
            var o2 = n2(2777), r = n2(757);
            t2.exports = function(t3) {
              var e3 = o2(t3, "string");
              return r(e3) ? e3 : e3 + "";
            };
          },
          2140: function(t2, e2, n2) {
            var o2 = {};
            o2[n2(8227)("toStringTag")] = "z", t2.exports = "[object z]" === String(o2);
          },
          655: function(t2, e2, n2) {
            var o2 = n2(6955), r = String;
            t2.exports = function(t3) {
              if ("Symbol" === o2(t3))
                throw new TypeError("Cannot convert a Symbol value to a string");
              return r(t3);
            };
          },
          6823: function(t2) {
            var e2 = String;
            t2.exports = function(t3) {
              try {
                return e2(t3);
              } catch (t4) {
                return "Object";
              }
            };
          },
          3392: function(t2, e2, n2) {
            var o2 = n2(9504), r = 0, i = Math.random(), a = o2(1 .toString);
            t2.exports = function(t3) {
              return "Symbol(" + (void 0 === t3 ? "" : t3) + ")_" + a(++r + i, 36);
            };
          },
          7040: function(t2, e2, n2) {
            var o2 = n2(4495);
            t2.exports = o2 && !Symbol.sham && "symbol" == typeof Symbol.iterator;
          },
          8686: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(9039);
            t2.exports = o2 && r(function() {
              return 42 !== Object.defineProperty(function() {
              }, "prototype", {
                value: 42,
                writable: false
              }).prototype;
            });
          },
          8622: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(4901), i = o2.WeakMap;
            t2.exports = r(i) && /native code/.test(String(i));
          },
          511: function(t2, e2, n2) {
            var o2 = n2(9167), r = n2(9297), i = n2(1951), a = n2(4913).f;
            t2.exports = function(t3) {
              var e3 = o2.Symbol || (o2.Symbol = {});
              r(e3, t3) || a(e3, t3, {
                value: i.f(t3)
              });
            };
          },
          1951: function(t2, e2, n2) {
            var o2 = n2(8227);
            e2.f = o2;
          },
          8227: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(5745), i = n2(9297), a = n2(3392), s = n2(4495), u = n2(7040), c = o2.Symbol, l = r("wks"), f = u ? c.for || c : c && c.withoutSetter || a;
            t2.exports = function(t3) {
              return i(l, t3) || (l[t3] = s && i(c, t3) ? c[t3] : f("Symbol." + t3)), l[t3];
            };
          },
          7452: function(t2) {
            t2.exports = "	\n\v\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
          },
          8706: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9039), i = n2(4376), a = n2(34), s = n2(8981), u = n2(6198), c = n2(6837), l = n2(4659), f = n2(1469), d = n2(597), p2 = n2(8227), h2 = n2(7388), v = p2("isConcatSpreadable"), y = h2 >= 51 || !r(function() {
              var t3 = [];
              return t3[v] = false, t3.concat()[0] !== t3;
            }), g = function(t3) {
              if (!a(t3))
                return false;
              var e3 = t3[v];
              return void 0 !== e3 ? !!e3 : i(t3);
            };
            o2({
              target: "Array",
              proto: true,
              arity: 1,
              forced: !y || !d("concat")
            }, {
              concat: function(t3) {
                var e3, n3, o3, r2, i2, a2 = s(this), d2 = f(a2, 0), p3 = 0;
                for (e3 = -1, o3 = arguments.length; e3 < o3; e3++)
                  if (g(i2 = -1 === e3 ? a2 : arguments[e3]))
                    for (r2 = u(i2), c(p3 + r2), n3 = 0; n3 < r2; n3++, p3++)
                      n3 in i2 && l(d2, p3, i2[n3]);
                  else
                    c(p3 + 1), l(d2, p3++, i2);
                return d2.length = p3, d2;
              }
            });
          },
          2008: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9213).filter;
            o2({
              target: "Array",
              proto: true,
              forced: !n2(597)("filter")
            }, {
              filter: function(t3) {
                return r(this, t3, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
          },
          3418: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(7916);
            o2({
              target: "Array",
              stat: true,
              forced: !n2(4428)(function(t3) {
                Array.from(t3);
              })
            }, {
              from: r
            });
          },
          4423: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9617).includes, i = n2(9039), a = n2(6469);
            o2({
              target: "Array",
              proto: true,
              forced: i(function() {
                return !Array(1).includes();
              })
            }, {
              includes: function(t3) {
                return r(this, t3, arguments.length > 1 ? arguments[1] : void 0);
              }
            }), a("includes");
          },
          5276: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(7476), i = n2(9617).indexOf, a = n2(4598), s = r([].indexOf), u = !!s && 1 / s([
              1
            ], 1, -0) < 0;
            o2({
              target: "Array",
              proto: true,
              forced: u || !a("indexOf")
            }, {
              indexOf: function(t3) {
                var e3 = arguments.length > 1 ? arguments[1] : void 0;
                return u ? s(this, t3, e3) || 0 : i(this, t3, e3);
              }
            });
          },
          3792: function(t2, e2, n2) {
            var o2 = n2(5397), r = n2(6469), i = n2(6269), a = n2(1181), s = n2(4913).f, u = n2(1088), c = n2(2529), l = n2(6395), f = n2(3724), d = "Array Iterator", p2 = a.set, h2 = a.getterFor(d);
            t2.exports = u(Array, "Array", function(t3, e3) {
              p2(this, {
                type: d,
                target: o2(t3),
                index: 0,
                kind: e3
              });
            }, function() {
              var t3 = h2(this), e3 = t3.target, n3 = t3.index++;
              if (!e3 || n3 >= e3.length)
                return t3.target = void 0, c(void 0, true);
              switch (t3.kind) {
                case "keys":
                  return c(n3, false);
                case "values":
                  return c(e3[n3], false);
              }
              return c([
                n3,
                e3[n3]
              ], false);
            }, "values");
            var v = i.Arguments = i.Array;
            if (r("keys"), r("values"), r("entries"), !l && f && "values" !== v.name)
              try {
                s(v, "name", {
                  value: "values"
                });
              } catch (t3) {
              }
          },
          8598: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9504), i = n2(7055), a = n2(5397), s = n2(4598), u = r([].join);
            o2({
              target: "Array",
              proto: true,
              forced: i !== Object || !s("join", ",")
            }, {
              join: function(t3) {
                return u(a(this), void 0 === t3 ? "," : t3);
              }
            });
          },
          2062: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9213).map;
            o2({
              target: "Array",
              proto: true,
              forced: !n2(597)("map")
            }, {
              map: function(t3) {
                return r(this, t3, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
          },
          2712: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(926).left, i = n2(4598), a = n2(7388);
            o2({
              target: "Array",
              proto: true,
              forced: !n2(9088) && a > 79 && a < 83 || !i("reduce")
            }, {
              reduce: function(t3) {
                var e3 = arguments.length;
                return r(this, t3, e3, e3 > 1 ? arguments[1] : void 0);
              }
            });
          },
          4782: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(4376), i = n2(3517), a = n2(34), s = n2(5610), u = n2(6198), c = n2(5397), l = n2(4659), f = n2(8227), d = n2(597), p2 = n2(7680), h2 = d("slice"), v = f("species"), y = Array, g = Math.max;
            o2({
              target: "Array",
              proto: true,
              forced: !h2
            }, {
              slice: function(t3, e3) {
                var n3, o3, f2, d2 = c(this), h3 = u(d2), m = s(t3, h3), b = s(void 0 === e3 ? h3 : e3, h3);
                if (r(d2) && (n3 = d2.constructor, (i(n3) && (n3 === y || r(n3.prototype)) || a(n3) && null === (n3 = n3[v])) && (n3 = void 0), n3 === y || void 0 === n3))
                  return p2(d2, m, b);
                for (o3 = new (void 0 === n3 ? y : n3)(g(b - m, 0)), f2 = 0; m < b; m++, f2++)
                  m in d2 && l(o3, f2, d2[m]);
                return o3.length = f2, o3;
              }
            });
          },
          6910: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9504), i = n2(9306), a = n2(8981), s = n2(6198), u = n2(4606), c = n2(655), l = n2(9039), f = n2(4488), d = n2(4598), p2 = n2(8834), h2 = n2(3202), v = n2(7388), y = n2(9160), g = [], m = r(g.sort), b = r(g.push), x = l(function() {
              g.sort(void 0);
            }), w = l(function() {
              g.sort(null);
            }), E = d("sort"), O = !l(function() {
              if (v)
                return v < 70;
              if (!(p2 && p2 > 3)) {
                if (h2)
                  return true;
                if (y)
                  return y < 603;
                var t3, e3, n3, o3, r2 = "";
                for (t3 = 65; t3 < 76; t3++) {
                  switch (e3 = String.fromCharCode(t3), t3) {
                    case 66:
                    case 69:
                    case 70:
                    case 72:
                      n3 = 3;
                      break;
                    case 68:
                    case 71:
                      n3 = 4;
                      break;
                    default:
                      n3 = 2;
                  }
                  for (o3 = 0; o3 < 47; o3++)
                    g.push({
                      k: e3 + o3,
                      v: n3
                    });
                }
                for (g.sort(function(t4, e4) {
                  return e4.v - t4.v;
                }), o3 = 0; o3 < g.length; o3++)
                  e3 = g[o3].k.charAt(0), r2.charAt(r2.length - 1) !== e3 && (r2 += e3);
                return "DGBEFHACIJK" !== r2;
              }
            });
            o2({
              target: "Array",
              proto: true,
              forced: x || !w || !E || !O
            }, {
              sort: function(t3) {
                void 0 !== t3 && i(t3);
                var e3 = a(this);
                if (O)
                  return void 0 === t3 ? m(e3) : m(e3, t3);
                var n3, o3, r2 = [], l2 = s(e3);
                for (o3 = 0; o3 < l2; o3++)
                  o3 in e3 && b(r2, e3[o3]);
                for (f(r2, /* @__PURE__ */ function(t4) {
                  return function(e4, n4) {
                    return void 0 === n4 ? -1 : void 0 === e4 ? 1 : void 0 !== t4 ? +t4(e4, n4) || 0 : c(e4) > c(n4) ? 1 : -1;
                  };
                }(t3)), n3 = s(r2), o3 = 0; o3 < n3; )
                  e3[o3] = r2[o3++];
                for (; o3 < l2; )
                  u(e3, o3++);
                return e3;
              }
            });
          },
          4554: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(8981), i = n2(5610), a = n2(1291), s = n2(6198), u = n2(4527), c = n2(6837), l = n2(1469), f = n2(4659), d = n2(4606), p2 = n2(597)("splice"), h2 = Math.max, v = Math.min;
            o2({
              target: "Array",
              proto: true,
              forced: !p2
            }, {
              splice: function(t3, e3) {
                var n3, o3, p3, y, g, m, b = r(this), x = s(b), w = i(t3, x), E = arguments.length;
                for (0 === E ? n3 = o3 = 0 : 1 === E ? (n3 = 0, o3 = x - w) : (n3 = E - 2, o3 = v(h2(a(e3), 0), x - w)), c(x + n3 - o3), p3 = l(b, o3), y = 0; y < o3; y++)
                  (g = w + y) in b && f(p3, y, b[g]);
                if (p3.length = o3, n3 < o3) {
                  for (y = w; y < x - o3; y++)
                    m = y + n3, (g = y + o3) in b ? b[m] = b[g] : d(b, m);
                  for (y = x; y > x - o3 + n3; y--)
                    d(b, y - 1);
                } else if (n3 > o3)
                  for (y = x - o3; y > w; y--)
                    m = y + n3 - 1, (g = y + o3 - 1) in b ? b[m] = b[g] : d(b, m);
                for (y = 0; y < n3; y++)
                  b[y + w] = arguments[y + 2];
                return u(b, x - o3 + n3), p3;
              }
            });
          },
          739: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9039), i = n2(8981), a = n2(2777);
            o2({
              target: "Date",
              proto: true,
              arity: 1,
              forced: r(function() {
                return null !== (/* @__PURE__ */ new Date(NaN)).toJSON() || 1 !== Date.prototype.toJSON.call({
                  toISOString: function() {
                    return 1;
                  }
                });
              })
            }, {
              toJSON: function(t3) {
                var e3 = i(this), n3 = a(e3, "number");
                return "number" != typeof n3 || isFinite(n3) ? e3.toISOString() : null;
              }
            });
          },
          9572: function(t2, e2, n2) {
            var o2 = n2(9297), r = n2(6840), i = n2(3640), a = n2(8227)("toPrimitive"), s = Date.prototype;
            o2(s, a) || r(s, a, i);
          },
          2010: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(350).EXISTS, i = n2(9504), a = n2(2106), s = Function.prototype, u = i(s.toString), c = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/, l = i(c.exec);
            o2 && !r && a(s, "name", {
              configurable: true,
              get: function() {
                try {
                  return l(c, u(this))[1];
                } catch (t3) {
                  return "";
                }
              }
            });
          },
          3110: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(7751), i = n2(8745), a = n2(9565), s = n2(9504), u = n2(9039), c = n2(4901), l = n2(757), f = n2(7680), d = n2(6933), p2 = n2(4495), h2 = String, v = r("JSON", "stringify"), y = s(/./.exec), g = s("".charAt), m = s("".charCodeAt), b = s("".replace), x = s(1 .toString), w = /[\uD800-\uDFFF]/g, E = /^[\uD800-\uDBFF]$/, O = /^[\uDC00-\uDFFF]$/, S = !p2 || u(function() {
              var t3 = r("Symbol")("stringify detection");
              return "[null]" !== v([
                t3
              ]) || "{}" !== v({
                a: t3
              }) || "{}" !== v(Object(t3));
            }), k = u(function() {
              return '"\\udf06\\ud834"' !== v("\uDF06\uD834") || '"\\udead"' !== v("\uDEAD");
            }), P = function(t3, e3) {
              var n3 = f(arguments), o3 = d(e3);
              if (c(o3) || void 0 !== t3 && !l(t3))
                return n3[1] = function(t4, e4) {
                  if (c(o3) && (e4 = a(o3, this, h2(t4), e4)), !l(e4))
                    return e4;
                }, i(v, null, n3);
            }, I = function(t3, e3, n3) {
              var o3 = g(n3, e3 - 1), r2 = g(n3, e3 + 1);
              return y(E, t3) && !y(O, r2) || y(O, t3) && !y(E, o3) ? "\\u" + x(m(t3, 0), 16) : t3;
            };
            v && o2({
              target: "JSON",
              stat: true,
              arity: 3,
              forced: S || k
            }, {
              stringify: function(t3, e3, n3) {
                var o3 = f(arguments), r2 = i(S ? P : v, null, o3);
                return k && "string" == typeof r2 ? b(r2, w, I) : r2;
              }
            });
          },
          2892: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(6395), i = n2(3724), a = n2(4475), s = n2(9167), u = n2(9504), c = n2(2796), l = n2(9297), f = n2(3167), d = n2(1625), p2 = n2(757), h2 = n2(2777), v = n2(9039), y = n2(8480).f, g = n2(7347).f, m = n2(4913).f, b = n2(1240), x = n2(3802).trim, w = "Number", E = a[w], O = s[w], S = E.prototype, k = a.TypeError, P = u("".slice), I = u("".charCodeAt), C = function(t3) {
              var e3, n3, o3, r2, i2, a2, s2, u2, c2 = h2(t3, "number");
              if (p2(c2))
                throw new k("Cannot convert a Symbol value to a number");
              if ("string" == typeof c2 && c2.length > 2) {
                if (c2 = x(c2), 43 === (e3 = I(c2, 0)) || 45 === e3) {
                  if (88 === (n3 = I(c2, 2)) || 120 === n3)
                    return NaN;
                } else if (48 === e3) {
                  switch (I(c2, 1)) {
                    case 66:
                    case 98:
                      o3 = 2, r2 = 49;
                      break;
                    case 79:
                    case 111:
                      o3 = 8, r2 = 55;
                      break;
                    default:
                      return +c2;
                  }
                  for (a2 = (i2 = P(c2, 2)).length, s2 = 0; s2 < a2; s2++)
                    if ((u2 = I(i2, s2)) < 48 || u2 > r2)
                      return NaN;
                  return parseInt(i2, o3);
                }
              }
              return +c2;
            }, A = c(w, !E(" 0o1") || !E("0b1") || E("+0x1")), M = function(t3) {
              var e3, n3 = arguments.length < 1 ? 0 : E(function(t4) {
                var e4 = h2(t4, "number");
                return "bigint" == typeof e4 ? e4 : C(e4);
              }(t3));
              return d(S, e3 = this) && v(function() {
                b(e3);
              }) ? f(Object(n3), this, M) : n3;
            };
            M.prototype = S, A && !r && (S.constructor = M), o2({
              global: true,
              constructor: true,
              wrap: true,
              forced: A
            }, {
              Number: M
            });
            var T = function(t3, e3) {
              for (var n3, o3 = i ? y(e3) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","), r2 = 0; o3.length > r2; r2++)
                l(e3, n3 = o3[r2]) && !l(t3, n3) && m(t3, n3, g(e3, n3));
            };
            r && O && T(s[w], O), (A || r) && T(s[w], E);
          },
          2637: function(t2, e2, n2) {
            n2(6518)({
              target: "Number",
              stat: true
            }, {
              isInteger: n2(2087)
            });
          },
          9085: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(4213);
            o2({
              target: "Object",
              stat: true,
              arity: 2,
              forced: Object.assign !== r
            }, {
              assign: r
            });
          },
          7427: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(3724), i = n2(2551), a = n2(9306), s = n2(8981), u = n2(4913);
            r && o2({
              target: "Object",
              proto: true,
              forced: i
            }, {
              __defineGetter__: function(t3, e3) {
                u.f(s(this), t3, {
                  get: a(e3),
                  enumerable: true,
                  configurable: true
                });
              }
            });
          },
          3851: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9039), i = n2(5397), a = n2(7347).f, s = n2(3724);
            o2({
              target: "Object",
              stat: true,
              forced: !s || r(function() {
                a(1);
              }),
              sham: !s
            }, {
              getOwnPropertyDescriptor: function(t3, e3) {
                return a(i(t3), e3);
              }
            });
          },
          1278: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(3724), i = n2(5031), a = n2(5397), s = n2(7347), u = n2(4659);
            o2({
              target: "Object",
              stat: true,
              sham: !r
            }, {
              getOwnPropertyDescriptors: function(t3) {
                for (var e3, n3, o3 = a(t3), r2 = s.f, c = i(o3), l = {}, f = 0; c.length > f; )
                  void 0 !== (n3 = r2(o3, e3 = c[f++])) && u(l, e3, n3);
                return l;
              }
            });
          },
          1480: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9039), i = n2(298).f;
            o2({
              target: "Object",
              stat: true,
              forced: r(function() {
                return !Object.getOwnPropertyNames(1);
              })
            }, {
              getOwnPropertyNames: i
            });
          },
          9773: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(4495), i = n2(9039), a = n2(3717), s = n2(8981);
            o2({
              target: "Object",
              stat: true,
              forced: !r || i(function() {
                a.f(1);
              })
            }, {
              getOwnPropertySymbols: function(t3) {
                var e3 = a.f;
                return e3 ? e3(s(t3)) : [];
              }
            });
          },
          9432: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(8981), i = n2(1072);
            o2({
              target: "Object",
              stat: true,
              forced: n2(9039)(function() {
                i(1);
              })
            }, {
              keys: function(t3) {
                return i(r(t3));
              }
            });
          },
          6099: function(t2, e2, n2) {
            var o2 = n2(2140), r = n2(6840), i = n2(3179);
            o2 || r(Object.prototype, "toString", i, {
              unsafe: true
            });
          },
          4864: function(t2, e2, n2) {
            var o2 = n2(3724), r = n2(4475), i = n2(9504), a = n2(2796), s = n2(3167), u = n2(6699), c = n2(2360), l = n2(8480).f, f = n2(1625), d = n2(788), p2 = n2(655), h2 = n2(1034), v = n2(8429), y = n2(1056), g = n2(6840), m = n2(9039), b = n2(9297), x = n2(1181).enforce, w = n2(7633), E = n2(8227), O = n2(3635), S = n2(8814), k = E("match"), P = r.RegExp, I = P.prototype, C = r.SyntaxError, A = i(I.exec), M = i("".charAt), T = i("".replace), D = i("".indexOf), N = i("".slice), j = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/, R = /a/g, L = /a/g, B = new P(R) !== R, K = v.MISSED_STICKY, F = v.UNSUPPORTED_Y, _2 = o2 && (!B || K || O || S || m(function() {
              return L[k] = false, P(R) !== R || P(L) === L || "/a/i" !== String(P(R, "i"));
            }));
            if (a("RegExp", _2)) {
              for (var H = function(t3, e3) {
                var n3, o3, r2, i2, a2, l2, v2 = f(I, this), y2 = d(t3), g2 = void 0 === e3, m2 = [], w2 = t3;
                if (!v2 && y2 && g2 && t3.constructor === H)
                  return t3;
                if ((y2 || f(I, t3)) && (t3 = t3.source, g2 && (e3 = h2(w2))), t3 = void 0 === t3 ? "" : p2(t3), e3 = void 0 === e3 ? "" : p2(e3), w2 = t3, O && "dotAll" in R && (o3 = !!e3 && D(e3, "s") > -1) && (e3 = T(e3, /s/g, "")), n3 = e3, K && "sticky" in R && (r2 = !!e3 && D(e3, "y") > -1) && F && (e3 = T(e3, /y/g, "")), S && (i2 = function(t4) {
                  for (var e4, n4 = t4.length, o4 = 0, r3 = "", i3 = [], a3 = c(null), s2 = false, u2 = false, l3 = 0, f2 = ""; o4 <= n4; o4++) {
                    if ("\\" === (e4 = M(t4, o4)))
                      e4 += M(t4, ++o4);
                    else if ("]" === e4)
                      s2 = false;
                    else if (!s2)
                      switch (true) {
                        case "[" === e4:
                          s2 = true;
                          break;
                        case "(" === e4:
                          A(j, N(t4, o4 + 1)) && (o4 += 2, u2 = true), r3 += e4, l3++;
                          continue;
                        case (">" === e4 && u2):
                          if ("" === f2 || b(a3, f2))
                            throw new C("Invalid capture group name");
                          a3[f2] = true, i3[i3.length] = [
                            f2,
                            l3
                          ], u2 = false, f2 = "";
                          continue;
                      }
                    u2 ? f2 += e4 : r3 += e4;
                  }
                  return [
                    r3,
                    i3
                  ];
                }(t3), t3 = i2[0], m2 = i2[1]), a2 = s(P(t3, e3), v2 ? this : I, H), (o3 || r2 || m2.length) && (l2 = x(a2), o3 && (l2.dotAll = true, l2.raw = H(function(t4) {
                  for (var e4, n4 = t4.length, o4 = 0, r3 = "", i3 = false; o4 <= n4; o4++)
                    "\\" !== (e4 = M(t4, o4)) ? i3 || "." !== e4 ? ("[" === e4 ? i3 = true : "]" === e4 && (i3 = false), r3 += e4) : r3 += "[\\s\\S]" : r3 += e4 + M(t4, ++o4);
                  return r3;
                }(t3), n3)), r2 && (l2.sticky = true), m2.length && (l2.groups = m2)), t3 !== w2)
                  try {
                    u(a2, "source", "" === w2 ? "(?:)" : w2);
                  } catch (t4) {
                  }
                return a2;
              }, U = l(P), $ = 0; U.length > $; )
                y(H, P, U[$++]);
              I.constructor = H, H.prototype = I, g(r, "RegExp", H, {
                constructor: true
              });
            }
            w("RegExp");
          },
          7495: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(7323);
            o2({
              target: "RegExp",
              proto: true,
              forced: /./.exec !== r
            }, {
              exec: r
            });
          },
          8781: function(t2, e2, n2) {
            var o2 = n2(350).PROPER, r = n2(6840), i = n2(8551), a = n2(655), s = n2(9039), u = n2(1034), c = "toString", l = RegExp.prototype, f = l[c], d = s(function() {
              return "/a/b" !== f.call({
                source: "a",
                flags: "b"
              });
            }), p2 = o2 && f.name !== c;
            (d || p2) && r(l, c, function() {
              var t3 = i(this);
              return "/" + a(t3.source) + "/" + a(u(t3));
            }, {
              unsafe: true
            });
          },
          1699: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9504), i = n2(5749), a = n2(7750), s = n2(655), u = n2(1436), c = r("".indexOf);
            o2({
              target: "String",
              proto: true,
              forced: !u("includes")
            }, {
              includes: function(t3) {
                return !!~c(s(a(this)), s(i(t3)), arguments.length > 1 ? arguments[1] : void 0);
              }
            });
          },
          7764: function(t2, e2, n2) {
            var o2 = n2(8183).charAt, r = n2(655), i = n2(1181), a = n2(1088), s = n2(2529), u = "String Iterator", c = i.set, l = i.getterFor(u);
            a(String, "String", function(t3) {
              c(this, {
                type: u,
                string: r(t3),
                index: 0
              });
            }, function() {
              var t3, e3 = l(this), n3 = e3.string, r2 = e3.index;
              return r2 >= n3.length ? s(void 0, true) : (t3 = o2(n3, r2), e3.index += t3.length, s(t3, false));
            });
          },
          8543: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9565), i = n2(7476), a = n2(3994), s = n2(2529), u = n2(7750), c = n2(8014), l = n2(655), f = n2(8551), d = n2(4117), p2 = n2(4576), h2 = n2(788), v = n2(1034), y = n2(5966), g = n2(6840), m = n2(9039), b = n2(8227), x = n2(2293), w = n2(7829), E = n2(6682), O = n2(1181), S = n2(6395), k = b("matchAll"), P = "RegExp String", I = P + " Iterator", C = O.set, A = O.getterFor(I), M = RegExp.prototype, T = TypeError, D = i("".indexOf), N = i("".matchAll), j = !!N && !m(function() {
              N("a", /./);
            }), R = a(function(t3, e3, n3, o3) {
              C(this, {
                type: I,
                regexp: t3,
                string: e3,
                global: n3,
                unicode: o3,
                done: false
              });
            }, P, function() {
              var t3 = A(this);
              if (t3.done)
                return s(void 0, true);
              var e3 = t3.regexp, n3 = t3.string, o3 = E(e3, n3);
              return null === o3 ? (t3.done = true, s(void 0, true)) : t3.global ? ("" === l(o3[0]) && (e3.lastIndex = w(n3, c(e3.lastIndex), t3.unicode)), s(o3, false)) : (t3.done = true, s(o3, false));
            }), L = function(t3) {
              var e3, n3, o3, r2 = f(this), i2 = l(t3), a2 = x(r2, RegExp), s2 = l(v(r2));
              return e3 = new a2(a2 === RegExp ? r2.source : r2, s2), n3 = !!~D(s2, "g"), o3 = !!~D(s2, "u"), e3.lastIndex = c(r2.lastIndex), new R(e3, i2, n3, o3);
            };
            o2({
              target: "String",
              proto: true,
              forced: j
            }, {
              matchAll: function(t3) {
                var e3, n3, o3, i2, a2 = u(this);
                if (d(t3)) {
                  if (j)
                    return N(a2, t3);
                } else {
                  if (h2(t3) && (e3 = l(u(v(t3))), !~D(e3, "g")))
                    throw new T("`.matchAll` does not allow non-global regexes");
                  if (j)
                    return N(a2, t3);
                  if (void 0 === (o3 = y(t3, k)) && S && "RegExp" === p2(t3) && (o3 = L), o3)
                    return r(o3, t3, a2);
                }
                return n3 = l(a2), i2 = new RegExp(t3, "g"), S ? r(L, i2, n3) : i2[k](n3);
              }
            }), S || k in M || g(M, k, L);
          },
          1761: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(9228), i = n2(8551), a = n2(4117), s = n2(8014), u = n2(655), c = n2(7750), l = n2(5966), f = n2(7829), d = n2(6682);
            r("match", function(t3, e3, n3) {
              return [
                function(e4) {
                  var n4 = c(this), r2 = a(e4) ? void 0 : l(e4, t3);
                  return r2 ? o2(r2, e4, n4) : new RegExp(e4)[t3](u(n4));
                },
                function(t4) {
                  var o3 = i(this), r2 = u(t4), a2 = n3(e3, o3, r2);
                  if (a2.done)
                    return a2.value;
                  if (!o3.global)
                    return d(o3, r2);
                  var c2 = o3.unicode;
                  o3.lastIndex = 0;
                  for (var l2, p2 = [], h2 = 0; null !== (l2 = d(o3, r2)); ) {
                    var v = u(l2[0]);
                    p2[h2] = v, "" === v && (o3.lastIndex = f(r2, s(o3.lastIndex), c2)), h2++;
                  }
                  return 0 === h2 ? null : p2;
                }
              ];
            });
          },
          5440: function(t2, e2, n2) {
            var o2 = n2(8745), r = n2(9565), i = n2(9504), a = n2(9228), s = n2(9039), u = n2(8551), c = n2(4901), l = n2(4117), f = n2(1291), d = n2(8014), p2 = n2(655), h2 = n2(7750), v = n2(7829), y = n2(5966), g = n2(2478), m = n2(6682), b = n2(8227)("replace"), x = Math.max, w = Math.min, E = i([].concat), O = i([].push), S = i("".indexOf), k = i("".slice), P = "$0" === "a".replace(/./, "$0"), I = !!/./[b] && "" === /./[b]("a", "$0");
            a("replace", function(t3, e3, n3) {
              var i2 = I ? "$" : "$0";
              return [
                function(t4, n4) {
                  var o3 = h2(this), i3 = l(t4) ? void 0 : y(t4, b);
                  return i3 ? r(i3, t4, o3, n4) : r(e3, p2(o3), t4, n4);
                },
                function(t4, r2) {
                  var a2 = u(this), s2 = p2(t4);
                  if ("string" == typeof r2 && -1 === S(r2, i2) && -1 === S(r2, "$<")) {
                    var l2 = n3(e3, a2, s2, r2);
                    if (l2.done)
                      return l2.value;
                  }
                  var h3 = c(r2);
                  h3 || (r2 = p2(r2));
                  var y2, b2 = a2.global;
                  b2 && (y2 = a2.unicode, a2.lastIndex = 0);
                  for (var P2, I2 = []; null !== (P2 = m(a2, s2)) && (O(I2, P2), b2); ) {
                    "" === p2(P2[0]) && (a2.lastIndex = v(s2, d(a2.lastIndex), y2));
                  }
                  for (var C, A = "", M = 0, T = 0; T < I2.length; T++) {
                    for (var D, N = p2((P2 = I2[T])[0]), j = x(w(f(P2.index), s2.length), 0), R = [], L = 1; L < P2.length; L++)
                      O(R, void 0 === (C = P2[L]) ? C : String(C));
                    var B = P2.groups;
                    if (h3) {
                      var K = E([
                        N
                      ], R, j, s2);
                      void 0 !== B && O(K, B), D = p2(o2(r2, void 0, K));
                    } else
                      D = g(N, s2, j, R, B, r2);
                    j >= M && (A += k(s2, M, j) + D, M = j + N.length);
                  }
                  return A + k(s2, M);
                }
              ];
            }, !!s(function() {
              var t3 = /./;
              return t3.exec = function() {
                var t4 = [];
                return t4.groups = {
                  a: "7"
                }, t4;
              }, "7" !== "".replace(t3, "$<a>");
            }) || !P || I);
          },
          744: function(t2, e2, n2) {
            var o2 = n2(9565), r = n2(9504), i = n2(9228), a = n2(8551), s = n2(4117), u = n2(7750), c = n2(2293), l = n2(7829), f = n2(8014), d = n2(655), p2 = n2(5966), h2 = n2(6682), v = n2(8429), y = n2(9039), g = v.UNSUPPORTED_Y, m = Math.min, b = r([].push), x = r("".slice), w = !y(function() {
              var t3 = /(?:)/, e3 = t3.exec;
              t3.exec = function() {
                return e3.apply(this, arguments);
              };
              var n3 = "ab".split(t3);
              return 2 !== n3.length || "a" !== n3[0] || "b" !== n3[1];
            }), E = "c" === "abbc".split(/(b)*/)[1] || 4 !== "test".split(/(?:)/, -1).length || 2 !== "ab".split(/(?:ab)*/).length || 4 !== ".".split(/(.?)(.?)/).length || ".".split(/()()/).length > 1 || "".split(/.?/).length;
            i("split", function(t3, e3, n3) {
              var r2 = "0".split(void 0, 0).length ? function(t4, n4) {
                return void 0 === t4 && 0 === n4 ? [] : o2(e3, this, t4, n4);
              } : e3;
              return [
                function(e4, n4) {
                  var i2 = u(this), a2 = s(e4) ? void 0 : p2(e4, t3);
                  return a2 ? o2(a2, e4, i2, n4) : o2(r2, d(i2), e4, n4);
                },
                function(t4, o3) {
                  var i2 = a(this), s2 = d(t4);
                  if (!E) {
                    var u2 = n3(r2, i2, s2, o3, r2 !== e3);
                    if (u2.done)
                      return u2.value;
                  }
                  var p3 = c(i2, RegExp), v2 = i2.unicode, y2 = (i2.ignoreCase ? "i" : "") + (i2.multiline ? "m" : "") + (i2.unicode ? "u" : "") + (g ? "g" : "y"), w2 = new p3(g ? "^(?:" + i2.source + ")" : i2, y2), O = void 0 === o3 ? 4294967295 : o3 >>> 0;
                  if (0 === O)
                    return [];
                  if (0 === s2.length)
                    return null === h2(w2, s2) ? [
                      s2
                    ] : [];
                  for (var S = 0, k = 0, P = []; k < s2.length; ) {
                    w2.lastIndex = g ? 0 : k;
                    var I, C = h2(w2, g ? x(s2, k) : s2);
                    if (null === C || (I = m(f(w2.lastIndex + (g ? k : 0)), s2.length)) === S)
                      k = l(s2, k, v2);
                    else {
                      if (b(P, x(s2, S, k)), P.length === O)
                        return P;
                      for (var A = 1; A <= C.length - 1; A++)
                        if (b(P, C[A]), P.length === O)
                          return P;
                      k = S = I;
                    }
                  }
                  return b(P, x(s2, S)), P;
                }
              ];
            }, E || !w, g);
          },
          2762: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(3802).trim;
            o2({
              target: "String",
              proto: true,
              forced: n2(706)("trim")
            }, {
              trim: function() {
                return r(this);
              }
            });
          },
          6761: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(4475), i = n2(9565), a = n2(9504), s = n2(6395), u = n2(3724), c = n2(4495), l = n2(9039), f = n2(9297), d = n2(1625), p2 = n2(8551), h2 = n2(5397), v = n2(6969), y = n2(655), g = n2(6980), m = n2(2360), b = n2(1072), x = n2(8480), w = n2(298), E = n2(3717), O = n2(7347), S = n2(4913), k = n2(6801), P = n2(8773), I = n2(6840), C = n2(2106), A = n2(5745), M = n2(6119), T = n2(421), D = n2(3392), N = n2(8227), j = n2(1951), R = n2(511), L = n2(8242), B = n2(687), K = n2(1181), F = n2(9213).forEach, _2 = M("hidden"), H = "Symbol", U = "prototype", $ = K.set, G = K.getterFor(H), V = Object[U], z = r.Symbol, Y = z && z[U], W = r.RangeError, J = r.TypeError, X = r.QObject, q = O.f, Q = S.f, Z = w.f, tt = P.f, et = a([].push), nt = A("symbols"), ot = A("op-symbols"), rt = A("wks"), it = !X || !X[U] || !X[U].findChild, at = function(t3, e3, n3) {
              var o3 = q(V, e3);
              o3 && delete V[e3], Q(t3, e3, n3), o3 && t3 !== V && Q(V, e3, o3);
            }, st = u && l(function() {
              return 7 !== m(Q({}, "a", {
                get: function() {
                  return Q(this, "a", {
                    value: 7
                  }).a;
                }
              })).a;
            }) ? at : Q, ut = function(t3, e3) {
              var n3 = nt[t3] = m(Y);
              return $(n3, {
                type: H,
                tag: t3,
                description: e3
              }), u || (n3.description = e3), n3;
            }, ct = function(t3, e3, n3) {
              t3 === V && ct(ot, e3, n3), p2(t3);
              var o3 = v(e3);
              return p2(n3), f(nt, o3) ? (n3.enumerable ? (f(t3, _2) && t3[_2][o3] && (t3[_2][o3] = false), n3 = m(n3, {
                enumerable: g(0, false)
              })) : (f(t3, _2) || Q(t3, _2, g(1, m(null))), t3[_2][o3] = true), st(t3, o3, n3)) : Q(t3, o3, n3);
            }, lt = function(t3, e3) {
              p2(t3);
              var n3 = h2(e3), o3 = b(n3).concat(ht(n3));
              return F(o3, function(e4) {
                u && !i(ft, n3, e4) || ct(t3, e4, n3[e4]);
              }), t3;
            }, ft = function(t3) {
              var e3 = v(t3), n3 = i(tt, this, e3);
              return !(this === V && f(nt, e3) && !f(ot, e3)) && (!(n3 || !f(this, e3) || !f(nt, e3) || f(this, _2) && this[_2][e3]) || n3);
            }, dt = function(t3, e3) {
              var n3 = h2(t3), o3 = v(e3);
              if (n3 !== V || !f(nt, o3) || f(ot, o3)) {
                var r2 = q(n3, o3);
                return !r2 || !f(nt, o3) || f(n3, _2) && n3[_2][o3] || (r2.enumerable = true), r2;
              }
            }, pt = function(t3) {
              var e3 = Z(h2(t3)), n3 = [];
              return F(e3, function(t4) {
                f(nt, t4) || f(T, t4) || et(n3, t4);
              }), n3;
            }, ht = function(t3) {
              var e3 = t3 === V, n3 = Z(e3 ? ot : h2(t3)), o3 = [];
              return F(n3, function(t4) {
                !f(nt, t4) || e3 && !f(V, t4) || et(o3, nt[t4]);
              }), o3;
            };
            c || (z = function() {
              if (d(Y, this))
                throw new J("Symbol is not a constructor");
              var t3 = arguments.length && void 0 !== arguments[0] ? y(arguments[0]) : void 0, e3 = D(t3), n3 = function(t4) {
                var o3 = void 0 === this ? r : this;
                o3 === V && i(n3, ot, t4), f(o3, _2) && f(o3[_2], e3) && (o3[_2][e3] = false);
                var a2 = g(1, t4);
                try {
                  st(o3, e3, a2);
                } catch (t5) {
                  if (!(t5 instanceof W))
                    throw t5;
                  at(o3, e3, a2);
                }
              };
              return u && it && st(V, e3, {
                configurable: true,
                set: n3
              }), ut(e3, t3);
            }, I(Y = z[U], "toString", function() {
              return G(this).tag;
            }), I(z, "withoutSetter", function(t3) {
              return ut(D(t3), t3);
            }), P.f = ft, S.f = ct, k.f = lt, O.f = dt, x.f = w.f = pt, E.f = ht, j.f = function(t3) {
              return ut(N(t3), t3);
            }, u && (C(Y, "description", {
              configurable: true,
              get: function() {
                return G(this).description;
              }
            }), s || I(V, "propertyIsEnumerable", ft, {
              unsafe: true
            }))), o2({
              global: true,
              constructor: true,
              wrap: true,
              forced: !c,
              sham: !c
            }, {
              Symbol: z
            }), F(b(rt), function(t3) {
              R(t3);
            }), o2({
              target: H,
              stat: true,
              forced: !c
            }, {
              useSetter: function() {
                it = true;
              },
              useSimple: function() {
                it = false;
              }
            }), o2({
              target: "Object",
              stat: true,
              forced: !c,
              sham: !u
            }, {
              create: function(t3, e3) {
                return void 0 === e3 ? m(t3) : lt(m(t3), e3);
              },
              defineProperty: ct,
              defineProperties: lt,
              getOwnPropertyDescriptor: dt
            }), o2({
              target: "Object",
              stat: true,
              forced: !c
            }, {
              getOwnPropertyNames: pt
            }), L(), B(z, H), T[_2] = true;
          },
          9463: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(3724), i = n2(4475), a = n2(9504), s = n2(9297), u = n2(4901), c = n2(1625), l = n2(655), f = n2(2106), d = n2(7740), p2 = i.Symbol, h2 = p2 && p2.prototype;
            if (r && u(p2) && (!("description" in h2) || void 0 !== p2().description)) {
              var v = {}, y = function() {
                var t3 = arguments.length < 1 || void 0 === arguments[0] ? void 0 : l(arguments[0]), e3 = c(h2, this) ? new p2(t3) : void 0 === t3 ? p2() : p2(t3);
                return "" === t3 && (v[e3] = true), e3;
              };
              d(y, p2), y.prototype = h2, h2.constructor = y;
              var g = "Symbol(description detection)" === String(p2("description detection")), m = a(h2.valueOf), b = a(h2.toString), x = /^Symbol\((.*)\)[^)]+$/, w = a("".replace), E = a("".slice);
              f(h2, "description", {
                configurable: true,
                get: function() {
                  var t3 = m(this);
                  if (s(v, t3))
                    return "";
                  var e3 = b(t3), n3 = g ? E(e3, 7, -1) : w(e3, x, "$1");
                  return "" === n3 ? void 0 : n3;
                }
              }), o2({
                global: true,
                constructor: true,
                forced: true
              }, {
                Symbol: y
              });
            }
          },
          1510: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(7751), i = n2(9297), a = n2(655), s = n2(5745), u = n2(1296), c = s("string-to-symbol-registry"), l = s("symbol-to-string-registry");
            o2({
              target: "Symbol",
              stat: true,
              forced: !u
            }, {
              for: function(t3) {
                var e3 = a(t3);
                if (i(c, e3))
                  return c[e3];
                var n3 = r("Symbol")(e3);
                return c[e3] = n3, l[n3] = e3, n3;
              }
            });
          },
          2259: function(t2, e2, n2) {
            n2(511)("iterator");
          },
          2675: function(t2, e2, n2) {
            n2(6761), n2(1510), n2(7812), n2(3110), n2(9773);
          },
          7812: function(t2, e2, n2) {
            var o2 = n2(6518), r = n2(9297), i = n2(757), a = n2(6823), s = n2(5745), u = n2(1296), c = s("symbol-to-string-registry");
            o2({
              target: "Symbol",
              stat: true,
              forced: !u
            }, {
              keyFor: function(t3) {
                if (!i(t3))
                  throw new TypeError(a(t3) + " is not a symbol");
                if (r(c, t3))
                  return c[t3];
              }
            });
          },
          5700: function(t2, e2, n2) {
            var o2 = n2(511), r = n2(8242);
            o2("toPrimitive"), r();
          },
          8344: function(t2, e2, n2) {
            n2(8543);
          },
          3500: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(7400), i = n2(9296), a = n2(235), s = n2(6699), u = function(t3) {
              if (t3 && t3.forEach !== a)
                try {
                  s(t3, "forEach", a);
                } catch (e3) {
                  t3.forEach = a;
                }
            };
            for (var c in r)
              r[c] && u(o2[c] && o2[c].prototype);
            u(i);
          },
          2953: function(t2, e2, n2) {
            var o2 = n2(4475), r = n2(7400), i = n2(9296), a = n2(3792), s = n2(6699), u = n2(687), c = n2(8227)("iterator"), l = a.values, f = function(t3, e3) {
              if (t3) {
                if (t3[c] !== l)
                  try {
                    s(t3, c, l);
                  } catch (e4) {
                    t3[c] = l;
                  }
                if (u(t3, e3, true), r[e3]) {
                  for (var n3 in a)
                    if (t3[n3] !== a[n3])
                      try {
                        s(t3, n3, a[n3]);
                      } catch (e4) {
                        t3[n3] = a[n3];
                      }
                }
              }
            };
            for (var d in r)
              f(o2[d] && o2[d].prototype, d);
            f(i, "DOMTokenList");
          }
        }, e = {};
        function n(o2) {
          var r = e[o2];
          if (void 0 !== r)
            return r.exports;
          var i = e[o2] = {
            exports: {}
          };
          return t[o2].call(i.exports, i, i.exports, n), i.exports;
        }
        n.d = function(t2, e2) {
          for (var o2 in e2)
            n.o(e2, o2) && !n.o(t2, o2) && Object.defineProperty(t2, o2, {
              enumerable: true,
              get: e2[o2]
            });
        }, n.g = function() {
          if ("object" == typeof globalThis)
            return globalThis;
          try {
            return this || new Function("return this")();
          } catch (t2) {
            if ("object" == typeof window)
              return window;
          }
        }(), n.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, n.r = function(t2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, {
            value: "Module"
          }), Object.defineProperty(t2, "__esModule", {
            value: true
          });
        };
        var o = {};
        return function() {
          n.r(o), n.d(o, {
            SimpleKeyboard: function() {
              return M;
            },
            default: function() {
              return T;
            }
          });
          n(5276), n(8598), n(4782), n(4554), n(2010), n(7427), n(6099), n(7495), n(8781), n(5440), n(744), n(2762);
          "undefined" == typeof Element || "remove" in Element.prototype || (Element.prototype.remove = function() {
            this.parentNode && this.parentNode.removeChild(this);
          }), "undefined" != typeof self && "document" in self && ((!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) && function(t3) {
            if ("Element" in t3) {
              var e3 = "classList", n2 = "prototype", o2 = t3.Element[n2], r2 = Object, i2 = String[n2].trim || function() {
                return this.replace(/^\s+|\s+$/g, "");
              }, a2 = Array[n2].indexOf || function(t4) {
                for (var e4 = 0, n3 = this.length; e4 < n3; e4++)
                  if (e4 in this && this[e4] === t4)
                    return e4;
                return -1;
              }, s2 = function(t4, e4) {
                this.name = t4, this.code = DOMException[t4], this.message = e4;
              }, u2 = function(t4, e4) {
                if ("" === e4)
                  throw new s2("SYNTAX_ERR", "The token must not be empty.");
                if (/\s/.test(e4))
                  throw new s2("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
                return a2.call(t4, e4);
              }, c2 = function(t4) {
                for (var e4 = i2.call(t4.getAttribute("class") || ""), n3 = e4 ? e4.split(/\s+/) : [], o3 = 0, r3 = n3.length; o3 < r3; o3++)
                  this.push(n3[o3]);
                this._updateClassName = function() {
                  t4.setAttribute("class", this.toString());
                };
              }, l2 = c2[n2] = [], f2 = function() {
                return new c2(this);
              };
              if (s2[n2] = Error[n2], l2.item = function(t4) {
                return this[t4] || null;
              }, l2.contains = function(t4) {
                return ~u2(this, t4 + "");
              }, l2.add = function() {
                var t4, e4 = arguments, n3 = 0, o3 = e4.length, r3 = false;
                do {
                  ~u2(this, t4 = e4[n3] + "") || (this.push(t4), r3 = true);
                } while (++n3 < o3);
                r3 && this._updateClassName();
              }, l2.remove = function() {
                var t4, e4, n3 = arguments, o3 = 0, r3 = n3.length, i3 = false;
                do {
                  for (e4 = u2(this, t4 = n3[o3] + ""); ~e4; )
                    this.splice(e4, 1), i3 = true, e4 = u2(this, t4);
                } while (++o3 < r3);
                i3 && this._updateClassName();
              }, l2.toggle = function(t4, e4) {
                var n3 = this.contains(t4), o3 = n3 ? true !== e4 && "remove" : false !== e4 && "add";
                return o3 && this[o3](t4), true === e4 || false === e4 ? e4 : !n3;
              }, l2.replace = function(t4, e4) {
                var n3 = u2(t4 + "");
                ~n3 && (this.splice(n3, 1, e4), this._updateClassName());
              }, l2.toString = function() {
                return this.join(" ");
              }, r2.defineProperty) {
                var d2 = {
                  get: f2,
                  enumerable: true,
                  configurable: true
                };
                try {
                  r2.defineProperty(o2, e3, d2);
                } catch (t4) {
                  void 0 !== t4.number && -2146823252 !== t4.number || (d2.enumerable = false, r2.defineProperty(o2, e3, d2));
                }
              } else
                r2[n2].__defineGetter__ && o2.__defineGetter__(e3, f2);
            }
          }(self), function() {
            var t3 = document.createElement("_");
            if (t3.classList.add("c1", "c2"), !t3.classList.contains("c2")) {
              var e3 = function(t4) {
                var e4 = DOMTokenList.prototype[t4];
                DOMTokenList.prototype[t4] = function(t5) {
                  var n3, o2 = arguments.length;
                  for (n3 = 0; n3 < o2; n3++)
                    t5 = arguments[n3], e4.call(this, t5);
                };
              };
              e3("add"), e3("remove");
            }
            if (t3.classList.toggle("c3", false), t3.classList.contains("c3")) {
              var n2 = DOMTokenList.prototype.toggle;
              DOMTokenList.prototype.toggle = function(t4, e4) {
                return 1 in arguments && !this.contains(t4) == !e4 ? e4 : n2.call(this, t4);
              };
            }
            "replace" in document.createElement("_").classList || (DOMTokenList.prototype.replace = function(t4, e4) {
              var n3 = this.toString().split(" "), o2 = n3.indexOf(t4 + "");
              ~o2 && (n3 = n3.slice(o2), this.remove.apply(this, n3), this.add(e4), this.add.apply(this, n3.slice(1)));
            }), t3 = null;
          }());
          n(2675), n(9463), n(2259), n(5700), n(8706), n(2008), n(3418), n(4423), n(3792), n(2062), n(6910), n(739), n(9572), n(2892), n(9085), n(3851), n(1278), n(9432), n(4864), n(1699), n(7764), n(8344), n(3500), n(2953), n(2712), n(2637), n(1480), n(1761);
          function t2(t3) {
            return function(t4) {
              if (Array.isArray(t4))
                return r(t4);
            }(t3) || function(t4) {
              if ("undefined" != typeof Symbol && null != t4[Symbol.iterator] || null != t4["@@iterator"])
                return Array.from(t4);
            }(t3) || e2(t3) || function() {
              throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function e2(t3, e3) {
            if (t3) {
              if ("string" == typeof t3)
                return r(t3, e3);
              var n2 = Object.prototype.toString.call(t3).slice(8, -1);
              return "Object" === n2 && t3.constructor && (n2 = t3.constructor.name), "Map" === n2 || "Set" === n2 ? Array.from(t3) : "Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2) ? r(t3, e3) : void 0;
            }
          }
          function r(t3, e3) {
            (null == e3 || e3 > t3.length) && (e3 = t3.length);
            for (var n2 = 0, o2 = new Array(e3); n2 < e3; n2++)
              o2[n2] = t3[n2];
            return o2;
          }
          function i(t3) {
            return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t4) {
              return typeof t4;
            } : function(t4) {
              return t4 && "function" == typeof Symbol && t4.constructor === Symbol && t4 !== Symbol.prototype ? "symbol" : typeof t4;
            }, i(t3);
          }
          function a(t3, e3) {
            for (var n2 = 0; n2 < e3.length; n2++) {
              var o2 = e3[n2];
              o2.enumerable = o2.enumerable || false, o2.configurable = true, "value" in o2 && (o2.writable = true), Object.defineProperty(t3, u(o2.key), o2);
            }
          }
          function s(t3, e3, n2) {
            return (e3 = u(e3)) in t3 ? Object.defineProperty(t3, e3, {
              value: n2,
              enumerable: true,
              configurable: true,
              writable: true
            }) : t3[e3] = n2, t3;
          }
          function u(t3) {
            var e3 = function(t4, e4) {
              if ("object" != i(t4) || !t4)
                return t4;
              var n2 = t4[Symbol.toPrimitive];
              if (void 0 !== n2) {
                var o2 = n2.call(t4, e4 || "default");
                if ("object" != i(o2))
                  return o2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return ("string" === e4 ? String : Number)(t4);
            }(t3, "string");
            return "symbol" == i(e3) ? e3 : e3 + "";
          }
          var c = function() {
            return n2 = function t3(e3) {
              var n3 = e3.getOptions, o3 = e3.getCaretPosition, r3 = e3.getCaretPositionEnd, i2 = e3.dispatch;
              !function(t4, e4) {
                if (!(t4 instanceof e4))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t3), s(this, "getOptions", void 0), s(this, "getCaretPosition", void 0), s(this, "getCaretPositionEnd", void 0), s(this, "dispatch", void 0), s(this, "maxLengthReached", void 0), s(this, "isStandardButton", function(t4) {
                return t4 && !("{" === t4[0] && "}" === t4[t4.length - 1]);
              }), this.getOptions = n3, this.getCaretPosition = o3, this.getCaretPositionEnd = r3, this.dispatch = i2, t3.bindMethods(t3, this);
            }, o2 = [
              {
                key: "getButtonType",
                value: function(t3) {
                  return t3.includes("{") && t3.includes("}") && "{//}" !== t3 ? "functionBtn" : "standardBtn";
                }
              },
              {
                key: "getButtonClass",
                value: function(t3) {
                  var e3 = this.getButtonType(t3), n3 = t3.replace("{", "").replace("}", ""), o3 = "";
                  return "standardBtn" !== e3 && (o3 = " hg-button-".concat(n3)), "hg-".concat(e3).concat(o3);
                }
              },
              {
                key: "getDefaultDiplay",
                value: function() {
                  return {
                    "{bksp}": "backspace",
                    "{backspace}": "backspace",
                    "{enter}": "< enter",
                    "{shift}": "shift",
                    "{shiftleft}": "shift",
                    "{shiftright}": "shift",
                    "{alt}": "alt",
                    "{s}": "shift",
                    "{tab}": "tab",
                    "{lock}": "caps",
                    "{capslock}": "caps",
                    "{accept}": "Submit",
                    "{space}": " ",
                    "{//}": " ",
                    "{esc}": "esc",
                    "{escape}": "esc",
                    "{f1}": "f1",
                    "{f2}": "f2",
                    "{f3}": "f3",
                    "{f4}": "f4",
                    "{f5}": "f5",
                    "{f6}": "f6",
                    "{f7}": "f7",
                    "{f8}": "f8",
                    "{f9}": "f9",
                    "{f10}": "f10",
                    "{f11}": "f11",
                    "{f12}": "f12",
                    "{numpaddivide}": "/",
                    "{numlock}": "lock",
                    "{arrowup}": "\u2191",
                    "{arrowleft}": "\u2190",
                    "{arrowdown}": "\u2193",
                    "{arrowright}": "\u2192",
                    "{prtscr}": "print",
                    "{scrolllock}": "scroll",
                    "{pause}": "pause",
                    "{insert}": "ins",
                    "{home}": "home",
                    "{pageup}": "up",
                    "{delete}": "del",
                    "{forwarddelete}": "del",
                    "{end}": "end",
                    "{pagedown}": "down",
                    "{numpadmultiply}": "*",
                    "{numpadsubtract}": "-",
                    "{numpadadd}": "+",
                    "{numpadenter}": "enter",
                    "{period}": ".",
                    "{numpaddecimal}": ".",
                    "{numpad0}": "0",
                    "{numpad1}": "1",
                    "{numpad2}": "2",
                    "{numpad3}": "3",
                    "{numpad4}": "4",
                    "{numpad5}": "5",
                    "{numpad6}": "6",
                    "{numpad7}": "7",
                    "{numpad8}": "8",
                    "{numpad9}": "9"
                  };
                }
              },
              {
                key: "getButtonDisplayName",
                value: function(t3, e3) {
                  return (e3 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2] ? Object.assign({}, this.getDefaultDiplay(), e3) : e3 || this.getDefaultDiplay())[t3] || t3;
                }
              },
              {
                key: "getUpdatedInput",
                value: function(t3, e3, n3) {
                  var o3 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : n3, r3 = arguments.length > 4 && void 0 !== arguments[4] && arguments[4], i2 = this.getOptions(), a2 = [
                    n3,
                    o3,
                    r3
                  ], s2 = e3;
                  return ("{bksp}" === t3 || "{backspace}" === t3) && s2.length > 0 ? s2 = this.removeAt.apply(this, [
                    s2
                  ].concat(a2)) : ("{delete}" === t3 || "{forwarddelete}" === t3) && s2.length > 0 ? s2 = this.removeForwardsAt.apply(this, [
                    s2
                  ].concat(a2)) : "{space}" === t3 ? s2 = this.addStringAt.apply(this, [
                    s2,
                    " "
                  ].concat(a2)) : "{tab}" !== t3 || "boolean" == typeof i2.tabCharOnTab && false === i2.tabCharOnTab ? "{enter}" !== t3 && "{numpadenter}" !== t3 || !i2.newLineOnEnter ? t3.includes("numpad") && Number.isInteger(Number(t3[t3.length - 2])) ? s2 = this.addStringAt.apply(this, [
                    s2,
                    t3[t3.length - 2]
                  ].concat(a2)) : "{numpaddivide}" === t3 ? s2 = this.addStringAt.apply(this, [
                    s2,
                    "/"
                  ].concat(a2)) : "{numpadmultiply}" === t3 ? s2 = this.addStringAt.apply(this, [
                    s2,
                    "*"
                  ].concat(a2)) : "{numpadsubtract}" === t3 ? s2 = this.addStringAt.apply(this, [
                    s2,
                    "-"
                  ].concat(a2)) : "{numpadadd}" === t3 ? s2 = this.addStringAt.apply(this, [
                    s2,
                    "+"
                  ].concat(a2)) : "{numpaddecimal}" === t3 ? s2 = this.addStringAt.apply(this, [
                    s2,
                    "."
                  ].concat(a2)) : "{" === t3 || "}" === t3 ? s2 = this.addStringAt.apply(this, [
                    s2,
                    t3
                  ].concat(a2)) : t3.includes("{") || t3.includes("}") || (s2 = this.addStringAt.apply(this, [
                    s2,
                    t3
                  ].concat(a2))) : s2 = this.addStringAt.apply(this, [
                    s2,
                    "\n"
                  ].concat(a2)) : s2 = this.addStringAt.apply(this, [
                    s2,
                    "	"
                  ].concat(a2)), i2.debug && console.log("Input will be: " + s2), s2;
                }
              },
              {
                key: "updateCaretPos",
                value: function(t3) {
                  var e3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n3 = this.updateCaretPosAction(t3, e3);
                  this.dispatch(function(t4) {
                    t4.setCaretPosition(n3);
                  });
                }
              },
              {
                key: "updateCaretPosAction",
                value: function(t3) {
                  var e3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n3 = this.getOptions(), o3 = this.getCaretPosition();
                  return null != o3 && (e3 ? o3 > 0 && (o3 -= t3) : o3 += t3), n3.debug && console.log("Caret at:", o3), o3;
                }
              },
              {
                key: "addStringAt",
                value: function(t3, e3) {
                  var n3, o3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t3.length, r3 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t3.length, i2 = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
                  return o3 || 0 === o3 ? (n3 = [
                    t3.slice(0, o3),
                    e3,
                    t3.slice(r3)
                  ].join(""), this.isMaxLengthReached() || i2 && this.updateCaretPos(e3.length)) : n3 = t3 + e3, n3;
                }
              },
              {
                key: "removeAt",
                value: function(t3) {
                  var e3, n3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t3.length, o3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t3.length, r3 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                  if (0 === n3 && 0 === o3)
                    return t3;
                  if (n3 === o3) {
                    var i2 = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
                    n3 && n3 >= 0 ? t3.substring(n3 - 2, n3).match(i2) ? (e3 = t3.substr(0, n3 - 2) + t3.substr(n3), r3 && this.updateCaretPos(2, true)) : (e3 = t3.substr(0, n3 - 1) + t3.substr(n3), r3 && this.updateCaretPos(1, true)) : t3.slice(-2).match(i2) ? (e3 = t3.slice(0, -2), r3 && this.updateCaretPos(2, true)) : (e3 = t3.slice(0, -1), r3 && this.updateCaretPos(1, true));
                  } else
                    e3 = t3.slice(0, n3) + t3.slice(o3), r3 && this.dispatch(function(t4) {
                      t4.setCaretPosition(n3);
                    });
                  return e3;
                }
              },
              {
                key: "removeForwardsAt",
                value: function(t3) {
                  var e3, n3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t3.length, o3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t3.length, r3 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                  return null != t3 && t3.length && null !== n3 ? (n3 === o3 ? e3 = t3.substring(n3, n3 + 2).match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g) ? t3.substr(0, n3) + t3.substr(n3 + 2) : t3.substr(0, n3) + t3.substr(n3 + 1) : (e3 = t3.slice(0, n3) + t3.slice(o3), r3 && this.dispatch(function(t4) {
                    t4.setCaretPosition(n3);
                  })), e3) : t3;
                }
              },
              {
                key: "handleMaxLength",
                value: function(t3, e3) {
                  var n3 = this.getOptions(), o3 = n3.maxLength, r3 = t3[n3.inputName || "default"], a2 = e3.length - 1 >= o3;
                  if (e3.length <= r3.length)
                    return false;
                  if (Number.isInteger(o3))
                    return n3.debug && console.log("maxLength (num) reached:", a2), a2 ? (this.maxLengthReached = true, true) : (this.maxLengthReached = false, false);
                  if ("object" === i(o3)) {
                    var s2 = e3.length - 1 >= o3[n3.inputName || "default"];
                    return n3.debug && console.log("maxLength (obj) reached:", s2), s2 ? (this.maxLengthReached = true, true) : (this.maxLengthReached = false, false);
                  }
                }
              },
              {
                key: "isMaxLengthReached",
                value: function() {
                  return Boolean(this.maxLengthReached);
                }
              },
              {
                key: "isTouchDevice",
                value: function() {
                  return "ontouchstart" in window || navigator.maxTouchPoints;
                }
              },
              {
                key: "pointerEventsSupported",
                value: function() {
                  return !!window.PointerEvent;
                }
              },
              {
                key: "camelCase",
                value: function(t3) {
                  return t3 ? t3.toLowerCase().trim().split(/[.\-_\s]/g).reduce(function(t4, e3) {
                    return e3.length ? t4 + e3[0].toUpperCase() + e3.slice(1) : t4;
                  }) : "";
                }
              },
              {
                key: "chunkArray",
                value: function(e3, n3) {
                  return t2(Array(Math.ceil(e3.length / n3))).map(function(t3, o3) {
                    return e3.slice(n3 * o3, n3 + n3 * o3);
                  });
                }
              },
              {
                key: "escapeRegex",
                value: function(t3) {
                  return t3.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                }
              },
              {
                key: "getRtlOffset",
                value: function(t3, e3) {
                  var n3 = t3, o3 = e3.indexOf("\u202B");
                  return o3 < t3 && -1 != o3 && n3--, e3.indexOf("\u202C") < t3 && -1 != o3 && n3--, n3 < 0 ? 0 : n3;
                }
              }
            ], r2 = [
              {
                key: "bindMethods",
                value: function(t3, n3) {
                  var o3, r3 = function(t4, n4) {
                    var o4 = "undefined" != typeof Symbol && t4[Symbol.iterator] || t4["@@iterator"];
                    if (!o4) {
                      if (Array.isArray(t4) || (o4 = e2(t4)) || n4) {
                        o4 && (t4 = o4);
                        var r4 = 0, i3 = function() {
                        };
                        return {
                          s: i3,
                          n: function() {
                            return r4 >= t4.length ? {
                              done: true
                            } : {
                              done: false,
                              value: t4[r4++]
                            };
                          },
                          e: function(t5) {
                            throw t5;
                          },
                          f: i3
                        };
                      }
                      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                    }
                    var a2, s2 = true, u2 = false;
                    return {
                      s: function() {
                        o4 = o4.call(t4);
                      },
                      n: function() {
                        var t5 = o4.next();
                        return s2 = t5.done, t5;
                      },
                      e: function(t5) {
                        u2 = true, a2 = t5;
                      },
                      f: function() {
                        try {
                          s2 || null == o4.return || o4.return();
                        } finally {
                          if (u2)
                            throw a2;
                        }
                      }
                    };
                  }(Object.getOwnPropertyNames(t3.prototype));
                  try {
                    for (r3.s(); !(o3 = r3.n()).done; ) {
                      var i2 = o3.value;
                      "constructor" === i2 || "bindMethods" === i2 || (n3[i2] = n3[i2].bind(n3));
                    }
                  } catch (t4) {
                    r3.e(t4);
                  } finally {
                    r3.f();
                  }
                }
              }
            ], o2 && a(n2.prototype, o2), r2 && a(n2, r2), Object.defineProperty(n2, "prototype", {
              writable: false
            }), n2;
            var n2, o2, r2;
          }();
          s(c, "noop", function() {
          });
          var l = c;
          function f(t3) {
            return f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t4) {
              return typeof t4;
            } : function(t4) {
              return t4 && "function" == typeof Symbol && t4.constructor === Symbol && t4 !== Symbol.prototype ? "symbol" : typeof t4;
            }, f(t3);
          }
          function d(t3, e3) {
            for (var n2 = 0; n2 < e3.length; n2++) {
              var o2 = e3[n2];
              o2.enumerable = o2.enumerable || false, o2.configurable = true, "value" in o2 && (o2.writable = true), Object.defineProperty(t3, h2(o2.key), o2);
            }
          }
          function p2(t3, e3, n2) {
            return (e3 = h2(e3)) in t3 ? Object.defineProperty(t3, e3, {
              value: n2,
              enumerable: true,
              configurable: true,
              writable: true
            }) : t3[e3] = n2, t3;
          }
          function h2(t3) {
            var e3 = function(t4, e4) {
              if ("object" != f(t4) || !t4)
                return t4;
              var n2 = t4[Symbol.toPrimitive];
              if (void 0 !== n2) {
                var o2 = n2.call(t4, e4);
                if ("object" != f(o2))
                  return o2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(t4);
            }(t3, "string");
            return "symbol" == f(e3) ? e3 : e3 + "";
          }
          var v = function() {
            return t3 = function t4(e4) {
              var n3 = this, o2 = e4.dispatch, r2 = e4.getOptions;
              !function(t5, e5) {
                if (!(t5 instanceof e5))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t4), p2(this, "getOptions", void 0), p2(this, "dispatch", void 0), p2(this, "isModifierKey", function(t5) {
                return t5.altKey || t5.ctrlKey || t5.shiftKey || [
                  "Tab",
                  "CapsLock",
                  "Esc",
                  "ArrowUp",
                  "ArrowDown",
                  "ArrowLeft",
                  "ArrowRight"
                ].includes(t5.code || t5.key || n3.keyCodeToKey(null == t5 ? void 0 : t5.keyCode));
              }), this.dispatch = o2, this.getOptions = r2, l.bindMethods(t4, this);
            }, (e3 = [
              {
                key: "handleHighlightKeyDown",
                value: function(t4) {
                  var e4 = this.getOptions();
                  e4.physicalKeyboardHighlightPreventDefault && this.isModifierKey(t4) && (t4.preventDefault(), t4.stopImmediatePropagation());
                  var n3 = this.getSimpleKeyboardLayoutKey(t4);
                  this.dispatch(function(o2) {
                    var r2, i2, a2 = o2.getButtonElement(n3), s2 = o2.getButtonElement("{".concat(n3, "}"));
                    if (a2)
                      r2 = a2, i2 = n3;
                    else {
                      if (!s2)
                        return;
                      r2 = s2, i2 = "{".concat(n3, "}");
                    }
                    var u2, c2, l2, f2, d2 = function(t5) {
                      t5.style.background = e4.physicalKeyboardHighlightBgColor || "#dadce4", t5.style.color = e4.physicalKeyboardHighlightTextColor || "black";
                    };
                    if (r2)
                      if (Array.isArray(r2)) {
                        if (r2.forEach(function(t5) {
                          return d2(t5);
                        }), e4.physicalKeyboardHighlightPress)
                          if (e4.physicalKeyboardHighlightPressUsePointerEvents)
                            null === (u2 = r2[0]) || void 0 === u2 || null === (c2 = u2.onpointerdown) || void 0 === c2 || c2.call(u2, t4);
                          else if (e4.physicalKeyboardHighlightPressUseClick) {
                            var p3;
                            null === (p3 = r2[0]) || void 0 === p3 || p3.click();
                          } else
                            o2.handleButtonClicked(i2, t4);
                      } else
                        d2(r2), e4.physicalKeyboardHighlightPress && (e4.physicalKeyboardHighlightPressUsePointerEvents ? null === (l2 = r2) || void 0 === l2 || null === (f2 = l2.onpointerdown) || void 0 === f2 || f2.call(l2, t4) : e4.physicalKeyboardHighlightPressUseClick ? r2.click() : o2.handleButtonClicked(i2, t4));
                  });
                }
              },
              {
                key: "handleHighlightKeyUp",
                value: function(t4) {
                  var e4 = this.getOptions();
                  e4.physicalKeyboardHighlightPreventDefault && this.isModifierKey(t4) && (t4.preventDefault(), t4.stopImmediatePropagation());
                  var n3 = this.getSimpleKeyboardLayoutKey(t4);
                  this.dispatch(function(o2) {
                    var r2, i2, a2, s2 = o2.getButtonElement(n3) || o2.getButtonElement("{".concat(n3, "}")), u2 = function(t5) {
                      t5.removeAttribute && t5.removeAttribute("style");
                    };
                    s2 && (Array.isArray(s2) ? (s2.forEach(function(t5) {
                      return u2(t5);
                    }), e4.physicalKeyboardHighlightPressUsePointerEvents && (null === (r2 = s2[0]) || void 0 === r2 || null === (i2 = r2.onpointerup) || void 0 === i2 || i2.call(r2, t4))) : (u2(s2), e4.physicalKeyboardHighlightPressUsePointerEvents && (null == s2 || null === (a2 = s2.onpointerup) || void 0 === a2 || a2.call(s2, t4))));
                  });
                }
              },
              {
                key: "getSimpleKeyboardLayoutKey",
                value: function(t4) {
                  var e4, n3 = "", o2 = t4.code || t4.key || this.keyCodeToKey(null == t4 ? void 0 : t4.keyCode);
                  return (n3 = null != o2 && o2.includes("Numpad") || null != o2 && o2.includes("Shift") || null != o2 && o2.includes("Space") || null != o2 && o2.includes("Backspace") || null != o2 && o2.includes("Control") || null != o2 && o2.includes("Alt") || null != o2 && o2.includes("Meta") ? t4.code || "" : t4.key || this.keyCodeToKey(null == t4 ? void 0 : t4.keyCode) || "").length > 1 ? null === (e4 = n3) || void 0 === e4 ? void 0 : e4.toLowerCase() : n3;
                }
              },
              {
                key: "keyCodeToKey",
                value: function(t4) {
                  return {
                    8: "Backspace",
                    9: "Tab",
                    13: "Enter",
                    16: "Shift",
                    17: "Ctrl",
                    18: "Alt",
                    19: "Pause",
                    20: "CapsLock",
                    27: "Esc",
                    32: "Space",
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
                    48: "0",
                    49: "1",
                    50: "2",
                    51: "3",
                    52: "4",
                    53: "5",
                    54: "6",
                    55: "7",
                    56: "8",
                    57: "9",
                    65: "A",
                    66: "B",
                    67: "C",
                    68: "D",
                    69: "E",
                    70: "F",
                    71: "G",
                    72: "H",
                    73: "I",
                    74: "J",
                    75: "K",
                    76: "L",
                    77: "M",
                    78: "N",
                    79: "O",
                    80: "P",
                    81: "Q",
                    82: "R",
                    83: "S",
                    84: "T",
                    85: "U",
                    86: "V",
                    87: "W",
                    88: "X",
                    89: "Y",
                    90: "Z",
                    91: "Meta",
                    96: "Numpad0",
                    97: "Numpad1",
                    98: "Numpad2",
                    99: "Numpad3",
                    100: "Numpad4",
                    101: "Numpad5",
                    102: "Numpad6",
                    103: "Numpad7",
                    104: "Numpad8",
                    105: "Numpad9",
                    106: "NumpadMultiply",
                    107: "NumpadAdd",
                    109: "NumpadSubtract",
                    110: "NumpadDecimal",
                    111: "NumpadDivide",
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
                    186: ";",
                    187: "=",
                    188: ",",
                    189: "-",
                    190: ".",
                    191: "/",
                    192: "`",
                    219: "[",
                    220: "\\",
                    221: "]",
                    222: "'"
                  }[t4] || "";
                }
              }
            ]) && d(t3.prototype, e3), n2 && d(t3, n2), Object.defineProperty(t3, "prototype", {
              writable: false
            }), t3;
            var t3, e3, n2;
          }();
          function y(t3) {
            return y = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t4) {
              return typeof t4;
            } : function(t4) {
              return t4 && "function" == typeof Symbol && t4.constructor === Symbol && t4 !== Symbol.prototype ? "symbol" : typeof t4;
            }, y(t3);
          }
          function g(t3, e3) {
            for (var n2 = 0; n2 < e3.length; n2++) {
              var o2 = e3[n2];
              o2.enumerable = o2.enumerable || false, o2.configurable = true, "value" in o2 && (o2.writable = true), Object.defineProperty(t3, b(o2.key), o2);
            }
          }
          function m(t3, e3, n2) {
            return (e3 = b(e3)) in t3 ? Object.defineProperty(t3, e3, {
              value: n2,
              enumerable: true,
              configurable: true,
              writable: true
            }) : t3[e3] = n2, t3;
          }
          function b(t3) {
            var e3 = function(t4, e4) {
              if ("object" != y(t4) || !t4)
                return t4;
              var n2 = t4[Symbol.toPrimitive];
              if (void 0 !== n2) {
                var o2 = n2.call(t4, e4);
                if ("object" != y(o2))
                  return o2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(t4);
            }(t3, "string");
            return "symbol" == y(e3) ? e3 : e3 + "";
          }
          var x = function() {
            return t3 = function t4(e4) {
              var n3 = e4.utilities, o2 = e4.options;
              !function(t5, e5) {
                if (!(t5 instanceof e5))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t4), m(this, "utilities", void 0), m(this, "options", void 0), m(this, "candidateBoxElement", void 0), m(this, "pageIndex", 0), m(this, "pageSize", void 0), this.utilities = n3, this.options = o2, l.bindMethods(t4, this), this.pageSize = this.utilities.getOptions().layoutCandidatesPageSize || 5;
            }, e3 = [
              {
                key: "destroy",
                value: function() {
                  this.candidateBoxElement && (this.candidateBoxElement.remove(), this.pageIndex = 0);
                }
              },
              {
                key: "show",
                value: function(t4) {
                  var e4 = this, n3 = t4.candidateValue, o2 = t4.targetElement, r2 = t4.onSelect;
                  if (n3 && n3.length) {
                    var i2 = this.utilities.chunkArray(n3.split(" "), this.pageSize);
                    this.renderPage({
                      candidateListPages: i2,
                      targetElement: o2,
                      pageIndex: this.pageIndex,
                      nbPages: i2.length,
                      onItemSelected: function(t5, n4) {
                        r2(t5, n4), e4.destroy();
                      }
                    });
                  }
                }
              },
              {
                key: "renderPage",
                value: function(t4) {
                  var e4, n3 = this, o2 = t4.candidateListPages, r2 = t4.targetElement, i2 = t4.pageIndex, a2 = t4.nbPages, s2 = t4.onItemSelected;
                  null === (e4 = this.candidateBoxElement) || void 0 === e4 || e4.remove(), this.candidateBoxElement = document.createElement("div"), this.candidateBoxElement.className = "hg-candidate-box";
                  var u2 = document.createElement("ul");
                  u2.className = "hg-candidate-box-list", o2[i2].forEach(function(t5) {
                    var e5, o3 = document.createElement("li"), r3 = function() {
                      var t6 = new (n3.options.useTouchEvents ? TouchEvent : MouseEvent)("click");
                      return Object.defineProperty(t6, "target", {
                        value: o3
                      }), t6;
                    };
                    o3.className = "hg-candidate-box-list-item", o3.innerHTML = (null === (e5 = n3.options.display) || void 0 === e5 ? void 0 : e5[t5]) || t5, n3.options.useTouchEvents ? o3.ontouchstart = function(e6) {
                      return s2(t5, e6 || r3());
                    } : o3.onclick = function() {
                      var e6 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : r3();
                      return s2(t5, e6);
                    }, u2.appendChild(o3);
                  });
                  var c2 = i2 > 0, l2 = document.createElement("div");
                  l2.classList.add("hg-candidate-box-prev"), c2 && l2.classList.add("hg-candidate-box-btn-active");
                  var f2 = function() {
                    c2 && n3.renderPage({
                      candidateListPages: o2,
                      targetElement: r2,
                      pageIndex: i2 - 1,
                      nbPages: a2,
                      onItemSelected: s2
                    });
                  };
                  this.options.useTouchEvents ? l2.ontouchstart = f2 : l2.onclick = f2, this.candidateBoxElement.appendChild(l2), this.candidateBoxElement.appendChild(u2);
                  var d2 = i2 < a2 - 1, p3 = document.createElement("div");
                  p3.classList.add("hg-candidate-box-next"), d2 && p3.classList.add("hg-candidate-box-btn-active");
                  var h3 = function() {
                    d2 && n3.renderPage({
                      candidateListPages: o2,
                      targetElement: r2,
                      pageIndex: i2 + 1,
                      nbPages: a2,
                      onItemSelected: s2
                    });
                  };
                  this.options.useTouchEvents ? p3.ontouchstart = h3 : p3.onclick = h3, this.candidateBoxElement.appendChild(p3), r2.prepend(this.candidateBoxElement);
                }
              }
            ], e3 && g(t3.prototype, e3), n2 && g(t3, n2), Object.defineProperty(t3, "prototype", {
              writable: false
            }), t3;
            var t3, e3, n2;
          }(), w = x;
          function E(t3) {
            return function(t4) {
              if (Array.isArray(t4))
                return O(t4);
            }(t3) || function(t4) {
              if ("undefined" != typeof Symbol && null != t4[Symbol.iterator] || null != t4["@@iterator"])
                return Array.from(t4);
            }(t3) || function(t4, e3) {
              if (!t4)
                return;
              if ("string" == typeof t4)
                return O(t4, e3);
              var n2 = Object.prototype.toString.call(t4).slice(8, -1);
              "Object" === n2 && t4.constructor && (n2 = t4.constructor.name);
              if ("Map" === n2 || "Set" === n2)
                return Array.from(t4);
              if ("Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
                return O(t4, e3);
            }(t3) || function() {
              throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function O(t3, e3) {
            (null == e3 || e3 > t3.length) && (e3 = t3.length);
            for (var n2 = 0, o2 = new Array(e3); n2 < e3; n2++)
              o2[n2] = t3[n2];
            return o2;
          }
          function S(t3) {
            return S = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t4) {
              return typeof t4;
            } : function(t4) {
              return t4 && "function" == typeof Symbol && t4.constructor === Symbol && t4 !== Symbol.prototype ? "symbol" : typeof t4;
            }, S(t3);
          }
          function k(t3, e3) {
            var n2 = Object.keys(t3);
            if (Object.getOwnPropertySymbols) {
              var o2 = Object.getOwnPropertySymbols(t3);
              e3 && (o2 = o2.filter(function(e4) {
                return Object.getOwnPropertyDescriptor(t3, e4).enumerable;
              })), n2.push.apply(n2, o2);
            }
            return n2;
          }
          function P(t3, e3) {
            for (var n2 = 0; n2 < e3.length; n2++) {
              var o2 = e3[n2];
              o2.enumerable = o2.enumerable || false, o2.configurable = true, "value" in o2 && (o2.writable = true), Object.defineProperty(t3, C(o2.key), o2);
            }
          }
          function I(t3, e3, n2) {
            return (e3 = C(e3)) in t3 ? Object.defineProperty(t3, e3, {
              value: n2,
              enumerable: true,
              configurable: true,
              writable: true
            }) : t3[e3] = n2, t3;
          }
          function C(t3) {
            var e3 = function(t4, e4) {
              if ("object" != S(t4) || !t4)
                return t4;
              var n2 = t4[Symbol.toPrimitive];
              if (void 0 !== n2) {
                var o2 = n2.call(t4, e4);
                if ("object" != S(o2))
                  return o2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(t4);
            }(t3, "string");
            return "symbol" == S(e3) ? e3 : e3 + "";
          }
          var A = function() {
            return t3 = function t4(e4, n3) {
              var o2 = this;
              if (function(t5, e5) {
                if (!(t5 instanceof e5))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t4), I(this, "input", void 0), I(this, "options", void 0), I(this, "utilities", void 0), I(this, "caretPosition", void 0), I(this, "caretPositionEnd", void 0), I(this, "keyboardDOM", void 0), I(this, "keyboardPluginClasses", void 0), I(this, "keyboardDOMClass", void 0), I(this, "buttonElements", void 0), I(this, "currentInstanceName", void 0), I(this, "allKeyboardInstances", void 0), I(this, "keyboardInstanceNames", void 0), I(this, "isFirstKeyboardInstance", void 0), I(this, "physicalKeyboard", void 0), I(this, "modules", void 0), I(this, "activeButtonClass", void 0), I(this, "holdInteractionTimeout", void 0), I(this, "holdTimeout", void 0), I(this, "isMouseHold", void 0), I(this, "initialized", void 0), I(this, "candidateBox", void 0), I(this, "keyboardRowsDOM", void 0), I(this, "defaultName", "default"), I(this, "activeInputElement", null), I(this, "handleParams", function(t5, e5) {
                var n4, o3, r3;
                if ("string" == typeof t5)
                  n4 = t5.split(".").join(""), o3 = document.querySelector(".".concat(n4)), r3 = e5;
                else if (t5 instanceof HTMLDivElement) {
                  if (!t5.className)
                    throw console.warn("Any DOM element passed as parameter must have a class."), new Error("KEYBOARD_DOM_CLASS_ERROR");
                  n4 = t5.className.split(" ")[0], o3 = t5, r3 = e5;
                } else
                  n4 = "simple-keyboard", o3 = document.querySelector(".".concat(n4)), r3 = t5;
                return {
                  keyboardDOMClass: n4,
                  keyboardDOM: o3,
                  options: r3
                };
              }), I(this, "getOptions", function() {
                return o2.options;
              }), I(this, "getCaretPosition", function() {
                return o2.caretPosition;
              }), I(this, "getCaretPositionEnd", function() {
                return o2.caretPositionEnd;
              }), I(this, "registerModule", function(t5, e5) {
                o2.modules[t5] || (o2.modules[t5] = {}), e5(o2.modules[t5]);
              }), I(this, "getKeyboardClassString", function() {
                for (var t5 = arguments.length, e5 = new Array(t5), n4 = 0; n4 < t5; n4++)
                  e5[n4] = arguments[n4];
                return [
                  o2.keyboardDOMClass
                ].concat(e5).filter(function(t6) {
                  return !!t6;
                }).join(" ");
              }), "undefined" != typeof window) {
                var r2 = this.handleParams(e4, n3), i2 = r2.keyboardDOMClass, a2 = r2.keyboardDOM, s2 = r2.options, u2 = void 0 === s2 ? {} : s2;
                this.utilities = new l({
                  getOptions: this.getOptions,
                  getCaretPosition: this.getCaretPosition,
                  getCaretPositionEnd: this.getCaretPositionEnd,
                  dispatch: this.dispatch
                }), this.caretPosition = null, this.caretPositionEnd = null, this.keyboardDOM = a2, this.options = function(t5) {
                  for (var e5 = 1; e5 < arguments.length; e5++) {
                    var n4 = null != arguments[e5] ? arguments[e5] : {};
                    e5 % 2 ? k(Object(n4), true).forEach(function(e6) {
                      I(t5, e6, n4[e6]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t5, Object.getOwnPropertyDescriptors(n4)) : k(Object(n4)).forEach(function(e6) {
                      Object.defineProperty(t5, e6, Object.getOwnPropertyDescriptor(n4, e6));
                    });
                  }
                  return t5;
                }({
                  layoutName: "default",
                  theme: "hg-theme-default",
                  inputName: "default",
                  preventMouseDownDefault: false,
                  enableLayoutCandidates: true,
                  excludeFromLayout: {}
                }, u2), this.keyboardPluginClasses = "", l.bindMethods(t4, this);
                var c2 = this.options.inputName, f2 = void 0 === c2 ? this.defaultName : c2;
                if (this.input = {}, this.input[f2] = "", this.keyboardDOMClass = i2, this.buttonElements = {}, window.SimpleKeyboardInstances || (window.SimpleKeyboardInstances = {}), this.currentInstanceName = this.utilities.camelCase(this.keyboardDOMClass), window.SimpleKeyboardInstances[this.currentInstanceName] = this, this.allKeyboardInstances = window.SimpleKeyboardInstances, this.keyboardInstanceNames = Object.keys(window.SimpleKeyboardInstances), this.isFirstKeyboardInstance = this.keyboardInstanceNames[0] === this.currentInstanceName, this.physicalKeyboard = new v({
                  dispatch: this.dispatch,
                  getOptions: this.getOptions
                }), this.candidateBox = this.options.enableLayoutCandidates ? new w({
                  utilities: this.utilities,
                  options: this.options
                }) : null, !this.keyboardDOM)
                  throw console.warn('".'.concat(i2, '" was not found in the DOM.')), new Error("KEYBOARD_DOM_ERROR");
                this.render(), this.modules = {}, this.loadModules();
              }
            }, e3 = [
              {
                key: "setCaretPosition",
                value: function(t4) {
                  var e4 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t4;
                  this.caretPosition = t4, this.caretPositionEnd = e4;
                }
              },
              {
                key: "getInputCandidates",
                value: function(t4) {
                  var e4 = this, n3 = this.options, o2 = n3.layoutCandidates, r2 = n3.layoutCandidatesCaseSensitiveMatch;
                  if (!o2 || "object" !== S(o2))
                    return {};
                  var i2 = Object.keys(o2).filter(function(n4) {
                    var o3 = t4.substring(0, e4.getCaretPositionEnd() || 0) || t4, i3 = new RegExp("".concat(e4.utilities.escapeRegex(n4), "$"), r2 ? "g" : "gi");
                    return !!E(o3.matchAll(i3)).length;
                  });
                  if (i2.length > 1) {
                    var a2 = i2.sort(function(t5, e5) {
                      return e5.length - t5.length;
                    })[0];
                    return {
                      candidateKey: a2,
                      candidateValue: o2[a2]
                    };
                  }
                  if (i2.length) {
                    var s2 = i2[0];
                    return {
                      candidateKey: s2,
                      candidateValue: o2[s2]
                    };
                  }
                  return {};
                }
              },
              {
                key: "showCandidatesBox",
                value: function(t4, e4, n3) {
                  var o2 = this;
                  this.candidateBox && this.candidateBox.show({
                    candidateValue: e4,
                    targetElement: n3,
                    onSelect: function(e5, n4) {
                      var r2 = o2.options, i2 = r2.layoutCandidatesCaseSensitiveMatch, a2 = r2.disableCandidateNormalization, s2 = r2.enableLayoutCandidatesKeyPress, u2 = e5;
                      a2 || (u2 = e5.normalize("NFD"));
                      var c2 = o2.getInput(o2.options.inputName, true), l2 = o2.getCaretPositionEnd() || 0, f2 = c2.substring(0, l2 || 0) || c2, d2 = new RegExp("".concat(o2.utilities.escapeRegex(t4), "$"), i2 ? "g" : "gi"), p3 = f2.replace(d2, u2), h3 = c2.replace(f2, p3), v2 = p3.length - f2.length, y2 = (l2 || c2.length) + v2;
                      y2 < 0 && (y2 = 0), o2.setInput(h3, o2.options.inputName, true), o2.setCaretPosition(y2), s2 && "function" == typeof o2.options.onKeyPress && o2.options.onKeyPress(e5, n4), "function" == typeof o2.options.onChange && o2.options.onChange(o2.getInput(o2.options.inputName, true), n4), "function" == typeof o2.options.onChangeAll && o2.options.onChangeAll(o2.getAllInputs(), n4);
                    }
                  });
                }
              },
              {
                key: "handleButtonClicked",
                value: function(t4, e4) {
                  var n3 = this.options, o2 = n3.inputName, r2 = void 0 === o2 ? this.defaultName : o2, i2 = n3.debug;
                  if ("{//}" !== t4) {
                    this.input[r2] || (this.input[r2] = "");
                    var a2 = this.utilities.getUpdatedInput(t4, this.input[r2], this.caretPosition, this.caretPositionEnd);
                    if (this.utilities.isStandardButton(t4) && this.activeInputElement && this.input[r2] && this.input[r2] === a2 && 0 === this.caretPosition && this.caretPositionEnd === a2.length)
                      return this.setInput("", this.options.inputName, true), this.setCaretPosition(0), this.activeInputElement.value = "", this.activeInputElement.setSelectionRange(0, 0), void this.handleButtonClicked(t4, e4);
                    if ("function" == typeof this.options.onKeyPress && this.options.onKeyPress(t4, e4), this.input[r2] !== a2 && (!this.options.inputPattern || this.options.inputPattern && this.inputPatternIsValid(a2))) {
                      if (this.options.maxLength && this.utilities.handleMaxLength(this.input, a2))
                        return;
                      var s2 = this.utilities.getUpdatedInput(t4, this.input[r2], this.caretPosition, this.caretPositionEnd, true);
                      if (this.setInput(s2, this.options.inputName, true), i2 && console.log("Input changed:", this.getAllInputs()), this.options.debug && console.log("Caret at: ", this.getCaretPosition(), this.getCaretPositionEnd(), "(".concat(this.keyboardDOMClass, ")"), null == e4 ? void 0 : e4.type), this.options.syncInstanceInputs && this.syncInstanceInputs(), "function" == typeof this.options.onChange && this.options.onChange(this.getInput(this.options.inputName, true), e4), "function" == typeof this.options.onChangeAll && this.options.onChangeAll(this.getAllInputs(), e4), null != e4 && e4.target && this.options.enableLayoutCandidates) {
                        var u2, c2 = this.getInputCandidates(a2), l2 = c2.candidateKey, f2 = c2.candidateValue;
                        l2 && f2 ? this.showCandidatesBox(l2, f2, this.keyboardDOM) : null === (u2 = this.candidateBox) || void 0 === u2 || u2.destroy();
                      }
                    }
                    this.caretPositionEnd && this.caretPosition !== this.caretPositionEnd && (this.setCaretPosition(this.caretPositionEnd, this.caretPositionEnd), this.activeInputElement && this.activeInputElement.setSelectionRange(this.caretPositionEnd, this.caretPositionEnd), this.options.debug && console.log("Caret position aligned", this.caretPosition)), i2 && console.log("Key pressed:", t4);
                  }
                }
              },
              {
                key: "getMouseHold",
                value: function() {
                  return this.isMouseHold;
                }
              },
              {
                key: "setMouseHold",
                value: function(t4) {
                  this.options.syncInstanceInputs ? this.dispatch(function(e4) {
                    e4.isMouseHold = t4;
                  }) : this.isMouseHold = t4;
                }
              },
              {
                key: "handleButtonMouseDown",
                value: function(t4, e4) {
                  var n3 = this;
                  e4 && (this.options.preventMouseDownDefault && e4.preventDefault(), this.options.stopMouseDownPropagation && e4.stopPropagation(), e4.target.classList.add(this.activeButtonClass)), this.holdInteractionTimeout && clearTimeout(this.holdInteractionTimeout), this.holdTimeout && clearTimeout(this.holdTimeout), this.setMouseHold(true), this.options.disableButtonHold || (this.holdTimeout = window.setTimeout(function() {
                    (n3.getMouseHold() && (!t4.includes("{") && !t4.includes("}") || "{delete}" === t4 || "{backspace}" === t4 || "{bksp}" === t4 || "{space}" === t4 || "{tab}" === t4) || "{arrowright}" === t4 || "{arrowleft}" === t4 || "{arrowup}" === t4 || "{arrowdown}" === t4) && (n3.options.debug && console.log("Button held:", t4), n3.handleButtonHold(t4)), clearTimeout(n3.holdTimeout);
                  }, 500));
                }
              },
              {
                key: "handleButtonMouseUp",
                value: function(t4, e4) {
                  var n3 = this;
                  e4 && (this.options.preventMouseUpDefault && e4.preventDefault && e4.preventDefault(), this.options.stopMouseUpPropagation && e4.stopPropagation && e4.stopPropagation(), !(e4.target === this.keyboardDOM || e4.target && this.keyboardDOM.contains(e4.target) || this.candidateBox && this.candidateBox.candidateBoxElement && (e4.target === this.candidateBox.candidateBoxElement || e4.target && this.candidateBox.candidateBoxElement.contains(e4.target))) && this.candidateBox && this.candidateBox.destroy()), this.recurseButtons(function(t5) {
                    t5.classList.remove(n3.activeButtonClass);
                  }), this.setMouseHold(false), this.holdInteractionTimeout && clearTimeout(this.holdInteractionTimeout), t4 && "function" == typeof this.options.onKeyReleased && this.options.onKeyReleased(t4, e4);
                }
              },
              {
                key: "handleKeyboardContainerMouseDown",
                value: function(t4) {
                  this.options.preventMouseDownDefault && t4.preventDefault();
                }
              },
              {
                key: "handleButtonHold",
                value: function(t4) {
                  var e4 = this;
                  this.holdInteractionTimeout && clearTimeout(this.holdInteractionTimeout), this.holdInteractionTimeout = window.setTimeout(function() {
                    e4.getMouseHold() ? (e4.handleButtonClicked(t4), e4.handleButtonHold(t4)) : clearTimeout(e4.holdInteractionTimeout);
                  }, 100);
                }
              },
              {
                key: "syncInstanceInputs",
                value: function() {
                  var t4 = this;
                  this.dispatch(function(e4) {
                    e4.replaceInput(t4.input), e4.setCaretPosition(t4.caretPosition, t4.caretPositionEnd);
                  });
                }
              },
              {
                key: "clearInput",
                value: function() {
                  var t4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.options.inputName || this.defaultName;
                  this.input[t4] = "", this.setCaretPosition(0), this.options.syncInstanceInputs && this.syncInstanceInputs();
                }
              },
              {
                key: "getInput",
                value: function() {
                  var t4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.options.inputName || this.defaultName, e4 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                  return this.options.syncInstanceInputs && !e4 && this.syncInstanceInputs(), this.options.rtl ? "\u202B" + this.input[t4].replace("\u202B", "").replace("\u202C", "") + "\u202C" : this.input[t4];
                }
              },
              {
                key: "getAllInputs",
                value: function() {
                  var t4 = this, e4 = {};
                  return Object.keys(this.input).forEach(function(n3) {
                    e4[n3] = t4.getInput(n3, true);
                  }), e4;
                }
              },
              {
                key: "setInput",
                value: function(t4) {
                  var e4 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.options.inputName || this.defaultName, n3 = arguments.length > 2 ? arguments[2] : void 0;
                  this.input[e4] = t4, !n3 && this.options.syncInstanceInputs && this.syncInstanceInputs();
                }
              },
              {
                key: "replaceInput",
                value: function(t4) {
                  this.input = t4;
                }
              },
              {
                key: "setOptions",
                value: function() {
                  var t4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e4 = this.changedOptions(t4);
                  this.options = Object.assign(this.options, t4), e4.length && (this.options.debug && console.log("changedOptions", e4), this.onSetOptions(e4), this.render());
                }
              },
              {
                key: "changedOptions",
                value: function(t4) {
                  var e4 = this;
                  return Object.keys(t4).filter(function(n3) {
                    return JSON.stringify(t4[n3]) !== JSON.stringify(e4.options[n3]);
                  });
                }
              },
              {
                key: "onSetOptions",
                value: function() {
                  var t4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                  t4.includes("layoutName") && this.candidateBox && this.candidateBox.destroy(), (t4.includes("layoutCandidatesPageSize") || t4.includes("layoutCandidates")) && this.candidateBox && (this.candidateBox.destroy(), this.candidateBox = new w({
                    utilities: this.utilities,
                    options: this.options
                  }));
                }
              },
              {
                key: "resetRows",
                value: function() {
                  this.keyboardRowsDOM && this.keyboardRowsDOM.remove(), this.keyboardDOM.className = this.keyboardDOMClass, this.keyboardDOM.setAttribute("data-skInstance", this.currentInstanceName), this.buttonElements = {};
                }
              },
              {
                key: "dispatch",
                value: function(t4) {
                  if (!window.SimpleKeyboardInstances)
                    throw console.warn("SimpleKeyboardInstances is not defined. Dispatch cannot be called."), new Error("INSTANCES_VAR_ERROR");
                  return Object.keys(window.SimpleKeyboardInstances).forEach(function(e4) {
                    t4(window.SimpleKeyboardInstances[e4], e4);
                  });
                }
              },
              {
                key: "addButtonTheme",
                value: function(t4, e4) {
                  var n3 = this;
                  e4 && t4 && (t4.split(" ").forEach(function(o2) {
                    e4.split(" ").forEach(function(e5) {
                      n3.options.buttonTheme || (n3.options.buttonTheme = []);
                      var r2 = false;
                      n3.options.buttonTheme.map(function(t5) {
                        if (null != t5 && t5.class.split(" ").includes(e5)) {
                          r2 = true;
                          var n4 = t5.buttons.split(" ");
                          n4.includes(o2) || (r2 = true, n4.push(o2), t5.buttons = n4.join(" "));
                        }
                        return t5;
                      }), r2 || n3.options.buttonTheme.push({
                        class: e5,
                        buttons: t4
                      });
                    });
                  }), this.render());
                }
              },
              {
                key: "removeButtonTheme",
                value: function(t4, e4) {
                  var n3 = this;
                  if (!t4 && !e4)
                    return this.options.buttonTheme = [], void this.render();
                  t4 && Array.isArray(this.options.buttonTheme) && this.options.buttonTheme.length && (t4.split(" ").forEach(function(t5) {
                    var o2;
                    null === (o2 = n3.options) || void 0 === o2 || null === (o2 = o2.buttonTheme) || void 0 === o2 || o2.map(function(o3, r2) {
                      if (o3 && e4 && e4.includes(o3.class) || !e4) {
                        var i2, a2, s2 = null === (i2 = o3) || void 0 === i2 ? void 0 : i2.buttons.split(" ").filter(function(e5) {
                          return e5 !== t5;
                        });
                        o3 && null != s2 && s2.length ? o3.buttons = s2.join(" ") : (null === (a2 = n3.options.buttonTheme) || void 0 === a2 || a2.splice(r2, 1), o3 = null);
                      }
                      return o3;
                    });
                  }), this.render());
                }
              },
              {
                key: "getButtonElement",
                value: function(t4) {
                  var e4, n3 = this.buttonElements[t4];
                  return n3 && (e4 = n3.length > 1 ? n3 : n3[0]), e4;
                }
              },
              {
                key: "inputPatternIsValid",
                value: function(t4) {
                  var e4, n3 = this.options.inputPattern;
                  if ((e4 = n3 instanceof RegExp ? n3 : n3[this.options.inputName || this.defaultName]) && t4) {
                    var o2 = e4.test(t4);
                    return this.options.debug && console.log('inputPattern ("'.concat(e4, '"): ').concat(o2 ? "passed" : "did not pass!")), o2;
                  }
                  return true;
                }
              },
              {
                key: "setEventListeners",
                value: function() {
                  if (this.isFirstKeyboardInstance || !this.allKeyboardInstances) {
                    this.options.debug && console.log("Caret handling started (".concat(this.keyboardDOMClass, ")"));
                    var t4 = this.options.physicalKeyboardHighlightPreventDefault, e4 = void 0 !== t4 && t4;
                    document.addEventListener("keyup", this.handleKeyUp, e4), document.addEventListener("keydown", this.handleKeyDown, e4), document.addEventListener("mouseup", this.handleMouseUp), document.addEventListener("touchend", this.handleTouchEnd), document.addEventListener("selectionchange", this.handleSelectionChange), document.addEventListener("select", this.handleSelect);
                  }
                }
              },
              {
                key: "handleKeyUp",
                value: function(t4) {
                  this.caretEventHandler(t4), this.options.physicalKeyboardHighlight && this.physicalKeyboard.handleHighlightKeyUp(t4);
                }
              },
              {
                key: "handleKeyDown",
                value: function(t4) {
                  this.options.physicalKeyboardHighlight && this.physicalKeyboard.handleHighlightKeyDown(t4);
                }
              },
              {
                key: "handleMouseUp",
                value: function(t4) {
                  this.caretEventHandler(t4);
                }
              },
              {
                key: "handleTouchEnd",
                value: function(t4) {
                  this.caretEventHandler(t4);
                }
              },
              {
                key: "handleSelect",
                value: function(t4) {
                  this.caretEventHandler(t4);
                }
              },
              {
                key: "handleSelectionChange",
                value: function(t4) {
                  navigator.userAgent.includes("Firefox") || this.caretEventHandler(t4);
                }
              },
              {
                key: "caretEventHandler",
                value: function(t4) {
                  var e4, n3 = this;
                  t4.target.tagName && (e4 = t4.target.tagName.toLowerCase()), this.dispatch(function(o2) {
                    var r2 = t4.target === o2.keyboardDOM || t4.target && o2.keyboardDOM.contains(t4.target);
                    if (n3.options.syncInstanceInputs && Array.isArray(t4.path) && (r2 = t4.path.some(function(t5) {
                      var e5;
                      return null == t5 || null === (e5 = t5.hasAttribute) || void 0 === e5 ? void 0 : e5.call(t5, "data-skInstance");
                    })), ("textarea" === e4 || "input" === e4 && [
                      "text",
                      "search",
                      "url",
                      "tel",
                      "password"
                    ].includes(t4.target.type)) && !o2.options.disableCaretPositioning) {
                      var i2 = t4.target.selectionStart, a2 = t4.target.selectionEnd;
                      o2.options.rtl && (i2 = o2.utilities.getRtlOffset(i2, o2.getInput()), a2 = o2.utilities.getRtlOffset(a2, o2.getInput())), o2.setCaretPosition(i2, a2), n3.activeInputElement = t4.target, o2.options.debug && console.log("Caret at: ", o2.getCaretPosition(), o2.getCaretPositionEnd(), t4 && t4.target.tagName.toLowerCase(), "(".concat(o2.keyboardDOMClass, ")"), null == t4 ? void 0 : t4.type);
                    } else
                      !o2.options.disableCaretPositioning && r2 || "selectionchange" === (null == t4 ? void 0 : t4.type) || (o2.setCaretPosition(null), n3.activeInputElement = null, o2.options.debug && console.log('Caret position reset due to "'.concat(null == t4 ? void 0 : t4.type, '" event'), t4));
                  });
                }
              },
              {
                key: "recurseButtons",
                value: function(t4) {
                  var e4 = this;
                  t4 && Object.keys(this.buttonElements).forEach(function(n3) {
                    return e4.buttonElements[n3].forEach(t4);
                  });
                }
              },
              {
                key: "destroy",
                value: function() {
                  this.options.debug && console.log("Destroying simple-keyboard instance: ".concat(this.currentInstanceName));
                  var t4 = this.options.physicalKeyboardHighlightPreventDefault, e4 = void 0 !== t4 && t4;
                  document.removeEventListener("keyup", this.handleKeyUp, e4), document.removeEventListener("keydown", this.handleKeyDown, e4), document.removeEventListener("mouseup", this.handleMouseUp), document.removeEventListener("touchend", this.handleTouchEnd), document.removeEventListener("select", this.handleSelect), document.removeEventListener("selectionchange", this.handleSelectionChange), document.onpointerup = null, document.ontouchend = null, document.ontouchcancel = null, document.onmouseup = null, this.recurseButtons(function(t5) {
                    t5 && (t5.onpointerdown = null, t5.onpointerup = null, t5.onpointercancel = null, t5.ontouchstart = null, t5.ontouchend = null, t5.ontouchcancel = null, t5.onclick = null, t5.onmousedown = null, t5.onmouseup = null, t5.remove(), t5 = null);
                  }), this.keyboardDOM.onpointerdown = null, this.keyboardDOM.ontouchstart = null, this.keyboardDOM.onmousedown = null, this.resetRows(), this.candidateBox && (this.candidateBox.destroy(), this.candidateBox = null), this.activeInputElement = null, this.keyboardDOM.removeAttribute("data-skInstance"), this.keyboardDOM.innerHTML = "", window.SimpleKeyboardInstances[this.currentInstanceName] = null, delete window.SimpleKeyboardInstances[this.currentInstanceName], this.initialized = false;
                }
              },
              {
                key: "getButtonThemeClasses",
                value: function(t4) {
                  var e4 = this.options.buttonTheme, n3 = [];
                  return Array.isArray(e4) && e4.forEach(function(e5) {
                    if (e5 && e5.class && "string" == typeof e5.class && e5.buttons && "string" == typeof e5.buttons) {
                      var o2 = e5.class.split(" ");
                      e5.buttons.split(" ").includes(t4) && (n3 = [].concat(E(n3), E(o2)));
                    } else
                      console.warn('Incorrect "buttonTheme". Please check the documentation.', e5);
                  }), n3;
                }
              },
              {
                key: "setDOMButtonAttributes",
                value: function(t4, e4) {
                  var n3 = this.options.buttonAttributes;
                  Array.isArray(n3) && n3.forEach(function(n4) {
                    n4.attribute && "string" == typeof n4.attribute && n4.value && "string" == typeof n4.value && n4.buttons && "string" == typeof n4.buttons ? n4.buttons.split(" ").includes(t4) && e4(n4.attribute, n4.value) : console.warn('Incorrect "buttonAttributes". Please check the documentation.', n4);
                  });
                }
              },
              {
                key: "onTouchDeviceDetected",
                value: function() {
                  this.processAutoTouchEvents(), this.disableContextualWindow();
                }
              },
              {
                key: "disableContextualWindow",
                value: function() {
                  window.oncontextmenu = function(t4) {
                    if (t4.target.classList.contains("hg-button"))
                      return t4.preventDefault(), t4.stopPropagation(), false;
                  };
                }
              },
              {
                key: "processAutoTouchEvents",
                value: function() {
                  this.options.autoUseTouchEvents && (this.options.useTouchEvents = true, this.options.debug && console.log("autoUseTouchEvents: Touch device detected, useTouchEvents enabled."));
                }
              },
              {
                key: "onInit",
                value: function() {
                  this.options.debug && console.log("".concat(this.keyboardDOMClass, " Initialized")), this.setEventListeners(), "function" == typeof this.options.onInit && this.options.onInit(this);
                }
              },
              {
                key: "beforeFirstRender",
                value: function() {
                  this.utilities.isTouchDevice() && this.onTouchDeviceDetected(), "function" == typeof this.options.beforeFirstRender && this.options.beforeFirstRender(this), this.isFirstKeyboardInstance && this.utilities.pointerEventsSupported() && !this.options.useTouchEvents && !this.options.useMouseEvents && this.options.debug && console.log("Using PointerEvents as it is supported by this browser"), this.options.useTouchEvents && this.options.debug && console.log("useTouchEvents has been enabled. Only touch events will be used.");
                }
              },
              {
                key: "beforeRender",
                value: function() {
                  "function" == typeof this.options.beforeRender && this.options.beforeRender(this);
                }
              },
              {
                key: "onRender",
                value: function() {
                  "function" == typeof this.options.onRender && this.options.onRender(this);
                }
              },
              {
                key: "onModulesLoaded",
                value: function() {
                  "function" == typeof this.options.onModulesLoaded && this.options.onModulesLoaded(this);
                }
              },
              {
                key: "loadModules",
                value: function() {
                  var t4 = this;
                  Array.isArray(this.options.modules) && (this.options.modules.forEach(function(e4) {
                    var n3 = new e4(t4);
                    n3.init && n3.init(t4);
                  }), this.keyboardPluginClasses = "modules-loaded", this.render(), this.onModulesLoaded());
                }
              },
              {
                key: "getModuleProp",
                value: function(t4, e4) {
                  return !!this.modules[t4] && this.modules[t4][e4];
                }
              },
              {
                key: "getModulesList",
                value: function() {
                  return Object.keys(this.modules);
                }
              },
              {
                key: "parseRowDOMContainers",
                value: function(t4, e4, n3, o2) {
                  var r2 = this, i2 = Array.from(t4.children), a2 = 0;
                  return i2.length && n3.forEach(function(n4, s2) {
                    var u2 = o2[s2];
                    if (!(u2 && u2 > n4))
                      return false;
                    var c2 = n4 - a2, l2 = u2 - a2, f2 = document.createElement("div");
                    f2.className += "hg-button-container";
                    var d2 = "".concat(r2.options.layoutName, "-r").concat(e4, "c").concat(s2);
                    f2.setAttribute("data-skUID", d2);
                    var p3 = i2.splice(c2, l2 - c2 + 1);
                    a2 = l2 - c2, p3.forEach(function(t5) {
                      return f2.appendChild(t5);
                    }), i2.splice(c2, 0, f2), t4.innerHTML = "", i2.forEach(function(e5) {
                      return t4.appendChild(e5);
                    }), r2.options.debug && console.log("rowDOMContainer", p3, c2, l2, a2 + 1);
                  }), t4;
                }
              },
              {
                key: "render",
                value: function() {
                  var t4 = this;
                  this.resetRows(), this.initialized || this.beforeFirstRender(), this.beforeRender();
                  var e4 = "hg-layout-".concat(this.options.layoutName), n3 = this.options.layout || {
                    default: [
                      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                      "{tab} q w e r t y u i o p [ ] \\",
                      "{lock} a s d f g h j k l ; ' {enter}",
                      "{shift} z x c v b n m , . / {shift}",
                      ".com @ {space}"
                    ],
                    shift: [
                      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
                      "{tab} Q W E R T Y U I O P { } |",
                      '{lock} A S D F G H J K L : " {enter}',
                      "{shift} Z X C V B N M < > ? {shift}",
                      ".com @ {space}"
                    ]
                  }, o2 = this.options.useTouchEvents || false, r2 = o2 ? "hg-touch-events" : "", i2 = this.options.useMouseEvents || false, a2 = this.options.disableRowButtonContainers;
                  this.keyboardDOM.className = this.getKeyboardClassString(this.options.theme, e4, this.keyboardPluginClasses, r2), this.keyboardDOM.setAttribute("data-skInstance", this.currentInstanceName), this.keyboardRowsDOM = document.createElement("div"), this.keyboardRowsDOM.className = "hg-rows", n3[this.options.layoutName || this.defaultName].forEach(function(e5, n4) {
                    var r3 = e5.split(" ");
                    t4.options.excludeFromLayout && t4.options.excludeFromLayout[t4.options.layoutName || t4.defaultName] && (r3 = r3.filter(function(e6) {
                      return t4.options.excludeFromLayout && !t4.options.excludeFromLayout[t4.options.layoutName || t4.defaultName].includes(e6);
                    }));
                    var s2 = document.createElement("div");
                    s2.className += "hg-row";
                    var u2 = [], c2 = [];
                    r3.forEach(function(e6, r4) {
                      var l2, f2 = !a2 && "string" == typeof e6 && e6.length > 1 && 0 === e6.indexOf("["), d2 = !a2 && "string" == typeof e6 && e6.length > 1 && e6.indexOf("]") === e6.length - 1;
                      f2 && (u2.push(r4), e6 = e6.replace(/\[/g, "")), d2 && (c2.push(r4), e6 = e6.replace(/\]/g, ""));
                      var p3 = t4.utilities.getButtonClass(e6), h3 = t4.utilities.getButtonDisplayName(e6, t4.options.display, t4.options.mergeDisplay), v2 = t4.options.useButtonTag ? "button" : "div", y2 = document.createElement(v2);
                      y2.className += "hg-button ".concat(p3), (l2 = y2.classList).add.apply(l2, E(t4.getButtonThemeClasses(e6))), t4.setDOMButtonAttributes(e6, function(t5, e7) {
                        y2.setAttribute(t5, e7);
                      }), t4.activeButtonClass = "hg-activeButton", !t4.utilities.pointerEventsSupported() || o2 || i2 ? o2 ? (y2.ontouchstart = function(n5) {
                        t4.handleButtonClicked(e6, n5), t4.handleButtonMouseDown(e6, n5);
                      }, y2.ontouchend = function(n5) {
                        t4.handleButtonMouseUp(e6, n5);
                      }, y2.ontouchcancel = function(n5) {
                        t4.handleButtonMouseUp(e6, n5);
                      }) : (y2.onclick = function(n5) {
                        t4.setMouseHold(false), "function" != typeof t4.options.onKeyReleased && t4.handleButtonClicked(e6, n5);
                      }, y2.onmousedown = function(n5) {
                        "function" != typeof t4.options.onKeyReleased || t4.isMouseHold || t4.handleButtonClicked(e6, n5), t4.handleButtonMouseDown(e6, n5);
                      }, y2.onmouseup = function(n5) {
                        t4.handleButtonMouseUp(e6, n5);
                      }) : (y2.onpointerdown = function(n5) {
                        t4.handleButtonClicked(e6, n5), t4.handleButtonMouseDown(e6, n5);
                      }, y2.onpointerup = function(n5) {
                        t4.handleButtonMouseUp(e6, n5);
                      }, y2.onpointercancel = function(n5) {
                        t4.handleButtonMouseUp(e6, n5);
                      }), y2.setAttribute("data-skBtn", e6);
                      var g2 = "".concat(t4.options.layoutName, "-r").concat(n4, "b").concat(r4);
                      y2.setAttribute("data-skBtnUID", g2);
                      var m2 = document.createElement("span");
                      m2.innerHTML = h3, y2.appendChild(m2), t4.buttonElements[e6] || (t4.buttonElements[e6] = []), t4.buttonElements[e6].push(y2), s2.appendChild(y2);
                    }), s2 = t4.parseRowDOMContainers(s2, n4, u2, c2), t4.keyboardRowsDOM.appendChild(s2);
                  }), this.keyboardDOM.appendChild(this.keyboardRowsDOM), this.onRender(), this.initialized || (this.initialized = true, !this.utilities.pointerEventsSupported() || o2 || i2 ? o2 ? (document.ontouchend = function(e5) {
                    return t4.handleButtonMouseUp(void 0, e5);
                  }, document.ontouchcancel = function(e5) {
                    return t4.handleButtonMouseUp(void 0, e5);
                  }, this.keyboardDOM.ontouchstart = function(e5) {
                    return t4.handleKeyboardContainerMouseDown(e5);
                  }) : o2 || (document.onmouseup = function(e5) {
                    return t4.handleButtonMouseUp(void 0, e5);
                  }, this.keyboardDOM.onmousedown = function(e5) {
                    return t4.handleKeyboardContainerMouseDown(e5);
                  }) : (document.onpointerup = function(e5) {
                    return t4.handleButtonMouseUp(void 0, e5);
                  }, this.keyboardDOM.onpointerdown = function(e5) {
                    return t4.handleKeyboardContainerMouseDown(e5);
                  }), this.onInit());
                }
              }
            ], e3 && P(t3.prototype, e3), n2 && P(t3, n2), Object.defineProperty(t3, "prototype", {
              writable: false
            }), t3;
            var t3, e3, n2;
          }(), M = A, T = A;
        }(), o;
      }();
    });
  })(build);
  var buildExports = build.exports;
  const Keyboard = getDefaultExportFromCjs(buildExports);
  const layout = {
    layout: {
      default: [
        " 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
        "{tab} / ' \u05E7 \u05E8 \u05D0 \u05D8 \u05D5 \u05DF \u05DD \u05E4 ] [ :",
        "{lock} \u05E9 \u05D3 \u05D2 \u05DB \u05E2 \u05D9 \u05D7 \u05DC \u05DA \u05E3 , {enter}",
        "{shift} \u05D6 \u05E1 \u05D1 \u05D4 \u05E0 \u05DE \u05E6 \u05EA \u05E5 . {shift}",
        ".com @ {space}"
      ],
      shift: [
        "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
        "{tab} Q W E R T Y U I O P { } |",
        '{lock} A S D F G H J K L : " {enter}',
        "{shift} Z X C V B N M < > ? {shift}",
        ".com @ {space}"
      ]
    }
  };
  const _sfc_main$2 = defineComponent({
    __name: "Keyboard",
    props: {
      keyboardClass: {},
      input: {}
    },
    emits: [
      "onKeyPress"
    ],
    setup(__props, { emit: __emit }) {
      const emit2 = __emit;
      const props = __props;
      let keyboard = ref(null);
      onMounted(() => {
        keyboard.value = new Keyboard(props.keyboardClass, {
          onKeyPress,
          excludeFromLayout: {
            default: [
              "@",
              ".com",
              "{shift}",
              "{tab}",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "0",
              "=",
              "{lock}",
              ":",
              "[",
              "]",
              "/",
              ".",
              ","
            ]
          },
          ...layout
        });
      });
      function onKeyPress(button) {
        emit2("onKeyPress", button);
        if (button === "{shift}" || button === "{lock}")
          handleShift();
      }
      function handleShift() {
        var _a, _b;
        let currentLayout = (_a = keyboard.value) == null ? void 0 : _a.options.layoutName;
        let shiftToggle = currentLayout === "default" ? "shift" : "default";
        (_b = keyboard.value) == null ? void 0 : _b.setOptions({
          layoutName: shiftToggle
        });
      }
      watch(() => props.input, (input) => {
        var _a;
        (_a = keyboard.value) == null ? void 0 : _a.setInput(input);
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(_ctx.keyboardClass)
        }, null, 2);
      };
    }
  });
  const _withScopeId = (n) => (pushScopeId("data-v-caa42713"), n = n(), popScopeId(), n);
  const _hoisted_1$1 = {
    class: "main-container"
  };
  const _hoisted_2 = _withScopeId(() => createBaseVNode("div", null, "Start typing in Hebrew or enter the word in another language and press search", -1));
  const _hoisted_3 = {
    class: "search-container"
  };
  const _hoisted_4 = {
    class: "search-results"
  };
  const _hoisted_5 = {
    key: 0
  };
  const _hoisted_6 = [
    "onClick"
  ];
  const _hoisted_7 = {
    key: 1
  };
  const _hoisted_8 = _withScopeId(() => createBaseVNode("p", null, "No results found.", -1));
  const _hoisted_9 = [
    _hoisted_8
  ];
  const _sfc_main$1 = defineComponent({
    __name: "Search",
    setup(__props) {
      const searchQuery = ref("");
      const wordResults = ref([]);
      const wordIndexService = new IndexClient();
      const selectedWord = ref(null);
      let translatedVal;
      onMounted(async () => {
        console.log("onMounted");
      });
      const selectWord = (word) => {
        if (selectedWord.value !== word) {
          console.log("selectWord", word);
          selectedWord.value = word;
        }
      };
      const onKeyPress = (button) => {
        switch (button) {
          case "{enter}":
            console.log("enter");
            performSearch();
            break;
          case "{space}":
            console.log("space");
            searchQuery.value = searchQuery.value + " ";
            break;
          case "{bksp}":
            console.log("bksp");
            searchQuery.value = searchQuery.value.slice(0, -1);
            break;
          default:
            searchQuery.value = searchQuery.value + button;
        }
      };
      const performSearch = async () => {
        console.log("performSearch");
        let searchQueryValue = searchQuery.value;
        if (doesNotStartWithHebrew(searchQuery.value)) {
          console.log("searchQuery.value", searchQuery.value);
          translatedVal = await translate(searchQuery.value, "auto", "he");
          console.log("searchQuery.value translated", searchQuery.value, translatedVal);
          searchQueryValue = translatedVal;
        }
        if (searchQueryValue && searchQueryValue.length > 0) {
          console.log("searchQueryValue search", searchQueryValue);
          let value = await wordIndexService.getWordData(searchQueryValue);
          if (value.length > 0) {
            wordResults.value = value;
          } else {
            wordResults.value = await wordIndexService.suggestWordData(searchQueryValue, 15);
          }
        } else {
          wordResults.value = [];
        }
      };
      watch(searchQuery, async (newValue, oldValue) => {
        if (newValue && newValue.length > 1) {
          let value = await wordIndexService.suggestWordData(newValue, 15);
          wordResults.value = value;
        } else {
          wordResults.value = [];
        }
      }, {
        immediate: true
      });
      const getMatchingFroms = (searchResult) => {
        let matchingForms = [];
        let infinitiveMatch = "";
        for (let i = 0; i < searchResult.matching_forms.length; i++) {
          if (searchResult.matching_forms[i] == searchResult.word.forms.length) {
            infinitiveMatch = "Infinitive";
          } else {
            matchingForms.push(searchResult.word.forms[searchResult.matching_forms[i]]);
          }
        }
        let matchingFormsText = matchingForms ? matchingForms.map(formRepr).join("  ,  ") : "";
        if (infinitiveMatch.length > 0 && matchingFormsText.length > 0) {
          matchingFormsText = infinitiveMatch + "  ,  " + matchingFormsText;
        } else if (infinitiveMatch.length > 0) {
          matchingFormsText = infinitiveMatch;
        }
        return matchingFormsText;
      };
      const formRepr = (form) => {
        return `${form.tense} | ${form.person} | ${form.gender} | ${form.number}`;
      };
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$1, [
          _hoisted_2,
          createVNode(_sfc_main$2, {
            onOnKeyPress: onKeyPress,
            input: searchQuery.value,
            "keyboard-class": "simple-keyboard"
          }, null, 8, [
            "input"
          ]),
          createBaseVNode("div", _hoisted_3, [
            withDirectives(createBaseVNode("input", {
              class: "search-input",
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
              placeholder: "Search for words..."
            }, null, 512), [
              [
                vModelText,
                searchQuery.value
              ]
            ]),
            createBaseVNode("button", {
              class: "search-button",
              onClick: performSearch
            }, "Search")
          ]),
          createBaseVNode("div", _hoisted_4, [
            wordResults.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_5, [
              createBaseVNode("p", null, "Search Results for " + toDisplayString(unref(translatedVal) ? unref(translatedVal) : searchQuery.value) + ":", 1),
              createBaseVNode("ul", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(wordResults.value, (searchResult, index) => {
                  return openBlock(), createElementBlock("li", {
                    key: index,
                    onClick: ($event) => selectWord(searchResult),
                    class: "search-result"
                  }, toDisplayString(searchResult.word.word_normalized + ": " + searchResult.word.word_en + "  >>>  " + getMatchingFroms(searchResult)), 9, _hoisted_6);
                }), 128))
              ])
            ])) : (openBlock(), createElementBlock("div", _hoisted_7, _hoisted_9))
          ]),
          selectedWord.value ? (openBlock(), createBlock(WordDataView, {
            key: 0,
            wordData: selectedWord.value.word
          }, null, 8, [
            "wordData"
          ])) : createCommentVNode("", true)
        ]);
      };
    }
  });
  const Search = _export_sfc(_sfc_main$1, [
    [
      "__scopeId",
      "data-v-caa42713"
    ]
  ]);
  const _hoisted_1 = {
    class: "search-container"
  };
  const _sfc_main = defineComponent({
    __name: "SearchView",
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(Search)
        ]);
      };
    }
  });
  const SearchView = _export_sfc(_sfc_main, [
    [
      "__scopeId",
      "data-v-0838ec7d"
    ]
  ]);
  const router = createRouter({
    history: createWebHistory("/pealim-demo/"),
    routes: [
      {
        path: "/",
        name: "search",
        component: SearchView
      }
    ]
  });
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount("#app");
})();
