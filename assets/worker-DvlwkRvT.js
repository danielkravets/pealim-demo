this.document = { currentScript: { src: this.location.href } };
(function() {
  "use strict";
  var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
  (async () => {
    var __vite__wasmUrl = "" + new URL("libpealimrs_bg-BYHqUndX.wasm", _documentCurrentScript && _documentCurrentScript.src || new URL("assets/worker-DvlwkRvT.js", document.baseURI).href).href;
    var __vite__initWasm = async (opts = {}, url) => {
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
    const WordIndexFinalization = typeof FinalizationRegistry === "undefined" ? {
      register: () => {
      },
      unregister: () => {
      }
    } : new FinalizationRegistry((ptr) => wasm$1.__wbg_wordindex_free(ptr >>> 0));
    class WordIndex {
      static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WordIndex.prototype);
        obj.__wbg_ptr = ptr;
        WordIndexFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WordIndexFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm$1.__wbg_wordindex_free(ptr);
      }
      static init_local() {
        const ret = wasm$1.wordindex_init_local();
        return WordIndex.__wrap(ret);
      }
      static build(words) {
        const ptr0 = passArrayJsValueToWasm0(words, wasm$1.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm$1.wordindex_build(ptr0, len0);
        return WordIndex.__wrap(ret);
      }
      get_by_root(root) {
        try {
          const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(root, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          wasm$1.wordindex_get_by_root(retptr, this.__wbg_ptr, ptr0, len0);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 4, 4);
          return v2;
        } finally {
          wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
      }
      get(word) {
        try {
          const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(word, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          wasm$1.wordindex_get(retptr, this.__wbg_ptr, ptr0, len0);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 4, 4);
          return v2;
        } finally {
          wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
      }
      suggest(prefix, limit) {
        try {
          const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(prefix, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          wasm$1.wordindex_suggest(retptr, this.__wbg_ptr, ptr0, len0, limit);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 4, 4);
          return v2;
        } finally {
          wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
      }
      suggest_hebrew(prefix_norm, limit) {
        try {
          const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(prefix_norm, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          wasm$1.wordindex_suggest_hebrew(retptr, this.__wbg_ptr, ptr0, len0, limit);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 4, 4);
          return v2;
        } finally {
          wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
      }
      suggest_by_translation(prefix_norm, limit) {
        try {
          const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(prefix_norm, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          wasm$1.wordindex_suggest_by_translation(retptr, this.__wbg_ptr, ptr0, len0, limit);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 4, 4);
          return v2;
        } finally {
          wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
      }
      matching_forms(word_id, form_str) {
        try {
          const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(word_id, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          const ptr1 = passStringToWasm0(form_str, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          wasm$1.wordindex_matching_forms(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v3 = getArrayU32FromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_free(r0, r1 * 4, 4);
          return v3;
        } finally {
          wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
      }
    }
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
    var wasm = Object.freeze({
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
    });
    __wbg_set_wasm(wasm);
    class WordIndexService {
      wordIndexInstance = null;
      async initializeWordIndex() {
        const t0 = performance.now();
        this.wordIndexInstance = WordIndex.init_local();
        const t1 = performance.now();
        console.log(`init_local took ${(t1 - t0).toFixed(2)} milliseconds.`);
      }
      getWordData(word) {
        if (word && word.length > 0 && this.wordIndexInstance) {
          return this.wordIndexInstance.get(word);
        } else {
          return [];
        }
      }
      suggestWordData(prefix, limit) {
        if (prefix && prefix.length > 1 && this.wordIndexInstance) {
          const t0 = performance.now();
          const wordData = this.wordIndexInstance.suggest(prefix, limit);
          const t1 = performance.now();
          console.log(`suggestWordData took ${(t1 - t0).toFixed(2)} milliseconds.`);
          return wordData;
        } else {
          return [];
        }
      }
      getMatchedForms(url_id, form) {
        if (url_id && form && this.wordIndexInstance) {
          return this.wordIndexInstance.matching_forms(url_id, form);
        } else {
          return new Uint32Array(0);
        }
      }
    }
    const service = new WordIndexService();
    await service.initializeWordIndex();
    onmessage = async (e) => {
      const { method, params, id } = e.data;
      console.log("worker.ts onmessage", method, params, id);
      try {
        switch (method) {
          case "getWordData":
            const wordData = service.getWordData(params.word);
            console.log("getWordData", wordData.length);
            postMessage({
              id,
              result: wrapWithType(serializeArray(wordData), "SearchResult")
            });
            break;
          case "suggestWordData":
            const suggestedWords = service.suggestWordData(params.prefix, params.limit);
            console.log("suggestWordData", suggestedWords.length);
            postMessage({
              id,
              result: wrapWithType(serializeArray(suggestedWords), "SearchResult")
            });
            break;
          case "matchingForms":
            const matchedForms = service.getMatchedForms(params.urlId, params.form);
            console.log("matchedForms", matchedForms.length);
            postMessage({
              id,
              result: wrapWithType(matchedForms, "Uint32Array")
            });
            break;
          default:
            throw new Error("Unknown method");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        postMessage({
          id,
          error: errorMessage
        });
      }
    };
    function wrapWithType(value, type) {
      return {
        type,
        value
      };
    }
    function serializeWordData(instance) {
      return {
        binyan: instance.binyan,
        forms: serializeWordFormArray(instance.forms),
        passive: instance.passive ? serializeWordFormArray(instance.passive) : void 0,
        passive_binyan: instance.passive_binyan,
        root: instance.root,
        transcription: instance.transcription,
        url_id: instance.url_id,
        word: instance.word,
        word_en: instance.word_en,
        word_normalized: instance.word_normalized
      };
    }
    function serializeWordFormArray(forms) {
      return forms.map((form) => {
        return {
          form: form.form,
          form_normalized: form.form_normalized,
          form_vowelled: form.form_vowelled,
          gender: form.gender,
          meaning: form.meaning,
          number: form.number,
          person: form.person,
          tense: form.tense,
          transcription: form.transcription
        };
      });
    }
    function serializeSearchResult(instance) {
      return {
        word: serializeWordData(instance.word),
        matched_forms: instance.matching_forms
      };
    }
    function serializeArray(arr) {
      let result = arr.map((e) => {
        return serializeSearchResult(e);
      });
      console.log("serializeArray", result);
      return result;
    }
  })();
})();
