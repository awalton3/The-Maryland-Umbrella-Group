/**
 * State-based routing for AngularJS 1.x
 * NOTICE: This monolithic bundle also bundles the @uirouter/core code.
 *         This causes it to be incompatible with plugins that depend on @uirouter/core.
 *         We recommend switching to the ui-router-core.js and ui-router-angularjs.js bundles instead.
 *         For more information, see https://ui-router.github.io/blog/uirouter-for-angularjs-umd-bundles
 * @version v1.0.19
 * @link https://ui-router.github.io
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('angular')) :
    typeof define === 'function' && define.amd ? define(['exports', 'angular'], factory) :
    (factory((global['@uirouter/angularjs'] = {}),global.angular));
}(this, (function (exports,ng_from_import) { 'use strict';

    var ng_from_global = angular;
    var ng = ng_from_import && ng_from_import.module ? ng_from_import : ng_from_global;

    /**
     * Higher order functions
     *
     * These utility functions are exported, but are subject to change without notice.
     *
     * @module common_hof
     */ /** */
    /**
     * Returns a new function for [Partial Application](https://en.wikipedia.org/wiki/Partial_application) of the original function.
     *
     * Given a function with N parameters, returns a new function that supports partial application.
     * The new function accepts anywhere from 1 to N parameters.  When that function is called with M parameters,
     * where M is less than N, it returns a new function that accepts the remaining parameters.  It continues to
     * accept more parameters until all N parameters have been supplied.
     *
     *
     * This contrived example uses a partially applied function as an predicate, which returns true
     * if an object is found in both arrays.
     * @example
     * ```
     * // returns true if an object is in both of the two arrays
     * function inBoth(array1, array2, object) {
     *   return array1.indexOf(object) !== -1 &&
     *          array2.indexOf(object) !== 1;
     * }
     * let obj1, obj2, obj3, obj4, obj5, obj6, obj7
     * let foos = [obj1, obj3]
     * let bars = [obj3, obj4, obj5]
     *
     * // A curried "copy" of inBoth
     * let curriedInBoth = curry(inBoth);
     * // Partially apply both the array1 and array2
     * let inFoosAndBars = curriedInBoth(foos, bars);
     *
     * // Supply the final argument; since all arguments are
     * // supplied, the original inBoth function is then called.
     * let obj1InBoth = inFoosAndBars(obj1); // false
     *
     * // Use the inFoosAndBars as a predicate.
     * // Filter, on each iteration, supplies the final argument
     * let allObjs = [ obj1, obj2, obj3, obj4, obj5, obj6, obj7 ];
     * let foundInBoth = allObjs.filter(inFoosAndBars); // [ obj3 ]
     *
     * ```
     *
     * Stolen from: http://stackoverflow.com/questions/4394747/javascript-curry-function
     *
     * @param fn
     * @returns {*|function(): (*|any)}
     */
    function curry(fn) {
        var initial_args = [].slice.apply(arguments, [1]);
        var func_args_length = fn.length;
        function curried(args) {
            if (args.length >= func_args_length)
                return fn.apply(null, args);
            return function () {
                return curried(args.concat([].slice.apply(arguments)));
            };
        }
        return curried(initial_args);
    }
    /**
     * Given a varargs list of functions, returns a function that composes the argument functions, right-to-left
     * given: f(x), g(x), h(x)
     * let composed = compose(f,g,h)
     * then, composed is: f(g(h(x)))
     */
    function compose() {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start, result = args[start].apply(this, arguments);
            while (i--)
                result = args[i].call(this, result);
            return result;
        };
    }
    /**
     * Given a varargs list of functions, returns a function that is composes the argument functions, left-to-right
     * given: f(x), g(x), h(x)
     * let piped = pipe(f,g,h);
     * then, piped is: h(g(f(x)))
     */
    function pipe() {
        var funcs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            funcs[_i] = arguments[_i];
        }
        return compose.apply(null, [].slice.call(arguments).reverse());
    }
    /**
     * Given a property name, returns a function that returns that property from an object
     * let obj = { foo: 1, name: "blarg" };
     * let getName = prop("name");
     * getName(obj) === "blarg"
     */
    var prop = function (name) { return function (obj) { return obj && obj[name]; }; };
    /**
     * Given a property name and a value, returns a function that returns a boolean based on whether
     * the passed object has a property that matches the value
     * let obj = { foo: 1, name: "blarg" };
     * let getName = propEq("name", "blarg");
     * getName(obj) === true
     */
    var propEq = curry(function (name, _val, obj) { return obj && obj[name] === _val; });
    /**
     * Given a dotted property name, returns a function that returns a nested property from an object, or undefined
     * let obj = { id: 1, nestedObj: { foo: 1, name: "blarg" }, };
     * let getName = prop("nestedObj.name");
     * getName(obj) === "blarg"
     * let propNotFound = prop("this.property.doesnt.exist");
     * propNotFound(obj) === undefined
     */
    var parse = function (name) { return pipe.apply(null, name.split('.').map(prop)); };
    /**
     * Given a function that returns a truthy or falsey value, returns a
     * function that returns the opposite (falsey or truthy) value given the same inputs
     */
    var not = function (fn) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return !fn.apply(null, args);
    }; };
    /**
     * Given two functions that return truthy or falsey values, returns a function that returns truthy
     * if both functions return truthy for the given arguments
     */
    function and(fn1, fn2) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fn1.apply(null, args) && fn2.apply(null, args);
        };
    }
    /**
     * Given two functions that return truthy or falsey values, returns a function that returns truthy
     * if at least one of the functions returns truthy for the given arguments
     */
    function or(fn1, fn2) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fn1.apply(null, args) || fn2.apply(null, args);
        };
    }
    /**
     * Check if all the elements of an array match a predicate function
     *
     * @param fn1 a predicate function `fn1`
     * @returns a function which takes an array and returns true if `fn1` is true for all elements of the array
     */
    var all = function (fn1) { return function (arr) { return arr.reduce(function (b, x) { return b && !!fn1(x); }, true); }; };
    // tslint:disable-next-line:variable-name
    var any = function (fn1) { return function (arr) { return arr.reduce(function (b, x) { return b || !!fn1(x); }, false); }; };
    /** Given a class, returns a Predicate function that returns true if the object is of that class */
    var is = function (ctor) { return function (obj) {
        return (obj != null && obj.constructor === ctor) || obj instanceof ctor;
    }; };
    /** Given a value, returns a Predicate function that returns true if another value is === equal to the original value */
    var eq = function (value) { return function (other) { return value === other; }; };
    /** Given a value, returns a function which returns the value */
    var val = function (v) { return function () { return v; }; };
    function invoke(fnName, args) {
        return function (obj) { return obj[fnName].apply(obj, args); };
    }
    /**
     * Sorta like Pattern Matching (a functional programming conditional construct)
     *
     * See http://c2.com/cgi/wiki?PatternMatching
     *
     * This is a conditional construct which allows a series of predicates and output functions
     * to be checked and then applied.  Each predicate receives the input.  If the predicate
     * returns truthy, then its matching output function (mapping function) is provided with
     * the input and, then the result is returned.
     *
     * Each combination (2-tuple) of predicate + output function should be placed in an array
     * of size 2: [ predicate, mapFn ]
     *
     * These 2-tuples should be put in an outer array.
     *
     * @example
     * ```
     *
     * // Here's a 2-tuple where the first element is the isString predicate
     * // and the second element is a function that returns a description of the input
     * let firstTuple = [ angular.isString, (input) => `Heres your string ${input}` ];
     *
     * // Second tuple: predicate "isNumber", mapfn returns a description
     * let secondTuple = [ angular.isNumber, (input) => `(${input}) That's a number!` ];
     *
     * let third = [ (input) => input === null,  (input) => `Oh, null...` ];
     *
     * let fourth = [ (input) => input === undefined,  (input) => `notdefined` ];
     *
     * let descriptionOf = pattern([ firstTuple, secondTuple, third, fourth ]);
     *
     * console.log(descriptionOf(undefined)); // 'notdefined'
     * console.log(descriptionOf(55)); // '(55) That's a number!'
     * console.log(descriptionOf("foo")); // 'Here's your string foo'
     * ```
     *
     * @param struct A 2D array.  Each element of the array should be an array, a 2-tuple,
     * with a Predicate and a mapping/output function
     * @returns {function(any): *}
     */
    function pattern(struct) {
        return function (x) {
            for (var i = 0; i < struct.length; i++) {
                if (struct[i][0](x))
                    return struct[i][1](x);
            }
        };
    }

    /** Predicates
     *
     * These predicates return true/false based on the input.
     * Although these functions are exported, they are subject to change without notice.
     *
     * @module common_predicates
     */
    var toStr = Object.prototype.toString;
    var tis = function (t) { return function (x) { return typeof x === t; }; };
    var isUndefined = tis('undefined');
    var isDefined = not(isUndefined);
    var isNull = function (o) { return o === null; };
    var isNullOrUndefined = or(isNull, isUndefined);
    var isFunction = tis('function');
    var isNumber = tis('number');
    var isString = tis('string');
    var isObject = function (x) { return x !== null && typeof x === 'object'; };
    var isArray = Array.isArray;
    var isDate = (function (x) { return toStr.call(x) === '[object Date]'; });
    var isRegExp = (function (x) { return toStr.call(x) === '[object RegExp]'; });
    /**
     * Predicate which checks if a value is injectable
     *
     * A value is "injectable" if it is a function, or if it is an ng1 array-notation-style array
     * where all the elements in the array are Strings, except the last one, which is a Function
     */
    function isInjectable(val$$1) {
        if (isArray(val$$1) && val$$1.length) {
            var head = val$$1.slice(0, -1), tail = val$$1.slice(-1);
            return !(head.filter(not(isString)).length || tail.filter(not(isFunction)).length);
        }
        return isFunction(val$$1);
    }
    /**
     * Predicate which checks if a value looks like a Promise
     *
     * It is probably a Promise if it's an object, and it has a `then` property which is a Function
     */
    var isPromise = and(isObject, pipe(prop('then'), isFunction));

    var notImplemented = function (fnname) { return function () {
        throw new Error(fnname + "(): No coreservices implementation for UI-Router is loaded.");
    }; };
    var services = {
        $q: undefined,
        $injector: undefined,
    };

    /**
     * Random utility functions used in the UI-Router code
     *
     * These functions are exported, but are subject to change without notice.
     *
     * @preferred
     * @module common
     */
    var root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global) ||
        undefined;
    var angular$1 = root.angular || {};
    var fromJson = angular$1.fromJson || JSON.parse.bind(JSON);
    var toJson = angular$1.toJson || JSON.stringify.bind(JSON);
    var forEach = angular$1.forEach || _forEach;
    var extend = Object.assign || _extend;
    var equals = angular$1.equals || _equals;
    function identity(x) {
        return x;
    }
    function noop() { }
    /**
     * Builds proxy functions on the `to` object which pass through to the `from` object.
     *
     * For each key in `fnNames`, creates a proxy function on the `to` object.
     * The proxy function calls the real function on the `from` object.
     *
     *
     * #### Example:
     * This example creates an new class instance whose functions are prebound to the new'd object.
     * ```js
     * class Foo {
     *   constructor(data) {
     *     // Binds all functions from Foo.prototype to 'this',
     *     // then copies them to 'this'
     *     bindFunctions(Foo.prototype, this, this);
     *     this.data = data;
     *   }
     *
     *   log() {
     *     console.log(this.data);
     *   }
     * }
     *
     * let myFoo = new Foo([1,2,3]);
     * var logit = myFoo.log;
     * logit(); // logs [1, 2, 3] from the myFoo 'this' instance
     * ```
     *
     * #### Example:
     * This example creates a bound version of a service function, and copies it to another object
     * ```
     *
     * var SomeService = {
     *   this.data = [3, 4, 5];
     *   this.log = function() {
     *     console.log(this.data);
     *   }
     * }
     *
     * // Constructor fn
     * function OtherThing() {
     *   // Binds all functions from SomeService to SomeService,
     *   // then copies them to 'this'
     *   bindFunctions(SomeService, this, SomeService);
     * }
     *
     * let myOtherThing = new OtherThing();
     * myOtherThing.log(); // logs [3, 4, 5] from SomeService's 'this'
     * ```
     *
     * @param source A function that returns the source object which contains the original functions to be bound
     * @param target A function that returns the target object which will receive the bound functions
     * @param bind A function that returns the object which the functions will be bound to
     * @param fnNames The function names which will be bound (Defaults to all the functions found on the 'from' object)
     * @param latebind If true, the binding of the function is delayed until the first time it's invoked
     */
    function createProxyFunctions(source, target, bind, fnNames, latebind) {
        if (latebind === void 0) { latebind = false; }
        var bindFunction = function (fnName) { return source()[fnName].bind(bind()); };
        var makeLateRebindFn = function (fnName) {
            return function lateRebindFunction() {
                target[fnName] = bindFunction(fnName);
                return target[fnName].apply(null, arguments);
            };
        };
        fnNames = fnNames || Object.keys(source());
        return fnNames.reduce(function (acc, name) {
            acc[name] = latebind ? makeLateRebindFn(name) : bindFunction(name);
            return acc;
        }, target);
    }
    /**
     * prototypal inheritance helper.
     * Creates a new object which has `parent` object as its prototype, and then copies the properties from `extra` onto it
     */
    var inherit = function (parent, extra) { return extend(Object.create(parent), extra); };
    /** Given an array, returns true if the object is found in the array, (using indexOf) */
    var inArray = curry(_inArray);
    function _inArray(array, obj) {
        return array.indexOf(obj) !== -1;
    }
    /**
     * Given an array, and an item, if the item is found in the array, it removes it (in-place).
     * The same array is returned
     */
    var removeFrom = curry(_removeFrom);
    function _removeFrom(array, obj) {
        var idx = array.indexOf(obj);
        if (idx >= 0)
            array.splice(idx, 1);
        return array;
    }
    /** pushes a values to an array and returns the value */
    var pushTo = curry(_pushTo);
    function _pushTo(arr, val$$1) {
        return arr.push(val$$1), val$$1;
    }
    /** Given an array of (deregistration) functions, calls all functions and removes each one from the source array */
    var deregAll = function (functions) {
        return functions.slice().forEach(function (fn) {
            typeof fn === 'function' && fn();
            removeFrom(functions, fn);
        });
    };
    /**
     * Applies a set of defaults to an options object.  The options object is filtered
     * to only those properties of the objects in the defaultsList.
     * Earlier objects in the defaultsList take precedence when applying defaults.
     */
    function defaults(opts) {
        var defaultsList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            defaultsList[_i - 1] = arguments[_i];
        }
        var defaultVals = extend.apply(void 0, [{}].concat(defaultsList.reverse()));
        return extend(defaultVals, pick(opts || {}, Object.keys(defaultVals)));
    }
    /** Reduce function that merges each element of the list into a single object, using extend */
    var mergeR = function (memo, item) { return extend(memo, item); };
    /**
     * Finds the common ancestor path between two states.
     *
     * @param {Object} first The first state.
     * @param {Object} second The second state.
     * @return {Array} Returns an array of state names in descending order, not including the root.
     */
    function ancestors(first, second) {
        var path = [];
        // tslint:disable-next-line:forin
        for (var n in first.path) {
            if (first.path[n] !== second.path[n])
                break;
            path.push(first.path[n]);
        }
        return path;
    }
    /**
     * Return a copy of the object only containing the whitelisted properties.
     *
     * #### Example:
     * ```
     * var foo = { a: 1, b: 2, c: 3 };
     * var ab = pick(foo, ['a', 'b']); // { a: 1, b: 2 }
     * ```
     * @param obj the source object
     * @param propNames an Array of strings, which are the whitelisted property names
     */
    function pick(obj, propNames) {
        var objCopy = {};
        for (var _prop in obj) {
            if (propNames.indexOf(_prop) !== -1) {
                objCopy[_prop] = obj[_prop];
            }
        }
        return objCopy;
    }
    /**
     * Return a copy of the object omitting the blacklisted properties.
     *
     * @example
     * ```
     *
     * var foo = { a: 1, b: 2, c: 3 };
     * var ab = omit(foo, ['a', 'b']); // { c: 3 }
     * ```
     * @param obj the source object
     * @param propNames an Array of strings, which are the blacklisted property names
     */
    function omit(obj, propNames) {
        return Object.keys(obj)
            .filter(not(inArray(propNames)))
            .reduce(function (acc, key) { return ((acc[key] = obj[key]), acc); }, {});
    }
    /**
     * Maps an array, or object to a property (by name)
     */
    function pluck(collection, propName) {
        return map(collection, prop(propName));
    }
    /** Filters an Array or an Object's properties based on a predicate */
    function filter(collection, callback) {
        var arr = isArray(collection), result = arr ? [] : {};
        var accept = arr ? function (x) { return result.push(x); } : function (x, key) { return (result[key] = x); };
        forEach(collection, function (item, i) {
            if (callback(item, i))
                accept(item, i);
        });
        return result;
    }
    /** Finds an object from an array, or a property of an object, that matches a predicate */
    function find(collection, callback) {
        var result;
        forEach(collection, function (item, i) {
            if (result)
                return;
            if (callback(item, i))
                result = item;
        });
        return result;
    }
    /** Given an object, returns a new object, where each property is transformed by the callback function */
    var mapObj = map;
    /** Maps an array or object properties using a callback function */
    function map(collection, callback, target) {
        target = target || (isArray(collection) ? [] : {});
        forEach(collection, function (item, i) { return (target[i] = callback(item, i)); });
        return target;
    }
    /**
     * Given an object, return its enumerable property values
     *
     * @example
     * ```
     *
     * let foo = { a: 1, b: 2, c: 3 }
     * let vals = values(foo); // [ 1, 2, 3 ]
     * ```
     */
    var values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
    /**
     * Reduce function that returns true if all of the values are truthy.
     *
     * @example
     * ```
     *
     * let vals = [ 1, true, {}, "hello world"];
     * vals.reduce(allTrueR, true); // true
     *
     * vals.push(0);
     * vals.reduce(allTrueR, true); // false
     * ```
     */
    var allTrueR = function (memo, elem) { return memo && elem; };
    /**
     * Reduce function that returns true if any of the values are truthy.
     *
     *  * @example
     * ```
     *
     * let vals = [ 0, null, undefined ];
     * vals.reduce(anyTrueR, true); // false
     *
     * vals.push("hello world");
     * vals.reduce(anyTrueR, true); // true
     * ```
     */
    var anyTrueR = function (memo, elem) { return memo || elem; };
    /**
     * Reduce function which un-nests a single level of arrays
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * input.reduce(unnestR, []) // [ "a", "b", "c", "d", [ "double, "nested" ] ]
     * ```
     */
    var unnestR = function (memo, elem) { return memo.concat(elem); };
    /**
     * Reduce function which recursively un-nests all arrays
     *
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * input.reduce(unnestR, []) // [ "a", "b", "c", "d", "double, "nested" ]
     * ```
     */
    var flattenR = function (memo, elem) {
        return isArray(elem) ? memo.concat(elem.reduce(flattenR, [])) : pushR(memo, elem);
    };
    /**
     * Reduce function that pushes an object to an array, then returns the array.
     * Mostly just for [[flattenR]] and [[uniqR]]
     */
    function pushR(arr, obj) {
        arr.push(obj);
        return arr;
    }
    /** Reduce function that filters out duplicates */
    var uniqR = function (acc, token) { return (inArray(acc, token) ? acc : pushR(acc, token)); };
    /**
     * Return a new array with a single level of arrays unnested.
     *
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * unnest(input) // [ "a", "b", "c", "d", [ "double, "nested" ] ]
     * ```
     */
    var unnest = function (arr) { return arr.reduce(unnestR, []); };
    /**
     * Return a completely flattened version of an array.
     *
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * flatten(input) // [ "a", "b", "c", "d", "double, "nested" ]
     * ```
     */
    var flatten = function (arr) { return arr.reduce(flattenR, []); };
    /**
     * Given a .filter Predicate, builds a .filter Predicate which throws an error if any elements do not pass.
     * @example
     * ```
     *
     * let isNumber = (obj) => typeof(obj) === 'number';
     * let allNumbers = [ 1, 2, 3, 4, 5 ];
     * allNumbers.filter(assertPredicate(isNumber)); //OK
     *
     * let oneString = [ 1, 2, 3, 4, "5" ];
     * oneString.filter(assertPredicate(isNumber, "Not all numbers")); // throws Error(""Not all numbers"");
     * ```
     */
    var assertPredicate = assertFn;
    /**
     * Given a .map function, builds a .map function which throws an error if any mapped elements do not pass a truthyness test.
     * @example
     * ```
     *
     * var data = { foo: 1, bar: 2 };
     *
     * let keys = [ 'foo', 'bar' ]
     * let values = keys.map(assertMap(key => data[key], "Key not found"));
     * // values is [1, 2]
     *
     * let keys = [ 'foo', 'bar', 'baz' ]
     * let values = keys.map(assertMap(key => data[key], "Key not found"));
     * // throws Error("Key not found")
     * ```
     */
    var assertMap = assertFn;
    function assertFn(predicateOrMap, errMsg) {
        if (errMsg === void 0) { errMsg = 'assert failure'; }
        return function (obj) {
            var result = predicateOrMap(obj);
            if (!result) {
                throw new Error(isFunction(errMsg) ? errMsg(obj) : errMsg);
            }
            return result;
        };
    }
    /**
     * Like _.pairs: Given an object, returns an array of key/value pairs
     *
     * @example
     * ```
     *
     * pairs({ foo: "FOO", bar: "BAR }) // [ [ "foo", "FOO" ], [ "bar": "BAR" ] ]
     * ```
     */
    var pairs = function (obj) { return Object.keys(obj).map(function (key) { return [key, obj[key]]; }); };
    /**
     * Given two or more parallel arrays, returns an array of tuples where
     * each tuple is composed of [ a[i], b[i], ... z[i] ]
     *
     * @example
     * ```
     *
     * let foo = [ 0, 2, 4, 6 ];
     * let bar = [ 1, 3, 5, 7 ];
     * let baz = [ 10, 30, 50, 70 ];
     * arrayTuples(foo, bar);       // [ [0, 1], [2, 3], [4, 5], [6, 7] ]
     * arrayTuples(foo, bar, baz);  // [ [0, 1, 10], [2, 3, 30], [4, 5, 50], [6, 7, 70] ]
     * ```
     */
    function arrayTuples() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 0)
            return [];
        var maxArrayLen = args.reduce(function (min, arr) { return Math.min(arr.length, min); }, 9007199254740991); // aka 2^53 − 1 aka Number.MAX_SAFE_INTEGER
        var result = [];
        var _loop_1 = function (i) {
            // This is a hot function
            // Unroll when there are 1-4 arguments
            switch (args.length) {
                case 1:
                    result.push([args[0][i]]);
                    break;
                case 2:
                    result.push([args[0][i], args[1][i]]);
                    break;
                case 3:
                    result.push([args[0][i], args[1][i], args[2][i]]);
                    break;
                case 4:
                    result.push([args[0][i], args[1][i], args[2][i], args[3][i]]);
                    break;
                default:
                    result.push(args.map(function (array) { return array[i]; }));
                    break;
            }
        };
        for (var i = 0; i < maxArrayLen; i++) {
            _loop_1(i);
        }
        return result;
    }
    /**
     * Reduce function which builds an object from an array of [key, value] pairs.
     *
     * Each iteration sets the key/val pair on the memo object, then returns the memo for the next iteration.
     *
     * Each keyValueTuple should be an array with values [ key: string, value: any ]
     *
     * @example
     * ```
     *
     * var pairs = [ ["fookey", "fooval"], ["barkey", "barval"] ]
     *
     * var pairsToObj = pairs.reduce((memo, pair) => applyPairs(memo, pair), {})
     * // pairsToObj == { fookey: "fooval", barkey: "barval" }
     *
     * // Or, more simply:
     * var pairsToObj = pairs.reduce(applyPairs, {})
     * // pairsToObj == { fookey: "fooval", barkey: "barval" }
     * ```
     */
    function applyPairs(memo, keyValTuple) {
        var key, value;
        if (isArray(keyValTuple))
            key = keyValTuple[0], value = keyValTuple[1];
        if (!isString(key))
            throw new Error('invalid parameters to applyPairs');
        memo[key] = value;
        return memo;
    }
    /** Get the last element of an array */
    function tail(arr) {
        return (arr.length && arr[arr.length - 1]) || undefined;
    }
    /**
     * shallow copy from src to dest
     */
    function copy(src, dest) {
        if (dest)
            Object.keys(dest).forEach(function (key) { return delete dest[key]; });
        if (!dest)
            dest = {};
        return extend(dest, src);
    }
    /** Naive forEach implementation works with Objects or Arrays */
    function _forEach(obj, cb, _this) {
        if (isArray(obj))
            return obj.forEach(cb, _this);
        Object.keys(obj).forEach(function (key) { return cb(obj[key], key); });
    }
    function _extend(toObj) {
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j++) {
                toObj[keys[j]] = obj[keys[j]];
            }
        }
        return toObj;
    }
    function _equals(o1, o2) {
        if (o1 === o2)
            return true;
        if (o1 === null || o2 === null)
            return false;
        if (o1 !== o1 && o2 !== o2)
            return true; // NaN === NaN
        var t1 = typeof o1, t2 = typeof o2;
        if (t1 !== t2 || t1 !== 'object')
            return false;
        var tup = [o1, o2];
        if (all(isArray)(tup))
            return _arraysEq(o1, o2);
        if (all(isDate)(tup))
            return o1.getTime() === o2.getTime();
        if (all(isRegExp)(tup))
            return o1.toString() === o2.toString();
        if (all(isFunction)(tup))
            return true; // meh
        var predicates = [isFunction, isArray, isDate, isRegExp];
        if (predicates.map(any).reduce(function (b, fn) { return b || !!fn(tup); }, false))
            return false;
        var keys = {};
        // tslint:disable-next-line:forin
        for (var key in o1) {
            if (!_equals(o1[key], o2[key]))
                return false;
            keys[key] = true;
        }
        for (var key in o2) {
            if (!keys[key])
                return false;
        }
        return true;
    }
    function _arraysEq(a1, a2) {
        if (a1.length !== a2.length)
            return false;
        return arrayTuples(a1, a2).reduce(function (b, t) { return b && _equals(t[0], t[1]); }, true);
    }
    // issue #2676
    var silenceUncaughtInPromise = function (promise) { return promise.catch(function (e) { return 0; }) && promise; };
    var silentRejection = function (error) { return silenceUncaughtInPromise(services.$q.reject(error)); };

    /**
     * @coreapi
     * @module core
     */
    /**
     * Matches state names using glob-like pattern strings.
     *
     * Globs can be used in specific APIs including:
     *
     * - [[StateService.is]]
     * - [[StateService.includes]]
     * - The first argument to Hook Registration functions like [[TransitionService.onStart]]
     *    - [[HookMatchCriteria]] and [[HookMatchCriterion]]
     *
     * A `Glob` string is a pattern which matches state names.
     * Nested state names are split into segments (separated by a dot) when processing.
     * The state named `foo.bar.baz` is split into three segments ['foo', 'bar', 'baz']
     *
     * Globs work according to the following rules:
     *
     * ### Exact match:
     *
     * The glob `'A.B'` matches the state named exactly `'A.B'`.
     *
     * | Glob        |Matches states named|Does not match state named|
     * |:------------|:--------------------|:---------------------|
     * | `'A'`       | `'A'`               | `'B'` , `'A.C'`      |
     * | `'A.B'`     | `'A.B'`             | `'A'` , `'A.B.C'`    |
     * | `'foo'`     | `'foo'`             | `'FOO'` , `'foo.bar'`|
     *
     * ### Single star (`*`)
     *
     * A single star (`*`) is a wildcard that matches exactly one segment.
     *
     * | Glob        |Matches states named  |Does not match state named |
     * |:------------|:---------------------|:--------------------------|
     * | `'*'`       | `'A'` , `'Z'`        | `'A.B'` , `'Z.Y.X'`       |
     * | `'A.*'`     | `'A.B'` , `'A.C'`    | `'A'` , `'A.B.C'`         |
     * | `'A.*.*'`   | `'A.B.C'` , `'A.X.Y'`| `'A'`, `'A.B'` , `'Z.Y.X'`|
     *
     * ### Double star (`**`)
     *
     * A double star (`'**'`) is a wildcard that matches *zero or more segments*
     *
     * | Glob        |Matches states named                           |Does not match state named         |
     * |:------------|:----------------------------------------------|:----------------------------------|
     * | `'**'`      | `'A'` , `'A.B'`, `'Z.Y.X'`                    | (matches all states)              |
     * | `'A.**'`    | `'A'` , `'A.B'` , `'A.C.X'`                   | `'Z.Y.X'`                         |
     * | `'**.X'`    | `'X'` , `'A.X'` , `'Z.Y.X'`                   | `'A'` , `'A.login.Z'`             |
     * | `'A.**.X'`  | `'A.X'` , `'A.B.X'` , `'A.B.C.X'`             | `'A'` , `'A.B.C'`                 |
     *
     */
    var Glob = /** @class */ (function () {
        function Glob(text) {
            this.text = text;
            this.glob = text.split('.');
            var regexpString = this.text
                .split('.')
                .map(function (seg) {
                if (seg === '**')
                    return '(?:|(?:\\.[^.]*)*)';
                if (seg === '*')
                    return '\\.[^.]*';
                return '\\.' + seg;
            })
                .join('');
            this.regexp = new RegExp('^' + regexpString + '$');
        }
        /** Returns true if the string has glob-like characters in it */
        Glob.is = function (text) {
            return !!/[!,*]+/.exec(text);
        };
        /** Returns a glob from the string, or null if the string isn't Glob-like */
        Glob.fromString = function (text) {
            return Glob.is(text) ? new Glob(text) : null;
        };
        Glob.prototype.matches = function (name) {
            return this.regexp.test('.' + name);
        };
        return Glob;
    }());

    /** @module common */
    var Queue = /** @class */ (function () {
        function Queue(_items, _limit) {
            if (_items === void 0) { _items = []; }
            if (_limit === void 0) { _limit = null; }
            this._items = _items;
            this._limit = _limit;
            this._evictListeners = [];
            this.onEvict = pushTo(this._evictListeners);
        }
        Queue.prototype.enqueue = function (item) {
            var items = this._items;
            items.push(item);
            if (this._limit && items.length > this._limit)
                this.evict();
            return item;
        };
        Queue.prototype.evict = function () {
            var item = this._items.shift();
            this._evictListeners.forEach(function (fn) { return fn(item); });
            return item;
        };
        Queue.prototype.dequeue = function () {
            if (this.size())
                return this._items.splice(0, 1)[0];
        };
        Queue.prototype.clear = function () {
            var current = this._items;
            this._items = [];
            return current;
        };
        Queue.prototype.size = function () {
            return this._items.length;
        };
        Queue.prototype.remove = function (item) {
            var idx = this._items.indexOf(item);
            return idx > -1 && this._items.splice(idx, 1)[0];
        };
        Queue.prototype.peekTail = function () {
            return this._items[this._items.length - 1];
        };
        Queue.prototype.peekHead = function () {
            if (this.size())
                return this._items[0];
        };
        return Queue;
    }());

    /**
     * @coreapi
     * @module transition
     */ /** for typedoc */

    (function (RejectType) {
        /**
         * A new transition superseded this one.
         *
         * While this transition was running, a new transition started.
         * This transition is cancelled because it was superseded by new transition.
         */
        RejectType[RejectType["SUPERSEDED"] = 2] = "SUPERSEDED";
        /**
         * The transition was aborted
         *
         * The transition was aborted by a hook which returned `false`
         */
        RejectType[RejectType["ABORTED"] = 3] = "ABORTED";
        /**
         * The transition was invalid
         *
         * The transition was never started because it was invalid
         */
        RejectType[RejectType["INVALID"] = 4] = "INVALID";
        /**
         * The transition was ignored
         *
         * The transition was ignored because it would have no effect.
         *
         * Either:
         *
         * - The transition is targeting the current state and parameter values
         * - The transition is targeting the same state and parameter values as the currently running transition.
         */
        RejectType[RejectType["IGNORED"] = 5] = "IGNORED";
        /**
         * The transition errored.
         *
         * This generally means a hook threw an error or returned a rejected promise
         */
        RejectType[RejectType["ERROR"] = 6] = "ERROR";
    })(exports.RejectType || (exports.RejectType = {}));
    /** @hidden */
    var id = 0;
    var Rejection = /** @class */ (function () {
        function Rejection(type, message, detail) {
            /** @hidden */
            this.$id = id++;
            this.type = type;
            this.message = message;
            this.detail = detail;
        }
        /** Returns true if the obj is a rejected promise created from the `asPromise` factory */
        Rejection.isRejectionPromise = function (obj) {
            return obj && typeof obj.then === 'function' && is(Rejection)(obj._transitionRejection);
        };
        /** Returns a Rejection due to transition superseded */
        Rejection.superseded = function (detail, options) {
            var message = 'The transition has been superseded by a different transition';
            var rejection = new Rejection(exports.RejectType.SUPERSEDED, message, detail);
            if (options && options.redirected) {
                rejection.redirected = true;
            }
            return rejection;
        };
        /** Returns a Rejection due to redirected transition */
        Rejection.redirected = function (detail) {
            return Rejection.superseded(detail, { redirected: true });
        };
        /** Returns a Rejection due to invalid transition */
        Rejection.invalid = function (detail) {
            var message = 'This transition is invalid';
            return new Rejection(exports.RejectType.INVALID, message, detail);
        };
        /** Returns a Rejection due to ignored transition */
        Rejection.ignored = function (detail) {
            var message = 'The transition was ignored';
            return new Rejection(exports.RejectType.IGNORED, message, detail);
        };
        /** Returns a Rejection due to aborted transition */
        Rejection.aborted = function (detail) {
            var message = 'The transition has been aborted';
            return new Rejection(exports.RejectType.ABORTED, message, detail);
        };
        /** Returns a Rejection due to aborted transition */
        Rejection.errored = function (detail) {
            var message = 'The transition errored';
            return new Rejection(exports.RejectType.ERROR, message, detail);
        };
        /**
         * Returns a Rejection
         *
         * Normalizes a value as a Rejection.
         * If the value is already a Rejection, returns it.
         * Otherwise, wraps and returns the value as a Rejection (Rejection type: ERROR).
         *
         * @returns `detail` if it is already a `Rejection`, else returns an ERROR Rejection.
         */
        Rejection.normalize = function (detail) {
            return is(Rejection)(detail) ? detail : Rejection.errored(detail);
        };
        Rejection.prototype.toString = function () {
            var detailString = function (d) { return (d && d.toString !== Object.prototype.toString ? d.toString() : stringify(d)); };
            var detail = detailString(this.detail);
            var _a = this, $id = _a.$id, type = _a.type, message = _a.message;
            return "Transition Rejection($id: " + $id + " type: " + type + ", message: " + message + ", detail: " + detail + ")";
        };
        Rejection.prototype.toPromise = function () {
            return extend(silentRejection(this), { _transitionRejection: this });
        };
        return Rejection;
    }());

    /**
     * Functions that manipulate strings
     *
     * Although these functions are exported, they are subject to change without notice.
     *
     * @module common_strings
     */ /** */
    /**
     * Returns a string shortened to a maximum length
     *
     * If the string is already less than the `max` length, return the string.
     * Else return the string, shortened to `max - 3` and append three dots ("...").
     *
     * @param max the maximum length of the string to return
     * @param str the input string
     */
    function maxLength(max, str) {
        if (str.length <= max)
            return str;
        return str.substr(0, max - 3) + '...';
    }
    /**
     * Returns a string, with spaces added to the end, up to a desired str length
     *
     * If the string is already longer than the desired length, return the string.
     * Else returns the string, with extra spaces on the end, such that it reaches `length` characters.
     *
     * @param length the desired length of the string to return
     * @param str the input string
     */
    function padString(length, str) {
        while (str.length < length)
            str += ' ';
        return str;
    }
    function kebobString(camelCase) {
        return camelCase
            .replace(/^([A-Z])/, function ($1) { return $1.toLowerCase(); }) // replace first char
            .replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); }); // replace rest
    }
    function functionToString(fn) {
        var fnStr = fnToString(fn);
        var namedFunctionMatch = fnStr.match(/^(function [^ ]+\([^)]*\))/);
        var toStr = namedFunctionMatch ? namedFunctionMatch[1] : fnStr;
        var fnName = fn['name'] || '';
        if (fnName && toStr.match(/function \(/)) {
            return 'function ' + fnName + toStr.substr(9);
        }
        return toStr;
    }
    function fnToString(fn) {
        var _fn = isArray(fn) ? fn.slice(-1)[0] : fn;
        return (_fn && _fn.toString()) || 'undefined';
    }
    var isRejection = Rejection.isRejectionPromise;
    var hasToString = function (obj) {
        return isObject(obj) && !isArray(obj) && obj.constructor !== Object && isFunction(obj.toString);
    };
    var stringifyPattern = pattern([
        [isUndefined, val('undefined')],
        [isNull, val('null')],
        [isPromise, val('[Promise]')],
        [isRejection, function (x) { return x._transitionRejection.toString(); }],
        [hasToString, function (x) { return x.toString(); }],
        [isInjectable, functionToString],
        [val(true), identity],
    ]);
    function stringify(o) {
        var seen = [];
        function format(value) {
            if (isObject(value)) {
                if (seen.indexOf(value) !== -1)
                    return '[circular ref]';
                seen.push(value);
            }
            return stringifyPattern(value);
        }
        if (isUndefined(o)) {
            // Workaround for IE & Edge Spec incompatibility where replacer function would not be called when JSON.stringify
            // is given `undefined` as value. To work around that, we simply detect `undefined` and bail out early by
            // manually stringifying it.
            return format(o);
        }
        return JSON.stringify(o, function (key, value) { return format(value); }).replace(/\\"/g, '"');
    }
    /** Returns a function that splits a string on a character or substring */
    var beforeAfterSubstr = function (char) { return function (str) {
        if (!str)
            return ['', ''];
        var idx = str.indexOf(char);
        if (idx === -1)
            return [str, ''];
        return [str.substr(0, idx), str.substr(idx + 1)];
    }; };
    var hostRegex = new RegExp('^(?:[a-z]+:)?//[^/]+/');
    var stripLastPathElement = function (str) { return str.replace(/\/[^/]*$/, ''); };
    var splitHash = beforeAfterSubstr('#');
    var splitQuery = beforeAfterSubstr('?');
    var splitEqual = beforeAfterSubstr('=');
    var trimHashVal = function (str) { return (str ? str.replace(/^#/, '') : ''); };
    /**
     * Splits on a delimiter, but returns the delimiters in the array
     *
     * #### Example:
     * ```js
     * var splitOnSlashes = splitOnDelim('/');
     * splitOnSlashes("/foo"); // ["/", "foo"]
     * splitOnSlashes("/foo/"); // ["/", "foo", "/"]
     * ```
     */
    function splitOnDelim(delim) {
        var re = new RegExp('(' + delim + ')', 'g');
        return function (str) { return str.split(re).filter(identity); };
    }
    /**
     * Reduce fn that joins neighboring strings
     *
     * Given an array of strings, returns a new array
     * where all neighboring strings have been joined.
     *
     * #### Example:
     * ```js
     * let arr = ["foo", "bar", 1, "baz", "", "qux" ];
     * arr.reduce(joinNeighborsR, []) // ["foobar", 1, "bazqux" ]
     * ```
     */
    function joinNeighborsR(acc, x) {
        if (isString(tail(acc)) && isString(x))
            return acc.slice(0, -1).concat(tail(acc) + x);
        return pushR(acc, x);
    }

    /**
     * # Transition tracing (debug)
     *
     * Enable transition tracing to print transition information to the console,
     * in order to help debug your application.
     * Tracing logs detailed information about each Transition to your console.
     *
     * To enable tracing, import the [[Trace]] singleton and enable one or more categories.
     *
     * ### ES6
     * ```js
     * import {trace} from "@uirouter/core";
     * trace.enable(1, 5); // TRANSITION and VIEWCONFIG
     * ```
     *
     * ### CJS
     * ```js
     * let trace = require("@uirouter/core").trace;
     * trace.enable("TRANSITION", "VIEWCONFIG");
     * ```
     *
     * ### Globals
     * ```js
     * let trace = window["@uirouter/core"].trace;
     * trace.enable(); // Trace everything (very verbose)
     * ```
     *
     * ### Angular 1:
     * ```js
     * app.run($trace => $trace.enable());
     * ```
     *
     * @coreapi
     * @module trace
     */
    /** @hidden */
    function uiViewString(uiview) {
        if (!uiview)
            return 'ui-view (defunct)';
        var state = uiview.creationContext ? uiview.creationContext.name || '(root)' : '(none)';
        return "[ui-view#" + uiview.id + " " + uiview.$type + ":" + uiview.fqn + " (" + uiview.name + "@" + state + ")]";
    }
    /** @hidden */
    var viewConfigString = function (viewConfig) {
        var view = viewConfig.viewDecl;
        var state = view.$context.name || '(root)';
        return "[View#" + viewConfig.$id + " from '" + state + "' state]: target ui-view: '" + view.$uiViewName + "@" + view.$uiViewContextAnchor + "'";
    };
    /** @hidden */
    function normalizedCat(input) {
        return isNumber(input) ? exports.Category[input] : exports.Category[exports.Category[input]];
    }
    /** @hidden */
    var consoleLog = Function.prototype.bind.call(console.log, console);
    /** @hidden */
    var consoletable = isFunction(console.table) ? console.table.bind(console) : consoleLog.bind(console);
    /**
     * Trace categories Enum
     *
     * Enable or disable a category using [[Trace.enable]] or [[Trace.disable]]
     *
     * `trace.enable(Category.TRANSITION)`
     *
     * These can also be provided using a matching string, or position ordinal
     *
     * `trace.enable("TRANSITION")`
     *
     * `trace.enable(1)`
     */

    (function (Category) {
        Category[Category["RESOLVE"] = 0] = "RESOLVE";
        Category[Category["TRANSITION"] = 1] = "TRANSITION";
        Category[Category["HOOK"] = 2] = "HOOK";
        Category[Category["UIVIEW"] = 3] = "UIVIEW";
        Category[Category["VIEWCONFIG"] = 4] = "VIEWCONFIG";
    })(exports.Category || (exports.Category = {}));
    /** @hidden */
    var _tid = parse('$id');
    /** @hidden */
    var _rid = parse('router.$id');
    /** @hidden */
    var transLbl = function (trans) { return "Transition #" + _tid(trans) + "-" + _rid(trans); };
    /**
     * Prints UI-Router Transition trace information to the console.
     */
    var Trace = /** @class */ (function () {
        /** @hidden */
        function Trace() {
            /** @hidden */
            this._enabled = {};
            this.approximateDigests = 0;
        }
        /** @hidden */
        Trace.prototype._set = function (enabled, categories) {
            var _this = this;
            if (!categories.length) {
                categories = Object.keys(exports.Category)
                    .map(function (k) { return parseInt(k, 10); })
                    .filter(function (k) { return !isNaN(k); })
                    .map(function (key) { return exports.Category[key]; });
            }
            categories.map(normalizedCat).forEach(function (category) { return (_this._enabled[category] = enabled); });
        };
        Trace.prototype.enable = function () {
            var categories = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                categories[_i] = arguments[_i];
            }
            this._set(true, categories);
        };
        Trace.prototype.disable = function () {
            var categories = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                categories[_i] = arguments[_i];
            }
            this._set(false, categories);
        };
        /**
         * Retrieves the enabled stateus of a [[Category]]
         *
         * ```js
         * trace.enabled("VIEWCONFIG"); // true or false
         * ```
         *
         * @returns boolean true if the category is enabled
         */
        Trace.prototype.enabled = function (category) {
            return !!this._enabled[normalizedCat(category)];
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceTransitionStart = function (trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": Started  -> " + stringify(trans));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceTransitionIgnored = function (trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": Ignored  <> " + stringify(trans));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceHookInvocation = function (step, trans, options) {
            if (!this.enabled(exports.Category.HOOK))
                return;
            var event = parse('traceData.hookType')(options) || 'internal', context = parse('traceData.context.state.name')(options) || parse('traceData.context')(options) || 'unknown', name = functionToString(step.registeredHook.callback);
            console.log(transLbl(trans) + ":   Hook -> " + event + " context: " + context + ", " + maxLength(200, name));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceHookResult = function (hookResult, trans, transitionOptions) {
            if (!this.enabled(exports.Category.HOOK))
                return;
            console.log(transLbl(trans) + ":   <- Hook returned: " + maxLength(200, stringify(hookResult)));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceResolvePath = function (path, when, trans) {
            if (!this.enabled(exports.Category.RESOLVE))
                return;
            console.log(transLbl(trans) + ":         Resolving " + path + " (" + when + ")");
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceResolvableResolved = function (resolvable, trans) {
            if (!this.enabled(exports.Category.RESOLVE))
                return;
            console.log(transLbl(trans) + ":               <- Resolved  " + resolvable + " to: " + maxLength(200, stringify(resolvable.data)));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceError = function (reason, trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": <- Rejected " + stringify(trans) + ", reason: " + reason);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceSuccess = function (finalState, trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": <- Success  " + stringify(trans) + ", final state: " + finalState.name);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceUIViewEvent = function (event, viewData, extra) {
            if (extra === void 0) { extra = ''; }
            if (!this.enabled(exports.Category.UIVIEW))
                return;
            console.log("ui-view: " + padString(30, event) + " " + uiViewString(viewData) + extra);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceUIViewConfigUpdated = function (viewData, context) {
            if (!this.enabled(exports.Category.UIVIEW))
                return;
            this.traceUIViewEvent('Updating', viewData, " with ViewConfig from context='" + context + "'");
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceUIViewFill = function (viewData, html) {
            if (!this.enabled(exports.Category.UIVIEW))
                return;
            this.traceUIViewEvent('Fill', viewData, " with: " + maxLength(200, html));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceViewSync = function (pairs) {
            if (!this.enabled(exports.Category.VIEWCONFIG))
                return;
            var uivheader = 'uiview component fqn';
            var cfgheader = 'view config state (view name)';
            var mapping = pairs
                .map(function (_a) {
                var uiView = _a.uiView, viewConfig = _a.viewConfig;
                var _b;
                var uiv = uiView && uiView.fqn;
                var cfg = viewConfig && viewConfig.viewDecl.$context.name + ": (" + viewConfig.viewDecl.$name + ")";
                return _b = {}, _b[uivheader] = uiv, _b[cfgheader] = cfg, _b;
            })
                .sort(function (a, b) { return (a[uivheader] || '').localeCompare(b[uivheader] || ''); });
            consoletable(mapping);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceViewServiceEvent = function (event, viewConfig) {
            if (!this.enabled(exports.Category.VIEWCONFIG))
                return;
            console.log("VIEWCONFIG: " + event + " " + viewConfigString(viewConfig));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceViewServiceUIViewEvent = function (event, viewData) {
            if (!this.enabled(exports.Category.VIEWCONFIG))
                return;
            console.log("VIEWCONFIG: " + event + " " + uiViewString(viewData));
        };
        return Trace;
    }());
    /**
     * The [[Trace]] singleton
     *
     * #### Example:
     * ```js
     * import {trace} from "@uirouter/core";
     * trace.enable(1, 5);
     * ```
     */
    var trace = new Trace();

    /** @module common */ /** for typedoc */

    /**
     * @coreapi
     * @module params
     */
    /**
     * An internal class which implements [[ParamTypeDefinition]].
     *
     * A [[ParamTypeDefinition]] is a plain javascript object used to register custom parameter types.
     * When a param type definition is registered, an instance of this class is created internally.
     *
     * This class has naive implementations for all the [[ParamTypeDefinition]] methods.
     *
     * Used by [[UrlMatcher]] when matching or formatting URLs, or comparing and validating parameter values.
     *
     * #### Example:
     * ```js
     * var paramTypeDef = {
     *   decode: function(val) { return parseInt(val, 10); },
     *   encode: function(val) { return val && val.toString(); },
     *   equals: function(a, b) { return this.is(a) && a === b; },
     *   is: function(val) { return angular.isNumber(val) && isFinite(val) && val % 1 === 0; },
     *   pattern: /\d+/
     * }
     *
     * var paramType = new ParamType(paramTypeDef);
     * ```
     * @internalapi
     */
    var ParamType = /** @class */ (function () {
        /**
         * @param def  A configuration object which contains the custom type definition.  The object's
         *        properties will override the default methods and/or pattern in `ParamType`'s public interface.
         * @returns a new ParamType object
         */
        function ParamType(def) {
            /** @inheritdoc */
            this.pattern = /.*/;
            /** @inheritdoc */
            this.inherit = true;
            extend(this, def);
        }
        // consider these four methods to be "abstract methods" that should be overridden
        /** @inheritdoc */
        ParamType.prototype.is = function (val, key) {
            return true;
        };
        /** @inheritdoc */
        ParamType.prototype.encode = function (val, key) {
            return val;
        };
        /** @inheritdoc */
        ParamType.prototype.decode = function (val, key) {
            return val;
        };
        /** @inheritdoc */
        ParamType.prototype.equals = function (a, b) {
            // tslint:disable-next-line:triple-equals
            return a == b;
        };
        ParamType.prototype.$subPattern = function () {
            var sub = this.pattern.toString();
            return sub.substr(1, sub.length - 2);
        };
        ParamType.prototype.toString = function () {
            return "{ParamType:" + this.name + "}";
        };
        /** Given an encoded string, or a decoded object, returns a decoded object */
        ParamType.prototype.$normalize = function (val) {
            return this.is(val) ? val : this.decode(val);
        };
        /**
         * Wraps an existing custom ParamType as an array of ParamType, depending on 'mode'.
         * e.g.:
         * - urlmatcher pattern "/path?{queryParam[]:int}"
         * - url: "/path?queryParam=1&queryParam=2
         * - $stateParams.queryParam will be [1, 2]
         * if `mode` is "auto", then
         * - url: "/path?queryParam=1 will create $stateParams.queryParam: 1
         * - url: "/path?queryParam=1&queryParam=2 will create $stateParams.queryParam: [1, 2]
         */
        ParamType.prototype.$asArray = function (mode, isSearch) {
            if (!mode)
                return this;
            if (mode === 'auto' && !isSearch)
                throw new Error("'auto' array mode is for query parameters only");
            return new ArrayType(this, mode);
        };
        return ParamType;
    }());
    /**
     * Wraps up a `ParamType` object to handle array values.
     * @internalapi
     */
    function ArrayType(type, mode) {
        var _this = this;
        // Wrap non-array value as array
        function arrayWrap(val) {
            return isArray(val) ? val : isDefined(val) ? [val] : [];
        }
        // Unwrap array value for "auto" mode. Return undefined for empty array.
        function arrayUnwrap(val) {
            switch (val.length) {
                case 0:
                    return undefined;
                case 1:
                    return mode === 'auto' ? val[0] : val;
                default:
                    return val;
            }
        }
        // Wraps type (.is/.encode/.decode) functions to operate on each value of an array
        function arrayHandler(callback, allTruthyMode) {
            return function handleArray(val) {
                if (isArray(val) && val.length === 0)
                    return val;
                var arr = arrayWrap(val);
                var result = map(arr, callback);
                return allTruthyMode === true ? filter(result, function (x) { return !x; }).length === 0 : arrayUnwrap(result);
            };
        }
        // Wraps type (.equals) functions to operate on each value of an array
        function arrayEqualsHandler(callback) {
            return function handleArray(val1, val2) {
                var left = arrayWrap(val1), right = arrayWrap(val2);
                if (left.length !== right.length)
                    return false;
                for (var i = 0; i < left.length; i++) {
                    if (!callback(left[i], right[i]))
                        return false;
                }
                return true;
            };
        }
        ['encode', 'decode', 'equals', '$normalize'].forEach(function (name) {
            var paramTypeFn = type[name].bind(type);
            var wrapperFn = name === 'equals' ? arrayEqualsHandler : arrayHandler;
            _this[name] = wrapperFn(paramTypeFn);
        });
        extend(this, {
            dynamic: type.dynamic,
            name: type.name,
            pattern: type.pattern,
            inherit: type.inherit,
            raw: type.raw,
            is: arrayHandler(type.is.bind(type), true),
            $arrayMode: mode,
        });
    }

    /**
     * @coreapi
     * @module params
     */ /** for typedoc */
    /** @hidden */
    var hasOwn = Object.prototype.hasOwnProperty;
    /** @hidden */
    var isShorthand = function (cfg) {
        return ['value', 'type', 'squash', 'array', 'dynamic'].filter(hasOwn.bind(cfg || {})).length === 0;
    };
    /** @internalapi */

    (function (DefType) {
        DefType[DefType["PATH"] = 0] = "PATH";
        DefType[DefType["SEARCH"] = 1] = "SEARCH";
        DefType[DefType["CONFIG"] = 2] = "CONFIG";
    })(exports.DefType || (exports.DefType = {}));
    function getParamDeclaration(paramName, location, state) {
        var noReloadOnSearch = (state.reloadOnSearch === false && location === exports.DefType.SEARCH) || undefined;
        var dynamic = [state.dynamic, noReloadOnSearch].find(isDefined);
        var defaultConfig = isDefined(dynamic) ? { dynamic: dynamic } : {};
        var paramConfig = unwrapShorthand(state && state.params && state.params[paramName]);
        return extend(defaultConfig, paramConfig);
    }
    /** @hidden */
    function unwrapShorthand(cfg) {
        cfg = isShorthand(cfg) ? { value: cfg } : cfg;
        getStaticDefaultValue['__cacheable'] = true;
        function getStaticDefaultValue() {
            return cfg.value;
        }
        var $$fn = isInjectable(cfg.value) ? cfg.value : getStaticDefaultValue;
        return extend(cfg, { $$fn: $$fn });
    }
    /** @hidden */
    function getType(cfg, urlType, location, id, paramTypes) {
        if (cfg.type && urlType && urlType.name !== 'string')
            throw new Error("Param '" + id + "' has two type configurations.");
        if (cfg.type && urlType && urlType.name === 'string' && paramTypes.type(cfg.type))
            return paramTypes.type(cfg.type);
        if (urlType)
            return urlType;
        if (!cfg.type) {
            var type = location === exports.DefType.CONFIG
                ? 'any'
                : location === exports.DefType.PATH
                    ? 'path'
                    : location === exports.DefType.SEARCH
                        ? 'query'
                        : 'string';
            return paramTypes.type(type);
        }
        return cfg.type instanceof ParamType ? cfg.type : paramTypes.type(cfg.type);
    }
    /**
     * @internalapi
     * returns false, true, or the squash value to indicate the "default parameter url squash policy".
     */
    function getSquashPolicy(config, isOptional, defaultPolicy) {
        var squash = config.squash;
        if (!isOptional || squash === false)
            return false;
        if (!isDefined(squash) || squash == null)
            return defaultPolicy;
        if (squash === true || isString(squash))
            return squash;
        throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
    }
    /** @internalapi */
    function getReplace(config, arrayMode, isOptional, squash) {
        var defaultPolicy = [
            { from: '', to: isOptional || arrayMode ? undefined : '' },
            { from: null, to: isOptional || arrayMode ? undefined : '' },
        ];
        var replace = isArray(config.replace) ? config.replace : [];
        if (isString(squash))
            replace.push({ from: squash, to: undefined });
        var configuredKeys = map(replace, prop('from'));
        return filter(defaultPolicy, function (item) { return configuredKeys.indexOf(item.from) === -1; }).concat(replace);
    }
    /** @internalapi */
    var Param = /** @class */ (function () {
        function Param(id, type, location, urlMatcherFactory, state) {
            var config = getParamDeclaration(id, location, state);
            type = getType(config, type, location, id, urlMatcherFactory.paramTypes);
            var arrayMode = getArrayMode();
            type = arrayMode ? type.$asArray(arrayMode, location === exports.DefType.SEARCH) : type;
            var isOptional = config.value !== undefined || location === exports.DefType.SEARCH;
            var dynamic = isDefined(config.dynamic) ? !!config.dynamic : !!type.dynamic;
            var raw = isDefined(config.raw) ? !!config.raw : !!type.raw;
            var squash = getSquashPolicy(config, isOptional, urlMatcherFactory.defaultSquashPolicy());
            var replace = getReplace(config, arrayMode, isOptional, squash);
            var inherit$$1 = isDefined(config.inherit) ? !!config.inherit : !!type.inherit;
            // array config: param name (param[]) overrides default settings.  explicit config overrides param name.
            function getArrayMode() {
                var arrayDefaults = { array: location === exports.DefType.SEARCH ? 'auto' : false };
                var arrayParamNomenclature = id.match(/\[\]$/) ? { array: true } : {};
                return extend(arrayDefaults, arrayParamNomenclature, config).array;
            }
            extend(this, { id: id, type: type, location: location, isOptional: isOptional, dynamic: dynamic, raw: raw, squash: squash, replace: replace, inherit: inherit$$1, array: arrayMode, config: config });
        }
        Param.values = function (params, values$$1) {
            if (values$$1 === void 0) { values$$1 = {}; }
            var paramValues = {};
            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                var param = params_1[_i];
                paramValues[param.id] = param.value(values$$1[param.id]);
            }
            return paramValues;
        };
        /**
         * Finds [[Param]] objects which have different param values
         *
         * Filters a list of [[Param]] objects to only those whose parameter values differ in two param value objects
         *
         * @param params: The list of Param objects to filter
         * @param values1: The first set of parameter values
         * @param values2: the second set of parameter values
         *
         * @returns any Param objects whose values were different between values1 and values2
         */
        Param.changed = function (params, values1, values2) {
            if (values1 === void 0) { values1 = {}; }
            if (values2 === void 0) { values2 = {}; }
            return params.filter(function (param) { return !param.type.equals(values1[param.id], values2[param.id]); });
        };
        /**
         * Checks if two param value objects are equal (for a set of [[Param]] objects)
         *
         * @param params The list of [[Param]] objects to check
         * @param values1 The first set of param values
         * @param values2 The second set of param values
         *
         * @returns true if the param values in values1 and values2 are equal
         */
        Param.equals = function (params, values1, values2) {
            if (values1 === void 0) { values1 = {}; }
            if (values2 === void 0) { values2 = {}; }
            return Param.changed(params, values1, values2).length === 0;
        };
        /** Returns true if a the parameter values are valid, according to the Param definitions */
        Param.validates = function (params, values$$1) {
            if (values$$1 === void 0) { values$$1 = {}; }
            return params.map(function (param) { return param.validates(values$$1[param.id]); }).reduce(allTrueR, true);
        };
        Param.prototype.isDefaultValue = function (value) {
            return this.isOptional && this.type.equals(this.value(), value);
        };
        /**
         * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
         * default value, which may be the result of an injectable function.
         */
        Param.prototype.value = function (value) {
            var _this = this;
            /**
             * [Internal] Get the default value of a parameter, which may be an injectable function.
             */
            var getDefaultValue = function () {
                if (_this._defaultValueCache)
                    return _this._defaultValueCache.defaultValue;
                if (!services.$injector)
                    throw new Error('Injectable functions cannot be called at configuration time');
                var defaultValue = services.$injector.invoke(_this.config.$$fn);
                if (defaultValue !== null && defaultValue !== undefined && !_this.type.is(defaultValue))
                    throw new Error("Default value (" + defaultValue + ") for parameter '" + _this.id + "' is not an instance of ParamType (" + _this.type.name + ")");
                if (_this.config.$$fn['__cacheable']) {
                    _this._defaultValueCache = { defaultValue: defaultValue };
                }
                return defaultValue;
            };
            var replaceSpecialValues = function (val$$1) {
                for (var _i = 0, _a = _this.replace; _i < _a.length; _i++) {
                    var tuple = _a[_i];
                    if (tuple.from === val$$1)
                        return tuple.to;
                }
                return val$$1;
            };
            value = replaceSpecialValues(value);
            return isUndefined(value) ? getDefaultValue() : this.type.$normalize(value);
        };
        Param.prototype.isSearch = function () {
            return this.location === exports.DefType.SEARCH;
        };
        Param.prototype.validates = function (value) {
            // There was no parameter value, but the param is optional
            if ((isUndefined(value) || value === null) && this.isOptional)
                return true;
            // The value was not of the correct ParamType, and could not be decoded to the correct ParamType
            var normalized = this.type.$normalize(value);
            if (!this.type.is(normalized))
                return false;
            // The value was of the correct type, but when encoded, did not match the ParamType's regexp
            var encoded = this.type.encode(normalized);
            return !(isString(encoded) && !this.type.pattern.exec(encoded));
        };
        Param.prototype.toString = function () {
            return "{Param:" + this.id + " " + this.type + " squash: '" + this.squash + "' optional: " + this.isOptional + "}";
        };
        return Param;
    }());

    /**
     * @coreapi
     * @module params
     */
    /**
     * A registry for parameter types.
     *
     * This registry manages the built-in (and custom) parameter types.
     *
     * The built-in parameter types are:
     *
     * - [[string]]
     * - [[path]]
     * - [[query]]
     * - [[hash]]
     * - [[int]]
     * - [[bool]]
     * - [[date]]
     * - [[json]]
     * - [[any]]
     */
    var ParamTypes = /** @class */ (function () {
        /** @internalapi */
        function ParamTypes() {
            /** @hidden */
            this.enqueue = true;
            /** @hidden */
            this.typeQueue = [];
            /** @internalapi */
            this.defaultTypes = pick(ParamTypes.prototype, [
                'hash',
                'string',
                'query',
                'path',
                'int',
                'bool',
                'date',
                'json',
                'any',
            ]);
            // Register default types. Store them in the prototype of this.types.
            var makeType = function (definition, name) { return new ParamType(extend({ name: name }, definition)); };
            this.types = inherit(map(this.defaultTypes, makeType), {});
        }
        /** @internalapi */
        ParamTypes.prototype.dispose = function () {
            this.types = {};
        };
        /**
         * Registers a parameter type
         *
         * End users should call [[UrlMatcherFactory.type]], which delegates to this method.
         */
        ParamTypes.prototype.type = function (name, definition, definitionFn) {
            if (!isDefined(definition))
                return this.types[name];
            if (this.types.hasOwnProperty(name))
                throw new Error("A type named '" + name + "' has already been defined.");
            this.types[name] = new ParamType(extend({ name: name }, definition));
            if (definitionFn) {
                this.typeQueue.push({ name: name, def: definitionFn });
                if (!this.enqueue)
                    this._flushTypeQueue();
            }
            return this;
        };
        /** @internalapi */
        ParamTypes.prototype._flushTypeQueue = function () {
            while (this.typeQueue.length) {
                var type = this.typeQueue.shift();
                if (type.pattern)
                    throw new Error("You cannot override a type's .pattern at runtime.");
                extend(this.types[type.name], services.$injector.invoke(type.def));
            }
        };
        return ParamTypes;
    }());
    /** @hidden */
    function initDefaultTypes() {
        var makeDefaultType = function (def) {
            var valToString = function (val$$1) { return (val$$1 != null ? val$$1.toString() : val$$1); };
            var defaultTypeBase = {
                encode: valToString,
                decode: valToString,
                is: is(String),
                pattern: /.*/,
                // tslint:disable-next-line:triple-equals
                equals: function (a, b) { return a == b; },
            };
            return extend({}, defaultTypeBase, def);
        };
        // Default Parameter Type Definitions
        extend(ParamTypes.prototype, {
            string: makeDefaultType({}),
            path: makeDefaultType({
                pattern: /[^/]*/,
            }),
            query: makeDefaultType({}),
            hash: makeDefaultType({
                inherit: false,
            }),
            int: makeDefaultType({
                decode: function (val$$1) { return parseInt(val$$1, 10); },
                is: function (val$$1) {
                    return !isNullOrUndefined(val$$1) && this.decode(val$$1.toString()) === val$$1;
                },
                pattern: /-?\d+/,
            }),
            bool: makeDefaultType({
                encode: function (val$$1) { return (val$$1 && 1) || 0; },
                decode: function (val$$1) { return parseInt(val$$1, 10) !== 0; },
                is: is(Boolean),
                pattern: /0|1/,
            }),
            date: makeDefaultType({
                encode: function (val$$1) {
                    return !this.is(val$$1)
                        ? undefined
                        : [val$$1.getFullYear(), ('0' + (val$$1.getMonth() + 1)).slice(-2), ('0' + val$$1.getDate()).slice(-2)].join('-');
                },
                decode: function (val$$1) {
                    if (this.is(val$$1))
                        return val$$1;
                    var match = this.capture.exec(val$$1);
                    return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
                },
                is: function (val$$1) { return val$$1 instanceof Date && !isNaN(val$$1.valueOf()); },
                equals: function (l, r) {
                    return ['getFullYear', 'getMonth', 'getDate'].reduce(function (acc, fn) { return acc && l[fn]() === r[fn](); }, true);
                },
                pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
                capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/,
            }),
            json: makeDefaultType({
                encode: toJson,
                decode: fromJson,
                is: is(Object),
                equals: equals,
                pattern: /[^/]*/,
            }),
            // does not encode/decode
            any: makeDefaultType({
                encode: identity,
                decode: identity,
                is: function () { return true; },
                equals: equals,
            }),
        });
    }
    initDefaultTypes();

    /**
     * @coreapi
     * @module params
     */
    /** @internalapi */
    var StateParams = /** @class */ (function () {
        function StateParams(params) {
            if (params === void 0) { params = {}; }
            extend(this, params);
        }
        /**
         * Merges a set of parameters with all parameters inherited between the common parents of the
         * current state and a given destination state.
         *
         * @param {Object} newParams The set of parameters which will be composited with inherited params.
         * @param {Object} $current Internal definition of object representing the current state.
         * @param {Object} $to Internal definition of object representing state to transition to.
         */
        StateParams.prototype.$inherit = function (newParams, $current, $to) {
            var parentParams;
            var parents = ancestors($current, $to), inherited = {}, inheritList = [];
            for (var i in parents) {
                if (!parents[i] || !parents[i].params)
                    continue;
                parentParams = Object.keys(parents[i].params);
                if (!parentParams.length)
                    continue;
                for (var j in parentParams) {
                    if (inheritList.indexOf(parentParams[j]) >= 0)
                        continue;
                    inheritList.push(parentParams[j]);
                    inherited[parentParams[j]] = this[parentParams[j]];
                }
            }
            return extend({}, inherited, newParams);
        };
        return StateParams;
    }());

    /** @module path */ /** for typedoc */
    /**
     * @internalapi
     *
     * A node in a [[TreeChanges]] path
     *
     * For a [[TreeChanges]] path, this class holds the stateful information for a single node in the path.
     * Each PathNode corresponds to a state being entered, exited, or retained.
     * The stateful information includes parameter values and resolve data.
     */
    var PathNode = /** @class */ (function () {
        function PathNode(stateOrNode) {
            if (stateOrNode instanceof PathNode) {
                var node = stateOrNode;
                this.state = node.state;
                this.paramSchema = node.paramSchema.slice();
                this.paramValues = extend({}, node.paramValues);
                this.resolvables = node.resolvables.slice();
                this.views = node.views && node.views.slice();
            }
            else {
                var state = stateOrNode;
                this.state = state;
                this.paramSchema = state.parameters({ inherit: false });
                this.paramValues = {};
                this.resolvables = state.resolvables.map(function (res) { return res.clone(); });
            }
        }
        PathNode.prototype.clone = function () {
            return new PathNode(this);
        };
        /** Sets [[paramValues]] for the node, from the values of an object hash */
        PathNode.prototype.applyRawParams = function (params) {
            var getParamVal = function (paramDef) { return [paramDef.id, paramDef.value(params[paramDef.id])]; };
            this.paramValues = this.paramSchema.reduce(function (memo, pDef) { return applyPairs(memo, getParamVal(pDef)); }, {});
            return this;
        };
        /** Gets a specific [[Param]] metadata that belongs to the node */
        PathNode.prototype.parameter = function (name) {
            return find(this.paramSchema, propEq('id', name));
        };
        /**
         * @returns true if the state and parameter values for another PathNode are
         * equal to the state and param values for this PathNode
         */
        PathNode.prototype.equals = function (node, paramsFn) {
            var diff = this.diff(node, paramsFn);
            return diff && diff.length === 0;
        };
        /**
         * Finds Params with different parameter values on another PathNode.
         *
         * Given another node (of the same state), finds the parameter values which differ.
         * Returns the [[Param]] (schema objects) whose parameter values differ.
         *
         * Given another node for a different state, returns `false`
         *
         * @param node The node to compare to
         * @param paramsFn A function that returns which parameters should be compared.
         * @returns The [[Param]]s which differ, or null if the two nodes are for different states
         */
        PathNode.prototype.diff = function (node, paramsFn) {
            if (this.state !== node.state)
                return false;
            var params = paramsFn ? paramsFn(this) : this.paramSchema;
            return Param.changed(params, this.paramValues, node.paramValues);
        };
        /**
         * Returns a clone of the PathNode
         * @deprecated use instance method `node.clone()`
         */
        PathNode.clone = function (node) { return node.clone(); };
        return PathNode;
    }());

    /**
     * @coreapi
     * @module state
     */ /** for typedoc */
    /**
     * Encapsulate the target (destination) state/params/options of a [[Transition]].
     *
     * This class is frequently used to redirect a transition to a new destination.
     *
     * See:
     *
     * - [[HookResult]]
     * - [[TransitionHookFn]]
     * - [[TransitionService.onStart]]
     *
     * To create a `TargetState`, use [[StateService.target]].
     *
     * ---
     *
     * This class wraps:
     *
     * 1) an identifier for a state
     * 2) a set of parameters
     * 3) and transition options
     * 4) the registered state object (the [[StateDeclaration]])
     *
     * Many UI-Router APIs such as [[StateService.go]] take a [[StateOrName]] argument which can
     * either be a *state object* (a [[StateDeclaration]] or [[StateObject]]) or a *state name* (a string).
     * The `TargetState` class normalizes those options.
     *
     * A `TargetState` may be valid (the state being targeted exists in the registry)
     * or invalid (the state being targeted is not registered).
     */
    var TargetState = /** @class */ (function () {
        /**
         * The TargetState constructor
         *
         * Note: Do not construct a `TargetState` manually.
         * To create a `TargetState`, use the [[StateService.target]] factory method.
         *
         * @param _stateRegistry The StateRegistry to use to look up the _definition
         * @param _identifier An identifier for a state.
         *    Either a fully-qualified state name, or the object used to define the state.
         * @param _params Parameters for the target state
         * @param _options Transition options.
         *
         * @internalapi
         */
        function TargetState(_stateRegistry, _identifier, _params, _options) {
            this._stateRegistry = _stateRegistry;
            this._identifier = _identifier;
            this._identifier = _identifier;
            this._params = extend({}, _params || {});
            this._options = extend({}, _options || {});
            this._definition = _stateRegistry.matcher.find(_identifier, this._options.relative);
        }
        /** The name of the state this object targets */
        TargetState.prototype.name = function () {
            return (this._definition && this._definition.name) || this._identifier;
        };
        /** The identifier used when creating this TargetState */
        TargetState.prototype.identifier = function () {
            return this._identifier;
        };
        /** The target parameter values */
        TargetState.prototype.params = function () {
            return this._params;
        };
        /** The internal state object (if it was found) */
        TargetState.prototype.$state = function () {
            return this._definition;
        };
        /** The internal state declaration (if it was found) */
        TargetState.prototype.state = function () {
            return this._definition && this._definition.self;
        };
        /** The target options */
        TargetState.prototype.options = function () {
            return this._options;
        };
        /** True if the target state was found */
        TargetState.prototype.exists = function () {
            return !!(this._definition && this._definition.self);
        };
        /** True if the object is valid */
        TargetState.prototype.valid = function () {
            return !this.error();
        };
        /** If the object is invalid, returns the reason why */
        TargetState.prototype.error = function () {
            var base = this.options().relative;
            if (!this._definition && !!base) {
                var stateName = base.name ? base.name : base;
                return "Could not resolve '" + this.name() + "' from state '" + stateName + "'";
            }
            if (!this._definition)
                return "No such state '" + this.name() + "'";
            if (!this._definition.self)
                return "State '" + this.name() + "' has an invalid definition";
        };
        TargetState.prototype.toString = function () {
            return "'" + this.name() + "'" + stringify(this.params());
        };
        /**
         * Returns a copy of this TargetState which targets a different state.
         * The new TargetState has the same parameter values and transition options.
         *
         * @param state The new state that should be targeted
         */
        TargetState.prototype.withState = function (state) {
            return new TargetState(this._stateRegistry, state, this._params, this._options);
        };
        /**
         * Returns a copy of this TargetState, using the specified parameter values.
         *
         * @param params the new parameter values to use
         * @param replace When false (default) the new parameter values will be merged with the current values.
         *                When true the parameter values will be used instead of the current values.
         */
        TargetState.prototype.withParams = function (params, replace) {
            if (replace === void 0) { replace = false; }
            var newParams = replace ? params : extend({}, this._params, params);
            return new TargetState(this._stateRegistry, this._identifier, newParams, this._options);
        };
        /**
         * Returns a copy of this TargetState, using the specified Transition Options.
         *
         * @param options the new options to use
         * @param replace When false (default) the new options will be merged with the current options.
         *                When true the options will be used instead of the current options.
         */
        TargetState.prototype.withOptions = function (options, replace) {
            if (replace === void 0) { replace = false; }
            var newOpts = replace ? options : extend({}, this._options, options);
            return new TargetState(this._stateRegistry, this._identifier, this._params, newOpts);
        };
        /** Returns true if the object has a state property that might be a state or state name */
        TargetState.isDef = function (obj) { return obj && obj.state && (isString(obj.state) || isString(obj.state.name)); };
        return TargetState;
    }());

    /** @module path */ /** for typedoc */
    /**
     * This class contains functions which convert TargetStates, Nodes and paths from one type to another.
     */
    var PathUtils = /** @class */ (function () {
        function PathUtils() {
        }
        /** Given a PathNode[], create an TargetState */
        PathUtils.makeTargetState = function (registry, path) {
            var state = tail(path).state;
            return new TargetState(registry, state, path.map(prop('paramValues')).reduce(mergeR, {}), {});
        };
        PathUtils.buildPath = function (targetState) {
            var toParams = targetState.params();
            return targetState.$state().path.map(function (state) { return new PathNode(state).applyRawParams(toParams); });
        };
        /** Given a fromPath: PathNode[] and a TargetState, builds a toPath: PathNode[] */
        PathUtils.buildToPath = function (fromPath, targetState) {
            var toPath = PathUtils.buildPath(targetState);
            if (targetState.options().inherit) {
                return PathUtils.inheritParams(fromPath, toPath, Object.keys(targetState.params()));
            }
            return toPath;
        };
        /**
         * Creates ViewConfig objects and adds to nodes.
         *
         * On each [[PathNode]], creates ViewConfig objects from the views: property of the node's state
         */
        PathUtils.applyViewConfigs = function ($view, path, states) {
            // Only apply the viewConfigs to the nodes for the given states
            path.filter(function (node) { return inArray(states, node.state); }).forEach(function (node) {
                var viewDecls = values(node.state.views || {});
                var subPath = PathUtils.subPath(path, function (n) { return n === node; });
                var viewConfigs = viewDecls.map(function (view) { return $view.createViewConfig(subPath, view); });
                node.views = viewConfigs.reduce(unnestR, []);
            });
        };
        /**
         * Given a fromPath and a toPath, returns a new to path which inherits parameters from the fromPath
         *
         * For a parameter in a node to be inherited from the from path:
         * - The toPath's node must have a matching node in the fromPath (by state).
         * - The parameter name must not be found in the toKeys parameter array.
         *
         * Note: the keys provided in toKeys are intended to be those param keys explicitly specified by some
         * caller, for instance, $state.transitionTo(..., toParams).  If a key was found in toParams,
         * it is not inherited from the fromPath.
         */
        PathUtils.inheritParams = function (fromPath, toPath, toKeys) {
            if (toKeys === void 0) { toKeys = []; }
            function nodeParamVals(path, state) {
                var node = find(path, propEq('state', state));
                return extend({}, node && node.paramValues);
            }
            var noInherit = fromPath
                .map(function (node) { return node.paramSchema; })
                .reduce(unnestR, [])
                .filter(function (param) { return !param.inherit; })
                .map(prop('id'));
            /**
             * Given an [[PathNode]] "toNode", return a new [[PathNode]] with param values inherited from the
             * matching node in fromPath.  Only inherit keys that aren't found in "toKeys" from the node in "fromPath""
             */
            function makeInheritedParamsNode(toNode) {
                // All param values for the node (may include default key/vals, when key was not found in toParams)
                var toParamVals = extend({}, toNode && toNode.paramValues);
                // limited to only those keys found in toParams
                var incomingParamVals = pick(toParamVals, toKeys);
                toParamVals = omit(toParamVals, toKeys);
                var fromParamVals = omit(nodeParamVals(fromPath, toNode.state) || {}, noInherit);
                // extend toParamVals with any fromParamVals, then override any of those those with incomingParamVals
                var ownParamVals = extend(toParamVals, fromParamVals, incomingParamVals);
                return new PathNode(toNode.state).applyRawParams(ownParamVals);
            }
            // The param keys specified by the incoming toParams
            return toPath.map(makeInheritedParamsNode);
        };
        /**
         * Computes the tree changes (entering, exiting) between a fromPath and toPath.
         */
        PathUtils.treeChanges = function (fromPath, toPath, reloadState) {
            var max = Math.min(fromPath.length, toPath.length);
            var keep = 0;
            var nodesMatch = function (node1, node2) { return node1.equals(node2, PathUtils.nonDynamicParams); };
            while (keep < max && fromPath[keep].state !== reloadState && nodesMatch(fromPath[keep], toPath[keep])) {
                keep++;
            }
            /** Given a retained node, return a new node which uses the to node's param values */
            function applyToParams(retainedNode, idx) {
                var cloned = retainedNode.clone();
                cloned.paramValues = toPath[idx].paramValues;
                return cloned;
            }
            var from, retained, exiting, entering, to;
            from = fromPath;
            retained = from.slice(0, keep);
            exiting = from.slice(keep);
            // Create a new retained path (with shallow copies of nodes) which have the params of the toPath mapped
            var retainedWithToParams = retained.map(applyToParams);
            entering = toPath.slice(keep);
            to = retainedWithToParams.concat(entering);
            return { from: from, to: to, retained: retained, retainedWithToParams: retainedWithToParams, exiting: exiting, entering: entering };
        };
        /**
         * Returns a new path which is: the subpath of the first path which matches the second path.
         *
         * The new path starts from root and contains any nodes that match the nodes in the second path.
         * It stops before the first non-matching node.
         *
         * Nodes are compared using their state property and their parameter values.
         * If a `paramsFn` is provided, only the [[Param]] returned by the function will be considered when comparing nodes.
         *
         * @param pathA the first path
         * @param pathB the second path
         * @param paramsFn a function which returns the parameters to consider when comparing
         *
         * @returns an array of PathNodes from the first path which match the nodes in the second path
         */
        PathUtils.matching = function (pathA, pathB, paramsFn) {
            var done = false;
            var tuples = arrayTuples(pathA, pathB);
            return tuples.reduce(function (matching, _a) {
                var nodeA = _a[0], nodeB = _a[1];
                done = done || !nodeA.equals(nodeB, paramsFn);
                return done ? matching : matching.concat(nodeA);
            }, []);
        };
        /**
         * Returns true if two paths are identical.
         *
         * @param pathA
         * @param pathB
         * @param paramsFn a function which returns the parameters to consider when comparing
         * @returns true if the the states and parameter values for both paths are identical
         */
        PathUtils.equals = function (pathA, pathB, paramsFn) {
            return pathA.length === pathB.length && PathUtils.matching(pathA, pathB, paramsFn).length === pathA.length;
        };
        /**
         * Return a subpath of a path, which stops at the first matching node
         *
         * Given an array of nodes, returns a subset of the array starting from the first node,
         * stopping when the first node matches the predicate.
         *
         * @param path a path of [[PathNode]]s
         * @param predicate a [[Predicate]] fn that matches [[PathNode]]s
         * @returns a subpath up to the matching node, or undefined if no match is found
         */
        PathUtils.subPath = function (path, predicate) {
            var node = find(path, predicate);
            var elementIdx = path.indexOf(node);
            return elementIdx === -1 ? undefined : path.slice(0, elementIdx + 1);
        };
        PathUtils.nonDynamicParams = function (node) {
            return node.state.parameters({ inherit: false }).filter(function (param) { return !param.dynamic; });
        };
        /** Gets the raw parameter values from a path */
        PathUtils.paramValues = function (path) { return path.reduce(function (acc, node) { return extend(acc, node.paramValues); }, {}); };
        return PathUtils;
    }());

    /** @module path */ /** for typedoc */

    /** @internalapi */
    var resolvePolicies = {
        when: {
            LAZY: 'LAZY',
            EAGER: 'EAGER',
        },
        async: {
            WAIT: 'WAIT',
            NOWAIT: 'NOWAIT',
            RXWAIT: 'RXWAIT',
        },
    };

    /**
     * @coreapi
     * @module resolve
     */ /** for typedoc */
    // TODO: explicitly make this user configurable
    var defaultResolvePolicy = {
        when: 'LAZY',
        async: 'WAIT',
    };
    /**
     * The basic building block for the resolve system.
     *
     * Resolvables encapsulate a state's resolve's resolveFn, the resolveFn's declared dependencies, the wrapped (.promise),
     * and the unwrapped-when-complete (.data) result of the resolveFn.
     *
     * Resolvable.get() either retrieves the Resolvable's existing promise, or else invokes resolve() (which invokes the
     * resolveFn) and returns the resulting promise.
     *
     * Resolvable.get() and Resolvable.resolve() both execute within a context path, which is passed as the first
     * parameter to those fns.
     */
    var Resolvable = /** @class */ (function () {
        function Resolvable(arg1, resolveFn, deps, policy, data) {
            this.resolved = false;
            this.promise = undefined;
            if (arg1 instanceof Resolvable) {
                extend(this, arg1);
            }
            else if (isFunction(resolveFn)) {
                if (isNullOrUndefined(arg1))
                    throw new Error('new Resolvable(): token argument is required');
                if (!isFunction(resolveFn))
                    throw new Error('new Resolvable(): resolveFn argument must be a function');
                this.token = arg1;
                this.policy = policy;
                this.resolveFn = resolveFn;
                this.deps = deps || [];
                this.data = data;
                this.resolved = data !== undefined;
                this.promise = this.resolved ? services.$q.when(this.data) : undefined;
            }
            else if (isObject(arg1) && arg1.token && (arg1.hasOwnProperty('resolveFn') || arg1.hasOwnProperty('data'))) {
                var literal = arg1;
                return new Resolvable(literal.token, literal.resolveFn, literal.deps, literal.policy, literal.data);
            }
        }
        Resolvable.prototype.getPolicy = function (state) {
            var thisPolicy = this.policy || {};
            var statePolicy = (state && state.resolvePolicy) || {};
            return {
                when: thisPolicy.when || statePolicy.when || defaultResolvePolicy.when,
                async: thisPolicy.async || statePolicy.async || defaultResolvePolicy.async,
            };
        };
        /**
         * Asynchronously resolve this Resolvable's data
         *
         * Given a ResolveContext that this Resolvable is found in:
         * Wait for this Resolvable's dependencies, then invoke this Resolvable's function
         * and update the Resolvable's state
         */
        Resolvable.prototype.resolve = function (resolveContext, trans) {
            var _this = this;
            var $q = services.$q;
            // Gets all dependencies from ResolveContext and wait for them to be resolved
            var getResolvableDependencies = function () {
                return $q.all(resolveContext.getDependencies(_this).map(function (resolvable) { return resolvable.get(resolveContext, trans); }));
            };
            // Invokes the resolve function passing the resolved dependencies as arguments
            var invokeResolveFn = function (resolvedDeps) { return _this.resolveFn.apply(null, resolvedDeps); };
            /**
             * For RXWAIT policy:
             *
             * Given an observable returned from a resolve function:
             * - enables .cache() mode (this allows multicast subscribers)
             * - then calls toPromise() (this triggers subscribe() and thus fetches)
             * - Waits for the promise, then return the cached observable (not the first emitted value).
             */
            var waitForRx = function (observable$) {
                var cached = observable$.cache(1);
                return cached
                    .take(1)
                    .toPromise()
                    .then(function () { return cached; });
            };
            // If the resolve policy is RXWAIT, wait for the observable to emit something. otherwise pass through.
            var node = resolveContext.findNode(this);
            var state = node && node.state;
            var maybeWaitForRx = this.getPolicy(state).async === 'RXWAIT' ? waitForRx : identity;
            // After the final value has been resolved, update the state of the Resolvable
            var applyResolvedValue = function (resolvedValue) {
                _this.data = resolvedValue;
                _this.resolved = true;
                _this.resolveFn = null;
                trace.traceResolvableResolved(_this, trans);
                return _this.data;
            };
            // Sets the promise property first, then getsResolvableDependencies in the context of the promise chain. Always waits one tick.
            return (this.promise = $q
                .when()
                .then(getResolvableDependencies)
                .then(invokeResolveFn)
                .then(maybeWaitForRx)
                .then(applyResolvedValue));
        };
        /**
         * Gets a promise for this Resolvable's data.
         *
         * Fetches the data and returns a promise.
         * Returns the existing promise if it has already been fetched once.
         */
        Resolvable.prototype.get = function (resolveContext, trans) {
            return this.promise || this.resolve(resolveContext, trans);
        };
        Resolvable.prototype.toString = function () {
            return "Resolvable(token: " + stringify(this.token) + ", requires: [" + this.deps.map(stringify) + "])";
        };
        Resolvable.prototype.clone = function () {
            return new Resolvable(this);
        };
        Resolvable.fromData = function (token, data) { return new Resolvable(token, function () { return data; }, null, null, data); };
        return Resolvable;
    }());

    /** @module resolve */
    var whens = resolvePolicies.when;
    var ALL_WHENS = [whens.EAGER, whens.LAZY];
    var EAGER_WHENS = [whens.EAGER];
    // tslint:disable-next-line:no-inferrable-types
    var NATIVE_INJECTOR_TOKEN = 'Native Injector';
    /**
     * Encapsulates Dependency Injection for a path of nodes
     *
     * UI-Router states are organized as a tree.
     * A nested state has a path of ancestors to the root of the tree.
     * When a state is being activated, each element in the path is wrapped as a [[PathNode]].
     * A `PathNode` is a stateful object that holds things like parameters and resolvables for the state being activated.
     *
     * The ResolveContext closes over the [[PathNode]]s, and provides DI for the last node in the path.
     */
    var ResolveContext = /** @class */ (function () {
        function ResolveContext(_path) {
            this._path = _path;
        }
        /** Gets all the tokens found in the resolve context, de-duplicated */
        ResolveContext.prototype.getTokens = function () {
            return this._path.reduce(function (acc, node) { return acc.concat(node.resolvables.map(function (r) { return r.token; })); }, []).reduce(uniqR, []);
        };
        /**
         * Gets the Resolvable that matches the token
         *
         * Gets the last Resolvable that matches the token in this context, or undefined.
         * Throws an error if it doesn't exist in the ResolveContext
         */
        ResolveContext.prototype.getResolvable = function (token) {
            var matching = this._path
                .map(function (node) { return node.resolvables; })
                .reduce(unnestR, [])
                .filter(function (r) { return r.token === token; });
            return tail(matching);
        };
        /** Returns the [[ResolvePolicy]] for the given [[Resolvable]] */
        ResolveContext.prototype.getPolicy = function (resolvable) {
            var node = this.findNode(resolvable);
            return resolvable.getPolicy(node.state);
        };
        /**
         * Returns a ResolveContext that includes a portion of this one
         *
         * Given a state, this method creates a new ResolveContext from this one.
         * The new context starts at the first node (root) and stops at the node for the `state` parameter.
         *
         * #### Why
         *
         * When a transition is created, the nodes in the "To Path" are injected from a ResolveContext.
         * A ResolveContext closes over a path of [[PathNode]]s and processes the resolvables.
         * The "To State" can inject values from its own resolvables, as well as those from all its ancestor state's (node's).
         * This method is used to create a narrower context when injecting ancestor nodes.
         *
         * @example
         * `let ABCD = new ResolveContext([A, B, C, D]);`
         *
         * Given a path `[A, B, C, D]`, where `A`, `B`, `C` and `D` are nodes for states `a`, `b`, `c`, `d`:
         * When injecting `D`, `D` should have access to all resolvables from `A`, `B`, `C`, `D`.
         * However, `B` should only be able to access resolvables from `A`, `B`.
         *
         * When resolving for the `B` node, first take the full "To Path" Context `[A,B,C,D]` and limit to the subpath `[A,B]`.
         * `let AB = ABCD.subcontext(a)`
         */
        ResolveContext.prototype.subContext = function (state) {
            return new ResolveContext(PathUtils.subPath(this._path, function (node) { return node.state === state; }));
        };
        /**
         * Adds Resolvables to the node that matches the state
         *
         * This adds a [[Resolvable]] (generally one created on the fly; not declared on a [[StateDeclaration.resolve]] block).
         * The resolvable is added to the node matching the `state` parameter.
         *
         * These new resolvables are not automatically fetched.
         * The calling code should either fetch them, fetch something that depends on them,
         * or rely on [[resolvePath]] being called when some state is being entered.
         *
         * Note: each resolvable's [[ResolvePolicy]] is merged with the state's policy, and the global default.
         *
         * @param newResolvables the new Resolvables
         * @param state Used to find the node to put the resolvable on
         */
        ResolveContext.prototype.addResolvables = function (newResolvables, state) {
            var node = find(this._path, propEq('state', state));
            var keys = newResolvables.map(function (r) { return r.token; });
            node.resolvables = node.resolvables.filter(function (r) { return keys.indexOf(r.token) === -1; }).concat(newResolvables);
        };
        /**
         * Returns a promise for an array of resolved path Element promises
         *
         * @param when
         * @param trans
         * @returns {Promise<any>|any}
         */
        ResolveContext.prototype.resolvePath = function (when, trans) {
            var _this = this;
            if (when === void 0) { when = 'LAZY'; }
            // This option determines which 'when' policy Resolvables we are about to fetch.
            var whenOption = inArray(ALL_WHENS, when) ? when : 'LAZY';
            // If the caller specified EAGER, only the EAGER Resolvables are fetched.
            // if the caller specified LAZY, both EAGER and LAZY Resolvables are fetched.`
            var matchedWhens = whenOption === resolvePolicies.when.EAGER ? EAGER_WHENS : ALL_WHENS;
            // get the subpath to the state argument, if provided
            trace.traceResolvePath(this._path, when, trans);
            var matchesPolicy = function (acceptedVals, whenOrAsync) { return function (resolvable) {
                return inArray(acceptedVals, _this.getPolicy(resolvable)[whenOrAsync]);
            }; };
            // Trigger all the (matching) Resolvables in the path
            // Reduce all the "WAIT" Resolvables into an array
            var promises = this._path.reduce(function (acc, node) {
                var nodeResolvables = node.resolvables.filter(matchesPolicy(matchedWhens, 'when'));
                var nowait = nodeResolvables.filter(matchesPolicy(['NOWAIT'], 'async'));
                var wait = nodeResolvables.filter(not(matchesPolicy(['NOWAIT'], 'async')));
                // For the matching Resolvables, start their async fetch process.
                var subContext = _this.subContext(node.state);
                var getResult = function (r) {
                    return r
                        .get(subContext, trans)
                        // Return a tuple that includes the Resolvable's token
                        .then(function (value) { return ({ token: r.token, value: value }); });
                };
                nowait.forEach(getResult);
                return acc.concat(wait.map(getResult));
            }, []);
            // Wait for all the "WAIT" resolvables
            return services.$q.all(promises);
        };
        ResolveContext.prototype.injector = function () {
            return this._injector || (this._injector = new UIInjectorImpl(this));
        };
        ResolveContext.prototype.findNode = function (resolvable) {
            return find(this._path, function (node) { return inArray(node.resolvables, resolvable); });
        };
        /**
         * Gets the async dependencies of a Resolvable
         *
         * Given a Resolvable, returns its dependencies as a Resolvable[]
         */
        ResolveContext.prototype.getDependencies = function (resolvable) {
            var _this = this;
            var node = this.findNode(resolvable);
            // Find which other resolvables are "visible" to the `resolvable` argument
            // subpath stopping at resolvable's node, or the whole path (if the resolvable isn't in the path)
            var subPath = PathUtils.subPath(this._path, function (x) { return x === node; }) || this._path;
            var availableResolvables = subPath
                .reduce(function (acc, _node) { return acc.concat(_node.resolvables); }, []) // all of subpath's resolvables
                .filter(function (res) { return res !== resolvable; }); // filter out the `resolvable` argument
            var getDependency = function (token) {
                var matching = availableResolvables.filter(function (r) { return r.token === token; });
                if (matching.length)
                    return tail(matching);
                var fromInjector = _this.injector().getNative(token);
                if (isUndefined(fromInjector)) {
                    throw new Error('Could not find Dependency Injection token: ' + stringify(token));
                }
                return new Resolvable(token, function () { return fromInjector; }, [], fromInjector);
            };
            return resolvable.deps.map(getDependency);
        };
        return ResolveContext;
    }());
    var UIInjectorImpl = /** @class */ (function () {
        function UIInjectorImpl(context) {
            this.context = context;
            this.native = this.get(NATIVE_INJECTOR_TOKEN) || services.$injector;
        }
        UIInjectorImpl.prototype.get = function (token) {
            var resolvable = this.context.getResolvable(token);
            if (resolvable) {
                if (this.context.getPolicy(resolvable).async === 'NOWAIT') {
                    return resolvable.get(this.context);
                }
                if (!resolvable.resolved) {
                    throw new Error('Resolvable async .get() not complete:' + stringify(resolvable.token));
                }
                return resolvable.data;
            }
            return this.getNative(token);
        };
        UIInjectorImpl.prototype.getAsync = function (token) {
            var resolvable = this.context.getResolvable(token);
            if (resolvable)
                return resolvable.get(this.context);
            return services.$q.when(this.native.get(token));
        };
        UIInjectorImpl.prototype.getNative = function (token) {
            return this.native && this.native.get(token);
        };
        return UIInjectorImpl;
    }());

    /** @module resolve */ /** for typedoc */

    /** @module state */
    var parseUrl = function (url) {
        if (!isString(url))
            return false;
        var root$$1 = url.charAt(0) === '^';
        return { val: root$$1 ? url.substring(1) : url, root: root$$1 };
    };
    function nameBuilder(state) {
        return state.name;
    }
    function selfBuilder(state) {
        state.self.$$state = function () { return state; };
        return state.self;
    }
    function dataBuilder(state) {
        if (state.parent && state.parent.data) {
            state.data = state.self.data = inherit(state.parent.data, state.data);
        }
        return state.data;
    }
    var getUrlBuilder = function ($urlMatcherFactoryProvider, root$$1) {
        return function urlBuilder(stateObject) {
            var state = stateObject.self;
            // For future states, i.e., states whose name ends with `.**`,
            // match anything that starts with the url prefix
            if (state && state.url && state.name && state.name.match(/\.\*\*$/)) {
                state.url += '{remainder:any}'; // match any path (.*)
            }
            var parent = stateObject.parent;
            var parsed = parseUrl(state.url);
            var url = !parsed ? state.url : $urlMatcherFactoryProvider.compile(parsed.val, { state: state });
            if (!url)
                return null;
            if (!$urlMatcherFactoryProvider.isMatcher(url))
                throw new Error("Invalid url '" + url + "' in state '" + stateObject + "'");
            return parsed && parsed.root ? url : ((parent && parent.navigable) || root$$1()).url.append(url);
        };
    };
    var getNavigableBuilder = function (isRoot) {
        return function navigableBuilder(state) {
            return !isRoot(state) && state.url ? state : state.parent ? state.parent.navigable : null;
        };
    };
    var getParamsBuilder = function (paramFactory) {
        return function paramsBuilder(state) {
            var makeConfigParam = function (config, id) { return paramFactory.fromConfig(id, null, state.self); };
            var urlParams = (state.url && state.url.parameters({ inherit: false })) || [];
            var nonUrlParams = values(mapObj(omit(state.params || {}, urlParams.map(prop('id'))), makeConfigParam));
            return urlParams
                .concat(nonUrlParams)
                .map(function (p) { return [p.id, p]; })
                .reduce(applyPairs, {});
        };
    };
    function pathBuilder(state) {
        return state.parent ? state.parent.path.concat(state) : /*root*/ [state];
    }
    function includesBuilder(state) {
        var includes = state.parent ? extend({}, state.parent.includes) : {};
        includes[state.name] = true;
        return includes;
    }
    /**
     * This is a [[StateBuilder.builder]] function for the `resolve:` block on a [[StateDeclaration]].
     *
     * When the [[StateBuilder]] builds a [[StateObject]] object from a raw [[StateDeclaration]], this builder
     * validates the `resolve` property and converts it to a [[Resolvable]] array.
     *
     * resolve: input value can be:
     *
     * {
     *   // analyzed but not injected
     *   myFooResolve: function() { return "myFooData"; },
     *
     *   // function.toString() parsed, "DependencyName" dep as string (not min-safe)
     *   myBarResolve: function(DependencyName) { return DependencyName.fetchSomethingAsPromise() },
     *
     *   // Array split; "DependencyName" dep as string
     *   myBazResolve: [ "DependencyName", function(dep) { return dep.fetchSomethingAsPromise() },
     *
     *   // Array split; DependencyType dep as token (compared using ===)
     *   myQuxResolve: [ DependencyType, function(dep) { return dep.fetchSometingAsPromise() },
     *
     *   // val.$inject used as deps
     *   // where:
     *   //     corgeResolve.$inject = ["DependencyName"];
     *   //     function corgeResolve(dep) { dep.fetchSometingAsPromise() }
     *   // then "DependencyName" dep as string
     *   myCorgeResolve: corgeResolve,
     *
     *  // inject service by name
     *  // When a string is found, desugar creating a resolve that injects the named service
     *   myGraultResolve: "SomeService"
     * }
     *
     * or:
     *
     * [
     *   new Resolvable("myFooResolve", function() { return "myFooData" }),
     *   new Resolvable("myBarResolve", function(dep) { return dep.fetchSomethingAsPromise() }, [ "DependencyName" ]),
     *   { provide: "myBazResolve", useFactory: function(dep) { dep.fetchSomethingAsPromise() }, deps: [ "DependencyName" ] }
     * ]
     */
    function resolvablesBuilder(state) {
        /** convert resolve: {} and resolvePolicy: {} objects to an array of tuples */
        var objects2Tuples = function (resolveObj, resolvePolicies) {
            return Object.keys(resolveObj || {}).map(function (token) { return ({
                token: token,
                val: resolveObj[token],
                deps: undefined,
                policy: resolvePolicies[token],
            }); });
        };
        /** fetch DI annotations from a function or ng1-style array */
        var annotate = function (fn) {
            var $injector = services.$injector;
            // ng1 doesn't have an $injector until runtime.
            // If the $injector doesn't exist, use "deferred" literal as a
            // marker indicating they should be annotated when runtime starts
            return fn['$inject'] || ($injector && $injector.annotate(fn, $injector.strictDi)) || 'deferred';
        };
        /** true if the object has both `token` and `resolveFn`, and is probably a [[ResolveLiteral]] */
        var isResolveLiteral = function (obj) { return !!(obj.token && obj.resolveFn); };
        /** true if the object looks like a provide literal, or a ng2 Provider */
        var isLikeNg2Provider = function (obj) {
            return !!((obj.provide || obj.token) && (obj.useValue || obj.useFactory || obj.useExisting || obj.useClass));
        };
        /** true if the object looks like a tuple from obj2Tuples */
        var isTupleFromObj = function (obj) {
            return !!(obj && obj.val && (isString(obj.val) || isArray(obj.val) || isFunction(obj.val)));
        };
        /** extracts the token from a Provider or provide literal */
        var getToken = function (p) { return p.provide || p.token; };
        // prettier-ignore: Given a literal resolve or provider object, returns a Resolvable
        var literal2Resolvable = pattern([
            [prop('resolveFn'), function (p) { return new Resolvable(getToken(p), p.resolveFn, p.deps, p.policy); }],
            [prop('useFactory'), function (p) { return new Resolvable(getToken(p), p.useFactory, p.deps || p.dependencies, p.policy); }],
            [prop('useClass'), function (p) { return new Resolvable(getToken(p), function () { return new p.useClass(); }, [], p.policy); }],
            [prop('useValue'), function (p) { return new Resolvable(getToken(p), function () { return p.useValue; }, [], p.policy, p.useValue); }],
            [prop('useExisting'), function (p) { return new Resolvable(getToken(p), identity, [p.useExisting], p.policy); }],
        ]);
        // prettier-ignore
        var tuple2Resolvable = pattern([
            [pipe(prop('val'), isString), function (tuple) { return new Resolvable(tuple.token, identity, [tuple.val], tuple.policy); }],
            [pipe(prop('val'), isArray), function (tuple) { return new Resolvable(tuple.token, tail(tuple.val), tuple.val.slice(0, -1), tuple.policy); }],
            [pipe(prop('val'), isFunction), function (tuple) { return new Resolvable(tuple.token, tuple.val, annotate(tuple.val), tuple.policy); }],
        ]);
        // prettier-ignore
        var item2Resolvable = pattern([
            [is(Resolvable), function (r) { return r; }],
            [isResolveLiteral, literal2Resolvable],
            [isLikeNg2Provider, literal2Resolvable],
            [isTupleFromObj, tuple2Resolvable],
            [val(true), function (obj) { throw new Error('Invalid resolve value: ' + stringify(obj)); },],
        ]);
        // If resolveBlock is already an array, use it as-is.
        // Otherwise, assume it's an object and convert to an Array of tuples
        var decl = state.resolve;
        var items = isArray(decl) ? decl : objects2Tuples(decl, state.resolvePolicy || {});
        return items.map(item2Resolvable);
    }
    /**
     * @internalapi A internal global service
     *
     * StateBuilder is a factory for the internal [[StateObject]] objects.
     *
     * When you register a state with the [[StateRegistry]], you register a plain old javascript object which
     * conforms to the [[StateDeclaration]] interface.  This factory takes that object and builds the corresponding
     * [[StateObject]] object, which has an API and is used internally.
     *
     * Custom properties or API may be added to the internal [[StateObject]] object by registering a decorator function
     * using the [[builder]] method.
     */
    var StateBuilder = /** @class */ (function () {
        function StateBuilder(matcher, urlMatcherFactory) {
            this.matcher = matcher;
            var self = this;
            var root$$1 = function () { return matcher.find(''); };
            var isRoot = function (state) { return state.name === ''; };
            function parentBuilder(state) {
                if (isRoot(state))
                    return null;
                return matcher.find(self.parentName(state)) || root$$1();
            }
            this.builders = {
                name: [nameBuilder],
                self: [selfBuilder],
                parent: [parentBuilder],
                data: [dataBuilder],
                // Build a URLMatcher if necessary, either via a relative or absolute URL
                url: [getUrlBuilder(urlMatcherFactory, root$$1)],
                // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
                navigable: [getNavigableBuilder(isRoot)],
                params: [getParamsBuilder(urlMatcherFactory.paramFactory)],
                // Each framework-specific ui-router implementation should define its own `views` builder
                // e.g., src/ng1/statebuilders/views.ts
                views: [],
                // Keep a full path from the root down to this state as this is needed for state activation.
                path: [pathBuilder],
                // Speed up $state.includes() as it's used a lot
                includes: [includesBuilder],
                resolvables: [resolvablesBuilder],
            };
        }
        /**
         * Registers a [[BuilderFunction]] for a specific [[StateObject]] property (e.g., `parent`, `url`, or `path`).
         * More than one BuilderFunction can be registered for a given property.
         *
         * The BuilderFunction(s) will be used to define the property on any subsequently built [[StateObject]] objects.
         *
         * @param name The name of the State property being registered for.
         * @param fn The BuilderFunction which will be used to build the State property
         * @returns a function which deregisters the BuilderFunction
         */
        StateBuilder.prototype.builder = function (name, fn) {
            var builders = this.builders;
            var array = builders[name] || [];
            // Backwards compat: if only one builder exists, return it, else return whole arary.
            if (isString(name) && !isDefined(fn))
                return array.length > 1 ? array : array[0];
            if (!isString(name) || !isFunction(fn))
                return;
            builders[name] = array;
            builders[name].push(fn);
            return function () { return builders[name].splice(builders[name].indexOf(fn, 1)) && null; };
        };
        /**
         * Builds all of the properties on an essentially blank State object, returning a State object which has all its
         * properties and API built.
         *
         * @param state an uninitialized State object
         * @returns the built State object
         */
        StateBuilder.prototype.build = function (state) {
            var _a = this, matcher = _a.matcher, builders = _a.builders;
            var parent = this.parentName(state);
            if (parent && !matcher.find(parent, undefined, false)) {
                return null;
            }
            for (var key in builders) {
                if (!builders.hasOwnProperty(key))
                    continue;
                var chain = builders[key].reduce(function (parentFn, step) { return function (_state) { return step(_state, parentFn); }; }, noop);
                state[key] = chain(state);
            }
            return state;
        };
        StateBuilder.prototype.parentName = function (state) {
            // name = 'foo.bar.baz.**'
            var name = state.name || '';
            // segments = ['foo', 'bar', 'baz', '.**']
            var segments = name.split('.');
            // segments = ['foo', 'bar', 'baz']
            var lastSegment = segments.pop();
            // segments = ['foo', 'bar'] (ignore .** segment for future states)
            if (lastSegment === '**')
                segments.pop();
            if (segments.length) {
                if (state.parent) {
                    throw new Error("States that specify the 'parent:' property should not have a '.' in their name (" + name + ")");
                }
                // 'foo.bar'
                return segments.join('.');
            }
            if (!state.parent)
                return '';
            return isString(state.parent) ? state.parent : state.parent.name;
        };
        StateBuilder.prototype.name = function (state) {
            var name = state.name;
            if (name.indexOf('.') !== -1 || !state.parent)
                return name;
            var parentName = isString(state.parent) ? state.parent : state.parent.name;
            return parentName ? parentName + '.' + name : name;
        };
        return StateBuilder;
    }());

    /**
     * Internal representation of a UI-Router state.
     *
     * Instances of this class are created when a [[StateDeclaration]] is registered with the [[StateRegistry]].
     *
     * A registered [[StateDeclaration]] is augmented with a getter ([[StateDeclaration.$$state]]) which returns the corresponding [[StateObject]] object.
     *
     * This class prototypally inherits from the corresponding [[StateDeclaration]].
     * Each of its own properties (i.e., `hasOwnProperty`) are built using builders from the [[StateBuilder]].
     */
    var StateObject = /** @class */ (function () {
        /** @deprecated use State.create() */
        function StateObject(config) {
            return StateObject.create(config || {});
        }
        /**
         * Create a state object to put the private/internal implementation details onto.
         * The object's prototype chain looks like:
         * (Internal State Object) -> (Copy of State.prototype) -> (State Declaration object) -> (State Declaration's prototype...)
         *
         * @param stateDecl the user-supplied State Declaration
         * @returns {StateObject} an internal State object
         */
        StateObject.create = function (stateDecl) {
            stateDecl = StateObject.isStateClass(stateDecl) ? new stateDecl() : stateDecl;
            var state = inherit(inherit(stateDecl, StateObject.prototype));
            stateDecl.$$state = function () { return state; };
            state.self = stateDecl;
            state.__stateObjectCache = {
                nameGlob: Glob.fromString(state.name),
            };
            return state;
        };
        /**
         * Returns true if the provided parameter is the same state.
         *
         * Compares the identity of the state against the passed value, which is either an object
         * reference to the actual `State` instance, the original definition object passed to
         * `$stateProvider.state()`, or the fully-qualified name.
         *
         * @param ref Can be one of (a) a `State` instance, (b) an object that was passed
         *        into `$stateProvider.state()`, (c) the fully-qualified name of a state as a string.
         * @returns Returns `true` if `ref` matches the current `State` instance.
         */
        StateObject.prototype.is = function (ref) {
            return this === ref || this.self === ref || this.fqn() === ref;
        };
        /**
         * @deprecated this does not properly handle dot notation
         * @returns Returns a dot-separated name of the state.
         */
        StateObject.prototype.fqn = function () {
            if (!this.parent || !(this.parent instanceof this.constructor))
                return this.name;
            var name = this.parent.fqn();
            return name ? name + '.' + this.name : this.name;
        };
        /**
         * Returns the root node of this state's tree.
         *
         * @returns The root of this state's tree.
         */
        StateObject.prototype.root = function () {
            return (this.parent && this.parent.root()) || this;
        };
        /**
         * Gets the state's `Param` objects
         *
         * Gets the list of [[Param]] objects owned by the state.
         * If `opts.inherit` is true, it also includes the ancestor states' [[Param]] objects.
         * If `opts.matchingKeys` exists, returns only `Param`s whose `id` is a key on the `matchingKeys` object
         *
         * @param opts options
         */
        StateObject.prototype.parameters = function (opts) {
            opts = defaults(opts, { inherit: true, matchingKeys: null });
            var inherited = (opts.inherit && this.parent && this.parent.parameters()) || [];
            return inherited
                .concat(values(this.params))
                .filter(function (param) { return !opts.matchingKeys || opts.matchingKeys.hasOwnProperty(param.id); });
        };
        /**
         * Returns a single [[Param]] that is owned by the state
         *
         * If `opts.inherit` is true, it also searches the ancestor states` [[Param]]s.
         * @param id the name of the [[Param]] to return
         * @param opts options
         */
        StateObject.prototype.parameter = function (id, opts) {
            if (opts === void 0) { opts = {}; }
            return ((this.url && this.url.parameter(id, opts)) ||
                find(values(this.params), propEq('id', id)) ||
                (opts.inherit && this.parent && this.parent.parameter(id)));
        };
        StateObject.prototype.toString = function () {
            return this.fqn();
        };
        /** Predicate which returns true if the object is an class with @State() decorator */
        StateObject.isStateClass = function (stateDecl) {
            return isFunction(stateDecl) && stateDecl['__uiRouterState'] === true;
        };
        /** Predicate which returns true if the object is an internal [[StateObject]] object */
        StateObject.isState = function (obj) { return isObject(obj['__stateObjectCache']); };
        return StateObject;
    }());

    /** @module state */ /** for typedoc */
    var StateMatcher = /** @class */ (function () {
        function StateMatcher(_states) {
            this._states = _states;
        }
        StateMatcher.prototype.isRelative = function (stateName) {
            stateName = stateName || '';
            return stateName.indexOf('.') === 0 || stateName.indexOf('^') === 0;
        };
        StateMatcher.prototype.find = function (stateOrName, base, matchGlob) {
            if (matchGlob === void 0) { matchGlob = true; }
            if (!stateOrName && stateOrName !== '')
                return undefined;
            var isStr = isString(stateOrName);
            var name = isStr ? stateOrName : stateOrName.name;
            if (this.isRelative(name))
                name = this.resolvePath(name, base);
            var state = this._states[name];
            if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
                return state;
            }
            else if (isStr && matchGlob) {
                var _states = values(this._states);
                var matches = _states.filter(function (_state) { return _state.__stateObjectCache.nameGlob && _state.__stateObjectCache.nameGlob.matches(name); });
                if (matches.length > 1) {
                    // tslint:disable-next-line:no-console
                    console.log("stateMatcher.find: Found multiple matches for " + name + " using glob: ", matches.map(function (match) { return match.name; }));
                }
                return matches[0];
            }
            return undefined;
        };
        StateMatcher.prototype.resolvePath = function (name, base) {
            if (!base)
                throw new Error("No reference point given for path '" + name + "'");
            var baseState = this.find(base);
            var splitName = name.split('.');
            var pathLength = splitName.length;
            var i = 0, current = baseState;
            for (; i < pathLength; i++) {
                if (splitName[i] === '' && i === 0) {
                    current = baseState;
                    continue;
                }
                if (splitName[i] === '^') {
                    if (!current.parent)
                        throw new Error("Path '" + name + "' not valid for state '" + baseState.name + "'");
                    current = current.parent;
                    continue;
                }
                break;
            }
            var relName = splitName.slice(i).join('.');
            return current.name + (current.name && relName ? '.' : '') + relName;
        };
        return StateMatcher;
    }());

    /** @module state */ /** for typedoc */
    /** @internalapi */
    var StateQueueManager = /** @class */ (function () {
        function StateQueueManager($registry, $urlRouter, states, builder, listeners) {
            this.$registry = $registry;
            this.$urlRouter = $urlRouter;
            this.states = states;
            this.builder = builder;
            this.listeners = listeners;
            this.queue = [];
            this.matcher = $registry.matcher;
        }
        /** @internalapi */
        StateQueueManager.prototype.dispose = function () {
            this.queue = [];
        };
        StateQueueManager.prototype.register = function (stateDecl) {
            var queue = this.queue;
            var state = StateObject.create(stateDecl);
            var name = state.name;
            if (!isString(name))
                throw new Error('State must have a valid name');
            if (this.states.hasOwnProperty(name) || inArray(queue.map(prop('name')), name))
                throw new Error("State '" + name + "' is already defined");
            queue.push(state);
            this.flush();
            return state;
        };
        StateQueueManager.prototype.flush = function () {
            var _this = this;
            var _a = this, queue = _a.queue, states = _a.states, builder = _a.builder;
            var registered = [], // states that got registered
            orphans = [], // states that don't yet have a parent registered
            previousQueueLength = {}; // keep track of how long the queue when an orphan was first encountered
            var getState = function (name) { return _this.states.hasOwnProperty(name) && _this.states[name]; };
            var notifyListeners = function () {
                if (registered.length) {
                    _this.listeners.forEach(function (listener) { return listener('registered', registered.map(function (s) { return s.self; })); });
                }
            };
            while (queue.length > 0) {
                var state = queue.shift();
                var name_1 = state.name;
                var result = builder.build(state);
                var orphanIdx = orphans.indexOf(state);
                if (result) {
                    var existingState = getState(name_1);
                    if (existingState && existingState.name === name_1) {
                        throw new Error("State '" + name_1 + "' is already defined");
                    }
                    var existingFutureState = getState(name_1 + '.**');
                    if (existingFutureState) {
                        // Remove future state of the same name
                        this.$registry.deregister(existingFutureState);
                    }
                    states[name_1] = state;
                    this.attachRoute(state);
                    if (orphanIdx >= 0)
                        orphans.splice(orphanIdx, 1);
                    registered.push(state);
                    continue;
                }
                var prev = previousQueueLength[name_1];
                previousQueueLength[name_1] = queue.length;
                if (orphanIdx >= 0 && prev === queue.length) {
                    // Wait until two consecutive iterations where no additional states were dequeued successfully.
                    // throw new Error(`Cannot register orphaned state '${name}'`);
                    queue.push(state);
                    notifyListeners();
                    return states;
                }
                else if (orphanIdx < 0) {
                    orphans.push(state);
                }
                queue.push(state);
            }
            notifyListeners();
            return states;
        };
        StateQueueManager.prototype.attachRoute = function (state) {
            if (state.abstract || !state.url)
                return;
            this.$urlRouter.rule(this.$urlRouter.urlRuleFactory.create(state));
        };
        return StateQueueManager;
    }());

    /**
     * @coreapi
     * @module state
     */ /** for typedoc */
    var StateRegistry = /** @class */ (function () {
        /** @internalapi */
        function StateRegistry(_router) {
            this._router = _router;
            this.states = {};
            this.listeners = [];
            this.matcher = new StateMatcher(this.states);
            this.builder = new StateBuilder(this.matcher, _router.urlMatcherFactory);
            this.stateQueue = new StateQueueManager(this, _router.urlRouter, this.states, this.builder, this.listeners);
            this._registerRoot();
        }
        /** @internalapi */
        StateRegistry.prototype._registerRoot = function () {
            var rootStateDef = {
                name: '',
                url: '^',
                views: null,
                params: {
                    '#': { value: null, type: 'hash', dynamic: true },
                },
                abstract: true,
            };
            var _root = (this._root = this.stateQueue.register(rootStateDef));
            _root.navigable = null;
        };
        /** @internalapi */
        StateRegistry.prototype.dispose = function () {
            var _this = this;
            this.stateQueue.dispose();
            this.listeners = [];
            this.get().forEach(function (state) { return _this.get(state) && _this.deregister(state); });
        };
        /**
         * Listen for a State Registry events
         *
         * Adds a callback that is invoked when states are registered or deregistered with the StateRegistry.
         *
         * #### Example:
         * ```js
         * let allStates = registry.get();
         *
         * // Later, invoke deregisterFn() to remove the listener
         * let deregisterFn = registry.onStatesChanged((event, states) => {
         *   switch(event) {
         *     case: 'registered':
         *       states.forEach(state => allStates.push(state));
         *       break;
         *     case: 'deregistered':
         *       states.forEach(state => {
         *         let idx = allStates.indexOf(state);
         *         if (idx !== -1) allStates.splice(idx, 1);
         *       });
         *       break;
         *   }
         * });
         * ```
         *
         * @param listener a callback function invoked when the registered states changes.
         *        The function receives two parameters, `event` and `state`.
         *        See [[StateRegistryListener]]
         * @return a function that deregisters the listener
         */
        StateRegistry.prototype.onStatesChanged = function (listener) {
            this.listeners.push(listener);
            return function deregisterListener() {
                removeFrom(this.listeners)(listener);
            }.bind(this);
        };
        /**
         * Gets the implicit root state
         *
         * Gets the root of the state tree.
         * The root state is implicitly created by UI-Router.
         * Note: this returns the internal [[StateObject]] representation, not a [[StateDeclaration]]
         *
         * @return the root [[StateObject]]
         */
        StateRegistry.prototype.root = function () {
            return this._root;
        };
        /**
         * Adds a state to the registry
         *
         * Registers a [[StateDeclaration]] or queues it for registration.
         *
         * Note: a state will be queued if the state's parent isn't yet registered.
         *
         * @param stateDefinition the definition of the state to register.
         * @returns the internal [[StateObject]] object.
         *          If the state was successfully registered, then the object is fully built (See: [[StateBuilder]]).
         *          If the state was only queued, then the object is not fully built.
         */
        StateRegistry.prototype.register = function (stateDefinition) {
            return this.stateQueue.register(stateDefinition);
        };
        /** @hidden */
        StateRegistry.prototype._deregisterTree = function (state) {
            var _this = this;
            var all$$1 = this.get().map(function (s) { return s.$$state(); });
            var getChildren = function (states) {
                var _children = all$$1.filter(function (s) { return states.indexOf(s.parent) !== -1; });
                return _children.length === 0 ? _children : _children.concat(getChildren(_children));
            };
            var children = getChildren([state]);
            var deregistered = [state].concat(children).reverse();
            deregistered.forEach(function (_state) {
                var $ur = _this._router.urlRouter;
                // Remove URL rule
                $ur
                    .rules()
                    .filter(propEq('state', _state))
                    .forEach($ur.removeRule.bind($ur));
                // Remove state from registry
                delete _this.states[_state.name];
            });
            return deregistered;
        };
        /**
         * Removes a state from the registry
         *
         * This removes a state from the registry.
         * If the state has children, they are are also removed from the registry.
         *
         * @param stateOrName the state's name or object representation
         * @returns {StateObject[]} a list of removed states
         */
        StateRegistry.prototype.deregister = function (stateOrName) {
            var _state = this.get(stateOrName);
            if (!_state)
                throw new Error("Can't deregister state; not found: " + stateOrName);
            var deregisteredStates = this._deregisterTree(_state.$$state());
            this.listeners.forEach(function (listener) { return listener('deregistered', deregisteredStates.map(function (s) { return s.self; })); });
            return deregisteredStates;
        };
        StateRegistry.prototype.get = function (stateOrName, base) {
            var _this = this;
            if (arguments.length === 0)
                return Object.keys(this.states).map(function (name) { return _this.states[name].self; });
            var found = this.matcher.find(stateOrName, base);
            return (found && found.self) || null;
        };
        StateRegistry.prototype.decorator = function (name, func) {
            return this.builder.builder(name, func);
        };
        return StateRegistry;
    }());

    (function (TransitionHookPhase) {
        TransitionHookPhase[TransitionHookPhase["CREATE"] = 0] = "CREATE";
        TransitionHookPhase[TransitionHookPhase["BEFORE"] = 1] = "BEFORE";
        TransitionHookPhase[TransitionHookPhase["RUN"] = 2] = "RUN";
        TransitionHookPhase[TransitionHookPhase["SUCCESS"] = 3] = "SUCCESS";
        TransitionHookPhase[TransitionHookPhase["ERROR"] = 4] = "ERROR";
    })(exports.TransitionHookPhase || (exports.TransitionHookPhase = {}));

    (function (TransitionHookScope) {
        TransitionHookScope[TransitionHookScope["TRANSITION"] = 0] = "TRANSITION";
        TransitionHookScope[TransitionHookScope["STATE"] = 1] = "STATE";
    })(exports.TransitionHookScope || (exports.TransitionHookScope = {}));

    /**
     * @coreapi
     * @module transition
     */
    var defaultOptions = {
        current: noop,
        transition: null,
        traceData: {},
        bind: null,
    };
    /** @hidden */
    var TransitionHook = /** @class */ (function () {
        function TransitionHook(transition, stateContext, registeredHook, options) {
            var _this = this;
            this.transition = transition;
            this.stateContext = stateContext;
            this.registeredHook = registeredHook;
            this.options = options;
            this.isSuperseded = function () { return _this.type.hookPhase === exports.TransitionHookPhase.RUN && !_this.options.transition.isActive(); };
            this.options = defaults(options, defaultOptions);
            this.type = registeredHook.eventType;
        }
        /**
         * Chains together an array of TransitionHooks.
         *
         * Given a list of [[TransitionHook]] objects, chains them together.
         * Each hook is invoked after the previous one completes.
         *
         * #### Example:
         * ```js
         * var hooks: TransitionHook[] = getHooks();
         * let promise: Promise<any> = TransitionHook.chain(hooks);
         *
         * promise.then(handleSuccess, handleError);
         * ```
         *
         * @param hooks the list of hooks to chain together
         * @param waitFor if provided, the chain is `.then()`'ed off this promise
         * @returns a `Promise` for sequentially invoking the hooks (in order)
         */
        TransitionHook.chain = function (hooks, waitFor) {
            // Chain the next hook off the previous
            var createHookChainR = function (prev, nextHook) { return prev.then(function () { return nextHook.invokeHook(); }); };
            return hooks.reduce(createHookChainR, waitFor || services.$q.when());
        };
        /**
         * Invokes all the provided TransitionHooks, in order.
         * Each hook's return value is checked.
         * If any hook returns a promise, then the rest of the hooks are chained off that promise, and the promise is returned.
         * If no hook returns a promise, then all hooks are processed synchronously.
         *
         * @param hooks the list of TransitionHooks to invoke
         * @param doneCallback a callback that is invoked after all the hooks have successfully completed
         *
         * @returns a promise for the async result, or the result of the callback
         */
        TransitionHook.invokeHooks = function (hooks, doneCallback) {
            for (var idx = 0; idx < hooks.length; idx++) {
                var hookResult = hooks[idx].invokeHook();
                if (isPromise(hookResult)) {
                    var remainingHooks = hooks.slice(idx + 1);
                    return TransitionHook.chain(remainingHooks, hookResult).then(doneCallback);
                }
            }
            return doneCallback();
        };
        /**
         * Run all TransitionHooks, ignoring their return value.
         */
        TransitionHook.runAllHooks = function (hooks) {
            hooks.forEach(function (hook) { return hook.invokeHook(); });
        };
        TransitionHook.prototype.logError = function (err) {
            this.transition.router.stateService.defaultErrorHandler()(err);
        };
        TransitionHook.prototype.invokeHook = function () {
            var _this = this;
            var hook = this.registeredHook;
            if (hook._deregistered)
                return;
            var notCurrent = this.getNotCurrentRejection();
            if (notCurrent)
                return notCurrent;
            var options = this.options;
            trace.traceHookInvocation(this, this.transition, options);
            var invokeCallback = function () { return hook.callback.call(options.bind, _this.transition, _this.stateContext); };
            var normalizeErr = function (err) { return Rejection.normalize(err).toPromise(); };
            var handleError = function (err) { return hook.eventType.getErrorHandler(_this)(err); };
            var handleResult = function (result) { return hook.eventType.getResultHandler(_this)(result); };
            try {
                var result = invokeCallback();
                if (!this.type.synchronous && isPromise(result)) {
                    return result.catch(normalizeErr).then(handleResult, handleError);
                }
                else {
                    return handleResult(result);
                }
            }
            catch (err) {
                // If callback throws (synchronously)
                return handleError(Rejection.normalize(err));
            }
            finally {
                if (hook.invokeLimit && ++hook.invokeCount >= hook.invokeLimit) {
                    hook.deregister();
                }
            }
        };
        /**
         * This method handles the return value of a Transition Hook.
         *
         * A hook can return false (cancel), a TargetState (redirect),
         * or a promise (which may later resolve to false or a redirect)
         *
         * This also handles "transition superseded" -- when a new transition
         * was started while the hook was still running
         */
        TransitionHook.prototype.handleHookResult = function (result) {
            var _this = this;
            var notCurrent = this.getNotCurrentRejection();
            if (notCurrent)
                return notCurrent;
            // Hook returned a promise
            if (isPromise(result)) {
                // Wait for the promise, then reprocess with the resulting value
                return result.then(function (val$$1) { return _this.handleHookResult(val$$1); });
            }
            trace.traceHookResult(result, this.transition, this.options);
            // Hook returned false
            if (result === false) {
                // Abort this Transition
                return Rejection.aborted('Hook aborted transition').toPromise();
            }
            var isTargetState = is(TargetState);
            // hook returned a TargetState
            if (isTargetState(result)) {
                // Halt the current Transition and redirect (a new Transition) to the TargetState.
                return Rejection.redirected(result).toPromise();
            }
        };
        /**
         * Return a Rejection promise if the transition is no longer current due
         * to a stopped router (disposed), or a new transition has started and superseded this one.
         */
        TransitionHook.prototype.getNotCurrentRejection = function () {
            var router = this.transition.router;
            // The router is stopped
            if (router._disposed) {
                return Rejection.aborted("UIRouter instance #" + router.$id + " has been stopped (disposed)").toPromise();
            }
            if (this.transition._aborted) {
                return Rejection.aborted().toPromise();
            }
            // This transition is no longer current.
            // Another transition started while this hook was still running.
            if (this.isSuperseded()) {
                // Abort this transition
                return Rejection.superseded(this.options.current()).toPromise();
            }
        };
        TransitionHook.prototype.toString = function () {
            var _a = this, options = _a.options, registeredHook = _a.registeredHook;
            var event = parse('traceData.hookType')(options) || 'internal', context = parse('traceData.context.state.name')(options) || parse('traceData.context')(options) || 'unknown', name = fnToString(registeredHook.callback);
            return event + " context: " + context + ", " + maxLength(200, name);
        };
        /**
         * These GetResultHandler(s) are used by [[invokeHook]] below
         * Each HookType chooses a GetResultHandler (See: [[TransitionService._defineCoreEvents]])
         */
        TransitionHook.HANDLE_RESULT = function (hook) { return function (result) {
            return hook.handleHookResult(result);
        }; };
        /**
         * If the result is a promise rejection, log it.
         * Otherwise, ignore the result.
         */
        TransitionHook.LOG_REJECTED_RESULT = function (hook) { return function (result) {
            isPromise(result) && result.catch(function (err) { return hook.logError(Rejection.normalize(err)); });
            return undefined;
        }; };
        /**
         * These GetErrorHandler(s) are used by [[invokeHook]] below
         * Each HookType chooses a GetErrorHandler (See: [[TransitionService._defineCoreEvents]])
         */
        TransitionHook.LOG_ERROR = function (hook) { return function (error) { return hook.logError(error); }; };
        TransitionHook.REJECT_ERROR = function (hook) { return function (error) { return silentRejection(error); }; };
        TransitionHook.THROW_ERROR = function (hook) { return function (error) {
            throw error;
        }; };
        return TransitionHook;
    }());

    /**
     * @coreapi
     * @module transition
     */ /** for typedoc */
    /**
     * Determines if the given state matches the matchCriteria
     *
     * @hidden
     *
     * @param state a State Object to test against
     * @param criterion
     * - If a string, matchState uses the string as a glob-matcher against the state name
     * - If an array (of strings), matchState uses each string in the array as a glob-matchers against the state name
     *   and returns a positive match if any of the globs match.
     * - If a function, matchState calls the function with the state and returns true if the function's result is truthy.
     * @returns {boolean}
     */
    function matchState(state, criterion) {
        var toMatch = isString(criterion) ? [criterion] : criterion;
        function matchGlobs(_state) {
            var globStrings = toMatch;
            for (var i = 0; i < globStrings.length; i++) {
                var glob = new Glob(globStrings[i]);
                if ((glob && glob.matches(_state.name)) || (!glob && globStrings[i] === _state.name)) {
                    return true;
                }
            }
            return false;
        }
        var matchFn = (isFunction(toMatch) ? toMatch : matchGlobs);
        return !!matchFn(state);
    }
    /**
     * @internalapi
     * The registration data for a registered transition hook
     */
    var RegisteredHook = /** @class */ (function () {
        function RegisteredHook(tranSvc, eventType, callback, matchCriteria, removeHookFromRegistry, options) {
            if (options === void 0) { options = {}; }
            this.tranSvc = tranSvc;
            this.eventType = eventType;
            this.callback = callback;
            this.matchCriteria = matchCriteria;
            this.removeHookFromRegistry = removeHookFromRegistry;
            this.invokeCount = 0;
            this._deregistered = false;
            this.priority = options.priority || 0;
            this.bind = options.bind || null;
            this.invokeLimit = options.invokeLimit;
        }
        /**
         * Gets the matching [[PathNode]]s
         *
         * Given an array of [[PathNode]]s, and a [[HookMatchCriterion]], returns an array containing
         * the [[PathNode]]s that the criteria matches, or `null` if there were no matching nodes.
         *
         * Returning `null` is significant to distinguish between the default
         * "match-all criterion value" of `true` compared to a `() => true` function,
         * when the nodes is an empty array.
         *
         * This is useful to allow a transition match criteria of `entering: true`
         * to still match a transition, even when `entering === []`.  Contrast that
         * with `entering: (state) => true` which only matches when a state is actually
         * being entered.
         */
        RegisteredHook.prototype._matchingNodes = function (nodes, criterion) {
            if (criterion === true)
                return nodes;
            var matching = nodes.filter(function (node) { return matchState(node.state, criterion); });
            return matching.length ? matching : null;
        };
        /**
         * Gets the default match criteria (all `true`)
         *
         * Returns an object which has all the criteria match paths as keys and `true` as values, i.e.:
         *
         * ```js
         * {
         *   to: true,
         *   from: true,
         *   entering: true,
         *   exiting: true,
         *   retained: true,
         * }
         */
        RegisteredHook.prototype._getDefaultMatchCriteria = function () {
            return mapObj(this.tranSvc._pluginapi._getPathTypes(), function () { return true; });
        };
        /**
         * Gets matching nodes as [[IMatchingNodes]]
         *
         * Create a IMatchingNodes object from the TransitionHookTypes that is roughly equivalent to:
         *
         * ```js
         * let matches: IMatchingNodes = {
         *   to:       _matchingNodes([tail(treeChanges.to)],   mc.to),
         *   from:     _matchingNodes([tail(treeChanges.from)], mc.from),
         *   exiting:  _matchingNodes(treeChanges.exiting,      mc.exiting),
         *   retained: _matchingNodes(treeChanges.retained,     mc.retained),
         *   entering: _matchingNodes(treeChanges.entering,     mc.entering),
         * };
         * ```
         */
        RegisteredHook.prototype._getMatchingNodes = function (treeChanges) {
            var _this = this;
            var criteria = extend(this._getDefaultMatchCriteria(), this.matchCriteria);
            var paths = values(this.tranSvc._pluginapi._getPathTypes());
            return paths.reduce(function (mn, pathtype) {
                // STATE scope criteria matches against every node in the path.
                // TRANSITION scope criteria matches against only the last node in the path
                var isStateHook = pathtype.scope === exports.TransitionHookScope.STATE;
                var path = treeChanges[pathtype.name] || [];
                var nodes = isStateHook ? path : [tail(path)];
                mn[pathtype.name] = _this._matchingNodes(nodes, criteria[pathtype.name]);
                return mn;
            }, {});
        };
        /**
         * Determines if this hook's [[matchCriteria]] match the given [[TreeChanges]]
         *
         * @returns an IMatchingNodes object, or null. If an IMatchingNodes object is returned, its values
         * are the matching [[PathNode]]s for each [[HookMatchCriterion]] (to, from, exiting, retained, entering)
         */
        RegisteredHook.prototype.matches = function (treeChanges) {
            var matches = this._getMatchingNodes(treeChanges);
            // Check if all the criteria matched the TreeChanges object
            var allMatched = values(matches).every(identity);
            return allMatched ? matches : null;
        };
        RegisteredHook.prototype.deregister = function () {
            this.removeHookFromRegistry(this);
            this._deregistered = true;
        };
        return RegisteredHook;
    }());
    /** @hidden Return a registration function of the requested type. */
    function makeEvent(registry, transitionService, eventType) {
        // Create the object which holds the registered transition hooks.
        var _registeredHooks = (registry._registeredHooks = registry._registeredHooks || {});
        var hooks = (_registeredHooks[eventType.name] = []);
        var removeHookFn = removeFrom(hooks);
        // Create hook registration function on the IHookRegistry for the event
        registry[eventType.name] = hookRegistrationFn;
        function hookRegistrationFn(matchObject, callback, options) {
            if (options === void 0) { options = {}; }
            var registeredHook = new RegisteredHook(transitionService, eventType, callback, matchObject, removeHookFn, options);
            hooks.push(registeredHook);
            return registeredHook.deregister.bind(registeredHook);
        }
        return hookRegistrationFn;
    }

    /**
     * @coreapi
     * @module transition
     */ /** for typedoc */
    /**
     * This class returns applicable TransitionHooks for a specific Transition instance.
     *
     * Hooks ([[RegisteredHook]]) may be registered globally, e.g., $transitions.onEnter(...), or locally, e.g.
     * myTransition.onEnter(...).  The HookBuilder finds matching RegisteredHooks (where the match criteria is
     * determined by the type of hook)
     *
     * The HookBuilder also converts RegisteredHooks objects to TransitionHook objects, which are used to run a Transition.
     *
     * The HookBuilder constructor is given the $transitions service and a Transition instance.  Thus, a HookBuilder
     * instance may only be used for one specific Transition object. (side note: the _treeChanges accessor is private
     * in the Transition class, so we must also provide the Transition's _treeChanges)
     *
     */
    var HookBuilder = /** @class */ (function () {
        function HookBuilder(transition) {
            this.transition = transition;
        }
        HookBuilder.prototype.buildHooksForPhase = function (phase) {
            var _this = this;
            var $transitions = this.transition.router.transitionService;
            return $transitions._pluginapi
                ._getEvents(phase)
                .map(function (type) { return _this.buildHooks(type); })
                .reduce(unnestR, [])
                .filter(identity);
        };
        /**
         * Returns an array of newly built TransitionHook objects.
         *
         * - Finds all RegisteredHooks registered for the given `hookType` which matched the transition's [[TreeChanges]].
         * - Finds [[PathNode]] (or `PathNode[]`) to use as the TransitionHook context(s)
         * - For each of the [[PathNode]]s, creates a TransitionHook
         *
         * @param hookType the type of the hook registration function, e.g., 'onEnter', 'onFinish'.
         */
        HookBuilder.prototype.buildHooks = function (hookType) {
            var transition = this.transition;
            var treeChanges = transition.treeChanges();
            // Find all the matching registered hooks for a given hook type
            var matchingHooks = this.getMatchingHooks(hookType, treeChanges);
            if (!matchingHooks)
                return [];
            var baseHookOptions = {
                transition: transition,
                current: transition.options().current,
            };
            var makeTransitionHooks = function (hook) {
                // Fetch the Nodes that caused this hook to match.
                var matches = hook.matches(treeChanges);
                // Select the PathNode[] that will be used as TransitionHook context objects
                var matchingNodes = matches[hookType.criteriaMatchPath.name];
                // Return an array of HookTuples
                return matchingNodes.map(function (node) {
                    var _options = extend({
                        bind: hook.bind,
                        traceData: { hookType: hookType.name, context: node },
                    }, baseHookOptions);
                    var state = hookType.criteriaMatchPath.scope === exports.TransitionHookScope.STATE ? node.state.self : null;
                    var transitionHook = new TransitionHook(transition, state, hook, _options);
                    return { hook: hook, node: node, transitionHook: transitionHook };
                });
            };
            return matchingHooks
                .map(makeTransitionHooks)
                .reduce(unnestR, [])
                .sort(tupleSort(hookType.reverseSort))
                .map(function (tuple) { return tuple.transitionHook; });
        };
        /**
         * Finds all RegisteredHooks from:
         * - The Transition object instance hook registry
         * - The TransitionService ($transitions) global hook registry
         *
         * which matched:
         * - the eventType
         * - the matchCriteria (to, from, exiting, retained, entering)
         *
         * @returns an array of matched [[RegisteredHook]]s
         */
        HookBuilder.prototype.getMatchingHooks = function (hookType, treeChanges) {
            var isCreate = hookType.hookPhase === exports.TransitionHookPhase.CREATE;
            // Instance and Global hook registries
            var $transitions = this.transition.router.transitionService;
            var registries = isCreate ? [$transitions] : [this.transition, $transitions];
            return registries
                .map(function (reg) { return reg.getHooks(hookType.name); }) // Get named hooks from registries
                .filter(assertPredicate(isArray, "broken event named: " + hookType.name)) // Sanity check
                .reduce(unnestR, []) // Un-nest RegisteredHook[][] to RegisteredHook[] array
                .filter(function (hook) { return hook.matches(treeChanges); }); // Only those satisfying matchCriteria
        };
        return HookBuilder;
    }());
    /**
     * A factory for a sort function for HookTuples.
     *
     * The sort function first compares the PathNode depth (how deep in the state tree a node is), then compares
     * the EventHook priority.
     *
     * @param reverseDepthSort a boolean, when true, reverses the sort order for the node depth
     * @returns a tuple sort function
     */
    function tupleSort(reverseDepthSort) {
        if (reverseDepthSort === void 0) { reverseDepthSort = false; }
        return function nodeDepthThenPriority(l, r) {
            var factor = reverseDepthSort ? -1 : 1;
            var depthDelta = (l.node.state.path.length - r.node.state.path.length) * factor;
            return depthDelta !== 0 ? depthDelta : r.hook.priority - l.hook.priority;
        };
    }

    /**
     * @coreapi
     * @module transition
     */
    /** @hidden */
    var stateSelf = prop('self');
    /**
     * Represents a transition between two states.
     *
     * When navigating to a state, we are transitioning **from** the current state **to** the new state.
     *
     * This object contains all contextual information about the to/from states, parameters, resolves.
     * It has information about all states being entered and exited as a result of the transition.
     */
    var Transition = /** @class */ (function () {
        /**
         * Creates a new Transition object.
         *
         * If the target state is not valid, an error is thrown.
         *
         * @internalapi
         *
         * @param fromPath The path of [[PathNode]]s from which the transition is leaving.  The last node in the `fromPath`
         *        encapsulates the "from state".
         * @param targetState The target state and parameters being transitioned to (also, the transition options)
         * @param router The [[UIRouter]] instance
         */
        function Transition(fromPath, targetState, router) {
            var _this = this;
            /** @hidden */
            this._deferred = services.$q.defer();
            /**
             * This promise is resolved or rejected based on the outcome of the Transition.
             *
             * When the transition is successful, the promise is resolved
             * When the transition is unsuccessful, the promise is rejected with the [[Rejection]] or javascript error
             */
            this.promise = this._deferred.promise;
            /** @hidden Holds the hook registration functions such as those passed to Transition.onStart() */
            this._registeredHooks = {};
            /** @hidden */
            this._hookBuilder = new HookBuilder(this);
            /** Checks if this transition is currently active/running. */
            this.isActive = function () { return _this.router.globals.transition === _this; };
            this.router = router;
            this._targetState = targetState;
            if (!targetState.valid()) {
                throw new Error(targetState.error());
            }
            // current() is assumed to come from targetState.options, but provide a naive implementation otherwise.
            this._options = extend({ current: val(this) }, targetState.options());
            this.$id = router.transitionService._transitionCount++;
            var toPath = PathUtils.buildToPath(fromPath, targetState);
            this._treeChanges = PathUtils.treeChanges(fromPath, toPath, this._options.reloadState);
            this.createTransitionHookRegFns();
            var onCreateHooks = this._hookBuilder.buildHooksForPhase(exports.TransitionHookPhase.CREATE);
            TransitionHook.invokeHooks(onCreateHooks, function () { return null; });
            this.applyViewConfigs(router);
        }
        /** @hidden */
        Transition.prototype.onBefore = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onStart = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onExit = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onRetain = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onEnter = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onFinish = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onSuccess = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onError = function (criteria, callback, options) {
            return;
        };
        /** @hidden
         * Creates the transition-level hook registration functions
         * (which can then be used to register hooks)
         */
        Transition.prototype.createTransitionHookRegFns = function () {
            var _this = this;
            this.router.transitionService._pluginapi
                ._getEvents()
                .filter(function (type) { return type.hookPhase !== exports.TransitionHookPhase.CREATE; })
                .forEach(function (type) { return makeEvent(_this, _this.router.transitionService, type); });
        };
        /** @internalapi */
        Transition.prototype.getHooks = function (hookName) {
            return this._registeredHooks[hookName];
        };
        Transition.prototype.applyViewConfigs = function (router) {
            var enteringStates = this._treeChanges.entering.map(function (node) { return node.state; });
            PathUtils.applyViewConfigs(router.transitionService.$view, this._treeChanges.to, enteringStates);
        };
        /**
         * @internalapi
         *
         * @returns the internal from [State] object
         */
        Transition.prototype.$from = function () {
            return tail(this._treeChanges.from).state;
        };
        /**
         * @internalapi
         *
         * @returns the internal to [State] object
         */
        Transition.prototype.$to = function () {
            return tail(this._treeChanges.to).state;
        };
        /**
         * Returns the "from state"
         *
         * Returns the state that the transition is coming *from*.
         *
         * @returns The state declaration object for the Transition's ("from state").
         */
        Transition.prototype.from = function () {
            return this.$from().self;
        };
        /**
         * Returns the "to state"
         *
         * Returns the state that the transition is going *to*.
         *
         * @returns The state declaration object for the Transition's target state ("to state").
         */
        Transition.prototype.to = function () {
            return this.$to().self;
        };
        /**
         * Gets the Target State
         *
         * A transition's [[TargetState]] encapsulates the [[to]] state, the [[params]], and the [[options]] as a single object.
         *
         * @returns the [[TargetState]] of this Transition
         */
        Transition.prototype.targetState = function () {
            return this._targetState;
        };
        /**
         * Determines whether two transitions are equivalent.
         * @deprecated
         */
        Transition.prototype.is = function (compare) {
            if (compare instanceof Transition) {
                // TODO: Also compare parameters
                return this.is({ to: compare.$to().name, from: compare.$from().name });
            }
            return !((compare.to && !matchState(this.$to(), compare.to)) ||
                (compare.from && !matchState(this.$from(), compare.from)));
        };
        Transition.prototype.params = function (pathname) {
            if (pathname === void 0) { pathname = 'to'; }
            return Object.freeze(this._treeChanges[pathname].map(prop('paramValues')).reduce(mergeR, {}));
        };
        Transition.prototype.paramsChanged = function () {
            var fromParams = this.params('from');
            var toParams = this.params('to');
            // All the parameters declared on both the "to" and "from" paths
            var allParamDescriptors = []
                .concat(this._treeChanges.to)
                .concat(this._treeChanges.from)
                .map(function (pathNode) { return pathNode.paramSchema; })
                .reduce(flattenR, [])
                .reduce(uniqR, []);
            var changedParamDescriptors = Param.changed(allParamDescriptors, fromParams, toParams);
            return changedParamDescriptors.reduce(function (changedValues, descriptor) {
                changedValues[descriptor.id] = toParams[descriptor.id];
                return changedValues;
            }, {});
        };
        /**
         * Creates a [[UIInjector]] Dependency Injector
         *
         * Returns a Dependency Injector for the Transition's target state (to state).
         * The injector provides resolve values which the target state has access to.
         *
         * The `UIInjector` can also provide values from the native root/global injector (ng1/ng2).
         *
         * #### Example:
         * ```js
         * .onEnter({ entering: 'myState' }, trans => {
         *   var myResolveValue = trans.injector().get('myResolve');
         *   // Inject a global service from the global/native injector (if it exists)
         *   var MyService = trans.injector().get('MyService');
         * })
         * ```
         *
         * In some cases (such as `onBefore`), you may need access to some resolve data but it has not yet been fetched.
         * You can use [[UIInjector.getAsync]] to get a promise for the data.
         * #### Example:
         * ```js
         * .onBefore({}, trans => {
         *   return trans.injector().getAsync('myResolve').then(myResolveValue =>
         *     return myResolveValue !== 'ABORT';
         *   });
         * });
         * ```
         *
         * If a `state` is provided, the injector that is returned will be limited to resolve values that the provided state has access to.
         * This can be useful if both a parent state `foo` and a child state `foo.bar` have both defined a resolve such as `data`.
         * #### Example:
         * ```js
         * .onEnter({ to: 'foo.bar' }, trans => {
         *   // returns result of `foo` state's `myResolve` resolve
         *   // even though `foo.bar` also has a `myResolve` resolve
         *   var fooData = trans.injector('foo').get('myResolve');
         * });
         * ```
         *
         * If you need resolve data from the exiting states, pass `'from'` as `pathName`.
         * The resolve data from the `from` path will be returned.
         * #### Example:
         * ```js
         * .onExit({ exiting: 'foo.bar' }, trans => {
         *   // Gets the resolve value of `myResolve` from the state being exited
         *   var fooData = trans.injector(null, 'from').get('myResolve');
         * });
         * ```
         *
         *
         * @param state Limits the resolves provided to only the resolves the provided state has access to.
         * @param pathName Default: `'to'`: Chooses the path for which to create the injector. Use this to access resolves for `exiting` states.
         *
         * @returns a [[UIInjector]]
         */
        Transition.prototype.injector = function (state, pathName) {
            if (pathName === void 0) { pathName = 'to'; }
            var path = this._treeChanges[pathName];
            if (state)
                path = PathUtils.subPath(path, function (node) { return node.state === state || node.state.name === state; });
            return new ResolveContext(path).injector();
        };
        /**
         * Gets all available resolve tokens (keys)
         *
         * This method can be used in conjunction with [[injector]] to inspect the resolve values
         * available to the Transition.
         *
         * This returns all the tokens defined on [[StateDeclaration.resolve]] blocks, for the states
         * in the Transition's [[TreeChanges.to]] path.
         *
         * #### Example:
         * This example logs all resolve values
         * ```js
         * let tokens = trans.getResolveTokens();
         * tokens.forEach(token => console.log(token + " = " + trans.injector().get(token)));
         * ```
         *
         * #### Example:
         * This example creates promises for each resolve value.
         * This triggers fetches of resolves (if any have not yet been fetched).
         * When all promises have all settled, it logs the resolve values.
         * ```js
         * let tokens = trans.getResolveTokens();
         * let promise = tokens.map(token => trans.injector().getAsync(token));
         * Promise.all(promises).then(values => console.log("Resolved values: " + values));
         * ```
         *
         * Note: Angular 1 users whould use `$q.all()`
         *
         * @param pathname resolve context's path name (e.g., `to` or `from`)
         *
         * @returns an array of resolve tokens (keys)
         */
        Transition.prototype.getResolveTokens = function (pathname) {
            if (pathname === void 0) { pathname = 'to'; }
            return new ResolveContext(this._treeChanges[pathname]).getTokens();
        };
        /**
         * Dynamically adds a new [[Resolvable]] (i.e., [[StateDeclaration.resolve]]) to this transition.
         *
         * Allows a transition hook to dynamically add a Resolvable to this Transition.
         *
         * Use the [[Transition.injector]] to retrieve the resolved data in subsequent hooks ([[UIInjector.get]]).
         *
         * If a `state` argument is provided, the Resolvable is processed when that state is being entered.
         * If no `state` is provided then the root state is used.
         * If the given `state` has already been entered, the Resolvable is processed when any child state is entered.
         * If no child states will be entered, the Resolvable is processed during the `onFinish` phase of the Transition.
         *
         * The `state` argument also scopes the resolved data.
         * The resolved data is available from the injector for that `state` and any children states.
         *
         * #### Example:
         * ```js
         * transitionService.onBefore({}, transition => {
         *   transition.addResolvable({
         *     token: 'myResolve',
         *     deps: ['MyService'],
         *     resolveFn: myService => myService.getData()
         *   });
         * });
         * ```
         *
         * @param resolvable a [[ResolvableLiteral]] object (or a [[Resolvable]])
         * @param state the state in the "to path" which should receive the new resolve (otherwise, the root state)
         */
        Transition.prototype.addResolvable = function (resolvable, state) {
            if (state === void 0) { state = ''; }
            resolvable = is(Resolvable)(resolvable) ? resolvable : new Resolvable(resolvable);
            var stateName = typeof state === 'string' ? state : state.name;
            var topath = this._treeChanges.to;
            var targetNode = find(topath, function (node) { return node.state.name === stateName; });
            var resolveContext = new ResolveContext(topath);
            resolveContext.addResolvables([resolvable], targetNode.state);
        };
        /**
         * Gets the transition from which this transition was redirected.
         *
         * If the current transition is a redirect, this method returns the transition that was redirected.
         *
         * #### Example:
         * ```js
         * let transitionA = $state.go('A').transition
         * transitionA.onStart({}, () => $state.target('B'));
         * $transitions.onSuccess({ to: 'B' }, (trans) => {
         *   trans.to().name === 'B'; // true
         *   trans.redirectedFrom() === transitionA; // true
         * });
         * ```
         *
         * @returns The previous Transition, or null if this Transition is not the result of a redirection
         */
        Transition.prototype.redirectedFrom = function () {
            return this._options.redirectedFrom || null;
        };
        /**
         * Gets the original transition in a redirect chain
         *
         * A transition might belong to a long chain of multiple redirects.
         * This method walks the [[redirectedFrom]] chain back to the original (first) transition in the chain.
         *
         * #### Example:
         * ```js
         * // states
         * registry.register({ name: 'A', redirectTo: 'B' });
         * registry.register({ name: 'B', redirectTo: 'C' });
         * registry.register({ name: 'C', redirectTo: 'D' });
         * registry.register({ name: 'D' });
         *
         * let transitionA = $state.go('A').transition
         *
         * $transitions.onSuccess({ to: 'D' }, (trans) => {
         *   trans.to().name === 'D'; // true
         *   trans.redirectedFrom().to().name === 'C'; // true
         *   trans.originalTransition() === transitionA; // true
         *   trans.originalTransition().to().name === 'A'; // true
         * });
         * ```
         *
         * @returns The original Transition that started a redirect chain
         */
        Transition.prototype.originalTransition = function () {
            var rf = this.redirectedFrom();
            return (rf && rf.originalTransition()) || this;
        };
        /**
         * Get the transition options
         *
         * @returns the options for this Transition.
         */
        Transition.prototype.options = function () {
            return this._options;
        };
        /**
         * Gets the states being entered.
         *
         * @returns an array of states that will be entered during this transition.
         */
        Transition.prototype.entering = function () {
            return map(this._treeChanges.entering, prop('state')).map(stateSelf);
        };
        /**
         * Gets the states being exited.
         *
         * @returns an array of states that will be exited during this transition.
         */
        Transition.prototype.exiting = function () {
            return map(this._treeChanges.exiting, prop('state'))
                .map(stateSelf)
                .reverse();
        };
        /**
         * Gets the states being retained.
         *
         * @returns an array of states that are already entered from a previous Transition, that will not be
         *    exited during this Transition
         */
        Transition.prototype.retained = function () {
            return map(this._treeChanges.retained, prop('state')).map(stateSelf);
        };
        /**
         * Get the [[ViewConfig]]s associated with this Transition
         *
         * Each state can define one or more views (template/controller), which are encapsulated as `ViewConfig` objects.
         * This method fetches the `ViewConfigs` for a given path in the Transition (e.g., "to" or "entering").
         *
         * @param pathname the name of the path to fetch views for:
         *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
         * @param state If provided, only returns the `ViewConfig`s for a single state in the path
         *
         * @returns a list of ViewConfig objects for the given path.
         */
        Transition.prototype.views = function (pathname, state) {
            if (pathname === void 0) { pathname = 'entering'; }
            var path = this._treeChanges[pathname];
            path = !state ? path : path.filter(propEq('state', state));
            return path
                .map(prop('views'))
                .filter(identity)
                .reduce(unnestR, []);
        };
        Transition.prototype.treeChanges = function (pathname) {
            return pathname ? this._treeChanges[pathname] : this._treeChanges;
        };
        /**
         * Creates a new transition that is a redirection of the current one.
         *
         * This transition can be returned from a [[TransitionService]] hook to
         * redirect a transition to a new state and/or set of parameters.
         *
         * @internalapi
         *
         * @returns Returns a new [[Transition]] instance.
         */
        Transition.prototype.redirect = function (targetState) {
            var redirects = 1, trans = this;
            // tslint:disable-next-line:no-conditional-assignment
            while ((trans = trans.redirectedFrom()) != null) {
                if (++redirects > 20)
                    throw new Error("Too many consecutive Transition redirects (20+)");
            }
            var redirectOpts = { redirectedFrom: this, source: 'redirect' };
            // If the original transition was caused by URL sync, then use { location: 'replace' }
            // on the new transition (unless the target state explicitly specifies location: false).
            // This causes the original url to be replaced with the url for the redirect target
            // so the original url disappears from the browser history.
            if (this.options().source === 'url' && targetState.options().location !== false) {
                redirectOpts.location = 'replace';
            }
            var newOptions = extend({}, this.options(), targetState.options(), redirectOpts);
            targetState = targetState.withOptions(newOptions, true);
            var newTransition = this.router.transitionService.create(this._treeChanges.from, targetState);
            var originalEnteringNodes = this._treeChanges.entering;
            var redirectEnteringNodes = newTransition._treeChanges.entering;
            // --- Re-use resolve data from original transition ---
            // When redirecting from a parent state to a child state where the parent parameter values haven't changed
            // (because of the redirect), the resolves fetched by the original transition are still valid in the
            // redirected transition.
            //
            // This allows you to define a redirect on a parent state which depends on an async resolve value.
            // You can wait for the resolve, then redirect to a child state based on the result.
            // The redirected transition does not have to re-fetch the resolve.
            // ---------------------------------------------------------
            var nodeIsReloading = function (reloadState) { return function (node) {
                return reloadState && node.state.includes[reloadState.name];
            }; };
            // Find any "entering" nodes in the redirect path that match the original path and aren't being reloaded
            var matchingEnteringNodes = PathUtils.matching(redirectEnteringNodes, originalEnteringNodes, PathUtils.nonDynamicParams).filter(not(nodeIsReloading(targetState.options().reloadState)));
            // Use the existing (possibly pre-resolved) resolvables for the matching entering nodes.
            matchingEnteringNodes.forEach(function (node, idx) {
                node.resolvables = originalEnteringNodes[idx].resolvables;
            });
            return newTransition;
        };
        /** @hidden If a transition doesn't exit/enter any states, returns any [[Param]] whose value changed */
        Transition.prototype._changedParams = function () {
            var tc = this._treeChanges;
            /** Return undefined if it's not a "dynamic" transition, for the following reasons */
            // If user explicitly wants a reload
            if (this._options.reload)
                return undefined;
            // If any states are exiting or entering
            if (tc.exiting.length || tc.entering.length)
                return undefined;
            // If to/from path lengths differ
            if (tc.to.length !== tc.from.length)
                return undefined;
            // If the to/from paths are different
            var pathsDiffer = arrayTuples(tc.to, tc.from)
                .map(function (tuple) { return tuple[0].state !== tuple[1].state; })
                .reduce(anyTrueR, false);
            if (pathsDiffer)
                return undefined;
            // Find any parameter values that differ
            var nodeSchemas = tc.to.map(function (node) { return node.paramSchema; });
            var _a = [tc.to, tc.from].map(function (path) { return path.map(function (x) { return x.paramValues; }); }), toValues = _a[0], fromValues = _a[1];
            var tuples = arrayTuples(nodeSchemas, toValues, fromValues);
            return tuples.map(function (_a) {
                var schema = _a[0], toVals = _a[1], fromVals = _a[2];
                return Param.changed(schema, toVals, fromVals);
            }).reduce(unnestR, []);
        };
        /**
         * Returns true if the transition is dynamic.
         *
         * A transition is dynamic if no states are entered nor exited, but at least one dynamic parameter has changed.
         *
         * @returns true if the Transition is dynamic
         */
        Transition.prototype.dynamic = function () {
            var changes = this._changedParams();
            return !changes ? false : changes.map(function (x) { return x.dynamic; }).reduce(anyTrueR, false);
        };
        /**
         * Returns true if the transition is ignored.
         *
         * A transition is ignored if no states are entered nor exited, and no parameter values have changed.
         *
         * @returns true if the Transition is ignored.
         */
        Transition.prototype.ignored = function () {
            return !!this._ignoredReason();
        };
        /** @hidden */
        Transition.prototype._ignoredReason = function () {
            var pending = this.router.globals.transition;
            var reloadState = this._options.reloadState;
            var same = function (pathA, pathB) {
                if (pathA.length !== pathB.length)
                    return false;
                var matching = PathUtils.matching(pathA, pathB);
                return pathA.length === matching.filter(function (node) { return !reloadState || !node.state.includes[reloadState.name]; }).length;
            };
            var newTC = this.treeChanges();
            var pendTC = pending && pending.treeChanges();
            if (pendTC && same(pendTC.to, newTC.to) && same(pendTC.exiting, newTC.exiting))
                return 'SameAsPending';
            if (newTC.exiting.length === 0 && newTC.entering.length === 0 && same(newTC.from, newTC.to))
                return 'SameAsCurrent';
        };
        /**
         * Runs the transition
         *
         * This method is generally called from the [[StateService.transitionTo]]
         *
         * @internalapi
         *
         * @returns a promise for a successful transition.
         */
        Transition.prototype.run = function () {
            var _this = this;
            var runAllHooks = TransitionHook.runAllHooks;
            // Gets transition hooks array for the given phase
            var getHooksFor = function (phase) { return _this._hookBuilder.buildHooksForPhase(phase); };
            // When the chain is complete, then resolve or reject the deferred
            var transitionSuccess = function () {
                trace.traceSuccess(_this.$to(), _this);
                _this.success = true;
                _this._deferred.resolve(_this.to());
                runAllHooks(getHooksFor(exports.TransitionHookPhase.SUCCESS));
            };
            var transitionError = function (reason) {
                trace.traceError(reason, _this);
                _this.success = false;
                _this._deferred.reject(reason);
                _this._error = reason;
                runAllHooks(getHooksFor(exports.TransitionHookPhase.ERROR));
            };
            var runTransition = function () {
                // Wait to build the RUN hook chain until the BEFORE hooks are done
                // This allows a BEFORE hook to dynamically add additional RUN hooks via the Transition object.
                var allRunHooks = getHooksFor(exports.TransitionHookPhase.RUN);
                var done = function () { return services.$q.when(undefined); };
                return TransitionHook.invokeHooks(allRunHooks, done);
            };
            var startTransition = function () {
                var globals = _this.router.globals;
                globals.lastStartedTransitionId = _this.$id;
                globals.transition = _this;
                globals.transitionHistory.enqueue(_this);
                trace.traceTransitionStart(_this);
                return services.$q.when(undefined);
            };
            var allBeforeHooks = getHooksFor(exports.TransitionHookPhase.BEFORE);
            TransitionHook.invokeHooks(allBeforeHooks, startTransition)
                .then(runTransition)
                .then(transitionSuccess, transitionError);
            return this.promise;
        };
        /**
         * Checks if the Transition is valid
         *
         * @returns true if the Transition is valid
         */
        Transition.prototype.valid = function () {
            return !this.error() || this.success !== undefined;
        };
        /**
         * Aborts this transition
         *
         * Imperative API to abort a Transition.
         * This only applies to Transitions that are not yet complete.
         */
        Transition.prototype.abort = function () {
            // Do not set flag if the transition is already complete
            if (isUndefined(this.success)) {
                this._aborted = true;
            }
        };
        /**
         * The Transition error reason.
         *
         * If the transition is invalid (and could not be run), returns the reason the transition is invalid.
         * If the transition was valid and ran, but was not successful, returns the reason the transition failed.
         *
         * @returns a transition rejection explaining why the transition is invalid, or the reason the transition failed.
         */
        Transition.prototype.error = function () {
            var state = this.$to();
            if (state.self.abstract) {
                return Rejection.invalid("Cannot transition to abstract state '" + state.name + "'");
            }
            var paramDefs = state.parameters();
            var values$$1 = this.params();
            var invalidParams = paramDefs.filter(function (param) { return !param.validates(values$$1[param.id]); });
            if (invalidParams.length) {
                var invalidValues = invalidParams.map(function (param) { return "[" + param.id + ":" + stringify(values$$1[param.id]) + "]"; }).join(', ');
                var detail = "The following parameter values are not valid for state '" + state.name + "': " + invalidValues;
                return Rejection.invalid(detail);
            }
            if (this.success === false)
                return this._error;
        };
        /**
         * A string representation of the Transition
         *
         * @returns A string representation of the Transition
         */
        Transition.prototype.toString = function () {
            var fromStateOrName = this.from();
            var toStateOrName = this.to();
            var avoidEmptyHash = function (params) {
                return params['#'] !== null && params['#'] !== undefined ? params : omit(params, ['#']);
            };
            // (X) means the to state is invalid.
            var id = this.$id, from = isObject(fromStateOrName) ? fromStateOrName.name : fromStateOrName, fromParams = stringify(avoidEmptyHash(this._treeChanges.from.map(prop('paramValues')).reduce(mergeR, {}))), toValid = this.valid() ? '' : '(X) ', to = isObject(toStateOrName) ? toStateOrName.name : toStateOrName, toParams = stringify(avoidEmptyHash(this.params()));
            return "Transition#" + id + "( '" + from + "'" + fromParams + " -> " + toValid + "'" + to + "'" + toParams + " )";
        };
        /** @hidden */
        Transition.diToken = Transition;
        return Transition;
    }());

    /**
     * @coreapi
     * @module url
     */
    /** @hidden */
    function quoteRegExp(str, param) {
        var surroundPattern = ['', ''], result = str.replace(/[\\\[\]\^$*+?.()|{}]/g, '\\$&');
        if (!param)
            return result;
        switch (param.squash) {
            case false:
                surroundPattern = ['(', ')' + (param.isOptional ? '?' : '')];
                break;
            case true:
                result = result.replace(/\/$/, '');
                surroundPattern = ['(?:/(', ')|/)?'];
                break;
            default:
                surroundPattern = ["(" + param.squash + "|", ')?'];
                break;
        }
        return result + surroundPattern[0] + param.type.pattern.source + surroundPattern[1];
    }
    /** @hidden */
    var memoizeTo = function (obj, _prop, fn) { return (obj[_prop] = obj[_prop] || fn()); };
    /** @hidden */
    var splitOnSlash = splitOnDelim('/');
    var defaultConfig = {
        state: { params: {} },
        strict: true,
        caseInsensitive: true,
    };
    /**
     * Matches URLs against patterns.
     *
     * Matches URLs against patterns and extracts named parameters from the path or the search
     * part of the URL.
     *
     * A URL pattern consists of a path pattern, optionally followed by '?' and a list of search (query)
     * parameters. Multiple search parameter names are separated by '&'. Search parameters
     * do not influence whether or not a URL is matched, but their values are passed through into
     * the matched parameters returned by [[UrlMatcher.exec]].
     *
     * - *Path parameters* are defined using curly brace placeholders (`/somepath/{param}`)
     * or colon placeholders (`/somePath/:param`).
     *
     * - *A parameter RegExp* may be defined for a param after a colon
     * (`/somePath/{param:[a-zA-Z0-9]+}`) in a curly brace placeholder.
     * The regexp must match for the url to be matched.
     * Should the regexp itself contain curly braces, they must be in matched pairs or escaped with a backslash.
     *
     * Note: a RegExp parameter will encode its value using either [[ParamTypes.path]] or [[ParamTypes.query]].
     *
     * - *Custom parameter types* may also be specified after a colon (`/somePath/{param:int}`) in curly brace parameters.
     *   See [[UrlMatcherFactory.type]] for more information.
     *
     * - *Catch-all parameters* are defined using an asterisk placeholder (`/somepath/*catchallparam`).
     *   A catch-all * parameter value will contain the remainder of the URL.
     *
     * ---
     *
     * Parameter names may contain only word characters (latin letters, digits, and underscore) and
     * must be unique within the pattern (across both path and search parameters).
     * A path parameter matches any number of characters other than '/'. For catch-all
     * placeholders the path parameter matches any number of characters.
     *
     * Examples:
     *
     * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
     *   trailing slashes, and patterns have to match the entire path, not just a prefix.
     * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
     *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
     * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
     * * `'/user/{id:[^/]*}'` - Same as the previous example.
     * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
     *   parameter consists of 1 to 8 hex digits.
     * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
     *   path into the parameter 'path'.
     * * `'/files/*path'` - ditto.
     * * `'/calendar/{start:date}'` - Matches "/calendar/2014-11-12" (because the pattern defined
     *   in the built-in  `date` ParamType matches `2014-11-12`) and provides a Date object in $stateParams.start
     *
     */
    var UrlMatcher = /** @class */ (function () {
        /**
         * @param pattern The pattern to compile into a matcher.
         * @param paramTypes The [[ParamTypes]] registry
         * @param paramFactory A [[ParamFactory]] object
         * @param config  A [[UrlMatcherCompileConfig]] configuration object
         */
        function UrlMatcher(pattern$$1, paramTypes, paramFactory, config) {
            var _this = this;
            /** @hidden */
            this._cache = { path: [this] };
            /** @hidden */
            this._children = [];
            /** @hidden */
            this._params = [];
            /** @hidden */
            this._segments = [];
            /** @hidden */
            this._compiled = [];
            this.config = config = defaults(config, defaultConfig);
            this.pattern = pattern$$1;
            // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
            //   '*' name
            //   ':' name
            //   '{' name '}'
            //   '{' name ':' regexp '}'
            // The regular expression is somewhat complicated due to the need to allow curly braces
            // inside the regular expression. The placeholder regexp breaks down as follows:
            //    ([:*])([\w\[\]]+)              - classic placeholder ($1 / $2) (search version has - for snake-case)
            //    \{([\w\[\]]+)(?:\:\s*( ... ))?\}  - curly brace placeholder ($3) with optional regexp/type ... ($4) (search version has - for snake-case
            //    (?: ... | ... | ... )+         - the regexp consists of any number of atoms, an atom being either
            //    [^{}\\]+                       - anything other than curly braces or backslash
            //    \\.                            - a backslash escape
            //    \{(?:[^{}\\]+|\\.)*\}          - a matched set of curly braces containing other atoms
            var placeholder = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g;
            var searchPlaceholder = /([:]?)([\w\[\].-]+)|\{([\w\[\].-]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g;
            var patterns = [];
            var last = 0;
            var matchArray;
            var checkParamErrors = function (id) {
                if (!UrlMatcher.nameValidator.test(id))
                    throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern$$1 + "'");
                if (find(_this._params, propEq('id', id)))
                    throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern$$1 + "'");
            };
            // Split into static segments separated by path parameter placeholders.
            // The number of segments is always 1 more than the number of parameters.
            var matchDetails = function (m, isSearch) {
                // IE[78] returns '' for unmatched groups instead of null
                var id = m[2] || m[3];
                var regexp = isSearch ? m[4] : m[4] || (m[1] === '*' ? '[\\s\\S]*' : null);
                var makeRegexpType = function (str) {
                    return inherit(paramTypes.type(isSearch ? 'query' : 'path'), {
                        pattern: new RegExp(str, _this.config.caseInsensitive ? 'i' : undefined),
                    });
                };
                return {
                    id: id,
                    regexp: regexp,
                    segment: pattern$$1.substring(last, m.index),
                    type: !regexp ? null : paramTypes.type(regexp) || makeRegexpType(regexp),
                };
            };
            var details;
            var segment;
            // tslint:disable-next-line:no-conditional-assignment
            while ((matchArray = placeholder.exec(pattern$$1))) {
                details = matchDetails(matchArray, false);
                if (details.segment.indexOf('?') >= 0)
                    break; // we're into the search part
                checkParamErrors(details.id);
                this._params.push(paramFactory.fromPath(details.id, details.type, config.state));
                this._segments.push(details.segment);
                patterns.push([details.segment, tail(this._params)]);
                last = placeholder.lastIndex;
            }
            segment = pattern$$1.substring(last);
            // Find any search parameter names and remove them from the last segment
            var i = segment.indexOf('?');
            if (i >= 0) {
                var search = segment.substring(i);
                segment = segment.substring(0, i);
                if (search.length > 0) {
                    last = 0;
                    // tslint:disable-next-line:no-conditional-assignment
                    while ((matchArray = searchPlaceholder.exec(search))) {
                        details = matchDetails(matchArray, true);
                        checkParamErrors(details.id);
                        this._params.push(paramFactory.fromSearch(details.id, details.type, config.state));
                        last = placeholder.lastIndex;
                        // check if ?&
                    }
                }
            }
            this._segments.push(segment);
            this._compiled = patterns.map(function (_pattern) { return quoteRegExp.apply(null, _pattern); }).concat(quoteRegExp(segment));
        }
        /** @hidden */
        UrlMatcher.encodeDashes = function (str) {
            // Replace dashes with encoded "\-"
            return encodeURIComponent(str).replace(/-/g, function (c) {
                return "%5C%" + c
                    .charCodeAt(0)
                    .toString(16)
                    .toUpperCase();
            });
        };
        /** @hidden Given a matcher, return an array with the matcher's path segments and path params, in order */
        UrlMatcher.pathSegmentsAndParams = function (matcher) {
            var staticSegments = matcher._segments;
            var pathParams = matcher._params.filter(function (p) { return p.location === exports.DefType.PATH; });
            return arrayTuples(staticSegments, pathParams.concat(undefined))
                .reduce(unnestR, [])
                .filter(function (x) { return x !== '' && isDefined(x); });
        };
        /** @hidden Given a matcher, return an array with the matcher's query params */
        UrlMatcher.queryParams = function (matcher) {
            return matcher._params.filter(function (p) { return p.location === exports.DefType.SEARCH; });
        };
        /**
         * Compare two UrlMatchers
         *
         * This comparison function converts a UrlMatcher into static and dynamic path segments.
         * Each static path segment is a static string between a path separator (slash character).
         * Each dynamic segment is a path parameter.
         *
         * The comparison function sorts static segments before dynamic ones.
         */
        UrlMatcher.compare = function (a, b) {
            /**
             * Turn a UrlMatcher and all its parent matchers into an array
             * of slash literals '/', string literals, and Param objects
             *
             * This example matcher matches strings like "/foo/:param/tail":
             * var matcher = $umf.compile("/foo").append($umf.compile("/:param")).append($umf.compile("/")).append($umf.compile("tail"));
             * var result = segments(matcher); // [ '/', 'foo', '/', Param, '/', 'tail' ]
             *
             * Caches the result as `matcher._cache.segments`
             */
            var segments = function (matcher) {
                return (matcher._cache.segments =
                    matcher._cache.segments ||
                        matcher._cache.path
                            .map(UrlMatcher.pathSegmentsAndParams)
                            .reduce(unnestR, [])
                            .reduce(joinNeighborsR, [])
                            .map(function (x) { return (isString(x) ? splitOnSlash(x) : x); })
                            .reduce(unnestR, []));
            };
            /**
             * Gets the sort weight for each segment of a UrlMatcher
             *
             * Caches the result as `matcher._cache.weights`
             */
            var weights = function (matcher) {
                return (matcher._cache.weights =
                    matcher._cache.weights ||
                        segments(matcher).map(function (segment) {
                            // Sort slashes first, then static strings, the Params
                            if (segment === '/')
                                return 1;
                            if (isString(segment))
                                return 2;
                            if (segment instanceof Param)
                                return 3;
                        }));
            };
            /**
             * Pads shorter array in-place (mutates)
             */
            var padArrays = function (l, r, padVal) {
                var len = Math.max(l.length, r.length);
                while (l.length < len)
                    l.push(padVal);
                while (r.length < len)
                    r.push(padVal);
            };
            var weightsA = weights(a), weightsB = weights(b);
            padArrays(weightsA, weightsB, 0);
            var _pairs = arrayTuples(weightsA, weightsB);
            var cmp, i;
            for (i = 0; i < _pairs.length; i++) {
                cmp = _pairs[i][0] - _pairs[i][1];
                if (cmp !== 0)
                    return cmp;
            }
            return 0;
        };
        /**
         * Creates a new concatenated UrlMatcher
         *
         * Builds a new UrlMatcher by appending another UrlMatcher to this one.
         *
         * @param url A `UrlMatcher` instance to append as a child of the current `UrlMatcher`.
         */
        UrlMatcher.prototype.append = function (url) {
            this._children.push(url);
            url._cache = {
                path: this._cache.path.concat(url),
                parent: this,
                pattern: null,
            };
            return url;
        };
        /** @hidden */
        UrlMatcher.prototype.isRoot = function () {
            return this._cache.path[0] === this;
        };
        /** Returns the input pattern string */
        UrlMatcher.prototype.toString = function () {
            return this.pattern;
        };
        /**
         * Tests the specified url/path against this matcher.
         *
         * Tests if the given url matches this matcher's pattern, and returns an object containing the captured
         * parameter values.  Returns null if the path does not match.
         *
         * The returned object contains the values
         * of any search parameters that are mentioned in the pattern, but their value may be null if
         * they are not present in `search`. This means that search parameters are always treated
         * as optional.
         *
         * #### Example:
         * ```js
         * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', {
         *   x: '1', q: 'hello'
         * });
         * // returns { id: 'bob', q: 'hello', r: null }
         * ```
         *
         * @param path    The URL path to match, e.g. `$location.path()`.
         * @param search  URL search parameters, e.g. `$location.search()`.
         * @param hash    URL hash e.g. `$location.hash()`.
         * @param options
         *
         * @returns The captured parameter values.
         */
        UrlMatcher.prototype.exec = function (path, search, hash, options) {
            var _this = this;
            if (search === void 0) { search = {}; }
            if (options === void 0) { options = {}; }
            var match = memoizeTo(this._cache, 'pattern', function () {
                return new RegExp([
                    '^',
                    unnest(_this._cache.path.map(prop('_compiled'))).join(''),
                    _this.config.strict === false ? '/?' : '',
                    '$',
                ].join(''), _this.config.caseInsensitive ? 'i' : undefined);
            }).exec(path);
            if (!match)
                return null;
            // options = defaults(options, { isolate: false });
            var allParams = this.parameters(), pathParams = allParams.filter(function (param) { return !param.isSearch(); }), searchParams = allParams.filter(function (param) { return param.isSearch(); }), nPathSegments = this._cache.path.map(function (urlm) { return urlm._segments.length - 1; }).reduce(function (a, x) { return a + x; }), values$$1 = {};
            if (nPathSegments !== match.length - 1)
                throw new Error("Unbalanced capture group in route '" + this.pattern + "'");
            function decodePathArray(paramVal) {
                var reverseString = function (str) {
                    return str
                        .split('')
                        .reverse()
                        .join('');
                };
                var unquoteDashes = function (str) { return str.replace(/\\-/g, '-'); };
                var split = reverseString(paramVal).split(/-(?!\\)/);
                var allReversed = map(split, reverseString);
                return map(allReversed, unquoteDashes).reverse();
            }
            for (var i = 0; i < nPathSegments; i++) {
                var param = pathParams[i];
                var value = match[i + 1];
                // if the param value matches a pre-replace pair, replace the value before decoding.
                for (var j = 0; j < param.replace.length; j++) {
                    if (param.replace[j].from === value)
                        value = param.replace[j].to;
                }
                if (value && param.array === true)
                    value = decodePathArray(value);
                if (isDefined(value))
                    value = param.type.decode(value);
                values$$1[param.id] = param.value(value);
            }
            searchParams.forEach(function (param) {
                var value = search[param.id];
                for (var j = 0; j < param.replace.length; j++) {
                    if (param.replace[j].from === value)
                        value = param.replace[j].to;
                }
                if (isDefined(value))
                    value = param.type.decode(value);
                values$$1[param.id] = param.value(value);
            });
            if (hash)
                values$$1['#'] = hash;
            return values$$1;
        };
        /**
         * @hidden
         * Returns all the [[Param]] objects of all path and search parameters of this pattern in order of appearance.
         *
         * @returns {Array.<Param>}  An array of [[Param]] objects. Must be treated as read-only. If the
         *    pattern has no parameters, an empty array is returned.
         */
        UrlMatcher.prototype.parameters = function (opts) {
            if (opts === void 0) { opts = {}; }
            if (opts.inherit === false)
                return this._params;
            return unnest(this._cache.path.map(function (matcher) { return matcher._params; }));
        };
        /**
         * @hidden
         * Returns a single parameter from this UrlMatcher by id
         *
         * @param id
         * @param opts
         * @returns {T|Param|any|boolean|UrlMatcher|null}
         */
        UrlMatcher.prototype.parameter = function (id, opts) {
            var _this = this;
            if (opts === void 0) { opts = {}; }
            var findParam = function () {
                for (var _i = 0, _a = _this._params; _i < _a.length; _i++) {
                    var param = _a[_i];
                    if (param.id === id)
                        return param;
                }
            };
            var parent = this._cache.parent;
            return findParam() || (opts.inherit !== false && parent && parent.parameter(id, opts)) || null;
        };
        /**
         * Validates the input parameter values against this UrlMatcher
         *
         * Checks an object hash of parameters to validate their correctness according to the parameter
         * types of this `UrlMatcher`.
         *
         * @param params The object hash of parameters to validate.
         * @returns Returns `true` if `params` validates, otherwise `false`.
         */
        UrlMatcher.prototype.validates = function (params) {
            var validParamVal = function (param, val$$1) { return !param || param.validates(val$$1); };
            params = params || {};
            // I'm not sure why this checks only the param keys passed in, and not all the params known to the matcher
            var paramSchema = this.parameters().filter(function (paramDef) { return params.hasOwnProperty(paramDef.id); });
            return paramSchema.map(function (paramDef) { return validParamVal(paramDef, params[paramDef.id]); }).reduce(allTrueR, true);
        };
        /**
         * Given a set of parameter values, creates a URL from this UrlMatcher.
         *
         * Creates a URL that matches this pattern by substituting the specified values
         * for the path and search parameters.
         *
         * #### Example:
         * ```js
         * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
         * // returns '/user/bob?q=yes'
         * ```
         *
         * @param values  the values to substitute for the parameters in this pattern.
         * @returns the formatted URL (path and optionally search part).
         */
        UrlMatcher.prototype.format = function (values$$1) {
            if (values$$1 === void 0) { values$$1 = {}; }
            // Build the full path of UrlMatchers (including all parent UrlMatchers)
            var urlMatchers = this._cache.path;
            // Extract all the static segments and Params (processed as ParamDetails)
            // into an ordered array
            var pathSegmentsAndParams = urlMatchers
                .map(UrlMatcher.pathSegmentsAndParams)
                .reduce(unnestR, [])
                .map(function (x) { return (isString(x) ? x : getDetails(x)); });
            // Extract the query params into a separate array
            var queryParams = urlMatchers
                .map(UrlMatcher.queryParams)
                .reduce(unnestR, [])
                .map(getDetails);
            var isInvalid = function (param) { return param.isValid === false; };
            if (pathSegmentsAndParams.concat(queryParams).filter(isInvalid).length) {
                return null;
            }
            /**
             * Given a Param, applies the parameter value, then returns detailed information about it
             */
            function getDetails(param) {
                // Normalize to typed value
                var value = param.value(values$$1[param.id]);
                var isValid = param.validates(value);
                var isDefaultValue = param.isDefaultValue(value);
                // Check if we're in squash mode for the parameter
                var squash = isDefaultValue ? param.squash : false;
                // Allow the Parameter's Type to encode the value
                var encoded = param.type.encode(value);
                return { param: param, value: value, isValid: isValid, isDefaultValue: isDefaultValue, squash: squash, encoded: encoded };
            }
            // Build up the path-portion from the list of static segments and parameters
            var pathString = pathSegmentsAndParams.reduce(function (acc, x) {
                // The element is a static segment (a raw string); just append it
                if (isString(x))
                    return acc + x;
                // Otherwise, it's a ParamDetails.
                var squash = x.squash, encoded = x.encoded, param = x.param;
                // If squash is === true, try to remove a slash from the path
                if (squash === true)
                    return acc.match(/\/$/) ? acc.slice(0, -1) : acc;
                // If squash is a string, use the string for the param value
                if (isString(squash))
                    return acc + squash;
                if (squash !== false)
                    return acc; // ?
                if (encoded == null)
                    return acc;
                // If this parameter value is an array, encode the value using encodeDashes
                if (isArray(encoded))
                    return acc + map(encoded, UrlMatcher.encodeDashes).join('-');
                // If the parameter type is "raw", then do not encodeURIComponent
                if (param.raw)
                    return acc + encoded;
                // Encode the value
                return acc + encodeURIComponent(encoded);
            }, '');
            // Build the query string by applying parameter values (array or regular)
            // then mapping to key=value, then flattening and joining using "&"
            var queryString = queryParams
                .map(function (paramDetails) {
                var param = paramDetails.param, squash = paramDetails.squash, encoded = paramDetails.encoded, isDefaultValue = paramDetails.isDefaultValue;
                if (encoded == null || (isDefaultValue && squash !== false))
                    return;
                if (!isArray(encoded))
                    encoded = [encoded];
                if (encoded.length === 0)
                    return;
                if (!param.raw)
                    encoded = map(encoded, encodeURIComponent);
                return encoded.map(function (val$$1) { return param.id + "=" + val$$1; });
            })
                .filter(identity)
                .reduce(unnestR, [])
                .join('&');
            // Concat the pathstring with the queryString (if exists) and the hashString (if exists)
            return pathString + (queryString ? "?" + queryString : '') + (values$$1['#'] ? '#' + values$$1['#'] : '');
        };
        /** @hidden */
        UrlMatcher.nameValidator = /^\w+([-.]+\w+)*(?:\[\])?$/;
        return UrlMatcher;
    }());

    var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    /** @internalapi */
    var ParamFactory = /** @class */ (function () {
        function ParamFactory(umf) {
            this.umf = umf;
        }
        ParamFactory.prototype.fromConfig = function (id, type, state) {
            return new Param(id, type, exports.DefType.CONFIG, this.umf, state);
        };
        ParamFactory.prototype.fromPath = function (id, type, state) {
            return new Param(id, type, exports.DefType.PATH, this.umf, state);
        };
        ParamFactory.prototype.fromSearch = function (id, type, state) {
            return new Param(id, type, exports.DefType.SEARCH, this.umf, state);
        };
        return ParamFactory;
    }());
    /**
     * Factory for [[UrlMatcher]] instances.
     *
     * The factory is available to ng1 services as
     * `$urlMatcherFactory` or ng1 providers as `$urlMatcherFactoryProvider`.
     */
    var UrlMatcherFactory = /** @class */ (function () {
        function UrlMatcherFactory() {
            /** @hidden */ this.paramTypes = new ParamTypes();
            /** @hidden */ this._isCaseInsensitive = false;
            /** @hidden */ this._isStrictMode = true;
            /** @hidden */ this._defaultSquashPolicy = false;
            /** @internalapi Creates a new [[Param]] for a given location (DefType) */
            this.paramFactory = new ParamFactory(this);
            extend(this, { UrlMatcher: UrlMatcher, Param: Param });
        }
        /** @inheritdoc */
        UrlMatcherFactory.prototype.caseInsensitive = function (value) {
            return (this._isCaseInsensitive = isDefined(value) ? value : this._isCaseInsensitive);
        };
        /** @inheritdoc */
        UrlMatcherFactory.prototype.strictMode = function (value) {
            return (this._isStrictMode = isDefined(value) ? value : this._isStrictMode);
        };
        /** @inheritdoc */
        UrlMatcherFactory.prototype.defaultSquashPolicy = function (value) {
            if (isDefined(value) && value !== true && value !== false && !isString(value))
                throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
            return (this._defaultSquashPolicy = isDefined(value) ? value : this._defaultSquashPolicy);
        };
        /**
         * Creates a [[UrlMatcher]] for the specified pattern.
         *
         * @param pattern  The URL pattern.
         * @param config  The config object hash.
         * @returns The UrlMatcher.
         */
        UrlMatcherFactory.prototype.compile = function (pattern, config) {
            // backward-compatible support for config.params -> config.state.params
            var params = config && !config.state && config.params;
            config = params ? __assign({ state: { params: params } }, config) : config;
            var globalConfig = { strict: this._isStrictMode, caseInsensitive: this._isCaseInsensitive };
            return new UrlMatcher(pattern, this.paramTypes, this.paramFactory, extend(globalConfig, config));
        };
        /**
         * Returns true if the specified object is a [[UrlMatcher]], or false otherwise.
         *
         * @param object  The object to perform the type check against.
         * @returns `true` if the object matches the `UrlMatcher` interface, by
         *          implementing all the same methods.
         */
        UrlMatcherFactory.prototype.isMatcher = function (object) {
            // TODO: typeof?
            if (!isObject(object))
                return false;
            var result = true;
            forEach(UrlMatcher.prototype, function (val, name) {
                if (isFunction(val))
                    result = result && (isDefined(object[name]) && isFunction(object[name]));
            });
            return result;
        };
        /**
         * Creates and registers a custom [[ParamType]] object
         *
         * A [[ParamType]] can be used to generate URLs with typed parameters.
         *
         * @param name  The type name.
         * @param definition The type definition. See [[ParamTypeDefinition]] for information on the values accepted.
         * @param definitionFn A function that is injected before the app runtime starts.
         *        The result of this function should be a [[ParamTypeDefinition]].
         *        The result is merged into the existing `definition`.
         *        See [[ParamType]] for information on the values accepted.
         *
         * @returns - if a type was registered: the [[UrlMatcherFactory]]
         *   - if only the `name` parameter was specified: the currently registered [[ParamType]] object, or undefined
         *
         * Note: Register custom types *before using them* in a state definition.
         *
         * See [[ParamTypeDefinition]] for examples
         */
        UrlMatcherFactory.prototype.type = function (name, definition, definitionFn) {
            var type = this.paramTypes.type(name, definition, definitionFn);
            return !isDefined(definition) ? type : this;
        };
        /** @hidden */
        UrlMatcherFactory.prototype.$get = function () {
            this.paramTypes.enqueue = false;
            this.paramTypes._flushTypeQueue();
            return this;
        };
        /** @internalapi */
        UrlMatcherFactory.prototype.dispose = function () {
            this.paramTypes.dispose();
        };
        return UrlMatcherFactory;
    }());

    /**
     * @coreapi
     * @module url
     */ /** */
    /**
     * Creates a [[UrlRule]]
     *
     * Creates a [[UrlRule]] from a:
     *
     * - `string`
     * - [[UrlMatcher]]
     * - `RegExp`
     * - [[StateObject]]
     * @internalapi
     */
    var UrlRuleFactory = /** @class */ (function () {
        function UrlRuleFactory(router) {
            this.router = router;
        }
        UrlRuleFactory.prototype.compile = function (str) {
            return this.router.urlMatcherFactory.compile(str);
        };
        UrlRuleFactory.prototype.create = function (what, handler) {
            var _this = this;
            var isState = StateObject.isState;
            var makeRule = pattern([
                [isString, function (_what) { return makeRule(_this.compile(_what)); }],
                [is(UrlMatcher), function (_what) { return _this.fromUrlMatcher(_what, handler); }],
                [isState, function (_what) { return _this.fromState(_what, _this.router); }],
                [is(RegExp), function (_what) { return _this.fromRegExp(_what, handler); }],
                [isFunction, function (_what) { return new BaseUrlRule(_what, handler); }],
            ]);
            var rule = makeRule(what);
            if (!rule)
                throw new Error("invalid 'what' in when()");
            return rule;
        };
        /**
         * A UrlRule which matches based on a UrlMatcher
         *
         * The `handler` may be either a `string`, a [[UrlRuleHandlerFn]] or another [[UrlMatcher]]
         *
         * ## Handler as a function
         *
         * If `handler` is a function, the function is invoked with:
         *
         * - matched parameter values ([[RawParams]] from [[UrlMatcher.exec]])
         * - url: the current Url ([[UrlParts]])
         * - router: the router object ([[UIRouter]])
         *
         * #### Example:
         * ```js
         * var urlMatcher = $umf.compile("/foo/:fooId/:barId");
         * var rule = factory.fromUrlMatcher(urlMatcher, match => "/home/" + match.fooId + "/" + match.barId);
         * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
         * var result = rule.handler(match); // '/home/123/456'
         * ```
         *
         * ## Handler as UrlMatcher
         *
         * If `handler` is a UrlMatcher, the handler matcher is used to create the new url.
         * The `handler` UrlMatcher is formatted using the matched param from the first matcher.
         * The url is replaced with the result.
         *
         * #### Example:
         * ```js
         * var urlMatcher = $umf.compile("/foo/:fooId/:barId");
         * var handler = $umf.compile("/home/:fooId/:barId");
         * var rule = factory.fromUrlMatcher(urlMatcher, handler);
         * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
         * var result = rule.handler(match); // '/home/123/456'
         * ```
         */
        UrlRuleFactory.prototype.fromUrlMatcher = function (urlMatcher, handler) {
            var _handler = handler;
            if (isString(handler))
                handler = this.router.urlMatcherFactory.compile(handler);
            if (is(UrlMatcher)(handler))
                _handler = function (match) { return handler.format(match); };
            function matchUrlParamters(url) {
                var params = urlMatcher.exec(url.path, url.search, url.hash);
                return urlMatcher.validates(params) && params;
            }
            // Prioritize URLs, lowest to highest:
            // - Some optional URL parameters, but none matched
            // - No optional parameters in URL
            // - Some optional parameters, some matched
            // - Some optional parameters, all matched
            function matchPriority(params) {
                var optional = urlMatcher.parameters().filter(function (param) { return param.isOptional; });
                if (!optional.length)
                    return 0.000001;
                var matched = optional.filter(function (param) { return params[param.id]; });
                return matched.length / optional.length;
            }
            var details = { urlMatcher: urlMatcher, matchPriority: matchPriority, type: 'URLMATCHER' };
            return extend(new BaseUrlRule(matchUrlParamters, _handler), details);
        };
        /**
         * A UrlRule which matches a state by its url
         *
         * #### Example:
         * ```js
         * var rule = factory.fromState($state.get('foo'), router);
         * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
         * var result = rule.handler(match);
         * // Starts a transition to 'foo' with params: { fooId: '123', barId: '456' }
         * ```
         */
        UrlRuleFactory.prototype.fromState = function (state, router) {
            /**
             * Handles match by transitioning to matched state
             *
             * First checks if the router should start a new transition.
             * A new transition is not required if the current state's URL
             * and the new URL are already identical
             */
            var handler = function (match) {
                var $state = router.stateService;
                var globals = router.globals;
                if ($state.href(state, match) !== $state.href(globals.current, globals.params)) {
                    $state.transitionTo(state, match, { inherit: true, source: 'url' });
                }
            };
            var details = { state: state, type: 'STATE' };
            return extend(this.fromUrlMatcher(state.url, handler), details);
        };
        /**
         * A UrlRule which matches based on a regular expression
         *
         * The `handler` may be either a [[UrlRuleHandlerFn]] or a string.
         *
         * ## Handler as a function
         *
         * If `handler` is a function, the function is invoked with:
         *
         * - regexp match array (from `regexp`)
         * - url: the current Url ([[UrlParts]])
         * - router: the router object ([[UIRouter]])
         *
         * #### Example:
         * ```js
         * var rule = factory.fromRegExp(/^\/foo\/(bar|baz)$/, match => "/home/" + match[1])
         * var match = rule.match('/foo/bar'); // results in [ '/foo/bar', 'bar' ]
         * var result = rule.handler(match); // '/home/bar'
         * ```
         *
         * ## Handler as string
         *
         * If `handler` is a string, the url is *replaced by the string* when the Rule is invoked.
         * The string is first interpolated using `string.replace()` style pattern.
         *
         * #### Example:
         * ```js
         * var rule = factory.fromRegExp(/^\/foo\/(bar|baz)$/, "/home/$1")
         * var match = rule.match('/foo/bar'); // results in [ '/foo/bar', 'bar' ]
         * var result = rule.handler(match); // '/home/bar'
         * ```
         */
        UrlRuleFactory.prototype.fromRegExp = function (regexp, handler) {
            if (regexp.global || regexp.sticky)
                throw new Error('Rule RegExp must not be global or sticky');
            /**
             * If handler is a string, the url will be replaced by the string.
             * If the string has any String.replace() style variables in it (like `$2`),
             * they will be replaced by the captures from [[match]]
             */
            var redirectUrlTo = function (match) {
                // Interpolates matched values into $1 $2, etc using a String.replace()-style pattern
                return handler.replace(/\$(\$|\d{1,2})/, function (m, what) { return match[what === '$' ? 0 : Number(what)]; });
            };
            var _handler = isString(handler) ? redirectUrlTo : handler;
            var matchParamsFromRegexp = function (url) { return regexp.exec(url.path); };
            var details = { regexp: regexp, type: 'REGEXP' };
            return extend(new BaseUrlRule(matchParamsFromRegexp, _handler), details);
        };
        UrlRuleFactory.isUrlRule = function (obj) { return obj && ['type', 'match', 'handler'].every(function (key) { return isDefined(obj[key]); }); };
        return UrlRuleFactory;
    }());
    /**
     * A base rule which calls `match`
     *
     * The value from the `match` function is passed through to the `handler`.
     * @internalapi
     */
    var BaseUrlRule = /** @class */ (function () {
        function BaseUrlRule(match, handler) {
            var _this = this;
            this.match = match;
            this.type = 'RAW';
            this.matchPriority = function (match) { return 0 - _this.$id; };
            this.handler = handler || identity;
        }
        return BaseUrlRule;
    }());

    /**
     * @internalapi
     * @module url
     */
    /** @hidden */
    function appendBasePath(url, isHtml5, absolute, baseHref) {
        if (baseHref === '/')
            return url;
        if (isHtml5)
            return stripLastPathElement(baseHref) + url;
        if (absolute)
            return baseHref.slice(1) + url;
        return url;
    }
    /** @hidden */
    var prioritySort = function (a, b) { return (b.priority || 0) - (a.priority || 0); };
    /** @hidden */
    var typeSort = function (a, b) {
        var weights = { STATE: 4, URLMATCHER: 4, REGEXP: 3, RAW: 2, OTHER: 1 };
        return (weights[a.type] || 0) - (weights[b.type] || 0);
    };
    /** @hidden */
    var urlMatcherSort = function (a, b) {
        return !a.urlMatcher || !b.urlMatcher ? 0 : UrlMatcher.compare(a.urlMatcher, b.urlMatcher);
    };
    /** @hidden */
    var idSort = function (a, b) {
        // Identically sorted STATE and URLMATCHER best rule will be chosen by `matchPriority` after each rule matches the URL
        var useMatchPriority = { STATE: true, URLMATCHER: true };
        var equal = useMatchPriority[a.type] && useMatchPriority[b.type];
        return equal ? 0 : (a.$id || 0) - (b.$id || 0);
    };
    /**
     * Default rule priority sorting function.
     *
     * Sorts rules by:
     *
     * - Explicit priority (set rule priority using [[UrlRulesApi.when]])
     * - Rule type (STATE: 4, URLMATCHER: 4, REGEXP: 3, RAW: 2, OTHER: 1)
     * - `UrlMatcher` specificity ([[UrlMatcher.compare]]): works for STATE and URLMATCHER types to pick the most specific rule.
     * - Rule registration order (for rule types other than STATE and URLMATCHER)
     *   - Equally sorted State and UrlMatcher rules will each match the URL.
     *     Then, the *best* match is chosen based on how many parameter values were matched.
     *
     * @coreapi
     */
    var defaultRuleSortFn;
    defaultRuleSortFn = function (a, b) {
        var cmp = prioritySort(a, b);
        if (cmp !== 0)
            return cmp;
        cmp = typeSort(a, b);
        if (cmp !== 0)
            return cmp;
        cmp = urlMatcherSort(a, b);
        if (cmp !== 0)
            return cmp;
        return idSort(a, b);
    };
    /**
     * Updates URL and responds to URL changes
     *
     * ### Deprecation warning:
     * This class is now considered to be an internal API
     * Use the [[UrlService]] instead.
     * For configuring URL rules, use the [[UrlRulesApi]] which can be found as [[UrlService.rules]].
     *
     * This class updates the URL when the state changes.
     * It also responds to changes in the URL.
     */
    var UrlRouter = /** @class */ (function () {
        /** @hidden */
        function UrlRouter(router) {
            /** @hidden */ this._sortFn = defaultRuleSortFn;
            /** @hidden */ this._rules = [];
            /** @hidden */ this.interceptDeferred = false;
            /** @hidden */ this._id = 0;
            /** @hidden */ this._sorted = false;
            this._router = router;
            this.urlRuleFactory = new UrlRuleFactory(router);
            createProxyFunctions(val(UrlRouter.prototype), this, val(this));
        }
        /** @internalapi */
        UrlRouter.prototype.dispose = function () {
            this.listen(false);
            this._rules = [];
            delete this._otherwiseFn;
        };
        /** @inheritdoc */
        UrlRouter.prototype.sort = function (compareFn) {
            this._rules = this.stableSort(this._rules, (this._sortFn = compareFn || this._sortFn));
            this._sorted = true;
        };
        UrlRouter.prototype.ensureSorted = function () {
            this._sorted || this.sort();
        };
        UrlRouter.prototype.stableSort = function (arr, compareFn) {
            var arrOfWrapper = arr.map(function (elem, idx) { return ({ elem: elem, idx: idx }); });
            arrOfWrapper.sort(function (wrapperA, wrapperB) {
                var cmpDiff = compareFn(wrapperA.elem, wrapperB.elem);
                return cmpDiff === 0 ? wrapperA.idx - wrapperB.idx : cmpDiff;
            });
            return arrOfWrapper.map(function (wrapper) { return wrapper.elem; });
        };
        /**
         * Given a URL, check all rules and return the best [[MatchResult]]
         * @param url
         * @returns {MatchResult}
         */
        UrlRouter.prototype.match = function (url) {
            var _this = this;
            this.ensureSorted();
            url = extend({ path: '', search: {}, hash: '' }, url);
            var rules = this.rules();
            if (this._otherwiseFn)
                rules.push(this._otherwiseFn);
            // Checks a single rule. Returns { rule: rule, match: match, weight: weight } if it matched, or undefined
            var checkRule = function (rule) {
                var match = rule.match(url, _this._router);
                return match && { match: match, rule: rule, weight: rule.matchPriority(match) };
            };
            // The rules are pre-sorted.
            // - Find the first matching rule.
            // - Find any other matching rule that sorted *exactly the same*, according to `.sort()`.
            // - Choose the rule with the highest match weight.
            var best;
            for (var i = 0; i < rules.length; i++) {
                // Stop when there is a 'best' rule and the next rule sorts differently than it.
                if (best && this._sortFn(rules[i], best.rule) !== 0)
                    break;
                var current = checkRule(rules[i]);
                // Pick the best MatchResult
                best = !best || (current && current.weight > best.weight) ? current : best;
            }
            return best;
        };
        /** @inheritdoc */
        UrlRouter.prototype.sync = function (evt) {
            if (evt && evt.defaultPrevented)
                return;
            var router = this._router, $url = router.urlService, $state = router.stateService;
            var url = {
                path: $url.path(),
                search: $url.search(),
                hash: $url.hash(),
            };
            var best = this.match(url);
            var applyResult = pattern([
                [isString, function (newurl) { return $url.url(newurl, true); }],
                [TargetState.isDef, function (def) { return $state.go(def.state, def.params, def.options); }],
                [is(TargetState), function (target) { return $state.go(target.state(), target.params(), target.options()); }],
            ]);
            applyResult(best && best.rule.handler(best.match, url, router));
        };
        /** @inheritdoc */
        UrlRouter.prototype.listen = function (enabled) {
            var _this = this;
            if (enabled === false) {
                this._stopFn && this._stopFn();
                delete this._stopFn;
            }
            else {
                return (this._stopFn = this._stopFn || this._router.urlService.onChange(function (evt) { return _this.sync(evt); }));
            }
        };
        /**
         * Internal API.
         * @internalapi
         */
        UrlRouter.prototype.update = function (read) {
            var $url = this._router.locationService;
            if (read) {
                this.location = $url.url();
                return;
            }
            if ($url.url() === this.location)
                return;
            $url.url(this.location, true);
        };
        /**
         * Internal API.
         *
         * Pushes a new location to the browser history.
         *
         * @internalapi
         * @param urlMatcher
         * @param params
         * @param options
         */
        UrlRouter.prototype.push = function (urlMatcher, params, options) {
            var replace = options && !!options.replace;
            this._router.urlService.url(urlMatcher.format(params || {}), replace);
        };
        /**
         * Builds and returns a URL with interpolated parameters
         *
         * #### Example:
         * ```js
         * matcher = $umf.compile("/about/:person");
         * params = { person: "bob" };
         * $bob = $urlRouter.href(matcher, params);
         * // $bob == "/about/bob";
         * ```
         *
         * @param urlMatcher The [[UrlMatcher]] object which is used as the template of the URL to generate.
         * @param params An object of parameter values to fill the matcher's required parameters.
         * @param options Options object. The options are:
         *
         * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
         *
         * @returns Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
         */
        UrlRouter.prototype.href = function (urlMatcher, params, options) {
            var url = urlMatcher.format(params);
            if (url == null)
                return null;
            options = options || { absolute: false };
            var cfg = this._router.urlService.config;
            var isHtml5 = cfg.html5Mode();
            if (!isHtml5 && url !== null) {
                url = '#' + cfg.hashPrefix() + url;
            }
            url = appendBasePath(url, isHtml5, options.absolute, cfg.baseHref());
            if (!options.absolute || !url) {
                return url;
            }
            var slash = !isHtml5 && url ? '/' : '';
            var cfgPort = cfg.port();
            var port = (cfgPort === 80 || cfgPort === 443 ? '' : ':' + cfgPort);
            return [cfg.protocol(), '://', cfg.host(), port, slash, url].join('');
        };
        /**
         * Manually adds a URL Rule.
         *
         * Usually, a url rule is added using [[StateDeclaration.url]] or [[when]].
         * This api can be used directly for more control (to register a [[BaseUrlRule]], for example).
         * Rules can be created using [[UrlRouter.urlRuleFactory]], or create manually as simple objects.
         *
         * A rule should have a `match` function which returns truthy if the rule matched.
         * It should also have a `handler` function which is invoked if the rule is the best match.
         *
         * @return a function that deregisters the rule
         */
        UrlRouter.prototype.rule = function (rule) {
            var _this = this;
            if (!UrlRuleFactory.isUrlRule(rule))
                throw new Error('invalid rule');
            rule.$id = this._id++;
            rule.priority = rule.priority || 0;
            this._rules.push(rule);
            this._sorted = false;
            return function () { return _this.removeRule(rule); };
        };
        /** @inheritdoc */
        UrlRouter.prototype.removeRule = function (rule) {
            removeFrom(this._rules, rule);
        };
        /** @inheritdoc */
        UrlRouter.prototype.rules = function () {
            this.ensureSorted();
            return this._rules.slice();
        };
        /** @inheritdoc */
        UrlRouter.prototype.otherwise = function (handler) {
            var handlerFn = getHandlerFn(handler);
            this._otherwiseFn = this.urlRuleFactory.create(val(true), handlerFn);
            this._sorted = false;
        };
        /** @inheritdoc */
        UrlRouter.prototype.initial = function (handler) {
            var handlerFn = getHandlerFn(handler);
            var matchFn = function (urlParts, router) {
                return router.globals.transitionHistory.size() === 0 && !!/^\/?$/.exec(urlParts.path);
            };
            this.rule(this.urlRuleFactory.create(matchFn, handlerFn));
        };
        /** @inheritdoc */
        UrlRouter.prototype.when = function (matcher, handler, options) {
            var rule = this.urlRuleFactory.create(matcher, handler);
            if (isDefined(options && options.priority))
                rule.priority = options.priority;
            this.rule(rule);
            return rule;
        };
        /** @inheritdoc */
        UrlRouter.prototype.deferIntercept = function (defer) {
            if (defer === undefined)
                defer = true;
            this.interceptDeferred = defer;
        };
        return UrlRouter;
    }());
    function getHandlerFn(handler) {
        if (!isFunction(handler) && !isString(handler) && !is(TargetState)(handler) && !TargetState.isDef(handler)) {
            throw new Error("'handler' must be a string, function, TargetState, or have a state: 'newtarget' property");
        }
        return isFunction(handler) ? handler : val(handler);
    }

    /**
     * @coreapi
     * @module view
     */ /** for typedoc */
    /**
     * The View service
     *
     * This service pairs existing `ui-view` components (which live in the DOM)
     * with view configs (from the state declaration objects: [[StateDeclaration.views]]).
     *
     * - After a successful Transition, the views from the newly entered states are activated via [[activateViewConfig]].
     *   The views from exited states are deactivated via [[deactivateViewConfig]].
     *   (See: the [[registerActivateViews]] Transition Hook)
     *
     * - As `ui-view` components pop in and out of existence, they register themselves using [[registerUIView]].
     *
     * - When the [[sync]] function is called, the registered `ui-view`(s) ([[ActiveUIView]])
     * are configured with the matching [[ViewConfig]](s)
     *
     */
    var ViewService = /** @class */ (function () {
        function ViewService(router) {
            var _this = this;
            this.router = router;
            this._uiViews = [];
            this._viewConfigs = [];
            this._viewConfigFactories = {};
            this._listeners = [];
            this._pluginapi = {
                _rootViewContext: this._rootViewContext.bind(this),
                _viewConfigFactory: this._viewConfigFactory.bind(this),
                _registeredUIView: function (id) { return find(_this._uiViews, function (view) { return _this.router.$id + "." + view.id === id; }); },
                _registeredUIViews: function () { return _this._uiViews; },
                _activeViewConfigs: function () { return _this._viewConfigs; },
                _onSync: function (listener) {
                    _this._listeners.push(listener);
                    return function () { return removeFrom(_this._listeners, listener); };
                },
            };
        }
        /**
         * Normalizes a view's name from a state.views configuration block.
         *
         * This should be used by a framework implementation to calculate the values for
         * [[_ViewDeclaration.$uiViewName]] and [[_ViewDeclaration.$uiViewContextAnchor]].
         *
         * @param context the context object (state declaration) that the view belongs to
         * @param rawViewName the name of the view, as declared in the [[StateDeclaration.views]]
         *
         * @returns the normalized uiViewName and uiViewContextAnchor that the view targets
         */
        ViewService.normalizeUIViewTarget = function (context, rawViewName) {
            if (rawViewName === void 0) { rawViewName = ''; }
            // TODO: Validate incoming view name with a regexp to allow:
            // ex: "view.name@foo.bar" , "^.^.view.name" , "view.name@^.^" , "" ,
            // "@" , "$default@^" , "!$default.$default" , "!foo.bar"
            var viewAtContext = rawViewName.split('@');
            var uiViewName = viewAtContext[0] || '$default'; // default to unnamed view
            var uiViewContextAnchor = isString(viewAtContext[1]) ? viewAtContext[1] : '^'; // default to parent context
            // Handle relative view-name sugar syntax.
            // Matches rawViewName "^.^.^.foo.bar" into array: ["^.^.^.foo.bar", "^.^.^", "foo.bar"],
            var relativeViewNameSugar = /^(\^(?:\.\^)*)\.(.*$)/.exec(uiViewName);
            if (relativeViewNameSugar) {
                // Clobbers existing contextAnchor (rawViewName validation will fix this)
                uiViewContextAnchor = relativeViewNameSugar[1]; // set anchor to "^.^.^"
                uiViewName = relativeViewNameSugar[2]; // set view-name to "foo.bar"
            }
            if (uiViewName.charAt(0) === '!') {
                uiViewName = uiViewName.substr(1);
                uiViewContextAnchor = ''; // target absolutely from root
            }
            // handle parent relative targeting "^.^.^"
            var relativeMatch = /^(\^(?:\.\^)*)$/;
            if (relativeMatch.exec(uiViewContextAnchor)) {
                var anchorState = uiViewContextAnchor.split('.').reduce(function (anchor, x) { return anchor.parent; }, context);
                uiViewContextAnchor = anchorState.name;
            }
            else if (uiViewContextAnchor === '.') {
                uiViewContextAnchor = context.name;
            }
            return { uiViewName: uiViewName, uiViewContextAnchor: uiViewContextAnchor };
        };
        ViewService.prototype._rootViewContext = function (context) {
            return (this._rootContext = context || this._rootContext);
        };
        ViewService.prototype._viewConfigFactory = function (viewType, factory) {
            this._viewConfigFactories[viewType] = factory;
        };
        ViewService.prototype.createViewConfig = function (path, decl) {
            var cfgFactory = this._viewConfigFactories[decl.$type];
            if (!cfgFactory)
                throw new Error('ViewService: No view config factory registered for type ' + decl.$type);
            var cfgs = cfgFactory(path, decl);
            return isArray(cfgs) ? cfgs : [cfgs];
        };
        /**
         * Deactivates a ViewConfig.
         *
         * This function deactivates a `ViewConfig`.
         * After calling [[sync]], it will un-pair from any `ui-view` with which it is currently paired.
         *
         * @param viewConfig The ViewConfig view to deregister.
         */
        ViewService.prototype.deactivateViewConfig = function (viewConfig) {
            trace.traceViewServiceEvent('<- Removing', viewConfig);
            removeFrom(this._viewConfigs, viewConfig);
        };
        ViewService.prototype.activateViewConfig = function (viewConfig) {
            trace.traceViewServiceEvent('-> Registering', viewConfig);
            this._viewConfigs.push(viewConfig);
        };
        ViewService.prototype.sync = function () {
            var _this = this;
            var uiViewsByFqn = this._uiViews.map(function (uiv) { return [uiv.fqn, uiv]; }).reduce(applyPairs, {});
            // Return a weighted depth value for a uiView.
            // The depth is the nesting depth of ui-views (based on FQN; times 10,000)
            // plus the depth of the state that is populating the uiView
            function uiViewDepth(uiView) {
                var stateDepth = function (context) { return (context && context.parent ? stateDepth(context.parent) + 1 : 1); };
                return uiView.fqn.split('.').length * 10000 + stateDepth(uiView.creationContext);
            }
            // Return the ViewConfig's context's depth in the context tree.
            function viewConfigDepth(config) {
                var context = config.viewDecl.$context, count = 0;
                while (++count && context.parent)
                    context = context.parent;
                return count;
            }
            // Given a depth function, returns a compare function which can return either ascending or descending order
            var depthCompare = curry(function (depthFn, posNeg, left, right) { return posNeg * (depthFn(left) - depthFn(right)); });
            var matchingConfigPair = function (uiView) {
                var matchingConfigs = _this._viewConfigs.filter(ViewService.matches(uiViewsByFqn, uiView));
                if (matchingConfigs.length > 1) {
                    // This is OK.  Child states can target a ui-view that the parent state also targets (the child wins)
                    // Sort by depth and return the match from the deepest child
                    // console.log(`Multiple matching view configs for ${uiView.fqn}`, matchingConfigs);
                    matchingConfigs.sort(depthCompare(viewConfigDepth, -1)); // descending
                }
                return { uiView: uiView, viewConfig: matchingConfigs[0] };
            };
            var configureUIView = function (tuple) {
                // If a parent ui-view is reconfigured, it could destroy child ui-views.
                // Before configuring a child ui-view, make sure it's still in the active uiViews array.
                if (_this._uiViews.indexOf(tuple.uiView) !== -1)
                    tuple.uiView.configUpdated(tuple.viewConfig);
            };
            // Sort views by FQN and state depth. Process uiviews nearest the root first.
            var uiViewTuples = this._uiViews.sort(depthCompare(uiViewDepth, 1)).map(matchingConfigPair);
            var matchedViewConfigs = uiViewTuples.map(function (tuple) { return tuple.viewConfig; });
            var unmatchedConfigTuples = this._viewConfigs
                .filter(function (config) { return !inArray(matchedViewConfigs, config); })
                .map(function (viewConfig) { return ({ uiView: undefined, viewConfig: viewConfig }); });
            uiViewTuples.forEach(configureUIView);
            var allTuples = uiViewTuples.concat(unmatchedConfigTuples);
            this._listeners.forEach(function (cb) { return cb(allTuples); });
            trace.traceViewSync(allTuples);
        };
        /**
         * Registers a `ui-view` component
         *
         * When a `ui-view` component is created, it uses this method to register itself.
         * After registration the [[sync]] method is used to ensure all `ui-view` are configured with the proper [[ViewConfig]].
         *
         * Note: the `ui-view` component uses the `ViewConfig` to determine what view should be loaded inside the `ui-view`,
         * and what the view's state context is.
         *
         * Note: There is no corresponding `deregisterUIView`.
         *       A `ui-view` should hang on to the return value of `registerUIView` and invoke it to deregister itself.
         *
         * @param uiView The metadata for a UIView
         * @return a de-registration function used when the view is destroyed.
         */
        ViewService.prototype.registerUIView = function (uiView) {
            trace.traceViewServiceUIViewEvent('-> Registering', uiView);
            var uiViews = this._uiViews;
            var fqnAndTypeMatches = function (uiv) { return uiv.fqn === uiView.fqn && uiv.$type === uiView.$type; };
            if (uiViews.filter(fqnAndTypeMatches).length)
                trace.traceViewServiceUIViewEvent('!!!! duplicate uiView named:', uiView);
            uiViews.push(uiView);
            this.sync();
            return function () {
                var idx = uiViews.indexOf(uiView);
                if (idx === -1) {
                    trace.traceViewServiceUIViewEvent('Tried removing non-registered uiView', uiView);
                    return;
                }
                trace.traceViewServiceUIViewEvent('<- Deregistering', uiView);
                removeFrom(uiViews)(uiView);
            };
        };
        /**
         * Returns the list of views currently available on the page, by fully-qualified name.
         *
         * @return {Array} Returns an array of fully-qualified view names.
         */
        ViewService.prototype.available = function () {
            return this._uiViews.map(prop('fqn'));
        };
        /**
         * Returns the list of views on the page containing loaded content.
         *
         * @return {Array} Returns an array of fully-qualified view names.
         */
        ViewService.prototype.active = function () {
            return this._uiViews.filter(prop('$config')).map(prop('name'));
        };
        /**
         * Given a ui-view and a ViewConfig, determines if they "match".
         *
         * A ui-view has a fully qualified name (fqn) and a context object.  The fqn is built from its overall location in
         * the DOM, describing its nesting relationship to any parent ui-view tags it is nested inside of.
         *
         * A ViewConfig has a target ui-view name and a context anchor.  The ui-view name can be a simple name, or
         * can be a segmented ui-view path, describing a portion of a ui-view fqn.
         *
         * In order for a ui-view to match ViewConfig, ui-view's $type must match the ViewConfig's $type
         *
         * If the ViewConfig's target ui-view name is a simple name (no dots), then a ui-view matches if:
         * - the ui-view's name matches the ViewConfig's target name
         * - the ui-view's context matches the ViewConfig's anchor
         *
         * If the ViewConfig's target ui-view name is a segmented name (with dots), then a ui-view matches if:
         * - There exists a parent ui-view where:
         *    - the parent ui-view's name matches the first segment (index 0) of the ViewConfig's target name
         *    - the parent ui-view's context matches the ViewConfig's anchor
         * - And the remaining segments (index 1..n) of the ViewConfig's target name match the tail of the ui-view's fqn
         *
         * Example:
         *
         * DOM:
         * <ui-view>                        <!-- created in the root context (name: "") -->
         *   <ui-view name="foo">                <!-- created in the context named: "A"      -->
         *     <ui-view>                    <!-- created in the context named: "A.B"    -->
         *       <ui-view name="bar">            <!-- created in the context named: "A.B.C"  -->
         *       </ui-view>
         *     </ui-view>
         *   </ui-view>
         * </ui-view>
         *
         * uiViews: [
         *  { fqn: "$default",                  creationContext: { name: "" } },
         *  { fqn: "$default.foo",              creationContext: { name: "A" } },
         *  { fqn: "$default.foo.$default",     creationContext: { name: "A.B" } }
         *  { fqn: "$default.foo.$default.bar", creationContext: { name: "A.B.C" } }
         * ]
         *
         * These four view configs all match the ui-view with the fqn: "$default.foo.$default.bar":
         *
         * - ViewConfig1: { uiViewName: "bar",                       uiViewContextAnchor: "A.B.C" }
         * - ViewConfig2: { uiViewName: "$default.bar",              uiViewContextAnchor: "A.B" }
         * - ViewConfig3: { uiViewName: "foo.$default.bar",          uiViewContextAnchor: "A" }
         * - ViewConfig4: { uiViewName: "$default.foo.$default.bar", uiViewContextAnchor: "" }
         *
         * Using ViewConfig3 as an example, it matches the ui-view with fqn "$default.foo.$default.bar" because:
         * - The ViewConfig's segmented target name is: [ "foo", "$default", "bar" ]
         * - There exists a parent ui-view (which has fqn: "$default.foo") where:
         *    - the parent ui-view's name "foo" matches the first segment "foo" of the ViewConfig's target name
         *    - the parent ui-view's context "A" matches the ViewConfig's anchor context "A"
         * - And the remaining segments [ "$default", "bar" ].join("."_ of the ViewConfig's target name match
         *   the tail of the ui-view's fqn "default.bar"
         *
         * @internalapi
         */
        ViewService.matches = function (uiViewsByFqn, uiView) { return function (viewConfig) {
            // Don't supply an ng1 ui-view with an ng2 ViewConfig, etc
            if (uiView.$type !== viewConfig.viewDecl.$type)
                return false;
            // Split names apart from both viewConfig and uiView into segments
            var vc = viewConfig.viewDecl;
            var vcSegments = vc.$uiViewName.split('.');
            var uivSegments = uiView.fqn.split('.');
            // Check if the tails of the segment arrays match. ex, these arrays' tails match:
            // vc: ["foo", "bar"], uiv fqn: ["$default", "foo", "bar"]
            if (!equals(vcSegments, uivSegments.slice(0 - vcSegments.length)))
                return false;
            // Now check if the fqn ending at the first segment of the viewConfig matches the context:
            // ["$default", "foo"].join(".") == "$default.foo", does the ui-view $default.foo context match?
            var negOffset = 1 - vcSegments.length || undefined;
            var fqnToFirstSegment = uivSegments.slice(0, negOffset).join('.');
            var uiViewContext = uiViewsByFqn[fqnToFirstSegment].creationContext;
            return vc.$uiViewContextAnchor === (uiViewContext && uiViewContext.name);
        }; };
        return ViewService;
    }());

    /**
     * @coreapi
     * @module core
     */ /** */
    /**
     * Global router state
     *
     * This is where we hold the global mutable state such as current state, current
     * params, current transition, etc.
     */
    var UIRouterGlobals = /** @class */ (function () {
        function UIRouterGlobals() {
            /**
             * Current parameter values
             *
             * The parameter values from the latest successful transition
             */
            this.params = new StateParams();
            /** @internalapi */
            this.lastStartedTransitionId = -1;
            /** @internalapi */
            this.transitionHistory = new Queue([], 1);
            /** @internalapi */
            this.successfulTransitions = new Queue([], 1);
        }
        UIRouterGlobals.prototype.dispose = function () {
            this.transitionHistory.clear();
            this.successfulTransitions.clear();
            this.transition = null;
        };
        return UIRouterGlobals;
    }());

    /**
     * @coreapi
     * @module url
     */ /** */
    /** @hidden */
    var makeStub = function (keys) {
        return keys.reduce(function (acc, key) { return ((acc[key] = notImplemented(key)), acc); }, { dispose: noop });
    };
    /** @hidden */
    var locationServicesFns = ['url', 'path', 'search', 'hash', 'onChange'];
    /** @hidden */
    var locationConfigFns = ['port', 'protocol', 'host', 'baseHref', 'html5Mode', 'hashPrefix'];
    /** @hidden */
    var umfFns = ['type', 'caseInsensitive', 'strictMode', 'defaultSquashPolicy'];
    /** @hidden */
    var rulesFns = ['sort', 'when', 'initial', 'otherwise', 'rules', 'rule', 'removeRule'];
    /** @hidden */
    var syncFns = ['deferIntercept', 'listen', 'sync', 'match'];
    /**
     * API for URL management
     */
    var UrlService = /** @class */ (function () {
        /** @hidden */
        function UrlService(router, lateBind) {
            if (lateBind === void 0) { lateBind = true; }
            this.router = router;
            this.rules = {};
            this.config = {};
            // proxy function calls from UrlService to the LocationService/LocationConfig
            var locationServices = function () { return router.locationService; };
            createProxyFunctions(locationServices, this, locationServices, locationServicesFns, lateBind);
            var locationConfig = function () { return router.locationConfig; };
            createProxyFunctions(locationConfig, this.config, locationConfig, locationConfigFns, lateBind);
            var umf = function () { return router.urlMatcherFactory; };
            createProxyFunctions(umf, this.config, umf, umfFns);
            var urlRouter = function () { return router.urlRouter; };
            createProxyFunctions(urlRouter, this.rules, urlRouter, rulesFns);
            createProxyFunctions(urlRouter, this, urlRouter, syncFns);
        }
        UrlService.prototype.url = function (newurl, replace, state) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.path = function () {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.search = function () {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.hash = function () {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.onChange = function (callback) {
            return;
        };
        /**
         * Returns the current URL parts
         *
         * This method returns the current URL components as a [[UrlParts]] object.
         *
         * @returns the current url parts
         */
        UrlService.prototype.parts = function () {
            return { path: this.path(), search: this.search(), hash: this.hash() };
        };
        UrlService.prototype.dispose = function () { };
        /** @inheritdoc */
        UrlService.prototype.sync = function (evt) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.listen = function (enabled) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.deferIntercept = function (defer) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.match = function (urlParts) {
            return;
        };
        /** @hidden */
        UrlService.locationServiceStub = makeStub(locationServicesFns);
        /** @hidden */
        UrlService.locationConfigStub = makeStub(locationConfigFns);
        return UrlService;
    }());

    /**
     * @coreapi
     * @module core
     */ /** */
    /** @hidden */
    var _routerInstance = 0;
    /**
     * The master class used to instantiate an instance of UI-Router.
     *
     * UI-Router (for each specific framework) will create an instance of this class during bootstrap.
     * This class instantiates and wires the UI-Router services together.
     *
     * After a new instance of the UIRouter class is created, it should be configured for your app.
     * For instance, app states should be registered with the [[UIRouter.stateRegistry]].
     *
     * ---
     *
     * Normally the framework code will bootstrap UI-Router.
     * If you are bootstrapping UIRouter manually, tell it to monitor the URL by calling
     * [[UrlService.listen]] then [[UrlService.sync]].
     */
    var UIRouter = /** @class */ (function () {
        /**
         * Creates a new `UIRouter` object
         *
         * @param locationService a [[LocationServices]] implementation
         * @param locationConfig a [[LocationConfig]] implementation
         * @internalapi
         */
        function UIRouter(locationService, locationConfig) {
            if (locationService === void 0) { locationService = UrlService.locationServiceStub; }
            if (locationConfig === void 0) { locationConfig = UrlService.locationConfigStub; }
            this.locationService = locationService;
            this.locationConfig = locationConfig;
            /** @hidden */ this.$id = _routerInstance++;
            /** @hidden */ this._disposed = false;
            /** @hidden */ this._disposables = [];
            /** Provides trace information to the console */
            this.trace = trace;
            /** Provides services related to ui-view synchronization */
            this.viewService = new ViewService(this);
            /** Global router state */
            this.globals = new UIRouterGlobals();
            /** Provides services related to Transitions */
            this.transitionService = new TransitionService(this);
            /**
             * Deprecated for public use. Use [[urlService]] instead.
             * @deprecated Use [[urlService]] instead
             */
            this.urlMatcherFactory = new UrlMatcherFactory();
            /**
             * Deprecated for public use. Use [[urlService]] instead.
             * @deprecated Use [[urlService]] instead
             */
            this.urlRouter = new UrlRouter(this);
            /** Provides a registry for states, and related registration services */
            this.stateRegistry = new StateRegistry(this);
            /** Provides services related to states */
            this.stateService = new StateService(this);
            /** Provides services related to the URL */
            this.urlService = new UrlService(this);
            /** @hidden plugin instances are registered here */
            this._plugins = {};
            this.viewService._pluginapi._rootViewContext(this.stateRegistry.root());
            this.globals.$current = this.stateRegistry.root();
            this.globals.current = this.globals.$current.self;
            this.disposable(this.globals);
            this.disposable(this.stateService);
            this.disposable(this.stateRegistry);
            this.disposable(this.transitionService);
            this.disposable(this.urlRouter);
            this.disposable(locationService);
            this.disposable(locationConfig);
        }
        /** Registers an object to be notified when the router is disposed */
        UIRouter.prototype.disposable = function (disposable) {
            this._disposables.push(disposable);
        };
        /**
         * Disposes this router instance
         *
         * When called, clears resources retained by the router by calling `dispose(this)` on all
         * registered [[disposable]] objects.
         *
         * Or, if a `disposable` object is provided, calls `dispose(this)` on that object only.
         *
         * @param disposable (optional) the disposable to dispose
         */
        UIRouter.prototype.dispose = function (disposable) {
            var _this = this;
            if (disposable && isFunction(disposable.dispose)) {
                disposable.dispose(this);
                return undefined;
            }
            this._disposed = true;
            this._disposables.slice().forEach(function (d) {
                try {
                    typeof d.dispose === 'function' && d.dispose(_this);
                    removeFrom(_this._disposables, d);
                }
                catch (ignored) { }
            });
        };
        /**
         * Adds a plugin to UI-Router
         *
         * This method adds a UI-Router Plugin.
         * A plugin can enhance or change UI-Router behavior using any public API.
         *
         * #### Example:
         * ```js
         * import { MyCoolPlugin } from "ui-router-cool-plugin";
         *
         * var plugin = router.addPlugin(MyCoolPlugin);
         * ```
         *
         * ### Plugin authoring
         *
         * A plugin is simply a class (or constructor function) which accepts a [[UIRouter]] instance and (optionally) an options object.
         *
         * The plugin can implement its functionality using any of the public APIs of [[UIRouter]].
         * For example, it may configure router options or add a Transition Hook.
         *
         * The plugin can then be published as a separate module.
         *
         * #### Example:
         * ```js
         * export class MyAuthPlugin implements UIRouterPlugin {
         *   constructor(router: UIRouter, options: any) {
         *     this.name = "MyAuthPlugin";
         *     let $transitions = router.transitionService;
         *     let $state = router.stateService;
         *
         *     let authCriteria = {
         *       to: (state) => state.data && state.data.requiresAuth
         *     };
         *
         *     function authHook(transition: Transition) {
         *       let authService = transition.injector().get('AuthService');
         *       if (!authService.isAuthenticated()) {
         *         return $state.target('login');
         *       }
         *     }
         *
         *     $transitions.onStart(authCriteria, authHook);
         *   }
         * }
         * ```
         *
         * @param plugin one of:
         *        - a plugin class which implements [[UIRouterPlugin]]
         *        - a constructor function for a [[UIRouterPlugin]] which accepts a [[UIRouter]] instance
         *        - a factory function which accepts a [[UIRouter]] instance and returns a [[UIRouterPlugin]] instance
         * @param options options to pass to the plugin class/factory
         * @returns the registered plugin instance
         */
        UIRouter.prototype.plugin = function (plugin, options) {
            if (options === void 0) { options = {}; }
            var pluginInstance = new plugin(this, options);
            if (!pluginInstance.name)
                throw new Error('Required property `name` missing on plugin: ' + pluginInstance);
            this._disposables.push(pluginInstance);
            return (this._plugins[pluginInstance.name] = pluginInstance);
        };
        UIRouter.prototype.getPlugin = function (pluginName) {
            return pluginName ? this._plugins[pluginName] : values(this._plugins);
        };
        return UIRouter;
    }());

    /** @module hooks */ /** */
    function addCoreResolvables(trans) {
        trans.addResolvable(Resolvable.fromData(UIRouter, trans.router), '');
        trans.addResolvable(Resolvable.fromData(Transition, trans), '');
        trans.addResolvable(Resolvable.fromData('$transition$', trans), '');
        trans.addResolvable(Resolvable.fromData('$stateParams', trans.params()), '');
        trans.entering().forEach(function (state) {
            trans.addResolvable(Resolvable.fromData('$state$', state), state);
        });
    }
    var registerAddCoreResolvables = function (transitionService) {
        return transitionService.onCreate({}, addCoreResolvables);
    };
    var TRANSITION_TOKENS = ['$transition$', Transition];
    var isTransition = inArray(TRANSITION_TOKENS);
    // References to Transition in the treeChanges pathnodes makes all
    // previous Transitions reachable in memory, causing a memory leak
    // This function removes resolves for '$transition$' and `Transition` from the treeChanges.
    // Do not use this on current transitions, only on old ones.
    var treeChangesCleanup = function (trans) {
        var nodes = values(trans.treeChanges())
            .reduce(unnestR, [])
            .reduce(uniqR, []);
        // If the resolvable is a Transition, return a new resolvable with null data
        var replaceTransitionWithNull = function (r) {
            return isTransition(r.token) ? Resolvable.fromData(r.token, null) : r;
        };
        nodes.forEach(function (node) {
            node.resolvables = node.resolvables.map(replaceTransitionWithNull);
        });
    };

    /** @module hooks */ /** */
    /**
     * A [[TransitionHookFn]] that redirects to a different state or params
     *
     * Registered using `transitionService.onStart({ to: (state) => !!state.redirectTo }, redirectHook);`
     *
     * See [[StateDeclaration.redirectTo]]
     */
    var redirectToHook = function (trans) {
        var redirect = trans.to().redirectTo;
        if (!redirect)
            return;
        var $state = trans.router.stateService;
        function handleResult(result) {
            if (!result)
                return;
            if (result instanceof TargetState)
                return result;
            if (isString(result))
                return $state.target(result, trans.params(), trans.options());
            if (result['state'] || result['params'])
                return $state.target(result['state'] || trans.to(), result['params'] || trans.params(), trans.options());
        }
        if (isFunction(redirect)) {
            return services.$q.when(redirect(trans)).then(handleResult);
        }
        return handleResult(redirect);
    };
    var registerRedirectToHook = function (transitionService) {
        return transitionService.onStart({ to: function (state) { return !!state.redirectTo; } }, redirectToHook);
    };

    /**
     * A factory which creates an onEnter, onExit or onRetain transition hook function
     *
     * The returned function invokes the (for instance) state.onEnter hook when the
     * state is being entered.
     *
     * @hidden
     */
    function makeEnterExitRetainHook(hookName) {
        return function (transition, state) {
            var _state = state.$$state();
            var hookFn = _state[hookName];
            return hookFn(transition, state);
        };
    }
    /**
     * The [[TransitionStateHookFn]] for onExit
     *
     * When the state is being exited, the state's .onExit function is invoked.
     *
     * Registered using `transitionService.onExit({ exiting: (state) => !!state.onExit }, onExitHook);`
     *
     * See: [[IHookRegistry.onExit]]
     */
    var onExitHook = makeEnterExitRetainHook('onExit');
    var registerOnExitHook = function (transitionService) {
        return transitionService.onExit({ exiting: function (state) { return !!state.onExit; } }, onExitHook);
    };
    /**
     * The [[TransitionStateHookFn]] for onRetain
     *
     * When the state was already entered, and is not being exited or re-entered, the state's .onRetain function is invoked.
     *
     * Registered using `transitionService.onRetain({ retained: (state) => !!state.onRetain }, onRetainHook);`
     *
     * See: [[IHookRegistry.onRetain]]
     */
    var onRetainHook = makeEnterExitRetainHook('onRetain');
    var registerOnRetainHook = function (transitionService) {
        return transitionService.onRetain({ retained: function (state) { return !!state.onRetain; } }, onRetainHook);
    };
    /**
     * The [[TransitionStateHookFn]] for onEnter
     *
     * When the state is being entered, the state's .onEnter function is invoked.
     *
     * Registered using `transitionService.onEnter({ entering: (state) => !!state.onEnter }, onEnterHook);`
     *
     * See: [[IHookRegistry.onEnter]]
     */
    var onEnterHook = makeEnterExitRetainHook('onEnter');
    var registerOnEnterHook = function (transitionService) {
        return transitionService.onEnter({ entering: function (state) { return !!state.onEnter; } }, onEnterHook);
    };

    /** @module hooks */
    var RESOLVE_HOOK_PRIORITY = 1000;
    /**
     * A [[TransitionHookFn]] which resolves all EAGER Resolvables in the To Path
     *
     * Registered using `transitionService.onStart({}, eagerResolvePath, { priority: 1000 });`
     *
     * When a Transition starts, this hook resolves all the EAGER Resolvables, which the transition then waits for.
     *
     * See [[StateDeclaration.resolve]]
     */
    var eagerResolvePath = function (trans) {
        return new ResolveContext(trans.treeChanges().to).resolvePath('EAGER', trans).then(noop);
    };
    var registerEagerResolvePath = function (transitionService) {
        return transitionService.onStart({}, eagerResolvePath, { priority: RESOLVE_HOOK_PRIORITY });
    };
    /**
     * A [[TransitionHookFn]] which resolves all LAZY Resolvables for the state (and all its ancestors) in the To Path
     *
     * Registered using `transitionService.onEnter({ entering: () => true }, lazyResolveState, { priority: 1000 });`
     *
     * When a State is being entered, this hook resolves all the Resolvables for this state, which the transition then waits for.
     *
     * See [[StateDeclaration.resolve]]
     */
    var lazyResolveState = function (trans, state) {
        return new ResolveContext(trans.treeChanges().to)
            .subContext(state.$$state())
            .resolvePath('LAZY', trans)
            .then(noop);
    };
    var registerLazyResolveState = function (transitionService) {
        return transitionService.onEnter({ entering: val(true) }, lazyResolveState, { priority: RESOLVE_HOOK_PRIORITY });
    };
    /**
     * A [[TransitionHookFn]] which resolves any dynamically added (LAZY or EAGER) Resolvables.
     *
     * Registered using `transitionService.onFinish({}, eagerResolvePath, { priority: 1000 });`
     *
     * After all entering states have been entered, this hook resolves any remaining Resolvables.
     * These are typically dynamic resolves which were added by some Transition Hook using [[Transition.addResolvable]].
     *
     * See [[StateDeclaration.resolve]]
     */
    var resolveRemaining = function (trans) {
        return new ResolveContext(trans.treeChanges().to).resolvePath('LAZY', trans).then(noop);
    };
    var registerResolveRemaining = function (transitionService) {
        return transitionService.onFinish({}, resolveRemaining, { priority: RESOLVE_HOOK_PRIORITY });
    };

    /** @module hooks */ /** for typedoc */
    /**
     * A [[TransitionHookFn]] which waits for the views to load
     *
     * Registered using `transitionService.onStart({}, loadEnteringViews);`
     *
     * Allows the views to do async work in [[ViewConfig.load]] before the transition continues.
     * In angular 1, this includes loading the templates.
     */
    var loadEnteringViews = function (transition) {
        var $q = services.$q;
        var enteringViews = transition.views('entering');
        if (!enteringViews.length)
            return;
        return $q.all(enteringViews.map(function (view) { return $q.when(view.load()); })).then(noop);
    };
    var registerLoadEnteringViews = function (transitionService) {
        return transitionService.onFinish({}, loadEnteringViews);
    };
    /**
     * A [[TransitionHookFn]] which activates the new views when a transition is successful.
     *
     * Registered using `transitionService.onSuccess({}, activateViews);`
     *
     * After a transition is complete, this hook deactivates the old views from the previous state,
     * and activates the new views from the destination state.
     *
     * See [[ViewService]]
     */
    var activateViews = function (transition) {
        var enteringViews = transition.views('entering');
        var exitingViews = transition.views('exiting');
        if (!enteringViews.length && !exitingViews.length)
            return;
        var $view = transition.router.viewService;
        exitingViews.forEach(function (vc) { return $view.deactivateViewConfig(vc); });
        enteringViews.forEach(function (vc) { return $view.activateViewConfig(vc); });
        $view.sync();
    };
    var registerActivateViews = function (transitionService) {
        return transitionService.onSuccess({}, activateViews);
    };

    /**
     * A [[TransitionHookFn]] which updates global UI-Router state
     *
     * Registered using `transitionService.onBefore({}, updateGlobalState);`
     *
     * Before a [[Transition]] starts, updates the global value of "the current transition" ([[Globals.transition]]).
     * After a successful [[Transition]], updates the global values of "the current state"
     * ([[Globals.current]] and [[Globals.$current]]) and "the current param values" ([[Globals.params]]).
     *
     * See also the deprecated properties:
     * [[StateService.transition]], [[StateService.current]], [[StateService.params]]
     */
    var updateGlobalState = function (trans) {
        var globals = trans.router.globals;
        var transitionSuccessful = function () {
            globals.successfulTransitions.enqueue(trans);
            globals.$current = trans.$to();
            globals.current = globals.$current.self;
            copy(trans.params(), globals.params);
        };
        var clearCurrentTransition = function () {
            // Do not clear globals.transition if a different transition has started in the meantime
            if (globals.transition === trans)
                globals.transition = null;
        };
        trans.onSuccess({}, transitionSuccessful, { priority: 10000 });
        trans.promise.then(clearCurrentTransition, clearCurrentTransition);
    };
    var registerUpdateGlobalState = function (transitionService) {
        return transitionService.onCreate({}, updateGlobalState);
    };

    /**
     * A [[TransitionHookFn]] which updates the URL after a successful transition
     *
     * Registered using `transitionService.onSuccess({}, updateUrl);`
     */
    var updateUrl = function (transition) {
        var options = transition.options();
        var $state = transition.router.stateService;
        var $urlRouter = transition.router.urlRouter;
        // Dont update the url in these situations:
        // The transition was triggered by a URL sync (options.source === 'url')
        // The user doesn't want the url to update (options.location === false)
        // The destination state, and all parents have no navigable url
        if (options.source !== 'url' && options.location && $state.$current.navigable) {
            var urlOptions = { replace: options.location === 'replace' };
            $urlRouter.push($state.$current.navigable.url, $state.params, urlOptions);
        }
        $urlRouter.update(true);
    };
    var registerUpdateUrl = function (transitionService) {
        return transitionService.onSuccess({}, updateUrl, { priority: 9999 });
    };

    /**
     * A [[TransitionHookFn]] that performs lazy loading
     *
     * When entering a state "abc" which has a `lazyLoad` function defined:
     * - Invoke the `lazyLoad` function (unless it is already in process)
     *   - Flag the hook function as "in process"
     *   - The function should return a promise (that resolves when lazy loading is complete)
     * - Wait for the promise to settle
     *   - If the promise resolves to a [[LazyLoadResult]], then register those states
     *   - Flag the hook function as "not in process"
     * - If the hook was successful
     *   - Remove the `lazyLoad` function from the state declaration
     * - If all the hooks were successful
     *   - Retry the transition (by returning a TargetState)
     *
     * ```
     * .state('abc', {
     *   component: 'fooComponent',
     *   lazyLoad: () => System.import('./fooComponent')
     *   });
     * ```
     *
     * See [[StateDeclaration.lazyLoad]]
     */
    var lazyLoadHook = function (transition) {
        var router = transition.router;
        function retryTransition() {
            if (transition.originalTransition().options().source !== 'url') {
                // The original transition was not triggered via url sync
                // The lazy state should be loaded now, so re-try the original transition
                var orig = transition.targetState();
                return router.stateService.target(orig.identifier(), orig.params(), orig.options());
            }
            // The original transition was triggered via url sync
            // Run the URL rules and find the best match
            var $url = router.urlService;
            var result = $url.match($url.parts());
            var rule = result && result.rule;
            // If the best match is a state, redirect the transition (instead
            // of calling sync() which supersedes the current transition)
            if (rule && rule.type === 'STATE') {
                var state = rule.state;
                var params = result.match;
                return router.stateService.target(state, params, transition.options());
            }
            // No matching state found, so let .sync() choose the best non-state match/otherwise
            router.urlService.sync();
        }
        var promises = transition
            .entering()
            .filter(function (state) { return !!state.$$state().lazyLoad; })
            .map(function (state) { return lazyLoadState(transition, state); });
        return services.$q.all(promises).then(retryTransition);
    };
    var registerLazyLoadHook = function (transitionService) {
        return transitionService.onBefore({ entering: function (state) { return !!state.lazyLoad; } }, lazyLoadHook);
    };
    /**
     * Invokes a state's lazy load function
     *
     * @param transition a Transition context
     * @param state the state to lazy load
     * @returns A promise for the lazy load result
     */
    function lazyLoadState(transition, state) {
        var lazyLoadFn = state.$$state().lazyLoad;
        // Store/get the lazy load promise on/from the hookfn so it doesn't get re-invoked
        var promise = lazyLoadFn['_promise'];
        if (!promise) {
            var success = function (result) {
                delete state.lazyLoad;
                delete state.$$state().lazyLoad;
                delete lazyLoadFn['_promise'];
                return result;
            };
            var error = function (err) {
                delete lazyLoadFn['_promise'];
                return services.$q.reject(err);
            };
            promise = lazyLoadFn['_promise'] = services.$q
                .when(lazyLoadFn(transition, state))
                .then(updateStateRegistry)
                .then(success, error);
        }
        /** Register any lazy loaded state definitions */
        function updateStateRegistry(result) {
            if (result && Array.isArray(result.states)) {
                result.states.forEach(function (_state) { return transition.router.stateRegistry.register(_state); });
            }
            return result;
        }
        return promise;
    }

    /**
     * This class defines a type of hook, such as `onBefore` or `onEnter`.
     * Plugins can define custom hook types, such as sticky states does for `onInactive`.
     *
     * @interalapi
     */
    var TransitionEventType = /** @class */ (function () {
        /* tslint:disable:no-inferrable-types */
        function TransitionEventType(name, hookPhase, hookOrder, criteriaMatchPath, reverseSort, getResultHandler, getErrorHandler, synchronous) {
            if (reverseSort === void 0) { reverseSort = false; }
            if (getResultHandler === void 0) { getResultHandler = TransitionHook.HANDLE_RESULT; }
            if (getErrorHandler === void 0) { getErrorHandler = TransitionHook.REJECT_ERROR; }
            if (synchronous === void 0) { synchronous = false; }
            this.name = name;
            this.hookPhase = hookPhase;
            this.hookOrder = hookOrder;
            this.criteriaMatchPath = criteriaMatchPath;
            this.reverseSort = reverseSort;
            this.getResultHandler = getResultHandler;
            this.getErrorHandler = getErrorHandler;
            this.synchronous = synchronous;
        }
        return TransitionEventType;
    }());

    /** @module hooks */ /** */
    /**
     * A [[TransitionHookFn]] that skips a transition if it should be ignored
     *
     * This hook is invoked at the end of the onBefore phase.
     *
     * If the transition should be ignored (because no parameter or states changed)
     * then the transition is ignored and not processed.
     */
    function ignoredHook(trans) {
        var ignoredReason = trans._ignoredReason();
        if (!ignoredReason)
            return;
        trace.traceTransitionIgnored(trans);
        var pending = trans.router.globals.transition;
        // The user clicked a link going back to the *current state* ('A')
        // However, there is also a pending transition in flight (to 'B')
        // Abort the transition to 'B' because the user now wants to be back at 'A'.
        if (ignoredReason === 'SameAsCurrent' && pending) {
            pending.abort();
        }
        return Rejection.ignored().toPromise();
    }
    var registerIgnoredTransitionHook = function (transitionService) {
        return transitionService.onBefore({}, ignoredHook, { priority: -9999 });
    };

    /** @module hooks */ /** */
    /**
     * A [[TransitionHookFn]] that rejects the Transition if it is invalid
     *
     * This hook is invoked at the end of the onBefore phase.
     * If the transition is invalid (for example, param values do not validate)
     * then the transition is rejected.
     */
    function invalidTransitionHook(trans) {
        if (!trans.valid()) {
            throw new Error(trans.error().toString());
        }
    }
    var registerInvalidTransitionHook = function (transitionService) {
        return transitionService.onBefore({}, invalidTransitionHook, { priority: -10000 });
    };

    /**
     * @coreapi
     * @module transition
     */
    /**
     * The default [[Transition]] options.
     *
     * Include this object when applying custom defaults:
     * let reloadOpts = { reload: true, notify: true }
     * let options = defaults(theirOpts, customDefaults, defaultOptions);
     */
    var defaultTransOpts = {
        location: true,
        relative: null,
        inherit: false,
        notify: true,
        reload: false,
        custom: {},
        current: function () { return null; },
        source: 'unknown',
    };
    /**
     * This class provides services related to Transitions.
     *
     * - Most importantly, it allows global Transition Hooks to be registered.
     * - It allows the default transition error handler to be set.
     * - It also has a factory function for creating new [[Transition]] objects, (used internally by the [[StateService]]).
     *
     * At bootstrap, [[UIRouter]] creates a single instance (singleton) of this class.
     */
    var TransitionService = /** @class */ (function () {
        /** @hidden */
        function TransitionService(_router) {
            /** @hidden */
            this._transitionCount = 0;
            /** @hidden The transition hook types, such as `onEnter`, `onStart`, etc */
            this._eventTypes = [];
            /** @hidden The registered transition hooks */
            this._registeredHooks = {};
            /** @hidden The  paths on a criteria object */
            this._criteriaPaths = {};
            this._router = _router;
            this.$view = _router.viewService;
            this._deregisterHookFns = {};
            this._pluginapi = createProxyFunctions(val(this), {}, val(this), [
                '_definePathType',
                '_defineEvent',
                '_getPathTypes',
                '_getEvents',
                'getHooks',
            ]);
            this._defineCorePaths();
            this._defineCoreEvents();
            this._registerCoreTransitionHooks();
            _router.globals.successfulTransitions.onEvict(treeChangesCleanup);
        }
        /**
         * Registers a [[TransitionHookFn]], called *while a transition is being constructed*.
         *
         * Registers a transition lifecycle hook, which is invoked during transition construction.
         *
         * This low level hook should only be used by plugins.
         * This can be a useful time for plugins to add resolves or mutate the transition as needed.
         * The Sticky States plugin uses this hook to modify the treechanges.
         *
         * ### Lifecycle
         *
         * `onCreate` hooks are invoked *while a transition is being constructed*.
         *
         * ### Return value
         *
         * The hook's return value is ignored
         *
         * @internalapi
         * @param criteria defines which Transitions the Hook should be invoked for.
         * @param callback the hook function which will be invoked.
         * @param options the registration options
         * @returns a function which deregisters the hook.
         */
        TransitionService.prototype.onCreate = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onBefore = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onStart = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onExit = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onRetain = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onEnter = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onFinish = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onSuccess = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onError = function (criteria, callback, options) {
            return;
        };
        /**
         * dispose
         * @internalapi
         */
        TransitionService.prototype.dispose = function (router) {
            values(this._registeredHooks).forEach(function (hooksArray) {
                return hooksArray.forEach(function (hook) {
                    hook._deregistered = true;
                    removeFrom(hooksArray, hook);
                });
            });
        };
        /**
         * Creates a new [[Transition]] object
         *
         * This is a factory function for creating new Transition objects.
         * It is used internally by the [[StateService]] and should generally not be called by application code.
         *
         * @param fromPath the path to the current state (the from state)
         * @param targetState the target state (destination)
         * @returns a Transition
         */
        TransitionService.prototype.create = function (fromPath, targetState) {
            return new Transition(fromPath, targetState, this._router);
        };
        /** @hidden */
        TransitionService.prototype._defineCoreEvents = function () {
            var Phase = exports.TransitionHookPhase;
            var TH = TransitionHook;
            var paths = this._criteriaPaths;
            var NORMAL_SORT = false, REVERSE_SORT = true;
            var SYNCHRONOUS = true;
            this._defineEvent('onCreate', Phase.CREATE, 0, paths.to, NORMAL_SORT, TH.LOG_REJECTED_RESULT, TH.THROW_ERROR, SYNCHRONOUS);
            this._defineEvent('onBefore', Phase.BEFORE, 0, paths.to);
            this._defineEvent('onStart', Phase.RUN, 0, paths.to);
            this._defineEvent('onExit', Phase.RUN, 100, paths.exiting, REVERSE_SORT);
            this._defineEvent('onRetain', Phase.RUN, 200, paths.retained);
            this._defineEvent('onEnter', Phase.RUN, 300, paths.entering);
            this._defineEvent('onFinish', Phase.RUN, 400, paths.to);
            this._defineEvent('onSuccess', Phase.SUCCESS, 0, paths.to, NORMAL_SORT, TH.LOG_REJECTED_RESULT, TH.LOG_ERROR, SYNCHRONOUS);
            this._defineEvent('onError', Phase.ERROR, 0, paths.to, NORMAL_SORT, TH.LOG_REJECTED_RESULT, TH.LOG_ERROR, SYNCHRONOUS);
        };
        /** @hidden */
        TransitionService.prototype._defineCorePaths = function () {
            var STATE = exports.TransitionHookScope.STATE, TRANSITION = exports.TransitionHookScope.TRANSITION;
            this._definePathType('to', TRANSITION);
            this._definePathType('from', TRANSITION);
            this._definePathType('exiting', STATE);
            this._definePathType('retained', STATE);
            this._definePathType('entering', STATE);
        };
        /** @hidden */
        TransitionService.prototype._defineEvent = function (name, hookPhase, hookOrder, criteriaMatchPath, reverseSort, getResultHandler, getErrorHandler, synchronous) {
            if (reverseSort === void 0) { reverseSort = false; }
            if (getResultHandler === void 0) { getResultHandler = TransitionHook.HANDLE_RESULT; }
            if (getErrorHandler === void 0) { getErrorHandler = TransitionHook.REJECT_ERROR; }
            if (synchronous === void 0) { synchronous = false; }
            var eventType = new TransitionEventType(name, hookPhase, hookOrder, criteriaMatchPath, reverseSort, getResultHandler, getErrorHandler, synchronous);
            this._eventTypes.push(eventType);
            makeEvent(this, this, eventType);
        };
        /** @hidden */
        // tslint:disable-next-line
        TransitionService.prototype._getEvents = function (phase) {
            var transitionHookTypes = isDefined(phase)
                ? this._eventTypes.filter(function (type) { return type.hookPhase === phase; })
                : this._eventTypes.slice();
            return transitionHookTypes.sort(function (l, r) {
                var cmpByPhase = l.hookPhase - r.hookPhase;
                return cmpByPhase === 0 ? l.hookOrder - r.hookOrder : cmpByPhase;
            });
        };
        /**
         * Adds a Path to be used as a criterion against a TreeChanges path
         *
         * For example: the `exiting` path in [[HookMatchCriteria]] is a STATE scoped path.
         * It was defined by calling `defineTreeChangesCriterion('exiting', TransitionHookScope.STATE)`
         * Each state in the exiting path is checked against the criteria and returned as part of the match.
         *
         * Another example: the `to` path in [[HookMatchCriteria]] is a TRANSITION scoped path.
         * It was defined by calling `defineTreeChangesCriterion('to', TransitionHookScope.TRANSITION)`
         * Only the tail of the `to` path is checked against the criteria and returned as part of the match.
         *
         * @hidden
         */
        TransitionService.prototype._definePathType = function (name, hookScope) {
            this._criteriaPaths[name] = { name: name, scope: hookScope };
        };
        /** * @hidden */
        // tslint:disable-next-line
        TransitionService.prototype._getPathTypes = function () {
            return this._criteriaPaths;
        };
        /** @hidden */
        TransitionService.prototype.getHooks = function (hookName) {
            return this._registeredHooks[hookName];
        };
        /** @hidden */
        TransitionService.prototype._registerCoreTransitionHooks = function () {
            var fns = this._deregisterHookFns;
            fns.addCoreResolves = registerAddCoreResolvables(this);
            fns.ignored = registerIgnoredTransitionHook(this);
            fns.invalid = registerInvalidTransitionHook(this);
            // Wire up redirectTo hook
            fns.redirectTo = registerRedirectToHook(this);
            // Wire up onExit/Retain/Enter state hooks
            fns.onExit = registerOnExitHook(this);
            fns.onRetain = registerOnRetainHook(this);
            fns.onEnter = registerOnEnterHook(this);
            // Wire up Resolve hooks
            fns.eagerResolve = registerEagerResolvePath(this);
            fns.lazyResolve = registerLazyResolveState(this);
            fns.resolveAll = registerResolveRemaining(this);
            // Wire up the View management hooks
            fns.loadViews = registerLoadEnteringViews(this);
            fns.activateViews = registerActivateViews(this);
            // Updates global state after a transition
            fns.updateGlobals = registerUpdateGlobalState(this);
            // After globals.current is updated at priority: 10000
            fns.updateUrl = registerUpdateUrl(this);
            // Lazy load state trees
            fns.lazyLoad = registerLazyLoadHook(this);
        };
        return TransitionService;
    }());

    /**
     * @coreapi
     * @module state
     */
    /**
     * Provides state related service functions
     *
     * This class provides services related to ui-router states.
     * An instance of this class is located on the global [[UIRouter]] object.
     */
    var StateService = /** @class */ (function () {
        /** @internalapi */
        function StateService(router) {
            this.router = router;
            /** @internalapi */
            this.invalidCallbacks = [];
            /** @hidden */
            this._defaultErrorHandler = function $defaultErrorHandler($error$) {
                if ($error$ instanceof Error && $error$.stack) {
                    console.error($error$);
                    console.error($error$.stack);
                }
                else if ($error$ instanceof Rejection) {
                    console.error($error$.toString());
                    if ($error$.detail && $error$.detail.stack)
                        console.error($error$.detail.stack);
                }
                else {
                    console.error($error$);
                }
            };
            var getters = ['current', '$current', 'params', 'transition'];
            var boundFns = Object.keys(StateService.prototype).filter(not(inArray(getters)));
            createProxyFunctions(val(StateService.prototype), this, val(this), boundFns);
        }
        Object.defineProperty(StateService.prototype, "transition", {
            /**
             * The [[Transition]] currently in progress (or null)
             *
             * This is a passthrough through to [[UIRouterGlobals.transition]]
             */
            get: function () {
                return this.router.globals.transition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateService.prototype, "params", {
            /**
             * The latest successful state parameters
             *
             * This is a passthrough through to [[UIRouterGlobals.params]]
             */
            get: function () {
                return this.router.globals.params;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateService.prototype, "current", {
            /**
             * The current [[StateDeclaration]]
             *
             * This is a passthrough through to [[UIRouterGlobals.current]]
             */
            get: function () {
                return this.router.globals.current;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateService.prototype, "$current", {
            /**
             * The current [[StateObject]]
             *
             * This is a passthrough through to [[UIRouterGlobals.$current]]
             */
            get: function () {
                return this.router.globals.$current;
            },
            enumerable: true,
            configurable: true
        });
        /** @internalapi */
        StateService.prototype.dispose = function () {
            this.defaultErrorHandler(noop);
            this.invalidCallbacks = [];
        };
        /**
         * Handler for when [[transitionTo]] is called with an invalid state.
         *
         * Invokes the [[onInvalid]] callbacks, in natural order.
         * Each callback's return value is checked in sequence until one of them returns an instance of TargetState.
         * The results of the callbacks are wrapped in $q.when(), so the callbacks may return promises.
         *
         * If a callback returns an TargetState, then it is used as arguments to $state.transitionTo() and the result returned.
         *
         * @internalapi
         */
        StateService.prototype._handleInvalidTargetState = function (fromPath, toState) {
            var _this = this;
            var fromState = PathUtils.makeTargetState(this.router.stateRegistry, fromPath);
            var globals = this.router.globals;
            var latestThing = function () { return globals.transitionHistory.peekTail(); };
            var latest = latestThing();
            var callbackQueue = new Queue(this.invalidCallbacks.slice());
            var injector = new ResolveContext(fromPath).injector();
            var checkForRedirect = function (result) {
                if (!(result instanceof TargetState)) {
                    return;
                }
                var target = result;
                // Recreate the TargetState, in case the state is now defined.
                target = _this.target(target.identifier(), target.params(), target.options());
                if (!target.valid()) {
                    return Rejection.invalid(target.error()).toPromise();
                }
                if (latestThing() !== latest) {
                    return Rejection.superseded().toPromise();
                }
                return _this.transitionTo(target.identifier(), target.params(), target.options());
            };
            function invokeNextCallback() {
                var nextCallback = callbackQueue.dequeue();
                if (nextCallback === undefined)
                    return Rejection.invalid(toState.error()).toPromise();
                var callbackResult = services.$q.when(nextCallback(toState, fromState, injector));
                return callbackResult.then(checkForRedirect).then(function (result) { return result || invokeNextCallback(); });
            }
            return invokeNextCallback();
        };
        /**
         * Registers an Invalid State handler
         *
         * Registers a [[OnInvalidCallback]] function to be invoked when [[StateService.transitionTo]]
         * has been called with an invalid state reference parameter
         *
         * Example:
         * ```js
         * stateService.onInvalid(function(to, from, injector) {
         *   if (to.name() === 'foo') {
         *     let lazyLoader = injector.get('LazyLoadService');
         *     return lazyLoader.load('foo')
         *         .then(() => stateService.target('foo'));
         *   }
         * });
         * ```
         *
         * @param {function} callback invoked when the toState is invalid
         *   This function receives the (invalid) toState, the fromState, and an injector.
         *   The function may optionally return a [[TargetState]] or a Promise for a TargetState.
         *   If one is returned, it is treated as a redirect.
         *
         * @returns a function which deregisters the callback
         */
        StateService.prototype.onInvalid = function (callback) {
            this.invalidCallbacks.push(callback);
            return function deregisterListener() {
                removeFrom(this.invalidCallbacks)(callback);
            }.bind(this);
        };
        /**
         * Reloads the current state
         *
         * A method that force reloads the current state, or a partial state hierarchy.
         * All resolves are re-resolved, and components reinstantiated.
         *
         * #### Example:
         * ```js
         * let app angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.reload = function(){
         *     $state.reload();
         *   }
         * });
         * ```
         *
         * Note: `reload()` is just an alias for:
         *
         * ```js
         * $state.transitionTo($state.current, $state.params, {
         *   reload: true, inherit: false
         * });
         * ```
         *
         * @param reloadState A state name or a state object.
         *    If present, this state and all its children will be reloaded, but ancestors will not reload.
         *
         * #### Example:
         * ```js
         * //assuming app application consists of 3 states: 'contacts', 'contacts.detail', 'contacts.detail.item'
         * //and current state is 'contacts.detail.item'
         * let app angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.reload = function(){
         *     //will reload 'contact.detail' and nested 'contact.detail.item' states
         *     $state.reload('contact.detail');
         *   }
         * });
         * ```
         *
         * @returns A promise representing the state of the new transition. See [[StateService.go]]
         */
        StateService.prototype.reload = function (reloadState) {
            return this.transitionTo(this.current, this.params, {
                reload: isDefined(reloadState) ? reloadState : true,
                inherit: false,
                notify: false,
            });
        };
        /**
         * Transition to a different state and/or parameters
         *
         * Convenience method for transitioning to a new state.
         *
         * `$state.go` calls `$state.transitionTo` internally but automatically sets options to
         * `{ location: true, inherit: true, relative: router.globals.$current, notify: true }`.
         * This allows you to use either an absolute or relative `to` argument (because of `relative: router.globals.$current`).
         * It also allows you to specify * only the parameters you'd like to update, while letting unspecified parameters
         * inherit from the current parameter values (because of `inherit: true`).
         *
         * #### Example:
         * ```js
         * let app = angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.changeState = function () {
         *     $state.go('contact.detail');
         *   };
         * });
         * ```
         *
         * @param to Absolute state name, state object, or relative state path (relative to current state).
         *
         * Some examples:
         *
         * - `$state.go('contact.detail')` - will go to the `contact.detail` state
         * - `$state.go('^')` - will go to the parent state
         * - `$state.go('^.sibling')` - if current state is `home.child`, will go to the `home.sibling` state
         * - `$state.go('.child.grandchild')` - if current state is home, will go to the `home.child.grandchild` state
         *
         * @param params A map of the parameters that will be sent to the state, will populate $stateParams.
         *
         *    Any parameters that are not specified will be inherited from current parameter values (because of `inherit: true`).
         *    This allows, for example, going to a sibling state that shares parameters defined by a parent state.
         *
         * @param options Transition options
         *
         * @returns {promise} A promise representing the state of the new transition.
         */
        StateService.prototype.go = function (to, params, options) {
            var defautGoOpts = { relative: this.$current, inherit: true };
            var transOpts = defaults(options, defautGoOpts, defaultTransOpts);
            return this.transitionTo(to, params, transOpts);
        };
        /**
         * Creates a [[TargetState]]
         *
         * This is a factory method for creating a TargetState
         *
         * This may be returned from a Transition Hook to redirect a transition, for example.
         */
        StateService.prototype.target = function (identifier, params, options) {
            if (options === void 0) { options = {}; }
            // If we're reloading, find the state object to reload from
            if (isObject(options.reload) && !options.reload.name)
                throw new Error('Invalid reload state object');
            var reg = this.router.stateRegistry;
            options.reloadState =
                options.reload === true ? reg.root() : reg.matcher.find(options.reload, options.relative);
            if (options.reload && !options.reloadState)
                throw new Error("No such reload state '" + (isString(options.reload) ? options.reload : options.reload.name) + "'");
            return new TargetState(this.router.stateRegistry, identifier, params, options);
        };
        StateService.prototype.getCurrentPath = function () {
            var _this = this;
            var globals = this.router.globals;
            var latestSuccess = globals.successfulTransitions.peekTail();
            var rootPath = function () { return [new PathNode(_this.router.stateRegistry.root())]; };
            return latestSuccess ? latestSuccess.treeChanges().to : rootPath();
        };
        /**
         * Low-level method for transitioning to a new state.
         *
         * The [[go]] method (which uses `transitionTo` internally) is recommended in most situations.
         *
         * #### Example:
         * ```js
         * let app = angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.changeState = function () {
         *     $state.transitionTo('contact.detail');
         *   };
         * });
         * ```
         *
         * @param to State name or state object.
         * @param toParams A map of the parameters that will be sent to the state,
         *      will populate $stateParams.
         * @param options Transition options
         *
         * @returns A promise representing the state of the new transition. See [[go]]
         */
        StateService.prototype.transitionTo = function (to, toParams, options) {
            var _this = this;
            if (toParams === void 0) { toParams = {}; }
            if (options === void 0) { options = {}; }
            var router = this.router;
            var globals = router.globals;
            options = defaults(options, defaultTransOpts);
            var getCurrent = function () { return globals.transition; };
            options = extend(options, { current: getCurrent });
            var ref = this.target(to, toParams, options);
            var currentPath = this.getCurrentPath();
            if (!ref.exists())
                return this._handleInvalidTargetState(currentPath, ref);
            if (!ref.valid())
                return silentRejection(ref.error());
            /**
             * Special handling for Ignored, Aborted, and Redirected transitions
             *
             * The semantics for the transition.run() promise and the StateService.transitionTo()
             * promise differ. For instance, the run() promise may be rejected because it was
             * IGNORED, but the transitionTo() promise is resolved because from the user perspective
             * no error occurred.  Likewise, the transition.run() promise may be rejected because of
             * a Redirect, but the transitionTo() promise is chained to the new Transition's promise.
             */
            var rejectedTransitionHandler = function (trans) { return function (error) {
                if (error instanceof Rejection) {
                    var isLatest = router.globals.lastStartedTransitionId === trans.$id;
                    if (error.type === exports.RejectType.IGNORED) {
                        isLatest && router.urlRouter.update();
                        // Consider ignored `Transition.run()` as a successful `transitionTo`
                        return services.$q.when(globals.current);
                    }
                    var detail = error.detail;
                    if (error.type === exports.RejectType.SUPERSEDED && error.redirected && detail instanceof TargetState) {
                        // If `Transition.run()` was redirected, allow the `transitionTo()` promise to resolve successfully
                        // by returning the promise for the new (redirect) `Transition.run()`.
                        var redirect = trans.redirect(detail);
                        return redirect.run().catch(rejectedTransitionHandler(redirect));
                    }
                    if (error.type === exports.RejectType.ABORTED) {
                        isLatest && router.urlRouter.update();
                        return services.$q.reject(error);
                    }
                }
                var errorHandler = _this.defaultErrorHandler();
                errorHandler(error);
                return services.$q.reject(error);
            }; };
            var transition = this.router.transitionService.create(currentPath, ref);
            var transitionToPromise = transition.run().catch(rejectedTransitionHandler(transition));
            silenceUncaughtInPromise(transitionToPromise); // issue #2676
            // Return a promise for the transition, which also has the transition object on it.
            return extend(transitionToPromise, { transition: transition });
        };
        /**
         * Checks if the current state *is* the provided state
         *
         * Similar to [[includes]] but only checks for the full state name.
         * If params is supplied then it will be tested for strict equality against the current
         * active params object, so all params must match with none missing and no extras.
         *
         * #### Example:
         * ```js
         * $state.$current.name = 'contacts.details.item';
         *
         * // absolute name
         * $state.is('contact.details.item'); // returns true
         * $state.is(contactDetailItemStateObject); // returns true
         * ```
         *
         * // relative name (. and ^), typically from a template
         * // E.g. from the 'contacts.details' template
         * ```html
         * <div ng-class="{highlighted: $state.is('.item')}">Item</div>
         * ```
         *
         * @param stateOrName The state name (absolute or relative) or state object you'd like to check.
         * @param params A param object, e.g. `{sectionId: section.id}`, that you'd like
         * to test against the current active state.
         * @param options An options object. The options are:
         *   - `relative`: If `stateOrName` is a relative state name and `options.relative` is set, .is will
         *     test relative to `options.relative` state (or name).
         *
         * @returns Returns true if it is the state.
         */
        StateService.prototype.is = function (stateOrName, params, options) {
            options = defaults(options, { relative: this.$current });
            var state = this.router.stateRegistry.matcher.find(stateOrName, options.relative);
            if (!isDefined(state))
                return undefined;
            if (this.$current !== state)
                return false;
            if (!params)
                return true;
            var schema = state.parameters({ inherit: true, matchingKeys: params });
            return Param.equals(schema, Param.values(schema, params), this.params);
        };
        /**
         * Checks if the current state *includes* the provided state
         *
         * A method to determine if the current active state is equal to or is the child of the
         * state stateName. If any params are passed then they will be tested for a match as well.
         * Not all the parameters need to be passed, just the ones you'd like to test for equality.
         *
         * #### Example when `$state.$current.name === 'contacts.details.item'`
         * ```js
         * // Using partial names
         * $state.includes("contacts"); // returns true
         * $state.includes("contacts.details"); // returns true
         * $state.includes("contacts.details.item"); // returns true
         * $state.includes("contacts.list"); // returns false
         * $state.includes("about"); // returns false
         * ```
         *
         * #### Glob Examples when `* $state.$current.name === 'contacts.details.item.url'`:
         * ```js
         * $state.includes("*.details.*.*"); // returns true
         * $state.includes("*.details.**"); // returns true
         * $state.includes("**.item.**"); // returns true
         * $state.includes("*.details.item.url"); // returns true
         * $state.includes("*.details.*.url"); // returns true
         * $state.includes("*.details.*"); // returns false
         * $state.includes("item.**"); // returns false
         * ```
         *
         * @param stateOrName A partial name, relative name, glob pattern,
         *   or state object to be searched for within the current state name.
         * @param params A param object, e.g. `{sectionId: section.id}`,
         *   that you'd like to test against the current active state.
         * @param options An options object. The options are:
         *   - `relative`: If `stateOrName` is a relative state name and `options.relative` is set, .is will
         *     test relative to `options.relative` state (or name).
         *
         * @returns {boolean} Returns true if it does include the state
         */
        StateService.prototype.includes = function (stateOrName, params, options) {
            options = defaults(options, { relative: this.$current });
            var glob = isString(stateOrName) && Glob.fromString(stateOrName);
            if (glob) {
                if (!glob.matches(this.$current.name))
                    return false;
                stateOrName = this.$current.name;
            }
            var state = this.router.stateRegistry.matcher.find(stateOrName, options.relative), include = this.$current.includes;
            if (!isDefined(state))
                return undefined;
            if (!isDefined(include[state.name]))
                return false;
            if (!params)
                return true;
            var schema = state.parameters({ inherit: true, matchingKeys: params });
            return Param.equals(schema, Param.values(schema, params), this.params);
        };
        /**
         * Generates a URL for a state and parameters
         *
         * Returns the url for the given state populated with the given params.
         *
         * #### Example:
         * ```js
         * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
         * ```
         *
         * @param stateOrName The state name or state object you'd like to generate a url from.
         * @param params An object of parameter values to fill the state's required parameters.
         * @param options Options object. The options are:
         *
         * @returns {string} compiled state url
         */
        StateService.prototype.href = function (stateOrName, params, options) {
            var defaultHrefOpts = {
                lossy: true,
                inherit: true,
                absolute: false,
                relative: this.$current,
            };
            options = defaults(options, defaultHrefOpts);
            params = params || {};
            var state = this.router.stateRegistry.matcher.find(stateOrName, options.relative);
            if (!isDefined(state))
                return null;
            if (options.inherit)
                params = this.params.$inherit(params, this.$current, state);
            var nav = state && options.lossy ? state.navigable : state;
            if (!nav || nav.url === undefined || nav.url === null) {
                return null;
            }
            return this.router.urlRouter.href(nav.url, params, {
                absolute: options.absolute,
            });
        };
        /**
         * Sets or gets the default [[transitionTo]] error handler.
         *
         * The error handler is called when a [[Transition]] is rejected or when any error occurred during the Transition.
         * This includes errors caused by resolves and transition hooks.
         *
         * Note:
         * This handler does not receive certain Transition rejections.
         * Redirected and Ignored Transitions are not considered to be errors by [[StateService.transitionTo]].
         *
         * The built-in default error handler logs the error to the console.
         *
         * You can provide your own custom handler.
         *
         * #### Example:
         * ```js
         * stateService.defaultErrorHandler(function() {
         *   // Do not log transitionTo errors
         * });
         * ```
         *
         * @param handler a global error handler function
         * @returns the current global error handler
         */
        StateService.prototype.defaultErrorHandler = function (handler) {
            return (this._defaultErrorHandler = handler || this._defaultErrorHandler);
        };
        StateService.prototype.get = function (stateOrName, base) {
            var reg = this.router.stateRegistry;
            if (arguments.length === 0)
                return reg.get();
            return reg.get(stateOrName, base || this.$current);
        };
        /**
         * Lazy loads a state
         *
         * Explicitly runs a state's [[StateDeclaration.lazyLoad]] function.
         *
         * @param stateOrName the state that should be lazy loaded
         * @param transition the optional Transition context to use (if the lazyLoad function requires an injector, etc)
         * Note: If no transition is provided, a noop transition is created using the from the current state to the current state.
         * This noop transition is not actually run.
         *
         * @returns a promise to lazy load
         */
        StateService.prototype.lazyLoad = function (stateOrName, transition) {
            var state = this.get(stateOrName);
            if (!state || !state.lazyLoad)
                throw new Error('Can not lazy load ' + stateOrName);
            var currentPath = this.getCurrentPath();
            var target = PathUtils.makeTargetState(this.router.stateRegistry, currentPath);
            transition = transition || this.router.transitionService.create(currentPath, target);
            return lazyLoadState(transition, state);
        };
        return StateService;
    }());

    /**
     * # Transition subsystem
     *
     * This module contains APIs related to a Transition.
     *
     * See:
     * - [[TransitionService]]
     * - [[Transition]]
     * - [[HookFn]], [[TransitionHookFn]], [[TransitionStateHookFn]], [[HookMatchCriteria]], [[HookResult]]
     *
     * @coreapi
     * @preferred
     * @module transition
     */ /** for typedoc */

    /**
     * @internalapi
     * @module vanilla
     */
    /**
     * An angular1-like promise api
     *
     * This object implements four methods similar to the
     * [angular 1 promise api](https://docs.angularjs.org/api/ng/service/$q)
     *
     * UI-Router evolved from an angular 1 library to a framework agnostic library.
     * However, some of the `@uirouter/core` code uses these ng1 style APIs to support ng1 style dependency injection.
     *
     * This API provides native ES6 promise support wrapped as a $q-like API.
     * Internally, UI-Router uses this $q object to perform promise operations.
     * The `angular-ui-router` (ui-router for angular 1) uses the $q API provided by angular.
     *
     * $q-like promise api
     */
    var $q = {
        /** Normalizes a value as a promise */
        when: function (val$$1) { return new Promise(function (resolve, reject) { return resolve(val$$1); }); },
        /** Normalizes a value as a promise rejection */
        reject: function (val$$1) {
            return new Promise(function (resolve, reject) {
                reject(val$$1);
            });
        },
        /** @returns a deferred object, which has `resolve` and `reject` functions */
        defer: function () {
            var deferred = {};
            deferred.promise = new Promise(function (resolve, reject) {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
            return deferred;
        },
        /** Like Promise.all(), but also supports object key/promise notation like $q */
        all: function (promises) {
            if (isArray(promises)) {
                return Promise.all(promises);
            }
            if (isObject(promises)) {
                // Convert promises map to promises array.
                // When each promise resolves, map it to a tuple { key: key, val: val }
                var chain = Object.keys(promises).map(function (key) { return promises[key].then(function (val$$1) { return ({ key: key, val: val$$1 }); }); });
                // Then wait for all promises to resolve, and convert them back to an object
                return $q.all(chain).then(function (values$$1) {
                    return values$$1.reduce(function (acc, tuple) {
                        acc[tuple.key] = tuple.val;
                        return acc;
                    }, {});
                });
            }
        },
    };

    /**
     * @internalapi
     * @module vanilla
     */
    // globally available injectables
    var globals = {};
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    /**
     * A basic angular1-like injector api
     *
     * This object implements four methods similar to the
     * [angular 1 dependency injector](https://docs.angularjs.org/api/auto/service/$injector)
     *
     * UI-Router evolved from an angular 1 library to a framework agnostic library.
     * However, some of the `@uirouter/core` code uses these ng1 style APIs to support ng1 style dependency injection.
     *
     * This object provides a naive implementation of a globally scoped dependency injection system.
     * It supports the following DI approaches:
     *
     * ### Function parameter names
     *
     * A function's `.toString()` is called, and the parameter names are parsed.
     * This only works when the parameter names aren't "mangled" by a minifier such as UglifyJS.
     *
     * ```js
     * function injectedFunction(FooService, BarService) {
     *   // FooService and BarService are injected
     * }
     * ```
     *
     * ### Function annotation
     *
     * A function may be annotated with an array of dependency names as the `$inject` property.
     *
     * ```js
     * injectedFunction.$inject = [ 'FooService', 'BarService' ];
     * function injectedFunction(fs, bs) {
     *   // FooService and BarService are injected as fs and bs parameters
     * }
     * ```
     *
     * ### Array notation
     *
     * An array provides the names of the dependencies to inject (as strings).
     * The function is the last element of the array.
     *
     * ```js
     * [ 'FooService', 'BarService', function (fs, bs) {
     *   // FooService and BarService are injected as fs and bs parameters
     * }]
     * ```
     *
     * @type {$InjectorLike}
     */
    var $injector = {
        /** Gets an object from DI based on a string token */
        get: function (name) { return globals[name]; },
        /** Returns true if an object named `name` exists in global DI */
        has: function (name) { return $injector.get(name) != null; },
        /**
         * Injects a function
         *
         * @param fn the function to inject
         * @param context the function's `this` binding
         * @param locals An object with additional DI tokens and values, such as `{ someToken: { foo: 1 } }`
         */
        invoke: function (fn, context, locals) {
            var all$$1 = extend({}, globals, locals || {});
            var params = $injector.annotate(fn);
            var ensureExist = assertPredicate(function (key) { return all$$1.hasOwnProperty(key); }, function (key) { return "DI can't find injectable: '" + key + "'"; });
            var args = params.filter(ensureExist).map(function (x) { return all$$1[x]; });
            if (isFunction(fn))
                return fn.apply(context, args);
            else
                return fn.slice(-1)[0].apply(context, args);
        },
        /**
         * Returns a function's dependencies
         *
         * Analyzes a function (or array) and returns an array of DI tokens that the function requires.
         * @return an array of `string`s
         */
        annotate: function (fn) {
            if (!isInjectable(fn))
                throw new Error("Not an injectable function: " + fn);
            if (fn && fn.$inject)
                return fn.$inject;
            if (isArray(fn))
                return fn.slice(0, -1);
            var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
            var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
            return result || [];
        },
    };

    /**
     * @internalapi
     * @module vanilla
     */
    var keyValsToObjectR = function (accum, _a) {
        var key = _a[0], val$$1 = _a[1];
        if (!accum.hasOwnProperty(key)) {
            accum[key] = val$$1;
        }
        else if (isArray(accum[key])) {
            accum[key].push(val$$1);
        }
        else {
            accum[key] = [accum[key], val$$1];
        }
        return accum;
    };
    var getParams = function (queryString) {
        return queryString
            .split('&')
            .filter(identity)
            .map(splitEqual)
            .reduce(keyValsToObjectR, {});
    };
    function parseUrl$1(url) {
        var orEmptyString = function (x) { return x || ''; };
        var _a = splitHash(url).map(orEmptyString), beforehash = _a[0], hash = _a[1];
        var _b = splitQuery(beforehash).map(orEmptyString), path = _b[0], search = _b[1];
        return { path: path, search: search, hash: hash, url: url };
    }
    var buildUrl = function (loc) {
        var path = loc.path();
        var searchObject = loc.search();
        var hash = loc.hash();
        var search = Object.keys(searchObject)
            .map(function (key) {
            var param = searchObject[key];
            var vals = isArray(param) ? param : [param];
            return vals.map(function (val$$1) { return key + '=' + val$$1; });
        })
            .reduce(unnestR, [])
            .join('&');
        return path + (search ? '?' + search : '') + (hash ? '#' + hash : '');
    };
    function locationPluginFactory(name, isHtml5, serviceClass, configurationClass) {
        return function (uiRouter) {
            var service = (uiRouter.locationService = new serviceClass(uiRouter));
            var configuration = (uiRouter.locationConfig = new configurationClass(uiRouter, isHtml5));
            function dispose(router) {
                router.dispose(service);
                router.dispose(configuration);
            }
            return { name: name, service: service, configuration: configuration, dispose: dispose };
        };
    }

    /**
     * @internalapi
     * @module vanilla
     */ /** */
    /** A base `LocationServices` */
    var BaseLocationServices = /** @class */ (function () {
        function BaseLocationServices(router, fireAfterUpdate) {
            var _this = this;
            this.fireAfterUpdate = fireAfterUpdate;
            this._listeners = [];
            this._listener = function (evt) { return _this._listeners.forEach(function (cb) { return cb(evt); }); };
            this.hash = function () { return parseUrl$1(_this._get()).hash; };
            this.path = function () { return parseUrl$1(_this._get()).path; };
            this.search = function () { return getParams(parseUrl$1(_this._get()).search); };
            this._location = root.location;
            this._history = root.history;
        }
        BaseLocationServices.prototype.url = function (url, replace) {
            if (replace === void 0) { replace = true; }
            if (isDefined(url) && url !== this._get()) {
                this._set(null, null, url, replace);
                if (this.fireAfterUpdate) {
                    this._listeners.forEach(function (cb) { return cb({ url: url }); });
                }
            }
            return buildUrl(this);
        };
        BaseLocationServices.prototype.onChange = function (cb) {
            var _this = this;
            this._listeners.push(cb);
            return function () { return removeFrom(_this._listeners, cb); };
        };
        BaseLocationServices.prototype.dispose = function (router) {
            deregAll(this._listeners);
        };
        return BaseLocationServices;
    }());

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /** A `LocationServices` that uses the browser hash "#" to get/set the current location */
    var HashLocationService = /** @class */ (function (_super) {
        __extends(HashLocationService, _super);
        function HashLocationService(router) {
            var _this = _super.call(this, router, false) || this;
            root.addEventListener('hashchange', _this._listener, false);
            return _this;
        }
        HashLocationService.prototype._get = function () {
            return trimHashVal(this._location.hash);
        };
        HashLocationService.prototype._set = function (state, title, url, replace) {
            this._location.hash = url;
        };
        HashLocationService.prototype.dispose = function (router) {
            _super.prototype.dispose.call(this, router);
            root.removeEventListener('hashchange', this._listener);
        };
        return HashLocationService;
    }(BaseLocationServices));

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /** A `LocationServices` that gets/sets the current location from an in-memory object */
    var MemoryLocationService = /** @class */ (function (_super) {
        __extends$1(MemoryLocationService, _super);
        function MemoryLocationService(router) {
            return _super.call(this, router, true) || this;
        }
        MemoryLocationService.prototype._get = function () {
            return this._url;
        };
        MemoryLocationService.prototype._set = function (state, title, url, replace) {
            this._url = url;
        };
        return MemoryLocationService;
    }(BaseLocationServices));

    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * A `LocationServices` that gets/sets the current location using the browser's `location` and `history` apis
     *
     * Uses `history.pushState` and `history.replaceState`
     */
    var PushStateLocationService = /** @class */ (function (_super) {
        __extends$2(PushStateLocationService, _super);
        function PushStateLocationService(router) {
            var _this = _super.call(this, router, true) || this;
            _this._config = router.urlService.config;
            root.addEventListener('popstate', _this._listener, false);
            return _this;
        }
        /**
         * Gets the base prefix without:
         * - trailing slash
         * - trailing filename
         * - protocol and hostname
         *
         * If <base href='/base/'>, this returns '/base'.
         * If <base href='/foo/base/'>, this returns '/foo/base'.
         * If <base href='/base/index.html'>, this returns '/base'.
         * If <base href='http://localhost:8080/base/index.html'>, this returns '/base'.
         * If <base href='/base'>, this returns ''.
         * If <base href='http://localhost:8080'>, this returns ''.
         * If <base href='http://localhost:8080/'>, this returns ''.
         *
         * See: https://html.spec.whatwg.org/dev/semantics.html#the-base-element
         */
        PushStateLocationService.prototype._getBasePrefix = function () {
            return stripLastPathElement(this._config.baseHref());
        };
        PushStateLocationService.prototype._get = function () {
            var _a = this._location, pathname = _a.pathname, hash = _a.hash, search = _a.search;
            search = splitQuery(search)[1]; // strip ? if found
            hash = splitHash(hash)[1]; // strip # if found
            var basePrefix = this._getBasePrefix();
            var exactBaseHrefMatch = pathname === this._config.baseHref();
            var startsWithBase = pathname.substr(0, basePrefix.length) === basePrefix;
            pathname = exactBaseHrefMatch ? '/' : startsWithBase ? pathname.substring(basePrefix.length) : pathname;
            return pathname + (search ? '?' + search : '') + (hash ? '#' + hash : '');
        };
        PushStateLocationService.prototype._set = function (state, title, url, replace) {
            var basePrefix = this._getBasePrefix();
            var slash = url && url[0] !== '/' ? '/' : '';
            var fullUrl = url === '' || url === '/' ? this._config.baseHref() : basePrefix + slash + url;
            if (replace) {
                this._history.replaceState(state, title, fullUrl);
            }
            else {
                this._history.pushState(state, title, fullUrl);
            }
        };
        PushStateLocationService.prototype.dispose = function (router) {
            _super.prototype.dispose.call(this, router);
            root.removeEventListener('popstate', this._listener);
        };
        return PushStateLocationService;
    }(BaseLocationServices));

    /** A `LocationConfig` mock that gets/sets all config from an in-memory object */
    var MemoryLocationConfig = /** @class */ (function () {
        function MemoryLocationConfig() {
            var _this = this;
            this.dispose = noop;
            this._baseHref = '';
            this._port = 80;
            this._protocol = 'http';
            this._host = 'localhost';
            this._hashPrefix = '';
            this.port = function () { return _this._port; };
            this.protocol = function () { return _this._protocol; };
            this.host = function () { return _this._host; };
            this.baseHref = function () { return _this._baseHref; };
            this.html5Mode = function () { return false; };
            this.hashPrefix = function (newval) { return (isDefined(newval) ? (_this._hashPrefix = newval) : _this._hashPrefix); };
        }
        return MemoryLocationConfig;
    }());

    /**
     * @internalapi
     * @module vanilla
     */
    /** A `LocationConfig` that delegates to the browser's `location` object */
    var BrowserLocationConfig = /** @class */ (function () {
        function BrowserLocationConfig(router, _isHtml5) {
            if (_isHtml5 === void 0) { _isHtml5 = false; }
            this._isHtml5 = _isHtml5;
            this._baseHref = undefined;
            this._hashPrefix = '';
        }
        BrowserLocationConfig.prototype.port = function () {
            if (location.port) {
                return Number(location.port);
            }
            return this.protocol() === 'https' ? 443 : 80;
        };
        BrowserLocationConfig.prototype.protocol = function () {
            return location.protocol.replace(/:/g, '');
        };
        BrowserLocationConfig.prototype.host = function () {
            return location.hostname;
        };
        BrowserLocationConfig.prototype.html5Mode = function () {
            return this._isHtml5;
        };
        BrowserLocationConfig.prototype.hashPrefix = function (newprefix) {
            return isDefined(newprefix) ? (this._hashPrefix = newprefix) : this._hashPrefix;
        };
        BrowserLocationConfig.prototype.baseHref = function (href) {
            if (isDefined(href))
                this._baseHref = href;
            if (isUndefined(this._baseHref))
                this._baseHref = this.getBaseHref();
            return this._baseHref;
        };
        BrowserLocationConfig.prototype.getBaseHref = function () {
            var baseTag = document.getElementsByTagName('base')[0];
            if (!baseTag || !baseTag.href)
                return location.pathname || '/';
            return baseTag.href.replace(/^(https?:)?\/\/[^/]*/, '');
        };
        BrowserLocationConfig.prototype.dispose = function () { };
        return BrowserLocationConfig;
    }());

    /**
     * @internalapi
     * @module vanilla
     */
    function servicesPlugin(router) {
        services.$injector = $injector;
        services.$q = $q;
        return { name: 'vanilla.services', $q: $q, $injector: $injector, dispose: function () { return null; } };
    }
    /** A `UIRouterPlugin` uses the browser hash to get/set the current location */
    var hashLocationPlugin = locationPluginFactory('vanilla.hashBangLocation', false, HashLocationService, BrowserLocationConfig);
    /** A `UIRouterPlugin` that gets/sets the current location using the browser's `location` and `history` apis */
    var pushStateLocationPlugin = locationPluginFactory('vanilla.pushStateLocation', true, PushStateLocationService, BrowserLocationConfig);
    /** A `UIRouterPlugin` that gets/sets the current location from an in-memory object */
    var memoryLocationPlugin = locationPluginFactory('vanilla.memoryLocation', false, MemoryLocationService, MemoryLocationConfig);

    /**
     * @internalapi
     * @module vanilla
     */

    /**
     * # Core classes and interfaces
     *
     * The classes and interfaces that are core to ui-router and do not belong
     * to a more specific subsystem (such as resolve).
     *
     * @coreapi
     * @preferred
     * @module core
     */ /** for typedoc */
    /** @internalapi */
    var UIRouterPluginBase = /** @class */ (function () {
        function UIRouterPluginBase() {
        }
        UIRouterPluginBase.prototype.dispose = function (router) { };
        return UIRouterPluginBase;
    }());

    /**
     * @coreapi
     * @module common
     */ /** */

    var index = /*#__PURE__*/Object.freeze({
        root: root,
        fromJson: fromJson,
        toJson: toJson,
        forEach: forEach,
        extend: extend,
        equals: equals,
        identity: identity,
        noop: noop,
        createProxyFunctions: createProxyFunctions,
        inherit: inherit,
        inArray: inArray,
        _inArray: _inArray,
        removeFrom: removeFrom,
        _removeFrom: _removeFrom,
        pushTo: pushTo,
        _pushTo: _pushTo,
        deregAll: deregAll,
        defaults: defaults,
        mergeR: mergeR,
        ancestors: ancestors,
        pick: pick,
        omit: omit,
        pluck: pluck,
        filter: filter,
        find: find,
        mapObj: mapObj,
        map: map,
        values: values,
        allTrueR: allTrueR,
        anyTrueR: anyTrueR,
        unnestR: unnestR,
        flattenR: flattenR,
        pushR: pushR,
        uniqR: uniqR,
        unnest: unnest,
        flatten: flatten,
        assertPredicate: assertPredicate,
        assertMap: assertMap,
        assertFn: assertFn,
        pairs: pairs,
        arrayTuples: arrayTuples,
        applyPairs: applyPairs,
        tail: tail,
        copy: copy,
        _extend: _extend,
        silenceUncaughtInPromise: silenceUncaughtInPromise,
        silentRejection: silentRejection,
        notImplemented: notImplemented,
        services: services,
        Glob: Glob,
        curry: curry,
        compose: compose,
        pipe: pipe,
        prop: prop,
        propEq: propEq,
        parse: parse,
        not: not,
        and: and,
        or: or,
        all: all,
        any: any,
        is: is,
        eq: eq,
        val: val,
        invoke: invoke,
        pattern: pattern,
        isUndefined: isUndefined,
        isDefined: isDefined,
        isNull: isNull,
        isNullOrUndefined: isNullOrUndefined,
        isFunction: isFunction,
        isNumber: isNumber,
        isString: isString,
        isObject: isObject,
        isArray: isArray,
        isDate: isDate,
        isRegExp: isRegExp,
        isInjectable: isInjectable,
        isPromise: isPromise,
        Queue: Queue,
        maxLength: maxLength,
        padString: padString,
        kebobString: kebobString,
        functionToString: functionToString,
        fnToString: fnToString,
        stringify: stringify,
        beforeAfterSubstr: beforeAfterSubstr,
        hostRegex: hostRegex,
        stripLastPathElement: stripLastPathElement,
        splitHash: splitHash,
        splitQuery: splitQuery,
        splitEqual: splitEqual,
        trimHashVal: trimHashVal,
        splitOnDelim: splitOnDelim,
        joinNeighborsR: joinNeighborsR,
        get Category () { return exports.Category; },
        Trace: Trace,
        trace: trace,
        get DefType () { return exports.DefType; },
        Param: Param,
        ParamTypes: ParamTypes,
        StateParams: StateParams,
        ParamType: ParamType,
        PathNode: PathNode,
        PathUtils: PathUtils,
        resolvePolicies: resolvePolicies,
        defaultResolvePolicy: defaultResolvePolicy,
        Resolvable: Resolvable,
        NATIVE_INJECTOR_TOKEN: NATIVE_INJECTOR_TOKEN,
        ResolveContext: ResolveContext,
        resolvablesBuilder: resolvablesBuilder,
        StateBuilder: StateBuilder,
        StateObject: StateObject,
        StateMatcher: StateMatcher,
        StateQueueManager: StateQueueManager,
        StateRegistry: StateRegistry,
        StateService: StateService,
        TargetState: TargetState,
        get TransitionHookPhase () { return exports.TransitionHookPhase; },
        get TransitionHookScope () { return exports.TransitionHookScope; },
        HookBuilder: HookBuilder,
        matchState: matchState,
        RegisteredHook: RegisteredHook,
        makeEvent: makeEvent,
        get RejectType () { return exports.RejectType; },
        Rejection: Rejection,
        Transition: Transition,
        TransitionHook: TransitionHook,
        TransitionEventType: TransitionEventType,
        defaultTransOpts: defaultTransOpts,
        TransitionService: TransitionService,
        UrlMatcher: UrlMatcher,
        ParamFactory: ParamFactory,
        UrlMatcherFactory: UrlMatcherFactory,
        UrlRouter: UrlRouter,
        UrlRuleFactory: UrlRuleFactory,
        BaseUrlRule: BaseUrlRule,
        UrlService: UrlService,
        ViewService: ViewService,
        UIRouterGlobals: UIRouterGlobals,
        UIRouter: UIRouter,
        $q: $q,
        $injector: $injector,
        BaseLocationServices: BaseLocationServices,
        HashLocationService: HashLocationService,
        MemoryLocationService: MemoryLocationService,
        PushStateLocationService: PushStateLocationService,
        MemoryLocationConfig: MemoryLocationConfig,
        BrowserLocationConfig: BrowserLocationConfig,
        keyValsToObjectR: keyValsToObjectR,
        getParams: getParams,
        parseUrl: parseUrl$1,
        buildUrl: buildUrl,
        locationPluginFactory: locationPluginFactory,
        servicesPlugin: servicesPlugin,
        hashLocationPlugin: hashLocationPlugin,
        pushStateLocationPlugin: pushStateLocationPlugin,
        memoryLocationPlugin: memoryLocationPlugin,
        UIRouterPluginBase: UIRouterPluginBase
    });

    function getNg1ViewConfigFactory() {
        var templateFactory = null;
        return function (path, view) {
            templateFactory = templateFactory || services.$injector.get('$templateFactory');
            return [new Ng1ViewConfig(path, view, templateFactory)];
        };
    }
    var hasAnyKey = function (keys, obj) { return keys.reduce(function (acc, key) { return acc || isDefined(obj[key]); }, false); };
    /**
     * This is a [[StateBuilder.builder]] function for angular1 `views`.
     *
     * When the [[StateBuilder]] builds a [[StateObject]] object from a raw [[StateDeclaration]], this builder
     * handles the `views` property with logic specific to @uirouter/angularjs (ng1).
     *
     * If no `views: {}` property exists on the [[StateDeclaration]], then it creates the `views` object
     * and applies the state-level configuration to a view named `$default`.
     */
    function ng1ViewsBuilder(state) {
        // Do not process root state
        if (!state.parent)
            return {};
        var tplKeys = ['templateProvider', 'templateUrl', 'template', 'notify', 'async'], ctrlKeys = ['controller', 'controllerProvider', 'controllerAs', 'resolveAs'], compKeys = ['component', 'bindings', 'componentProvider'], nonCompKeys = tplKeys.concat(ctrlKeys), allViewKeys = compKeys.concat(nonCompKeys);
        // Do not allow a state to have both state-level props and also a `views: {}` property.
        // A state without a `views: {}` property can declare properties for the `$default` view as properties of the state.
        // However, the `$default` approach should not be mixed with a separate `views: ` block.
        if (isDefined(state.views) && hasAnyKey(allViewKeys, state)) {
            throw new Error("State '" + state.name + "' has a 'views' object. " +
                "It cannot also have \"view properties\" at the state level.  " +
                "Move the following properties into a view (in the 'views' object): " +
                (" " + allViewKeys.filter(function (key) { return isDefined(state[key]); }).join(', ')));
        }
        var views = {}, viewsObject = state.views || { $default: pick(state, allViewKeys) };
        forEach(viewsObject, function (config, name) {
            // Account for views: { "": { template... } }
            name = name || '$default';
            // Account for views: { header: "headerComponent" }
            if (isString(config))
                config = { component: config };
            // Make a shallow copy of the config object
            config = extend({}, config);
            // Do not allow a view to mix props for component-style view with props for template/controller-style view
            if (hasAnyKey(compKeys, config) && hasAnyKey(nonCompKeys, config)) {
                throw new Error("Cannot combine: " + compKeys.join('|') + " with: " + nonCompKeys.join('|') + " in stateview: '" + name + "@" + state.name + "'");
            }
            config.resolveAs = config.resolveAs || '$resolve';
            config.$type = 'ng1';
            config.$context = state;
            config.$name = name;
            var normalized = ViewService.normalizeUIViewTarget(config.$context, config.$name);
            config.$uiViewName = normalized.uiViewName;
            config.$uiViewContextAnchor = normalized.uiViewContextAnchor;
            views[name] = config;
        });
        return views;
    }
    var id$1 = 0;
    var Ng1ViewConfig = /** @class */ (function () {
        function Ng1ViewConfig(path, viewDecl, factory) {
            var _this = this;
            this.path = path;
            this.viewDecl = viewDecl;
            this.factory = factory;
            this.$id = id$1++;
            this.loaded = false;
            this.getTemplate = function (uiView, context) {
                return _this.component
                    ? _this.factory.makeComponentTemplate(uiView, context, _this.component, _this.viewDecl.bindings)
                    : _this.template;
            };
        }
        Ng1ViewConfig.prototype.load = function () {
            var _this = this;
            var $q$$1 = services.$q;
            var context = new ResolveContext(this.path);
            var params = this.path.reduce(function (acc, node) { return extend(acc, node.paramValues); }, {});
            var promises = {
                template: $q$$1.when(this.factory.fromConfig(this.viewDecl, params, context)),
                controller: $q$$1.when(this.getController(context)),
            };
            return $q$$1.all(promises).then(function (results) {
                trace.traceViewServiceEvent('Loaded', _this);
                _this.controller = results.controller;
                extend(_this, results.template); // Either { template: "tpl" } or { component: "cmpName" }
                return _this;
            });
        };
        /**
         * Gets the controller for a view configuration.
         *
         * @returns {Function|Promise.<Function>} Returns a controller, or a promise that resolves to a controller.
         */
        Ng1ViewConfig.prototype.getController = function (context) {
            var provider = this.viewDecl.controllerProvider;
            if (!isInjectable(provider))
                return this.viewDecl.controller;
            var deps = services.$injector.annotate(provider);
            var providerFn = isArray(provider) ? tail(provider) : provider;
            var resolvable = new Resolvable('', providerFn, deps);
            return resolvable.get(context);
        };
        return Ng1ViewConfig;
    }());

    /** @module view */
    /**
     * Service which manages loading of templates from a ViewConfig.
     */
    var TemplateFactory = /** @class */ (function () {
        function TemplateFactory() {
            var _this = this;
            /** @hidden */ this._useHttp = ng.version.minor < 3;
            /** @hidden */ this.$get = [
                '$http',
                '$templateCache',
                '$injector',
                function ($http, $templateCache, $injector$$1) {
                    _this.$templateRequest = $injector$$1.has && $injector$$1.has('$templateRequest') && $injector$$1.get('$templateRequest');
                    _this.$http = $http;
                    _this.$templateCache = $templateCache;
                    return _this;
                },
            ];
        }
        /** @hidden */
        TemplateFactory.prototype.useHttpService = function (value) {
            this._useHttp = value;
        };
        /**
         * Creates a template from a configuration object.
         *
         * @param config Configuration object for which to load a template.
         * The following properties are search in the specified order, and the first one
         * that is defined is used to create the template:
         *
         * @param params  Parameters to pass to the template function.
         * @param context The resolve context associated with the template's view
         *
         * @return {string|object}  The template html as a string, or a promise for
         * that string,or `null` if no template is configured.
         */
        TemplateFactory.prototype.fromConfig = function (config, params, context) {
            var defaultTemplate = '<ui-view></ui-view>';
            var asTemplate = function (result) { return services.$q.when(result).then(function (str) { return ({ template: str }); }); };
            var asComponent = function (result) { return services.$q.when(result).then(function (str) { return ({ component: str }); }); };
            return isDefined(config.template)
                ? asTemplate(this.fromString(config.template, params))
                : isDefined(config.templateUrl)
                    ? asTemplate(this.fromUrl(config.templateUrl, params))
                    : isDefined(config.templateProvider)
                        ? asTemplate(this.fromProvider(config.templateProvider, params, context))
                        : isDefined(config.component)
                            ? asComponent(config.component)
                            : isDefined(config.componentProvider)
                                ? asComponent(this.fromComponentProvider(config.componentProvider, params, context))
                                : asTemplate(defaultTemplate);
        };
        /**
         * Creates a template from a string or a function returning a string.
         *
         * @param template html template as a string or function that returns an html template as a string.
         * @param params Parameters to pass to the template function.
         *
         * @return {string|object} The template html as a string, or a promise for that
         * string.
         */
        TemplateFactory.prototype.fromString = function (template, params) {
            return isFunction(template) ? template(params) : template;
        };
        /**
         * Loads a template from the a URL via `$http` and `$templateCache`.
         *
         * @param {string|Function} url url of the template to load, or a function
         * that returns a url.
         * @param {Object} params Parameters to pass to the url function.
         * @return {string|Promise.<string>} The template html as a string, or a promise
         * for that string.
         */
        TemplateFactory.prototype.fromUrl = function (url, params) {
            if (isFunction(url))
                url = url(params);
            if (url == null)
                return null;
            if (this._useHttp) {
                return this.$http
                    .get(url, { cache: this.$templateCache, headers: { Accept: 'text/html' } })
                    .then(function (response) {
                    return response.data;
                });
            }
            return this.$templateRequest(url);
        };
        /**
         * Creates a template by invoking an injectable provider function.
         *
         * @param provider Function to invoke via `locals`
         * @param {Function} injectFn a function used to invoke the template provider
         * @return {string|Promise.<string>} The template html as a string, or a promise
         * for that string.
         */
        TemplateFactory.prototype.fromProvider = function (provider, params, context) {
            var deps = services.$injector.annotate(provider);
            var providerFn = isArray(provider) ? tail(provider) : provider;
            var resolvable = new Resolvable('', providerFn, deps);
            return resolvable.get(context);
        };
        /**
         * Creates a component's template by invoking an injectable provider function.
         *
         * @param provider Function to invoke via `locals`
         * @param {Function} injectFn a function used to invoke the template provider
         * @return {string} The template html as a string: "<component-name input1='::$resolve.foo'></component-name>".
         */
        TemplateFactory.prototype.fromComponentProvider = function (provider, params, context) {
            var deps = services.$injector.annotate(provider);
            var providerFn = isArray(provider) ? tail(provider) : provider;
            var resolvable = new Resolvable('', providerFn, deps);
            return resolvable.get(context);
        };
        /**
         * Creates a template from a component's name
         *
         * This implements route-to-component.
         * It works by retrieving the component (directive) metadata from the injector.
         * It analyses the component's bindings, then constructs a template that instantiates the component.
         * The template wires input and output bindings to resolves or from the parent component.
         *
         * @param uiView {object} The parent ui-view (for binding outputs to callbacks)
         * @param context The ResolveContext (for binding outputs to callbacks returned from resolves)
         * @param component {string} Component's name in camel case.
         * @param bindings An object defining the component's bindings: {foo: '<'}
         * @return {string} The template as a string: "<component-name input1='::$resolve.foo'></component-name>".
         */
        TemplateFactory.prototype.makeComponentTemplate = function (uiView, context, component, bindings) {
            bindings = bindings || {};
            // Bind once prefix
            var prefix = ng.version.minor >= 3 ? '::' : '';
            // Convert to kebob name. Add x- prefix if the string starts with `x-` or `data-`
            var kebob = function (camelCase) {
                var kebobed = kebobString(camelCase);
                return /^(x|data)-/.exec(kebobed) ? "x-" + kebobed : kebobed;
            };
            var attributeTpl = function (input) {
                var name = input.name, type = input.type;
                var attrName = kebob(name);
                // If the ui-view has an attribute which matches a binding on the routed component
                // then pass that attribute through to the routed component template.
                // Prefer ui-view wired mappings to resolve data, unless the resolve was explicitly bound using `bindings:`
                if (uiView.attr(attrName) && !bindings[name])
                    return attrName + "='" + uiView.attr(attrName) + "'";
                var resolveName = bindings[name] || name;
                // Pre-evaluate the expression for "@" bindings by enclosing in {{ }}
                // some-attr="{{ ::$resolve.someResolveName }}"
                if (type === '@')
                    return attrName + "='{{" + prefix + "$resolve." + resolveName + "}}'";
                // Wire "&" callbacks to resolves that return a callback function
                // Get the result of the resolve (should be a function) and annotate it to get its arguments.
                // some-attr="$resolve.someResolveResultName(foo, bar)"
                if (type === '&') {
                    var res = context.getResolvable(resolveName);
                    var fn = res && res.data;
                    var args = (fn && services.$injector.annotate(fn)) || [];
                    // account for array style injection, i.e., ['foo', function(foo) {}]
                    var arrayIdxStr = isArray(fn) ? "[" + (fn.length - 1) + "]" : '';
                    return attrName + "='$resolve." + resolveName + arrayIdxStr + "(" + args.join(',') + ")'";
                }
                // some-attr="::$resolve.someResolveName"
                return attrName + "='" + prefix + "$resolve." + resolveName + "'";
            };
            var attrs = getComponentBindings(component)
                .map(attributeTpl)
                .join(' ');
            var kebobName = kebob(component);
            return "<" + kebobName + " " + attrs + "></" + kebobName + ">";
        };
        return TemplateFactory;
    }());
    // Gets all the directive(s)' inputs ('@', '=', and '<') and outputs ('&')
    function getComponentBindings(name) {
        var cmpDefs = services.$injector.get(name + 'Directive'); // could be multiple
        if (!cmpDefs || !cmpDefs.length)
            throw new Error("Unable to find component named '" + name + "'");
        return cmpDefs.map(getBindings).reduce(unnestR, []);
    }
    // Given a directive definition, find its object input attributes
    // Use different properties, depending on the type of directive (component, bindToController, normal)
    var getBindings = function (def) {
        if (isObject(def.bindToController))
            return scopeBindings(def.bindToController);
        return scopeBindings(def.scope);
    };
    // for ng 1.2 style, process the scope: { input: "=foo" }
    // for ng 1.3 through ng 1.5, process the component's bindToController: { input: "=foo" } object
    var scopeBindings = function (bindingsObj) {
        return Object.keys(bindingsObj || {})
            // [ 'input', [ '=foo', '=', 'foo' ] ]
            .map(function (key) { return [key, /^([=<@&])[?]?(.*)/.exec(bindingsObj[key])]; })
            // skip malformed values
            .filter(function (tuple) { return isDefined(tuple) && isArray(tuple[1]); })
            // { name: ('foo' || 'input'), type: '=' }
            .map(function (tuple) { return ({ name: tuple[1][2] || tuple[0], type: tuple[1][1] }); });
    };

    /** @module ng1 */ /** for typedoc */
    /**
     * The Angular 1 `StateProvider`
     *
     * The `$stateProvider` works similar to Angular's v1 router, but it focuses purely
     * on state.
     *
     * A state corresponds to a "place" in the application in terms of the overall UI and
     * navigation. A state describes (via the controller / template / view properties) what
     * the UI looks like and does at that place.
     *
     * States often have things in common, and the primary way of factoring out these
     * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
     * nested states.
     *
     * The `$stateProvider` provides interfaces to declare these states for your app.
     */
    var StateProvider = /** @class */ (function () {
        function StateProvider(stateRegistry, stateService) {
            this.stateRegistry = stateRegistry;
            this.stateService = stateService;
            createProxyFunctions(val(StateProvider.prototype), this, val(this));
        }
        /**
         * Decorates states when they are registered
         *
         * Allows you to extend (carefully) or override (at your own peril) the
         * `stateBuilder` object used internally by [[StateRegistry]].
         * This can be used to add custom functionality to ui-router,
         * for example inferring templateUrl based on the state name.
         *
         * When passing only a name, it returns the current (original or decorated) builder
         * function that matches `name`.
         *
         * The builder functions that can be decorated are listed below. Though not all
         * necessarily have a good use case for decoration, that is up to you to decide.
         *
         * In addition, users can attach custom decorators, which will generate new
         * properties within the state's internal definition. There is currently no clear
         * use-case for this beyond accessing internal states (i.e. $state.$current),
         * however, expect this to become increasingly relevant as we introduce additional
         * meta-programming features.
         *
         * **Warning**: Decorators should not be interdependent because the order of
         * execution of the builder functions in non-deterministic. Builder functions
         * should only be dependent on the state definition object and super function.
         *
         *
         * Existing builder functions and current return values:
         *
         * - **parent** `{object}` - returns the parent state object.
         * - **data** `{object}` - returns state data, including any inherited data that is not
         *   overridden by own values (if any).
         * - **url** `{object}` - returns a {@link ui.router.util.type:UrlMatcher UrlMatcher}
         *   or `null`.
         * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is
         *   navigable).
         * - **params** `{object}` - returns an array of state params that are ensured to
         *   be a super-set of parent's params.
         * - **views** `{object}` - returns a views object where each key is an absolute view
         *   name (i.e. "viewName@stateName") and each value is the config object
         *   (template, controller) for the view. Even when you don't use the views object
         *   explicitly on a state config, one is still created for you internally.
         *   So by decorating this builder function you have access to decorating template
         *   and controller properties.
         * - **ownParams** `{object}` - returns an array of params that belong to the state,
         *   not including any params defined by ancestor states.
         * - **path** `{string}` - returns the full path from the root down to this state.
         *   Needed for state activation.
         * - **includes** `{object}` - returns an object that includes every state that
         *   would pass a `$state.includes()` test.
         *
         * #### Example:
         * Override the internal 'views' builder with a function that takes the state
         * definition, and a reference to the internal function being overridden:
         * ```js
         * $stateProvider.decorator('views', function (state, parent) {
         *   let result = {},
         *       views = parent(state);
         *
         *   angular.forEach(views, function (config, name) {
         *     let autoName = (state.name + '.' + name).replace('.', '/');
         *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
         *     result[name] = config;
         *   });
         *   return result;
         * });
         *
         * $stateProvider.state('home', {
         *   views: {
         *     'contact.list': { controller: 'ListController' },
         *     'contact.item': { controller: 'ItemController' }
         *   }
         * });
         * ```
         *
         *
         * ```js
         * // Auto-populates list and item views with /partials/home/contact/list.html,
         * // and /partials/home/contact/item.html, respectively.
         * $state.go('home');
         * ```
         *
         * @param {string} name The name of the builder function to decorate.
         * @param {object} func A function that is responsible for decorating the original
         * builder function. The function receives two parameters:
         *
         *   - `{object}` - state - The state config object.
         *   - `{object}` - super - The original builder function.
         *
         * @return {object} $stateProvider - $stateProvider instance
         */
        StateProvider.prototype.decorator = function (name, func) {
            return this.stateRegistry.decorator(name, func) || this;
        };
        StateProvider.prototype.state = function (name, definition) {
            if (isObject(name)) {
                definition = name;
            }
            else {
                definition.name = name;
            }
            this.stateRegistry.register(definition);
            return this;
        };
        /**
         * Registers an invalid state handler
         *
         * This is a passthrough to [[StateService.onInvalid]] for ng1.
         */
        StateProvider.prototype.onInvalid = function (callback) {
            return this.stateService.onInvalid(callback);
        };
        return StateProvider;
    }());

    /** @module ng1 */ /** */
    /**
     * This is a [[StateBuilder.builder]] function for angular1 `onEnter`, `onExit`,
     * `onRetain` callback hooks on a [[Ng1StateDeclaration]].
     *
     * When the [[StateBuilder]] builds a [[StateObject]] object from a raw [[StateDeclaration]], this builder
     * ensures that those hooks are injectable for @uirouter/angularjs (ng1).
     */
    var getStateHookBuilder = function (hookName) {
        return function stateHookBuilder(stateObject, parentFn) {
            var hook = stateObject[hookName];
            var pathname = hookName === 'onExit' ? 'from' : 'to';
            function decoratedNg1Hook(trans, state) {
                var resolveContext = new ResolveContext(trans.treeChanges(pathname));
                var subContext = resolveContext.subContext(state.$$state());
                var locals = extend(getLocals(subContext), { $state$: state, $transition$: trans });
                return services.$injector.invoke(hook, this, locals);
            }
            return hook ? decoratedNg1Hook : undefined;
        };
    };

    /**
     * @internalapi
     * @module ng1
     */ /** */
    /**
     * Implements UI-Router LocationServices and LocationConfig using Angular 1's $location service
     */
    var Ng1LocationServices = /** @class */ (function () {
        function Ng1LocationServices($locationProvider) {
            // .onChange() registry
            this._urlListeners = [];
            this.$locationProvider = $locationProvider;
            var _lp = val($locationProvider);
            createProxyFunctions(_lp, this, _lp, ['hashPrefix']);
        }
        /**
         * Applys ng1-specific path parameter encoding
         *
         * The Angular 1 `$location` service is a bit weird.
         * It doesn't allow slashes to be encoded/decoded bi-directionally.
         *
         * See the writeup at https://github.com/angular-ui/ui-router/issues/2598
         *
         * This code patches the `path` parameter type so it encoded/decodes slashes as ~2F
         *
         * @param router
         */
        Ng1LocationServices.monkeyPatchPathParameterType = function (router) {
            var pathType = router.urlMatcherFactory.type('path');
            pathType.encode = function (x) {
                return x != null ? x.toString().replace(/(~|\/)/g, function (m) { return ({ '~': '~~', '/': '~2F' }[m]); }) : x;
            };
            pathType.decode = function (x) {
                return x != null ? x.toString().replace(/(~~|~2F)/g, function (m) { return ({ '~~': '~', '~2F': '/' }[m]); }) : x;
            };
        };
        Ng1LocationServices.prototype.dispose = function () { };
        Ng1LocationServices.prototype.onChange = function (callback) {
            var _this = this;
            this._urlListeners.push(callback);
            return function () { return removeFrom(_this._urlListeners)(callback); };
        };
        Ng1LocationServices.prototype.html5Mode = function () {
            var html5Mode = this.$locationProvider.html5Mode();
            html5Mode = isObject(html5Mode) ? html5Mode.enabled : html5Mode;
            return html5Mode && this.$sniffer.history;
        };
        Ng1LocationServices.prototype.baseHref = function () {
            return this._baseHref || (this._baseHref = this.$browser.baseHref() || this.$window.location.pathname);
        };
        Ng1LocationServices.prototype.url = function (newUrl, replace, state) {
            if (replace === void 0) { replace = false; }
            if (isDefined(newUrl))
                this.$location.url(newUrl);
            if (replace)
                this.$location.replace();
            if (state)
                this.$location.state(state);
            return this.$location.url();
        };
        Ng1LocationServices.prototype._runtimeServices = function ($rootScope, $location, $sniffer, $browser, $window) {
            var _this = this;
            this.$location = $location;
            this.$sniffer = $sniffer;
            this.$browser = $browser;
            this.$window = $window;
            // Bind $locationChangeSuccess to the listeners registered in LocationService.onChange
            $rootScope.$on('$locationChangeSuccess', function (evt) { return _this._urlListeners.forEach(function (fn) { return fn(evt); }); });
            var _loc = val($location);
            // Bind these LocationService functions to $location
            createProxyFunctions(_loc, this, _loc, ['replace', 'path', 'search', 'hash']);
            // Bind these LocationConfig functions to $location
            createProxyFunctions(_loc, this, _loc, ['port', 'protocol', 'host']);
        };
        return Ng1LocationServices;
    }());

    /** @module url */ /** */
    /**
     * Manages rules for client-side URL
     *
     * ### Deprecation warning:
     * This class is now considered to be an internal API
     * Use the [[UrlService]] instead.
     * For configuring URL rules, use the [[UrlRulesApi]] which can be found as [[UrlService.rules]].
     *
     * This class manages the router rules for what to do when the URL changes.
     *
     * This provider remains for backwards compatibility.
     *
     * @deprecated
     */
    var UrlRouterProvider = /** @class */ (function () {
        /** @hidden */
        function UrlRouterProvider(router) {
            this._router = router;
            this._urlRouter = router.urlRouter;
        }
        UrlRouterProvider.injectableHandler = function (router, handler) {
            return function (match) { return services.$injector.invoke(handler, null, { $match: match, $stateParams: router.globals.params }); };
        };
        /** @hidden */
        UrlRouterProvider.prototype.$get = function () {
            var urlRouter = this._urlRouter;
            urlRouter.update(true);
            if (!urlRouter.interceptDeferred)
                urlRouter.listen();
            return urlRouter;
        };
        /**
         * Registers a url handler function.
         *
         * Registers a low level url handler (a `rule`).
         * A rule detects specific URL patterns and returns a redirect, or performs some action.
         *
         * If a rule returns a string, the URL is replaced with the string, and all rules are fired again.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   // Here's an example of how you might allow case insensitive urls
         *   $urlRouterProvider.rule(function ($injector, $location) {
         *     var path = $location.path(),
         *         normalized = path.toLowerCase();
         *
         *     if (path !== normalized) {
         *       return normalized;
         *     }
         *   });
         * });
         * ```
         *
         * @param ruleFn
         * Handler function that takes `$injector` and `$location` services as arguments.
         * You can use them to detect a url and return a different url as a string.
         *
         * @return [[UrlRouterProvider]] (`this`)
         */
        UrlRouterProvider.prototype.rule = function (ruleFn) {
            var _this = this;
            if (!isFunction(ruleFn))
                throw new Error("'rule' must be a function");
            var match = function () { return ruleFn(services.$injector, _this._router.locationService); };
            var rule = new BaseUrlRule(match, identity);
            this._urlRouter.rule(rule);
            return this;
        };
        /**
         * Defines the path or behavior to use when no url can be matched.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   // if the path doesn't match any of the urls you configured
         *   // otherwise will take care of routing the user to the
         *   // specified url
         *   $urlRouterProvider.otherwise('/index');
         *
         *   // Example of using function rule as param
         *   $urlRouterProvider.otherwise(function ($injector, $location) {
         *     return '/a/valid/url';
         *   });
         * });
         * ```
         *
         * @param rule
         * The url path you want to redirect to or a function rule that returns the url path or performs a `$state.go()`.
         * The function version is passed two params: `$injector` and `$location` services, and should return a url string.
         *
         * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
         */
        UrlRouterProvider.prototype.otherwise = function (rule) {
            var _this = this;
            var urlRouter = this._urlRouter;
            if (isString(rule)) {
                urlRouter.otherwise(rule);
            }
            else if (isFunction(rule)) {
                urlRouter.otherwise(function () { return rule(services.$injector, _this._router.locationService); });
            }
            else {
                throw new Error("'rule' must be a string or function");
            }
            return this;
        };
        /**
         * Registers a handler for a given url matching.
         *
         * If the handler is a string, it is
         * treated as a redirect, and is interpolated according to the syntax of match
         * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
         *
         * If the handler is a function, it is injectable.
         * It gets invoked if `$location` matches.
         * You have the option of inject the match object as `$match`.
         *
         * The handler can return
         *
         * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
         *   will continue trying to find another one that matches.
         * - **string** which is treated as a redirect and passed to `$location.url()`
         * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
         *     if ($state.$current.navigable !== state ||
         *         !equalForKeys($match, $stateParams) {
         *      $state.transitionTo(state, $match, false);
         *     }
         *   });
         * });
         * ```
         *
         * @param what A pattern string to match, compiled as a [[UrlMatcher]].
         * @param handler The path (or function that returns a path) that you want to redirect your user to.
         * @param ruleCallback [optional] A callback that receives the `rule` registered with [[UrlMatcher.rule]]
         *
         * Note: the handler may also invoke arbitrary code, such as `$state.go()`
         */
        UrlRouterProvider.prototype.when = function (what, handler) {
            if (isArray(handler) || isFunction(handler)) {
                handler = UrlRouterProvider.injectableHandler(this._router, handler);
            }
            this._urlRouter.when(what, handler);
            return this;
        };
        /**
         * Disables monitoring of the URL.
         *
         * Call this method before UI-Router has bootstrapped.
         * It will stop UI-Router from performing the initial url sync.
         *
         * This can be useful to perform some asynchronous initialization before the router starts.
         * Once the initialization is complete, call [[listen]] to tell UI-Router to start watching and synchronizing the URL.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   // Prevent $urlRouter from automatically intercepting URL changes;
         *   $urlRouterProvider.deferIntercept();
         * })
         *
         * app.run(function (MyService, $urlRouter, $http) {
         *   $http.get("/stuff").then(function(resp) {
         *     MyService.doStuff(resp.data);
         *     $urlRouter.listen();
         *     $urlRouter.sync();
         *   });
         * });
         * ```
         *
         * @param defer Indicates whether to defer location change interception.
         *        Passing no parameter is equivalent to `true`.
         */
        UrlRouterProvider.prototype.deferIntercept = function (defer) {
            this._urlRouter.deferIntercept(defer);
        };
        return UrlRouterProvider;
    }());

    /**
     * # Angular 1 types
     *
     * UI-Router core provides various Typescript types which you can use for code completion and validating parameter values, etc.
     * The customizations to the core types for Angular UI-Router are documented here.
     *
     * The optional [[$resolve]] service is also documented here.
     *
     * @module ng1
     * @preferred
     */
    ng.module('ui.router.angular1', []);
    var mod_init = ng.module('ui.router.init', ['ng']);
    var mod_util = ng.module('ui.router.util', ['ui.router.init']);
    var mod_rtr = ng.module('ui.router.router', ['ui.router.util']);
    var mod_state = ng.module('ui.router.state', ['ui.router.router', 'ui.router.util', 'ui.router.angular1']);
    var mod_main = ng.module('ui.router', ['ui.router.init', 'ui.router.state', 'ui.router.angular1']);
    var mod_cmpt = ng.module('ui.router.compat', ['ui.router']); // tslint:disable-line
    var router = null;
    $uiRouterProvider.$inject = ['$locationProvider'];
    /** This angular 1 provider instantiates a Router and exposes its services via the angular injector */
    function $uiRouterProvider($locationProvider) {
        // Create a new instance of the Router when the $uiRouterProvider is initialized
        router = this.router = new UIRouter();
        router.stateProvider = new StateProvider(router.stateRegistry, router.stateService);
        // Apply ng1 specific StateBuilder code for `views`, `resolve`, and `onExit/Retain/Enter` properties
        router.stateRegistry.decorator('views', ng1ViewsBuilder);
        router.stateRegistry.decorator('onExit', getStateHookBuilder('onExit'));
        router.stateRegistry.decorator('onRetain', getStateHookBuilder('onRetain'));
        router.stateRegistry.decorator('onEnter', getStateHookBuilder('onEnter'));
        router.viewService._pluginapi._viewConfigFactory('ng1', getNg1ViewConfigFactory());
        var ng1LocationService = (router.locationService = router.locationConfig = new Ng1LocationServices($locationProvider));
        Ng1LocationServices.monkeyPatchPathParameterType(router);
        // backwards compat: also expose router instance as $uiRouterProvider.router
        router['router'] = router;
        router['$get'] = $get;
        $get.$inject = ['$location', '$browser', '$window', '$sniffer', '$rootScope', '$http', '$templateCache'];
        function $get($location, $browser, $window, $sniffer, $rootScope, $http, $templateCache) {
            ng1LocationService._runtimeServices($rootScope, $location, $sniffer, $browser, $window);
            delete router['router'];
            delete router['$get'];
            return router;
        }
        return router;
    }
    var getProviderFor = function (serviceName) { return [
        '$uiRouterProvider',
        function ($urp) {
            var service = $urp.router[serviceName];
            service['$get'] = function () { return service; };
            return service;
        },
    ]; };
    // This effectively calls $get() on `$uiRouterProvider` to trigger init (when ng enters runtime)
    runBlock.$inject = ['$injector', '$q', '$uiRouter'];
    function runBlock($injector$$1, $q$$1, $uiRouter) {
        services.$injector = $injector$$1;
        services.$q = $q$$1;
        // https://github.com/angular-ui/ui-router/issues/3678
        if (!$injector$$1.hasOwnProperty('strictDi')) {
            try {
                $injector$$1.invoke(function (checkStrictDi) { });
            }
            catch (error) {
                $injector$$1.strictDi = !!/strict mode/.exec(error && error.toString());
            }
        }
        // The $injector is now available.
        // Find any resolvables that had dependency annotation deferred
        $uiRouter.stateRegistry
            .get()
            .map(function (x) { return x.$$state().resolvables; })
            .reduce(unnestR, [])
            .filter(function (x) { return x.deps === 'deferred'; })
            .forEach(function (resolvable) { return (resolvable.deps = $injector$$1.annotate(resolvable.resolveFn, $injector$$1.strictDi)); });
    }
    // $urlRouter service and $urlRouterProvider
    var getUrlRouterProvider = function (uiRouter) { return (uiRouter.urlRouterProvider = new UrlRouterProvider(uiRouter)); };
    // $state service and $stateProvider
    // $urlRouter service and $urlRouterProvider
    var getStateProvider = function () { return extend(router.stateProvider, { $get: function () { return router.stateService; } }); };
    watchDigests.$inject = ['$rootScope'];
    function watchDigests($rootScope) {
        $rootScope.$watch(function () {
            trace.approximateDigests++;
        });
    }
    mod_init.provider('$uiRouter', $uiRouterProvider);
    mod_rtr.provider('$urlRouter', ['$uiRouterProvider', getUrlRouterProvider]);
    mod_util.provider('$urlService', getProviderFor('urlService'));
    mod_util.provider('$urlMatcherFactory', ['$uiRouterProvider', function () { return router.urlMatcherFactory; }]);
    mod_util.provider('$templateFactory', function () { return new TemplateFactory(); });
    mod_state.provider('$stateRegistry', getProviderFor('stateRegistry'));
    mod_state.provider('$uiRouterGlobals', getProviderFor('globals'));
    mod_state.provider('$transitions', getProviderFor('transitionService'));
    mod_state.provider('$state', ['$uiRouterProvider', getStateProvider]);
    mod_state.factory('$stateParams', ['$uiRouter', function ($uiRouter) { return $uiRouter.globals.params; }]);
    mod_main.factory('$view', function () { return router.viewService; });
    mod_main.service('$trace', function () { return trace; });
    mod_main.run(watchDigests);
    mod_util.run(['$urlMatcherFactory', function ($urlMatcherFactory) { }]);
    mod_state.run(['$state', function ($state) { }]);
    mod_rtr.run(['$urlRouter', function ($urlRouter) { }]);
    mod_init.run(runBlock);
    /** @hidden TODO: find a place to move this */
    var getLocals = function (ctx) {
        var tokens = ctx.getTokens().filter(isString);
        var tuples = tokens.map(function (key) {
            var resolvable = ctx.getResolvable(key);
            var waitPolicy = ctx.getPolicy(resolvable).async;
            return [key, waitPolicy === 'NOWAIT' ? resolvable.promise : resolvable.data];
        });
        return tuples.reduce(applyPairs, {});
    };

    /**
     * The current (or pending) State Parameters
     *
     * An injectable global **Service Object** which holds the state parameters for the latest **SUCCESSFUL** transition.
     *
     * The values are not updated until *after* a `Transition` successfully completes.
     *
     * **Also:** an injectable **Per-Transition Object** object which holds the pending state parameters for the pending `Transition` currently running.
     *
     * ### Deprecation warning:
     *
     * The value injected for `$stateParams` is different depending on where it is injected.
     *
     * - When injected into an angular service, the object injected is the global **Service Object** with the parameter values for the latest successful `Transition`.
     * - When injected into transition hooks, resolves, or view controllers, the object is the **Per-Transition Object** with the parameter values for the running `Transition`.
     *
     * Because of these confusing details, this service is deprecated.
     *
     * ### Instead of using the global `$stateParams` service object,
     * inject [[$uiRouterGlobals]] and use [[UIRouterGlobals.params]]
     *
     * ```js
     * MyService.$inject = ['$uiRouterGlobals'];
     * function MyService($uiRouterGlobals) {
     *   return {
     *     paramValues: function () {
     *       return $uiRouterGlobals.params;
     *     }
     *   }
     * }
     * ```
     *
     * ### Instead of using the per-transition `$stateParams` object,
     * inject the current `Transition` (as [[$transition$]]) and use [[Transition.params]]
     *
     * ```js
     * MyController.$inject = ['$transition$'];
     * function MyController($transition$) {
     *   var username = $transition$.params().username;
     *   // .. do something with username
     * }
     * ```
     *
     * ---
     *
     * This object can be injected into other services.
     *
     * #### Deprecated Example:
     * ```js
     * SomeService.$inject = ['$http', '$stateParams'];
     * function SomeService($http, $stateParams) {
     *   return {
     *     getUser: function() {
     *       return $http.get('/api/users/' + $stateParams.username);
     *     }
     *   }
     * };
     * angular.service('SomeService', SomeService);
     * ```
     * @deprecated
     */

    /**
     * # Angular 1 Directives
     *
     * These are the directives included in UI-Router for Angular 1.
     * These directives are used in templates to create viewports and link/navigate to states.
     *
     * @ng1api
     * @preferred
     * @module directives
     */ /** for typedoc */
    /** @hidden */
    function parseStateRef(ref) {
        var parsed;
        var paramsOnly = ref.match(/^\s*({[^}]*})\s*$/);
        if (paramsOnly)
            ref = '(' + paramsOnly[1] + ')';
        parsed = ref.replace(/\n/g, ' ').match(/^\s*([^(]*?)\s*(\((.*)\))?\s*$/);
        if (!parsed || parsed.length !== 4)
            throw new Error("Invalid state ref '" + ref + "'");
        return { state: parsed[1] || null, paramExpr: parsed[3] || null };
    }
    /** @hidden */
    function stateContext(el) {
        var $uiView = el.parent().inheritedData('$uiView');
        var path = parse('$cfg.path')($uiView);
        return path ? tail(path).state.name : undefined;
    }
    /** @hidden */
    function processedDef($state, $element, def) {
        var uiState = def.uiState || $state.current.name;
        var uiStateOpts = extend(defaultOpts($element, $state), def.uiStateOpts || {});
        var href = $state.href(uiState, def.uiStateParams, uiStateOpts);
        return { uiState: uiState, uiStateParams: def.uiStateParams, uiStateOpts: uiStateOpts, href: href };
    }
    /** @hidden */
    function getTypeInfo(el) {
        // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
        var isSvg = Object.prototype.toString.call(el.prop('href')) === '[object SVGAnimatedString]';
        var isForm = el[0].nodeName === 'FORM';
        return {
            attr: isForm ? 'action' : isSvg ? 'xlink:href' : 'href',
            isAnchor: el.prop('tagName').toUpperCase() === 'A',
            clickable: !isForm,
        };
    }
    /** @hidden */
    function clickHook(el, $state, $timeout, type, getDef) {
        return function (e) {
            var button = e.which || e.button, target = getDef();
            if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || el.attr('target'))) {
                // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
                var transition_1 = $timeout(function () {
                    if (!el.attr('disabled')) {
                        $state.go(target.uiState, target.uiStateParams, target.uiStateOpts);
                    }
                });
                e.preventDefault();
                // if the state has no URL, ignore one preventDefault from the <a> directive.
                var ignorePreventDefaultCount_1 = type.isAnchor && !target.href ? 1 : 0;
                e.preventDefault = function () {
                    if (ignorePreventDefaultCount_1-- <= 0)
                        $timeout.cancel(transition_1);
                };
            }
        };
    }
    /** @hidden */
    function defaultOpts(el, $state) {
        return {
            relative: stateContext(el) || $state.$current,
            inherit: true,
            source: 'sref',
        };
    }
    /** @hidden */
    function bindEvents(element, scope, hookFn, uiStateOpts) {
        var events;
        if (uiStateOpts) {
            events = uiStateOpts.events;
        }
        if (!isArray(events)) {
            events = ['click'];
        }
        var on = element.on ? 'on' : 'bind';
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            element[on](event_1, hookFn);
        }
        scope.$on('$destroy', function () {
            var off = element.off ? 'off' : 'unbind';
            for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
                var event_2 = events_2[_i];
                element[off](event_2, hookFn);
            }
        });
    }
    /**
     * `ui-sref`: A directive for linking to a state
     *
     * A directive which links to a state (and optionally, parameters).
     * When clicked, this directive activates the linked state with the supplied parameter values.
     *
     * ### Linked State
     * The attribute value of the `ui-sref` is the name of the state to link to.
     *
     * #### Example:
     * This will activate the `home` state when the link is clicked.
     * ```html
     * <a ui-sref="home">Home</a>
     * ```
     *
     * ### Relative Links
     * You can also use relative state paths within `ui-sref`, just like a relative path passed to `$state.go()` ([[StateService.go]]).
     * You just need to be aware that the path is relative to the state that *created* the link.
     * This allows a state to create a relative `ui-sref` which always targets the same destination.
     *
     * #### Example:
     * Both these links are relative to the parent state, even when a child state is currently active.
     * ```html
     * <a ui-sref=".child1">child 1 state</a>
     * <a ui-sref=".child2">child 2 state</a>
     * ```
     *
     * This link activates the parent state.
     * ```html
     * <a ui-sref="^">Return</a>
     * ```
     *
     * ### hrefs
     * If the linked state has a URL, the directive will automatically generate and
     * update the `href` attribute (using the [[StateService.href]]  method).
     *
     * #### Example:
     * Assuming the `users` state has a url of `/users/`
     * ```html
     * <a ui-sref="users" href="/users/">Users</a>
     * ```
     *
     * ### Parameter Values
     * In addition to the state name, a `ui-sref` can include parameter values which are applied when activating the state.
     * Param values can be provided in the `ui-sref` value after the state name, enclosed by parentheses.
     * The content inside the parentheses is an expression, evaluated to the parameter values.
     *
     * #### Example:
     * This example renders a list of links to users.
     * The state's `userId` parameter value comes from each user's `user.id` property.
     * ```html
     * <li ng-repeat="user in users">
     *   <a ui-sref="users.detail({ userId: user.id })">{{ user.displayName }}</a>
     * </li>
     * ```
     *
     * Note:
     * The parameter values expression is `$watch`ed for updates.
     *
     * ### Transition Options
     * You can specify [[TransitionOptions]] to pass to [[StateService.go]] by using the `ui-sref-opts` attribute.
     * Options are restricted to `location`, `inherit`, and `reload`.
     *
     * #### Example:
     * ```html
     * <a ui-sref="home" ui-sref-opts="{ reload: true }">Home</a>
     * ```
     *
     * ### Other DOM Events
     *
     * You can also customize which DOM events to respond to (instead of `click`) by
     * providing an `events` array in the `ui-sref-opts` attribute.
     *
     * #### Example:
     * ```html
     * <input type="text" ui-sref="contacts" ui-sref-opts="{ events: ['change', 'blur'] }">
     * ```
     *
     * ### Highlighting the active link
     * This directive can be used in conjunction with [[uiSrefActive]] to highlight the active link.
     *
     * ### Examples
     * If you have the following template:
     *
     * ```html
     * <a ui-sref="home">Home</a>
     * <a ui-sref="about">About</a>
     * <a ui-sref="{page: 2}">Next page</a>
     *
     * <ul>
     *     <li ng-repeat="contact in contacts">
     *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
     *     </li>
     * </ul>
     * ```
     *
     * Then (assuming the current state is `contacts`) the rendered html including hrefs would be:
     *
     * ```html
     * <a href="#/home" ui-sref="home">Home</a>
     * <a href="#/about" ui-sref="about">About</a>
     * <a href="#/contacts?page=2" ui-sref="{page: 2}">Next page</a>
     *
     * <ul>
     *     <li ng-repeat="contact in contacts">
     *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
     *     </li>
     *     <li ng-repeat="contact in contacts">
     *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
     *     </li>
     *     <li ng-repeat="contact in contacts">
     *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
     *     </li>
     * </ul>
     *
     * <a href="#/home" ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
     * ```
     *
     * ### Notes
     *
     * - You can use `ui-sref` to change **only the parameter values** by omitting the state name and parentheses.
     * #### Example:
     * Sets the `lang` parameter to `en` and remains on the same state.
     *
     * ```html
     * <a ui-sref="{ lang: 'en' }">English</a>
     * ```
     *
     * - A middle-click, right-click, or ctrl-click is handled (natively) by the browser to open the href in a new window, for example.
     *
     * - Unlike the parameter values expression, the state name is not `$watch`ed (for performance reasons).
     * If you need to dynamically update the state being linked to, use the fully dynamic [[uiState]] directive.
     */
    var uiSrefDirective;
    uiSrefDirective = [
        '$uiRouter',
        '$timeout',
        function $StateRefDirective($uiRouter, $timeout) {
            var $state = $uiRouter.stateService;
            return {
                restrict: 'A',
                require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
                link: function (scope, element, attrs, uiSrefActive) {
                    var type = getTypeInfo(element);
                    var active = uiSrefActive[1] || uiSrefActive[0];
                    var unlinkInfoFn = null;
                    var hookFn;
                    var rawDef = {};
                    var getDef = function () { return processedDef($state, element, rawDef); };
                    var ref = parseStateRef(attrs.uiSref);
                    rawDef.uiState = ref.state;
                    rawDef.uiStateOpts = attrs.uiSrefOpts ? scope.$eval(attrs.uiSrefOpts) : {};
                    function update() {
                        var def = getDef();
                        if (unlinkInfoFn)
                            unlinkInfoFn();
                        if (active)
                            unlinkInfoFn = active.$$addStateInfo(def.uiState, def.uiStateParams);
                        if (def.href != null)
                            attrs.$set(type.attr, def.href);
                    }
                    if (ref.paramExpr) {
                        scope.$watch(ref.paramExpr, function (val$$1) {
                            rawDef.uiStateParams = extend({}, val$$1);
                            update();
                        }, true);
                        rawDef.uiStateParams = extend({}, scope.$eval(ref.paramExpr));
                    }
                    update();
                    scope.$on('$destroy', $uiRouter.stateRegistry.onStatesChanged(update));
                    scope.$on('$destroy', $uiRouter.transitionService.onSuccess({}, update));
                    if (!type.clickable)
                        return;
                    hookFn = clickHook(element, $state, $timeout, type, getDef);
                    bindEvents(element, scope, hookFn, rawDef.uiStateOpts);
                },
            };
        },
    ];
    /**
     * `ui-state`: A fully dynamic directive for linking to a state
     *
     * A directive which links to a state (and optionally, parameters).
     * When clicked, this directive activates the linked state with the supplied parameter values.
     *
     * **This directive is very similar to [[uiSref]], but it `$observe`s and `$watch`es/evaluates all its inputs.**
     *
     * A directive which links to a state (and optionally, parameters).
     * When clicked, this directive activates the linked state with the supplied parameter values.
     *
     * ### Linked State
     * The attribute value of `ui-state` is an expression which is `$watch`ed and evaluated as the state to link to.
     * **This is in contrast with `ui-sref`, which takes a state name as a string literal.**
     *
     * #### Example:
     * Create a list of links.
     * ```html
     * <li ng-repeat="link in navlinks">
     *   <a ui-state="link.state">{{ link.displayName }}</a>
     * </li>
     * ```
     *
     * ### Relative Links
     * If the expression evaluates to a relative path, it is processed like [[uiSref]].
     * You just need to be aware that the path is relative to the state that *created* the link.
     * This allows a state to create relative `ui-state` which always targets the same destination.
     *
     * ### hrefs
     * If the linked state has a URL, the directive will automatically generate and
     * update the `href` attribute (using the [[StateService.href]]  method).
     *
     * ### Parameter Values
     * In addition to the state name expression, a `ui-state` can include parameter values which are applied when activating the state.
     * Param values should be provided using the `ui-state-params` attribute.
     * The `ui-state-params` attribute value is `$watch`ed and evaluated as an expression.
     *
     * #### Example:
     * This example renders a list of links with param values.
     * The state's `userId` parameter value comes from each user's `user.id` property.
     * ```html
     * <li ng-repeat="link in navlinks">
     *   <a ui-state="link.state" ui-state-params="link.params">{{ link.displayName }}</a>
     * </li>
     * ```
     *
     * ### Transition Options
     * You can specify [[TransitionOptions]] to pass to [[StateService.go]] by using the `ui-state-opts` attribute.
     * Options are restricted to `location`, `inherit`, and `reload`.
     * The value of the `ui-state-opts` is `$watch`ed and evaluated as an expression.
     *
     * #### Example:
     * ```html
     * <a ui-state="returnto.state" ui-state-opts="{ reload: true }">Home</a>
     * ```
     *
     * ### Other DOM Events
     *
     * You can also customize which DOM events to respond to (instead of `click`) by
     * providing an `events` array in the `ui-state-opts` attribute.
     *
     * #### Example:
     * ```html
     * <input type="text" ui-state="contacts" ui-state-opts="{ events: ['change', 'blur'] }">
     * ```
     *
     * ### Highlighting the active link
     * This directive can be used in conjunction with [[uiSrefActive]] to highlight the active link.
     *
     * ### Notes
     *
     * - You can use `ui-params` to change **only the parameter values** by omitting the state name and supplying only `ui-state-params`.
     *   However, it might be simpler to use [[uiSref]] parameter-only links.
     *
     * #### Example:
     * Sets the `lang` parameter to `en` and remains on the same state.
     *
     * ```html
     * <a ui-state="" ui-state-params="{ lang: 'en' }">English</a>
     * ```
     *
     * - A middle-click, right-click, or ctrl-click is handled (natively) by the browser to open the href in a new window, for example.
     * ```
     */
    var uiStateDirective;
    uiStateDirective = [
        '$uiRouter',
        '$timeout',
        function $StateRefDynamicDirective($uiRouter, $timeout) {
            var $state = $uiRouter.stateService;
            return {
                restrict: 'A',
                require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
                link: function (scope, element, attrs, uiSrefActive) {
                    var type = getTypeInfo(element);
                    var active = uiSrefActive[1] || uiSrefActive[0];
                    var unlinkInfoFn = null;
                    var hookFn;
                    var rawDef = {};
                    var getDef = function () { return processedDef($state, element, rawDef); };
                    var inputAttrs = ['uiState', 'uiStateParams', 'uiStateOpts'];
                    var watchDeregFns = inputAttrs.reduce(function (acc, attr) { return ((acc[attr] = noop), acc); }, {});
                    function update() {
                        var def = getDef();
                        if (unlinkInfoFn)
                            unlinkInfoFn();
                        if (active)
                            unlinkInfoFn = active.$$addStateInfo(def.uiState, def.uiStateParams);
                        if (def.href != null)
                            attrs.$set(type.attr, def.href);
                    }
                    inputAttrs.forEach(function (field) {
                        rawDef[field] = attrs[field] ? scope.$eval(attrs[field]) : null;
                        attrs.$observe(field, function (expr) {
                            watchDeregFns[field]();
                            watchDeregFns[field] = scope.$watch(expr, function (newval) {
                                rawDef[field] = newval;
                                update();
                            }, true);
                        });
                    });
                    update();
                    scope.$on('$destroy', $uiRouter.stateRegistry.onStatesChanged(update));
                    scope.$on('$destroy', $uiRouter.transitionService.onSuccess({}, update));
                    if (!type.clickable)
                        return;
                    hookFn = clickHook(element, $state, $timeout, type, getDef);
                    bindEvents(element, scope, hookFn, rawDef.uiStateOpts);
                },
            };
        },
    ];
    /**
     * `ui-sref-active` and `ui-sref-active-eq`: A directive that adds a CSS class when a `ui-sref` is active
     *
     * A directive working alongside [[uiSref]] and [[uiState]] to add classes to an element when the
     * related directive's state is active (and remove them when it is inactive).
     *
     * The primary use-case is to highlight the active link in navigation menus,
     * distinguishing it from the inactive menu items.
     *
     * ### Linking to a `ui-sref` or `ui-state`
     * `ui-sref-active` can live on the same element as `ui-sref`/`ui-state`, or it can be on a parent element.
     * If a `ui-sref-active` is a parent to more than one `ui-sref`/`ui-state`, it will apply the CSS class when **any of the links are active**.
     *
     * ### Matching
     *
     * The `ui-sref-active` directive applies the CSS class when the `ui-sref`/`ui-state`'s target state **or any child state is active**.
     * This is a "fuzzy match" which uses [[StateService.includes]].
     *
     * The `ui-sref-active-eq` directive applies the CSS class when the `ui-sref`/`ui-state`'s target state is directly active (not when child states are active).
     * This is an "exact match" which uses [[StateService.is]].
     *
     * ### Parameter values
     * If the `ui-sref`/`ui-state` includes parameter values, the current parameter values must match the link's values for the link to be highlighted.
     * This allows a list of links to the same state with different parameters to be rendered, and the correct one highlighted.
     *
     * #### Example:
     * ```html
     * <li ng-repeat="user in users" ui-sref-active="active">
     *   <a ui-sref="user.details({ userId: user.id })">{{ user.lastName }}</a>
     * </li>
     * ```
     *
     * ### Examples
     *
     * Given the following template:
     * #### Example:
     * ```html
     * <ul>
     *   <li ui-sref-active="active" class="item">
     *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
     *   </li>
     * </ul>
     * ```
     *
     * When the app state is `app.user` (or any child state),
     * and contains the state parameter "user" with value "bilbobaggins",
     * the resulting HTML will appear as (note the 'active' class):
     *
     * ```html
     * <ul>
     *   <li ui-sref-active="active" class="item active">
     *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
     *   </li>
     * </ul>
     * ```
     *
     * ### Glob mode
     *
     * It is possible to pass `ui-sref-active` an expression that evaluates to an object.
     * The objects keys represent active class names and values represent the respective state names/globs.
     * `ui-sref-active` will match if the current active state **includes** any of
     * the specified state names/globs, even the abstract ones.
     *
     * #### Example:
     * Given the following template, with "TUTOR" being an abstract state:
     * ```html
     * <div ui-sref-active="{'active': 'TUTOR.**'}">
     *   <a ui-sref-active="active" ui-sref="TUTOR.roles">Roles</a>
     * </div>
     * ```
     *
     * Arrays are also supported as values in the `ngClass`-like interface.
     * This allows multiple states to add `active` class.
     *
     * #### Example:
     * Given the following template, with "TUTOR.roles" being the current state, the class will be added too:
     * ```html
     * <div ui-sref-active="{'active': ['owner.**', 'TUTOR.**']}">
     *   <a ui-sref-active="active" ui-sref="TUTOR.roles">Roles</a>
     * </div>
     * ```
     *
     * When the current state is "TUTOR.roles" the "active" class will be applied to both the `<div>` and `<a>` elements.
     * It is important to note that the state names/globs passed to `ui-sref-active` override any state provided by a linked `ui-sref`.
     *
     * ### Notes:
     *
     * - The class name is interpolated **once** during the directives link time (any further changes to the
     * interpolated value are ignored).
     *
     * - Multiple classes may be specified in a space-separated format: `ui-sref-active='class1 class2 class3'`
     */
    var uiSrefActiveDirective;
    uiSrefActiveDirective = [
        '$state',
        '$stateParams',
        '$interpolate',
        '$uiRouter',
        function $StateRefActiveDirective($state, $stateParams, $interpolate, $uiRouter) {
            return {
                restrict: 'A',
                controller: [
                    '$scope',
                    '$element',
                    '$attrs',
                    function ($scope, $element, $attrs) {
                        var states = [];
                        var activeEqClass;
                        var uiSrefActive;
                        // There probably isn't much point in $observing this
                        // uiSrefActive and uiSrefActiveEq share the same directive object with some
                        // slight difference in logic routing
                        activeEqClass = $interpolate($attrs.uiSrefActiveEq || '', false)($scope);
                        try {
                            uiSrefActive = $scope.$eval($attrs.uiSrefActive);
                        }
                        catch (e) {
                            // Do nothing. uiSrefActive is not a valid expression.
                            // Fall back to using $interpolate below
                        }
                        uiSrefActive = uiSrefActive || $interpolate($attrs.uiSrefActive || '', false)($scope);
                        setStatesFromDefinitionObject(uiSrefActive);
                        // Allow uiSref to communicate with uiSrefActive[Equals]
                        this.$$addStateInfo = function (newState, newParams) {
                            // we already got an explicit state provided by ui-sref-active, so we
                            // shadow the one that comes from ui-sref
                            if (isObject(uiSrefActive) && states.length > 0) {
                                return;
                            }
                            var deregister = addState(newState, newParams, uiSrefActive);
                            update();
                            return deregister;
                        };
                        function updateAfterTransition(trans) {
                            trans.promise.then(update, noop);
                        }
                        $scope.$on('$destroy', setupEventListeners());
                        if ($uiRouter.globals.transition) {
                            updateAfterTransition($uiRouter.globals.transition);
                        }
                        function setupEventListeners() {
                            var deregisterStatesChangedListener = $uiRouter.stateRegistry.onStatesChanged(handleStatesChanged);
                            var deregisterOnStartListener = $uiRouter.transitionService.onStart({}, updateAfterTransition);
                            var deregisterStateChangeSuccessListener = $scope.$on('$stateChangeSuccess', update);
                            return function cleanUp() {
                                deregisterStatesChangedListener();
                                deregisterOnStartListener();
                                deregisterStateChangeSuccessListener();
                            };
                        }
                        function handleStatesChanged() {
                            setStatesFromDefinitionObject(uiSrefActive);
                        }
                        function setStatesFromDefinitionObject(statesDefinition) {
                            if (isObject(statesDefinition)) {
                                states = [];
                                forEach(statesDefinition, function (stateOrName, activeClass) {
                                    // Helper function to abstract adding state.
                                    var addStateForClass = function (stateOrName, activeClass) {
                                        var ref = parseStateRef(stateOrName);
                                        addState(ref.state, $scope.$eval(ref.paramExpr), activeClass);
                                    };
                                    if (isString(stateOrName)) {
                                        // If state is string, just add it.
                                        addStateForClass(stateOrName, activeClass);
                                    }
                                    else if (isArray(stateOrName)) {
                                        // If state is an array, iterate over it and add each array item individually.
                                        forEach(stateOrName, function (stateOrName) {
                                            addStateForClass(stateOrName, activeClass);
                                        });
                                    }
                                });
                            }
                        }
                        function addState(stateName, stateParams, activeClass) {
                            var state = $state.get(stateName, stateContext($element));
                            var stateInfo = {
                                state: state || { name: stateName },
                                params: stateParams,
                                activeClass: activeClass,
                            };
                            states.push(stateInfo);
                            return function removeState() {
                                removeFrom(states)(stateInfo);
                            };
                        }
                        // Update route state
                        function update() {
                            var splitClasses = function (str) { return str.split(/\s/).filter(identity); };
                            var getClasses = function (stateList) {
                                return stateList
                                    .map(function (x) { return x.activeClass; })
                                    .map(splitClasses)
                                    .reduce(unnestR, []);
                            };
                            var allClasses = getClasses(states)
                                .concat(splitClasses(activeEqClass))
                                .reduce(uniqR, []);
                            var fuzzyClasses = getClasses(states.filter(function (x) { return $state.includes(x.state.name, x.params); }));
                            var exactlyMatchesAny = !!states.filter(function (x) { return $state.is(x.state.name, x.params); }).length;
                            var exactClasses = exactlyMatchesAny ? splitClasses(activeEqClass) : [];
                            var addClasses = fuzzyClasses.concat(exactClasses).reduce(uniqR, []);
                            var removeClasses = allClasses.filter(function (cls) { return !inArray(addClasses, cls); });
                            $scope.$evalAsync(function () {
                                addClasses.forEach(function (className) { return $element.addClass(className); });
                                removeClasses.forEach(function (className) { return $element.removeClass(className); });
                            });
                        }
                        update();
                    },
                ],
            };
        },
    ];
    ng
        .module('ui.router.state')
        .directive('uiSref', uiSrefDirective)
        .directive('uiSrefActive', uiSrefActiveDirective)
        .directive('uiSrefActiveEq', uiSrefActiveDirective)
        .directive('uiState', uiStateDirective);

    /** @module ng1 */ /** for typedoc */
    /**
     * `isState` Filter: truthy if the current state is the parameter
     *
     * Translates to [[StateService.is]] `$state.is("stateName")`.
     *
     * #### Example:
     * ```html
     * <div ng-if="'stateName' | isState">show if state is 'stateName'</div>
     * ```
     */
    $IsStateFilter.$inject = ['$state'];
    function $IsStateFilter($state) {
        var isFilter = function (state, params, options) {
            return $state.is(state, params, options);
        };
        isFilter.$stateful = true;
        return isFilter;
    }
    /**
     * `includedByState` Filter: truthy if the current state includes the parameter
     *
     * Translates to [[StateService.includes]]` $state.is("fullOrPartialStateName")`.
     *
     * #### Example:
     * ```html
     * <div ng-if="'fullOrPartialStateName' | includedByState">show if state includes 'fullOrPartialStateName'</div>
     * ```
     */
    $IncludedByStateFilter.$inject = ['$state'];
    function $IncludedByStateFilter($state) {
        var includesFilter = function (state, params, options) {
            return $state.includes(state, params, options);
        };
        includesFilter.$stateful = true;
        return includesFilter;
    }
    ng
        .module('ui.router.state')
        .filter('isState', $IsStateFilter)
        .filter('includedByState', $IncludedByStateFilter);

    /**
     * @ng1api
     * @module directives
     */
    /**
     * `ui-view`: A viewport directive which is filled in by a view from the active state.
     *
     * ### Attributes
     *
     * - `name`: (Optional) A view name.
     *   The name should be unique amongst the other views in the same state.
     *   You can have views of the same name that live in different states.
     *   The ui-view can be targeted in a View using the name ([[Ng1StateDeclaration.views]]).
     *
     * - `autoscroll`: an expression. When it evaluates to true, the `ui-view` will be scrolled into view when it is activated.
     *   Uses [[$uiViewScroll]] to do the scrolling.
     *
     * - `onload`: Expression to evaluate whenever the view updates.
     *
     * #### Example:
     * A view can be unnamed or named.
     * ```html
     * <!-- Unnamed -->
     * <div ui-view></div>
     *
     * <!-- Named -->
     * <div ui-view="viewName"></div>
     *
     * <!-- Named (different style) -->
     * <ui-view name="viewName"></ui-view>
     * ```
     *
     * You can only have one unnamed view within any template (or root html). If you are only using a
     * single view and it is unnamed then you can populate it like so:
     *
     * ```html
     * <div ui-view></div>
     * $stateProvider.state("home", {
     *   template: "<h1>HELLO!</h1>"
     * })
     * ```
     *
     * The above is a convenient shortcut equivalent to specifying your view explicitly with the
     * [[Ng1StateDeclaration.views]] config property, by name, in this case an empty name:
     *
     * ```js
     * $stateProvider.state("home", {
     *   views: {
     *     "": {
     *       template: "<h1>HELLO!</h1>"
     *     }
     *   }
     * })
     * ```
     *
     * But typically you'll only use the views property if you name your view or have more than one view
     * in the same template. There's not really a compelling reason to name a view if its the only one,
     * but you could if you wanted, like so:
     *
     * ```html
     * <div ui-view="main"></div>
     * ```
     *
     * ```js
     * $stateProvider.state("home", {
     *   views: {
     *     "main": {
     *       template: "<h1>HELLO!</h1>"
     *     }
     *   }
     * })
     * ```
     *
     * Really though, you'll use views to set up multiple views:
     *
     * ```html
     * <div ui-view></div>
     * <div ui-view="chart"></div>
     * <div ui-view="data"></div>
     * ```
     *
     * ```js
     * $stateProvider.state("home", {
     *   views: {
     *     "": {
     *       template: "<h1>HELLO!</h1>"
     *     },
     *     "chart": {
     *       template: "<chart_thing/>"
     *     },
     *     "data": {
     *       template: "<data_thing/>"
     *     }
     *   }
     * })
     * ```
     *
     * #### Examples for `autoscroll`:
     * ```html
     * <!-- If autoscroll present with no expression,
     *      then scroll ui-view into view -->
     * <ui-view autoscroll/>
     *
     * <!-- If autoscroll present with valid expression,
     *      then scroll ui-view into view if expression evaluates to true -->
     * <ui-view autoscroll='true'/>
     * <ui-view autoscroll='false'/>
     * <ui-view autoscroll='scopeVariable'/>
     * ```
     *
     * Resolve data:
     *
     * The resolved data from the state's `resolve` block is placed on the scope as `$resolve` (this
     * can be customized using [[Ng1ViewDeclaration.resolveAs]]).  This can be then accessed from the template.
     *
     * Note that when `controllerAs` is being used, `$resolve` is set on the controller instance *after* the
     * controller is instantiated.  The `$onInit()` hook can be used to perform initialization code which
     * depends on `$resolve` data.
     *
     * #### Example:
     * ```js
     * $stateProvider.state('home', {
     *   template: '<my-component user="$resolve.user"></my-component>',
     *   resolve: {
     *     user: function(UserService) { return UserService.fetchUser(); }
     *   }
     * });
     * ```
     */
    var uiView;
    uiView = [
        '$view',
        '$animate',
        '$uiViewScroll',
        '$interpolate',
        '$q',
        function $ViewDirective($view, $animate, $uiViewScroll, $interpolate, $q$$1) {
            function getRenderer(attrs, scope) {
                return {
                    enter: function (element, target, cb) {
                        if (ng.version.minor > 2) {
                            $animate.enter(element, null, target).then(cb);
                        }
                        else {
                            $animate.enter(element, null, target, cb);
                        }
                    },
                    leave: function (element, cb) {
                        if (ng.version.minor > 2) {
                            $animate.leave(element).then(cb);
                        }
                        else {
                            $animate.leave(element, cb);
                        }
                    },
                };
            }
            function configsEqual(config1, config2) {
                return config1 === config2;
            }
            var rootData = {
                $cfg: { viewDecl: { $context: $view._pluginapi._rootViewContext() } },
                $uiView: {},
            };
            var directive = {
                count: 0,
                restrict: 'ECA',
                terminal: true,
                priority: 400,
                transclude: 'element',
                compile: function (tElement, tAttrs, $transclude) {
                    return function (scope, $element, attrs) {
                        var onloadExp = attrs['onload'] || '', autoScrollExp = attrs['autoscroll'], renderer = getRenderer(attrs, scope), inherited = $element.inheritedData('$uiView') || rootData, name = $interpolate(attrs['uiView'] || attrs['name'] || '')(scope) || '$default';
                        var previousEl, currentEl, currentScope, viewConfig, unregister;
                        var activeUIView = {
                            $type: 'ng1',
                            id: directive.count++,
                            name: name,
                            fqn: inherited.$uiView.fqn ? inherited.$uiView.fqn + '.' + name : name,
                            config: null,
                            configUpdated: configUpdatedCallback,
                            get creationContext() {
                                // The context in which this ui-view "tag" was created
                                var fromParentTagConfig = parse('$cfg.viewDecl.$context')(inherited);
                                // Allow <ui-view name="foo"><ui-view name="bar"></ui-view></ui-view>
                                // See https://github.com/angular-ui/ui-router/issues/3355
                                var fromParentTag = parse('$uiView.creationContext')(inherited);
                                return fromParentTagConfig || fromParentTag;
                            },
                        };
                        trace.traceUIViewEvent('Linking', activeUIView);
                        function configUpdatedCallback(config) {
                            if (config && !(config instanceof Ng1ViewConfig))
                                return;
                            if (configsEqual(viewConfig, config))
                                return;
                            trace.traceUIViewConfigUpdated(activeUIView, config && config.viewDecl && config.viewDecl.$context);
                            viewConfig = config;
                            updateView(config);
                        }
                        $element.data('$uiView', { $uiView: activeUIView });
                        updateView();
                        unregister = $view.registerUIView(activeUIView);
                        scope.$on('$destroy', function () {
                            trace.traceUIViewEvent('Destroying/Unregistering', activeUIView);
                            unregister();
                        });
                        function cleanupLastView() {
                            if (previousEl) {
                                trace.traceUIViewEvent('Removing (previous) el', previousEl.data('$uiView'));
                                previousEl.remove();
                                previousEl = null;
                            }
                            if (currentScope) {
                                trace.traceUIViewEvent('Destroying scope', activeUIView);
                                currentScope.$destroy();
                                currentScope = null;
                            }
                            if (currentEl) {
                                var _viewData_1 = currentEl.data('$uiViewAnim');
                                trace.traceUIViewEvent('Animate out', _viewData_1);
                                renderer.leave(currentEl, function () {
                                    _viewData_1.$$animLeave.resolve();
                                    previousEl = null;
                                });
                                previousEl = currentEl;
                                currentEl = null;
                            }
                        }
                        function updateView(config) {
                            var newScope = scope.$new();
                            var animEnter = $q$$1.defer(), animLeave = $q$$1.defer();
                            var $uiViewData = {
                                $cfg: config,
                                $uiView: activeUIView,
                            };
                            var $uiViewAnim = {
                                $animEnter: animEnter.promise,
                                $animLeave: animLeave.promise,
                                $$animLeave: animLeave,
                            };
                            /**
                             * @ngdoc event
                             * @name ui.router.state.directive:ui-view#$viewContentLoading
                             * @eventOf ui.router.state.directive:ui-view
                             * @eventType emits on ui-view directive scope
                             * @description
                             *
                             * Fired once the view **begins loading**, *before* the DOM is rendered.
                             *
                             * @param {Object} event Event object.
                             * @param {string} viewName Name of the view.
                             */
                            newScope.$emit('$viewContentLoading', name);
                            var cloned = $transclude(newScope, function (clone) {
                                clone.data('$uiViewAnim', $uiViewAnim);
                                clone.data('$uiView', $uiViewData);
                                renderer.enter(clone, $element, function onUIViewEnter() {
                                    animEnter.resolve();
                                    if (currentScope)
                                        currentScope.$emit('$viewContentAnimationEnded');
                                    if ((isDefined(autoScrollExp) && !autoScrollExp) || scope.$eval(autoScrollExp)) {
                                        $uiViewScroll(clone);
                                    }
                                });
                                cleanupLastView();
                            });
                            currentEl = cloned;
                            currentScope = newScope;
                            /**
                             * @ngdoc event
                             * @name ui.router.state.directive:ui-view#$viewContentLoaded
                             * @eventOf ui.router.state.directive:ui-view
                             * @eventType emits on ui-view directive scope
                             * @description           *
                             * Fired once the view is **loaded**, *after* the DOM is rendered.
                             *
                             * @param {Object} event Event object.
                             */
                            currentScope.$emit('$viewContentLoaded', config || viewConfig);
                            currentScope.$eval(onloadExp);
                        }
                    };
                },
            };
            return directive;
        },
    ];
    $ViewDirectiveFill.$inject = ['$compile', '$controller', '$transitions', '$view', '$q', '$timeout'];
    /** @hidden */
    function $ViewDirectiveFill($compile, $controller, $transitions, $view, $q$$1, $timeout) {
        var getControllerAs = parse('viewDecl.controllerAs');
        var getResolveAs = parse('viewDecl.resolveAs');
        return {
            restrict: 'ECA',
            priority: -400,
            compile: function (tElement) {
                var initial = tElement.html();
                tElement.empty();
                return function (scope, $element) {
                    var data = $element.data('$uiView');
                    if (!data) {
                        $element.html(initial);
                        $compile($element.contents())(scope);
                        return;
                    }
                    var cfg = data.$cfg || { viewDecl: {}, getTemplate: noop };
                    var resolveCtx = cfg.path && new ResolveContext(cfg.path);
                    $element.html(cfg.getTemplate($element, resolveCtx) || initial);
                    trace.traceUIViewFill(data.$uiView, $element.html());
                    var link = $compile($element.contents());
                    var controller = cfg.controller;
                    var controllerAs = getControllerAs(cfg);
                    var resolveAs = getResolveAs(cfg);
                    var locals = resolveCtx && getLocals(resolveCtx);
                    scope[resolveAs] = locals;
                    if (controller) {
                        var controllerInstance = ($controller(controller, extend({}, locals, { $scope: scope, $element: $element })));
                        if (controllerAs) {
                            scope[controllerAs] = controllerInstance;
                            scope[controllerAs][resolveAs] = locals;
                        }
                        // TODO: Use $view service as a central point for registering component-level hooks
                        // Then, when a component is created, tell the $view service, so it can invoke hooks
                        // $view.componentLoaded(controllerInstance, { $scope: scope, $element: $element });
                        // scope.$on('$destroy', () => $view.componentUnloaded(controllerInstance, { $scope: scope, $element: $element }));
                        $element.data('$ngControllerController', controllerInstance);
                        $element.children().data('$ngControllerController', controllerInstance);
                        registerControllerCallbacks($q$$1, $transitions, controllerInstance, scope, cfg);
                    }
                    // Wait for the component to appear in the DOM
                    if (isString(cfg.component)) {
                        var kebobName = kebobString(cfg.component);
                        var tagRegexp_1 = new RegExp("^(x-|data-)?" + kebobName + "$", 'i');
                        var getComponentController = function () {
                            var directiveEl = [].slice
                                .call($element[0].children)
                                .filter(function (el) { return el && el.tagName && tagRegexp_1.exec(el.tagName); });
                            return directiveEl && ng.element(directiveEl).data("$" + cfg.component + "Controller");
                        };
                        var deregisterWatch_1 = scope.$watch(getComponentController, function (ctrlInstance) {
                            if (!ctrlInstance)
                                return;
                            registerControllerCallbacks($q$$1, $transitions, ctrlInstance, scope, cfg);
                            deregisterWatch_1();
                        });
                    }
                    link(scope);
                };
            },
        };
    }
    /** @hidden */
    var hasComponentImpl = typeof ng.module('ui.router')['component'] === 'function';
    /** @hidden incrementing id */
    var _uiCanExitId = 0;
    /** @hidden TODO: move these callbacks to $view and/or `/hooks/components.ts` or something */
    function registerControllerCallbacks($q$$1, $transitions, controllerInstance, $scope, cfg) {
        // Call $onInit() ASAP
        if (isFunction(controllerInstance.$onInit) && !(cfg.viewDecl.component && hasComponentImpl)) {
            controllerInstance.$onInit();
        }
        var viewState = tail(cfg.path).state.self;
        var hookOptions = { bind: controllerInstance };
        // Add component-level hook for onUiParamsChanged
        if (isFunction(controllerInstance.uiOnParamsChanged)) {
            var resolveContext = new ResolveContext(cfg.path);
            var viewCreationTrans_1 = resolveContext.getResolvable('$transition$').data;
            // Fire callback on any successful transition
            var paramsUpdated = function ($transition$) {
                // Exit early if the $transition$ is the same as the view was created within.
                // Exit early if the $transition$ will exit the state the view is for.
                if ($transition$ === viewCreationTrans_1 || $transition$.exiting().indexOf(viewState) !== -1)
                    return;
                var toParams = $transition$.params('to');
                var fromParams = $transition$.params('from');
                var getNodeSchema = function (node) { return node.paramSchema; };
                var toSchema = $transition$
                    .treeChanges('to')
                    .map(getNodeSchema)
                    .reduce(unnestR, []);
                var fromSchema = $transition$
                    .treeChanges('from')
                    .map(getNodeSchema)
                    .reduce(unnestR, []);
                // Find the to params that have different values than the from params
                var changedToParams = toSchema.filter(function (param) {
                    var idx = fromSchema.indexOf(param);
                    return idx === -1 || !fromSchema[idx].type.equals(toParams[param.id], fromParams[param.id]);
                });
                // Only trigger callback if a to param has changed or is new
                if (changedToParams.length) {
                    var changedKeys_1 = changedToParams.map(function (x) { return x.id; });
                    // Filter the params to only changed/new to params.  `$transition$.params()` may be used to get all params.
                    var newValues = filter(toParams, function (val$$1, key) { return changedKeys_1.indexOf(key) !== -1; });
                    controllerInstance.uiOnParamsChanged(newValues, $transition$);
                }
            };
            $scope.$on('$destroy', $transitions.onSuccess({}, paramsUpdated, hookOptions));
        }
        // Add component-level hook for uiCanExit
        if (isFunction(controllerInstance.uiCanExit)) {
            var id_1 = _uiCanExitId++;
            var cacheProp_1 = '_uiCanExitIds';
            // Returns true if a redirect transition already answered truthy
            var prevTruthyAnswer_1 = function (trans) {
                return !!trans && ((trans[cacheProp_1] && trans[cacheProp_1][id_1] === true) || prevTruthyAnswer_1(trans.redirectedFrom()));
            };
            // If a user answered yes, but the transition was later redirected, don't also ask for the new redirect transition
            var wrappedHook = function (trans) {
                var promise;
                var ids = (trans[cacheProp_1] = trans[cacheProp_1] || {});
                if (!prevTruthyAnswer_1(trans)) {
                    promise = $q$$1.when(controllerInstance.uiCanExit(trans));
                    promise.then(function (val$$1) { return (ids[id_1] = val$$1 !== false); });
                }
                return promise;
            };
            var criteria = { exiting: viewState.name };
            $scope.$on('$destroy', $transitions.onBefore(criteria, wrappedHook, hookOptions));
        }
    }
    ng.module('ui.router.state').directive('uiView', uiView);
    ng.module('ui.router.state').directive('uiView', $ViewDirectiveFill);

    /** @module ng1 */ /** */
    /** @hidden */
    function $ViewScrollProvider() {
        var useAnchorScroll = false;
        this.useAnchorScroll = function () {
            useAnchorScroll = true;
        };
        this.$get = [
            '$anchorScroll',
            '$timeout',
            function ($anchorScroll, $timeout) {
                if (useAnchorScroll) {
                    return $anchorScroll;
                }
                return function ($element) {
                    return $timeout(function () {
                        $element[0].scrollIntoView();
                    }, 0, false);
                };
            },
        ];
    }
    ng.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

    /**
     * Main entry point for angular 1.x build
     * @module ng1
     */ /** */
    var index$1 = 'ui.router';

    exports.default = index$1;
    exports.core = index;
    exports.watchDigests = watchDigests;
    exports.getLocals = getLocals;
    exports.getNg1ViewConfigFactory = getNg1ViewConfigFactory;
    exports.ng1ViewsBuilder = ng1ViewsBuilder;
    exports.Ng1ViewConfig = Ng1ViewConfig;
    exports.StateProvider = StateProvider;
    exports.UrlRouterProvider = UrlRouterProvider;
    exports.root = root;
    exports.fromJson = fromJson;
    exports.toJson = toJson;
    exports.forEach = forEach;
    exports.extend = extend;
    exports.equals = equals;
    exports.identity = identity;
    exports.noop = noop;
    exports.createProxyFunctions = createProxyFunctions;
    exports.inherit = inherit;
    exports.inArray = inArray;
    exports._inArray = _inArray;
    exports.removeFrom = removeFrom;
    exports._removeFrom = _removeFrom;
    exports.pushTo = pushTo;
    exports._pushTo = _pushTo;
    exports.deregAll = deregAll;
    exports.defaults = defaults;
    exports.mergeR = mergeR;
    exports.ancestors = ancestors;
    exports.pick = pick;
    exports.omit = omit;
    exports.pluck = pluck;
    exports.filter = filter;
    exports.find = find;
    exports.mapObj = mapObj;
    exports.map = map;
    exports.values = values;
    exports.allTrueR = allTrueR;
    exports.anyTrueR = anyTrueR;
    exports.unnestR = unnestR;
    exports.flattenR = flattenR;
    exports.pushR = pushR;
    exports.uniqR = uniqR;
    exports.unnest = unnest;
    exports.flatten = flatten;
    exports.assertPredicate = assertPredicate;
    exports.assertMap = assertMap;
    exports.assertFn = assertFn;
    exports.pairs = pairs;
    exports.arrayTuples = arrayTuples;
    exports.applyPairs = applyPairs;
    exports.tail = tail;
    exports.copy = copy;
    exports._extend = _extend;
    exports.silenceUncaughtInPromise = silenceUncaughtInPromise;
    exports.silentRejection = silentRejection;
    exports.notImplemented = notImplemented;
    exports.services = services;
    exports.Glob = Glob;
    exports.curry = curry;
    exports.compose = compose;
    exports.pipe = pipe;
    exports.prop = prop;
    exports.propEq = propEq;
    exports.parse = parse;
    exports.not = not;
    exports.and = and;
    exports.or = or;
    exports.all = all;
    exports.any = any;
    exports.is = is;
    exports.eq = eq;
    exports.val = val;
    exports.invoke = invoke;
    exports.pattern = pattern;
    exports.isUndefined = isUndefined;
    exports.isDefined = isDefined;
    exports.isNull = isNull;
    exports.isNullOrUndefined = isNullOrUndefined;
    exports.isFunction = isFunction;
    exports.isNumber = isNumber;
    exports.isString = isString;
    exports.isObject = isObject;
    exports.isArray = isArray;
    exports.isDate = isDate;
    exports.isRegExp = isRegExp;
    exports.isInjectable = isInjectable;
    exports.isPromise = isPromise;
    exports.Queue = Queue;
    exports.maxLength = maxLength;
    exports.padString = padString;
    exports.kebobString = kebobString;
    exports.functionToString = functionToString;
    exports.fnToString = fnToString;
    exports.stringify = stringify;
    exports.beforeAfterSubstr = beforeAfterSubstr;
    exports.hostRegex = hostRegex;
    exports.stripLastPathElement = stripLastPathElement;
    exports.splitHash = splitHash;
    exports.splitQuery = splitQuery;
    exports.splitEqual = splitEqual;
    exports.trimHashVal = trimHashVal;
    exports.splitOnDelim = splitOnDelim;
    exports.joinNeighborsR = joinNeighborsR;
    exports.Trace = Trace;
    exports.trace = trace;
    exports.Param = Param;
    exports.ParamTypes = ParamTypes;
    exports.StateParams = StateParams;
    exports.ParamType = ParamType;
    exports.PathNode = PathNode;
    exports.PathUtils = PathUtils;
    exports.resolvePolicies = resolvePolicies;
    exports.defaultResolvePolicy = defaultResolvePolicy;
    exports.Resolvable = Resolvable;
    exports.NATIVE_INJECTOR_TOKEN = NATIVE_INJECTOR_TOKEN;
    exports.ResolveContext = ResolveContext;
    exports.resolvablesBuilder = resolvablesBuilder;
    exports.StateBuilder = StateBuilder;
    exports.StateObject = StateObject;
    exports.StateMatcher = StateMatcher;
    exports.StateQueueManager = StateQueueManager;
    exports.StateRegistry = StateRegistry;
    exports.StateService = StateService;
    exports.TargetState = TargetState;
    exports.HookBuilder = HookBuilder;
    exports.matchState = matchState;
    exports.RegisteredHook = RegisteredHook;
    exports.makeEvent = makeEvent;
    exports.Rejection = Rejection;
    exports.Transition = Transition;
    exports.TransitionHook = TransitionHook;
    exports.TransitionEventType = TransitionEventType;
    exports.defaultTransOpts = defaultTransOpts;
    exports.TransitionService = TransitionService;
    exports.UrlMatcher = UrlMatcher;
    exports.ParamFactory = ParamFactory;
    exports.UrlMatcherFactory = UrlMatcherFactory;
    exports.UrlRouter = UrlRouter;
    exports.UrlRuleFactory = UrlRuleFactory;
    exports.BaseUrlRule = BaseUrlRule;
    exports.UrlService = UrlService;
    exports.ViewService = ViewService;
    exports.UIRouterGlobals = UIRouterGlobals;
    exports.UIRouter = UIRouter;
    exports.$q = $q;
    exports.$injector = $injector;
    exports.BaseLocationServices = BaseLocationServices;
    exports.HashLocationService = HashLocationService;
    exports.MemoryLocationService = MemoryLocationService;
    exports.PushStateLocationService = PushStateLocationService;
    exports.MemoryLocationConfig = MemoryLocationConfig;
    exports.BrowserLocationConfig = BrowserLocationConfig;
    exports.keyValsToObjectR = keyValsToObjectR;
    exports.getParams = getParams;
    exports.parseUrl = parseUrl$1;
    exports.buildUrl = buildUrl;
    exports.locationPluginFactory = locationPluginFactory;
    exports.servicesPlugin = servicesPlugin;
    exports.hashLocationPlugin = hashLocationPlugin;
    exports.pushStateLocationPlugin = pushStateLocationPlugin;
    exports.memoryLocationPlugin = memoryLocationPlugin;
    exports.UIRouterPluginBase = UIRouterPluginBase;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-ui-router.js.map

/**
 * Parse JavaScript SDK v1.11.1
 *
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * The source tree of this library can be found at
 *   https://github.com/ParsePlatform/Parse-SDK-JS
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Parse=e()}}(function(){return function(){function e(t,r,n){function o(s,a){if(!r[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var c=r[s]={exports:{}};t[s][0].call(c.exports,function(e){var r=t[s][1][e];return o(r||e)},c,c.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}return e}()({1:[function(e,t,r){"use strict";function n(e,t,r){if(e=e||"",e=e.replace(/^\s*/,""),e=e.replace(/\s*$/,""),0===e.length)throw new TypeError("A name for the custom event must be provided");for(var n in t)if("string"!=typeof n||"string"!=typeof t[n])throw new TypeError('track() dimensions expects keys and values of type "string".');return r=r||{},i.default.getAnalyticsController().track(e,t)._thenRunCallbacks(r)}Object.defineProperty(r,"__esModule",{value:!0}),r.track=n;var o=e("./CoreManager"),i=function(e){return e&&e.__esModule?e:{default:e}}(o),s={track:function(e,t){return i.default.getRESTController().request("POST","events/"+e,{dimensions:t})}};i.default.setAnalyticsController(s)},{"./CoreManager":3}],2:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t,r){if(r=r||{},"string"!=typeof e||0===e.length)throw new TypeError("Cloud function name must be a string.");var n={};return r.useMasterKey&&(n.useMasterKey=r.useMasterKey),r.sessionToken&&(n.sessionToken=r.sessionToken),s.default.getCloudController().run(e,t,n)._thenRunCallbacks(r)}Object.defineProperty(r,"__esModule",{value:!0}),r.run=o;var i=e("./CoreManager"),s=n(i),a=e("./decode"),u=n(a),l=e("./encode"),c=n(l),f=e("./ParseError"),d=n(f),h=e("./ParsePromise"),p=n(h),_={run:function(e,t,r){var n=s.default.getRESTController(),o=(0,c.default)(t,!0),i={};return r.hasOwnProperty("useMasterKey")&&(i.useMasterKey=r.useMasterKey),r.hasOwnProperty("sessionToken")&&(i.sessionToken=r.sessionToken),n.request("POST","functions/"+e,o,i).then(function(e){var t=(0,u.default)(e);return t&&t.hasOwnProperty("result")?p.default.as(t.result):p.default.error(new d.default(d.default.INVALID_JSON,"The server returned an invalid response."))})._thenRunCallbacks(r)}};s.default.setCloudController(_)},{"./CoreManager":3,"./ParseError":13,"./ParsePromise":21,"./decode":37,"./encode":38}],3:[function(e,t,r){(function(e){"use strict";function r(e,t,r){t.forEach(function(t){if("function"!=typeof r[t])throw new Error(e+" must implement "+t+"()")})}var n={IS_NODE:void 0!==e&&!!e.versions&&!!e.versions.node&&!e.versions.electron,REQUEST_ATTEMPT_LIMIT:5,SERVER_URL:"https://api.parse.com/1",LIVEQUERY_SERVER_URL:null,VERSION:"js1.11.1",APPLICATION_ID:null,JAVASCRIPT_KEY:null,MASTER_KEY:null,USE_MASTER_KEY:!1,PERFORM_USER_REWRITE:!0,FORCE_REVOCABLE_SESSION:!1};t.exports={get:function(e){if(n.hasOwnProperty(e))return n[e];throw new Error("Configuration key not found: "+e)},set:function(e,t){n[e]=t},setAnalyticsController:function(e){r("AnalyticsController",["track"],e),n.AnalyticsController=e},getAnalyticsController:function(){return n.AnalyticsController},setCloudController:function(e){r("CloudController",["run"],e),n.CloudController=e},getCloudController:function(){return n.CloudController},setConfigController:function(e){r("ConfigController",["current","get"],e),n.ConfigController=e},getConfigController:function(){return n.ConfigController},setFileController:function(e){r("FileController",["saveFile","saveBase64"],e),n.FileController=e},getFileController:function(){return n.FileController},setInstallationController:function(e){r("InstallationController",["currentInstallationId"],e),n.InstallationController=e},getInstallationController:function(){return n.InstallationController},setObjectController:function(e){r("ObjectController",["save","fetch","destroy"],e),n.ObjectController=e},getObjectController:function(){return n.ObjectController},setObjectStateController:function(e){r("ObjectStateController",["getState","initializeState","removeState","getServerData","setServerData","getPendingOps","setPendingOp","pushPendingState","popPendingState","mergeFirstPendingState","getObjectCache","estimateAttribute","estimateAttributes","commitServerChanges","enqueueTask","clearAllState"],e),n.ObjectStateController=e},getObjectStateController:function(){return n.ObjectStateController},setPushController:function(e){r("PushController",["send"],e),n.PushController=e},getPushController:function(){return n.PushController},setQueryController:function(e){r("QueryController",["find","aggregate"],e),n.QueryController=e},getQueryController:function(){return n.QueryController},setRESTController:function(e){r("RESTController",["request","ajax"],e),n.RESTController=e},getRESTController:function(){return n.RESTController},setSchemaController:function(e){r("SchemaController",["get","create","update","delete","send","purge"],e),n.SchemaController=e},getSchemaController:function(){return n.SchemaController},setSessionController:function(e){r("SessionController",["getSession"],e),n.SessionController=e},getSessionController:function(){return n.SessionController},setStorageController:function(e){e.async?r("An async StorageController",["getItemAsync","setItemAsync","removeItemAsync"],e):r("A synchronous StorageController",["getItem","setItem","removeItem"],e),n.StorageController=e},getStorageController:function(){return n.StorageController},setAsyncStorage:function(e){n.AsyncStorage=e},getAsyncStorage:function(){return n.AsyncStorage},setUserController:function(e){r("UserController",["setCurrentUser","currentUser","currentUserAsync","signUp","logIn","become","logOut","requestPasswordReset","upgradeToRevocableSession","linkWith"],e),n.UserController=e},getUserController:function(){return n.UserController},setLiveQueryController:function(e){r("LiveQueryController",["subscribe","unsubscribe","open","close"],e),n.LiveQueryController=e},getLiveQueryController:function(){return n.LiveQueryController},setHooksController:function(e){r("HooksController",["create","get","update","remove"],e),n.HooksController=e},getHooksController:function(){return n.HooksController}}}).call(this,e("_process"))},{_process:64}],4:[function(e,t,r){"use strict";t.exports=e("events").EventEmitter},{events:177}],5:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o,i,s=e("./parseDate"),a=n(s),u=e("./ParseUser"),l=n(u),c=!1,f={authenticate:function(e){var t=this;"undefined"==typeof FB&&e.error(this,"Facebook SDK not found."),FB.login(function(r){r.authResponse?e.success&&e.success(t,{id:r.authResponse.userID,access_token:r.authResponse.accessToken,expiration_date:new Date(1e3*r.authResponse.expiresIn+(new Date).getTime()).toJSON()}):e.error&&e.error(t,r)},{scope:o})},restoreAuthentication:function(e){if(e){var t=(0,a.default)(e.expiration_date),r=t?(t.getTime()-(new Date).getTime())/1e3:0,n={userID:e.id,accessToken:e.access_token,expiresIn:r},o={};if(i)for(var s in i)o[s]=i[s];o.authResponse=n,o.status=!1;var u=FB.getAuthResponse();u&&u.userID!==n.userID&&FB.logout(),FB.init(o)}return!0},getAuthType:function(){return"facebook"},deauthenticate:function(){this.restoreAuthentication(null)}},d={init:function(e){if("undefined"==typeof FB)throw new Error("The Facebook JavaScript SDK must be loaded before calling init.");if(i={},e)for(var t in e)i[t]=e[t];if(i.status&&"undefined"!=typeof console){(console.warn||console.log||function(){}).call(console,'The "status" flag passed into FB.init, when set to true, can interfere with Parse Facebook integration, so it has been suppressed. Please call FB.getLoginStatus() explicitly if you require this behavior.')}i.status=!1,FB.init(i),l.default._registerAuthenticationProvider(f),c=!0},isLinked:function(e){return e._isLinked("facebook")},logIn:function(e,t){if(e&&"string"!=typeof e){var r={};if(t)for(var n in t)r[n]=t[n];return r.authData=e,l.default._logInWith("facebook",r)}if(!c)throw new Error("You must initialize FacebookUtils before calling logIn.");return o=e,l.default._logInWith("facebook",t)},link:function(e,t,r){if(t&&"string"!=typeof t){var n={};if(r)for(var i in r)n[i]=r[i];return n.authData=t,e._linkWith("facebook",n)}if(!c)throw new Error("You must initialize FacebookUtils before calling link.");return o=t,e._linkWith("facebook",r)},unlink:function(e,t){if(!c)throw new Error("You must initialize FacebookUtils before calling unlink.");return e._unlinkFrom("facebook",t)}};r.default=d},{"./ParseUser":27,"./parseDate":42}],6:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}function i(){return o()+o()+"-"+o()+"-"+o()+"-"+o()+"-"+o()+o()+o()}var s=e("./CoreManager"),a=(n(s),e("./ParsePromise")),u=n(a),l=e("./Storage"),c=n(l),f=null,d={currentInstallationId:function(){if("string"==typeof f)return u.default.as(f);var e=c.default.generatePath("installationId");return c.default.getItemAsync(e).then(function(t){return t?(f=t,t):(t=i(),c.default.setItemAsync(e,t).then(function(){return f=t,t}))})},_clearCache:function(){f=null},_setInstallationIdCache:function(e){f=e}};t.exports=d},{"./CoreManager":3,"./ParsePromise":21,"./Storage":31}],7:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/typeof"),i=n(o),s=e("babel-runtime/core-js/get-iterator"),a=n(s),u=e("babel-runtime/core-js/json/stringify"),l=n(u),c=e("babel-runtime/core-js/map"),f=n(c),d=e("babel-runtime/core-js/object/get-prototype-of"),h=n(d),p=e("babel-runtime/helpers/classCallCheck"),_=n(p),v=e("babel-runtime/helpers/createClass"),y=n(v),b=e("babel-runtime/helpers/possibleConstructorReturn"),g=n(b),m=e("babel-runtime/helpers/inherits"),C=n(m),k=e("./EventEmitter"),j=n(k),w=e("./ParsePromise"),O=n(w),S=e("./ParseObject"),E=n(S),P=e("./LiveQuerySubscription"),A=n(P),T={INITIALIZED:"initialized",CONNECTING:"connecting",CONNECTED:"connected",CLOSED:"closed",RECONNECTING:"reconnecting",DISCONNECTED:"disconnected"},I={CONNECT:"connect",SUBSCRIBE:"subscribe",UNSUBSCRIBE:"unsubscribe",ERROR:"error"},N={CONNECTED:"connected",SUBSCRIBED:"subscribed",UNSUBSCRIBED:"unsubscribed",ERROR:"error",CREATE:"create",UPDATE:"update",ENTER:"enter",LEAVE:"leave",DELETE:"delete"},R={CLOSE:"close",ERROR:"error",OPEN:"open"},M={OPEN:"open",CLOSE:"close",ERROR:"error",CREATE:"create",UPDATE:"update",ENTER:"enter",LEAVE:"leave",DELETE:"delete"},x=function(e){return Math.random()*Math.min(30,Math.pow(2,e)-1)*1e3},L=function(e){function t(e){var r=e.applicationId,n=e.serverURL,o=e.javascriptKey,i=e.masterKey,s=e.sessionToken;(0,_.default)(this,t);var a=(0,g.default)(this,(t.__proto__||(0,h.default)(t)).call(this));if(!n||0!==n.indexOf("ws"))throw new Error("You need to set a proper Parse LiveQuery server url before using LiveQueryClient");return a.reconnectHandle=null,a.attempts=1,a.id=0,a.requestId=1,a.serverURL=n,a.applicationId=r,a.javascriptKey=o,a.masterKey=i,a.sessionToken=s,a.connectPromise=new O.default,a.subscriptions=new f.default,a.state=T.INITIALIZED,a}return(0,C.default)(t,e),(0,y.default)(t,[{key:"shouldOpen",value:function(){return this.state===T.INITIALIZED||this.state===T.DISCONNECTED}},{key:"subscribe",value:function(e,t){var r=this;if(e){var n=e.className,o=e.toJSON(),i=o.where,s=o.keys?o.keys.split(","):void 0,a={op:I.SUBSCRIBE,requestId:this.requestId,query:{className:n,where:i,fields:s}};t&&(a.sessionToken=t);var u=new A.default(this.requestId,e,t);return this.subscriptions.set(this.requestId,u),this.requestId+=1,this.connectPromise.then(function(){r.socket.send((0,l.default)(a))}),u.on("error",function(){}),u}}},{key:"unsubscribe",value:function(e){var t=this;if(e){this.subscriptions.delete(e.id);var r={op:I.UNSUBSCRIBE,requestId:e.id};this.connectPromise.then(function(){t.socket.send((0,l.default)(r))})}}},{key:"open",value:function(){var e=this,t=this._getWebSocketImplementation();if(!t)return void this.emit(R.ERROR,"Can not find WebSocket implementation");this.state!==T.RECONNECTING&&(this.state=T.CONNECTING),this.socket=new t(this.serverURL),this.socket.onopen=function(){e._handleWebSocketOpen()},this.socket.onmessage=function(t){e._handleWebSocketMessage(t)},this.socket.onclose=function(){e._handleWebSocketClose()},this.socket.onerror=function(t){e._handleWebSocketError(t)}}},{key:"resubscribe",value:function(){var e=this;this.subscriptions.forEach(function(t,r){var n=t.query,o=n.toJSON(),i=o.where,s=o.keys?o.keys.split(","):void 0,a=n.className,u=t.sessionToken,c={op:I.SUBSCRIBE,requestId:r,query:{className:a,where:i,fields:s}};u&&(c.sessionToken=u),e.connectPromise.then(function(){e.socket.send((0,l.default)(c))})})}},{key:"close",value:function(){if(this.state!==T.INITIALIZED&&this.state!==T.DISCONNECTED){this.state=T.DISCONNECTED,this.socket.close();var e=!0,t=!1,r=void 0;try{for(var n,o=(0,a.default)(this.subscriptions.values());!(e=(n=o.next()).done);e=!0){n.value.emit(M.CLOSE)}}catch(e){t=!0,r=e}finally{try{!e&&o.return&&o.return()}finally{if(t)throw r}}this._handleReset(),this.emit(R.CLOSE)}}},{key:"_getWebSocketImplementation",value:function(){return"function"==typeof WebSocket||"object"===("undefined"==typeof WebSocket?"undefined":(0,i.default)(WebSocket))?WebSocket:null}},{key:"_handleReset",value:function(){this.attempts=1,this.id=0,this.requestId=1,this.connectPromise=new O.default,this.subscriptions=new f.default}},{key:"_handleWebSocketOpen",value:function(){this.attempts=1;var e={op:I.CONNECT,applicationId:this.applicationId,javascriptKey:this.javascriptKey,masterKey:this.masterKey,sessionToken:this.sessionToken};this.socket.send((0,l.default)(e))}},{key:"_handleWebSocketMessage",value:function(e){var t=e.data;"string"==typeof t&&(t=JSON.parse(t));var r=null;switch(t.requestId&&(r=this.subscriptions.get(t.requestId)),t.op){case N.CONNECTED:this.state===T.RECONNECTING&&this.resubscribe(),this.emit(R.OPEN),this.id=t.clientId,this.connectPromise.resolve(),this.state=T.CONNECTED;break;case N.SUBSCRIBED:r&&r.emit(M.OPEN);break;case N.ERROR:t.requestId?r&&r.emit(M.ERROR,t.error):this.emit(R.ERROR,t.error);break;case N.UNSUBSCRIBED:break;default:var n=t.object.className;delete t.object.__type,delete t.object.className;var o=new E.default(n);if(o._finishFetch(t.object),!r)break;r.emit(t.op,o)}}},{key:"_handleWebSocketClose",value:function(){if(this.state!==T.DISCONNECTED){this.state=T.CLOSED,this.emit(R.CLOSE);var e=!0,t=!1,r=void 0;try{for(var n,o=(0,a.default)(this.subscriptions.values());!(e=(n=o.next()).done);e=!0){n.value.emit(M.CLOSE)}}catch(e){t=!0,r=e}finally{try{!e&&o.return&&o.return()}finally{if(t)throw r}}this._handleReconnect()}}},{key:"_handleWebSocketError",value:function(e){this.emit(R.ERROR,e);var t=!0,r=!1,n=void 0;try{for(var o,i=(0,a.default)(this.subscriptions.values());!(t=(o=i.next()).done);t=!0){o.value.emit(M.ERROR)}}catch(e){r=!0,n=e}finally{try{!t&&i.return&&i.return()}finally{if(r)throw n}}this._handleReconnect()}},{key:"_handleReconnect",value:function(){var e=this;if(this.state!==T.DISCONNECTED){this.state=T.RECONNECTING;var t=x(this.attempts);this.reconnectHandle&&clearTimeout(this.reconnectHandle),this.reconnectHandle=setTimeout(function(){e.attempts++,e.connectPromise=new O.default,e.open()}.bind(this),t)}}}]),t}(j.default);r.default=L},{"./EventEmitter":4,"./LiveQuerySubscription":8,"./ParseObject":18,"./ParsePromise":21,"babel-runtime/core-js/get-iterator":45,"babel-runtime/core-js/json/stringify":46,"babel-runtime/core-js/map":47,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/inherits":61,"babel-runtime/helpers/possibleConstructorReturn":62,"babel-runtime/helpers/typeof":63}],8:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/object/get-prototype-of"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),a=n(s),u=e("babel-runtime/helpers/createClass"),l=n(u),c=e("babel-runtime/helpers/possibleConstructorReturn"),f=n(c),d=e("babel-runtime/helpers/inherits"),h=n(d),p=e("./EventEmitter"),_=n(p),v=e("./CoreManager"),y=n(v),b=function(e){function t(e,r,n){(0,a.default)(this,t);var o=(0,f.default)(this,(t.__proto__||(0,i.default)(t)).call(this));return o.id=e,o.query=r,o.sessionToken=n,o}return(0,h.default)(t,e),(0,l.default)(t,[{key:"unsubscribe",value:function(){var e=this,t=this;y.default.getLiveQueryController().getDefaultLiveQueryClient().then(function(r){r.unsubscribe(t),t.emit("close"),e.resolve()})}}]),t}(_.default);r.default=b},{"./CoreManager":3,"./EventEmitter":4,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/inherits":61,"babel-runtime/helpers/possibleConstructorReturn":62}],9:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(){return{serverData:{},pendingOps:[{}],objectCache:{},tasks:new E.default,existed:!1}}function i(e,t){for(var r in t)void 0!==t[r]?e[r]=t[r]:delete e[r]}function s(e,t,r){var n=e.length-1;r?e[n][t]=r:delete e[n][t]}function a(e){e.push({})}function u(e){var t=e.shift();return e.length||(e[0]={}),t}function l(e){var t=u(e),r=e[0];for(var n in t)if(r[n]&&t[n]){var o=r[n].mergeWith(t[n]);o&&(r[n]=o)}else r[n]=t[n]}function c(e,t,r,n,o){for(var i=e[o],s=0;s<t.length;s++)t[s][o]&&(t[s][o]instanceof P.RelationOp?n&&(i=t[s][o].applyTo(i,{className:r,id:n},o)):i=t[s][o].applyTo(i));return i}function f(e,t,r,n){var o={},i=void 0;for(i in e)o[i]=e[i];for(var s=0;s<t.length;s++)for(i in t[s])t[s][i]instanceof P.RelationOp?n&&(o[i]=t[s][i].applyTo(o[i],{className:r,id:n},i)):o[i]=t[s][i].applyTo(o[i]);return o}function d(e,t,r){for(var n in r){var o=r[n];if(e[n]=o,o&&"object"===(void 0===o?"undefined":(0,v.default)(o))&&!(o instanceof k.default)&&!(o instanceof m.default)&&!(o instanceof O.default)){var i=(0,b.default)(o,!1,!0);t[n]=(0,p.default)(i)}}}Object.defineProperty(r,"__esModule",{value:!0});var h=e("babel-runtime/core-js/json/stringify"),p=n(h),_=e("babel-runtime/helpers/typeof"),v=n(_);r.defaultState=o,r.setServerData=i,r.setPendingOp=s,r.pushPendingState=a,r.popPendingState=u,r.mergeFirstPendingState=l,r.estimateAttribute=c,r.estimateAttributes=f,r.commitServerChanges=d;var y=e("./encode"),b=n(y),g=e("./ParseFile"),m=n(g),C=e("./ParseObject"),k=n(C),j=e("./ParsePromise"),w=(n(j),e("./ParseRelation")),O=n(w),S=e("./TaskQueue"),E=n(S),P=e("./ParseOp")},{"./ParseFile":14,"./ParseObject":18,"./ParseOp":19,"./ParsePromise":21,"./ParseRelation":23,"./TaskQueue":33,"./encode":38,"babel-runtime/core-js/json/stringify":46,"babel-runtime/helpers/typeof":63}],10:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var o=e("./decode"),i=n(o),s=e("./encode"),a=n(s),u=e("./CoreManager"),l=n(u),c=e("./InstallationController"),f=n(c),d=e("./ParseOp"),h=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(d),p=e("./RESTController"),_=n(p),v={initialize:function(e,t){l.default.get("IS_NODE")&&console.log("It looks like you're using the browser version of the SDK in a node.js environment. You should require('parse/node') instead."),v._initialize(e,t)},_initialize:function(e,t,r){l.default.set("APPLICATION_ID",e),l.default.set("JAVASCRIPT_KEY",t),l.default.set("MASTER_KEY",r),l.default.set("USE_MASTER_KEY",!1)},setAsyncStorage:function(e){l.default.setAsyncStorage(e)}};Object.defineProperty(v,"applicationId",{get:function(){return l.default.get("APPLICATION_ID")},set:function(e){l.default.set("APPLICATION_ID",e)}}),Object.defineProperty(v,"javaScriptKey",{get:function(){return l.default.get("JAVASCRIPT_KEY")},set:function(e){l.default.set("JAVASCRIPT_KEY",e)}}),Object.defineProperty(v,"masterKey",{get:function(){return l.default.get("MASTER_KEY")},set:function(e){l.default.set("MASTER_KEY",e)}}),Object.defineProperty(v,"serverURL",{get:function(){return l.default.get("SERVER_URL")},set:function(e){l.default.set("SERVER_URL",e)}}),Object.defineProperty(v,"liveQueryServerURL",{get:function(){return l.default.get("LIVEQUERY_SERVER_URL")},set:function(e){l.default.set("LIVEQUERY_SERVER_URL",e)}}),v.ACL=e("./ParseACL").default,v.Analytics=e("./Analytics"),v.Cloud=e("./Cloud"),v.CoreManager=e("./CoreManager"),v.Config=e("./ParseConfig").default,v.Error=e("./ParseError").default,v.FacebookUtils=e("./FacebookUtils").default,v.File=e("./ParseFile").default,v.GeoPoint=e("./ParseGeoPoint").default,v.Polygon=e("./ParsePolygon").default,v.Installation=e("./ParseInstallation").default,v.Object=e("./ParseObject").default,v.Op={Set:h.SetOp,Unset:h.UnsetOp,Increment:h.IncrementOp,Add:h.AddOp,Remove:h.RemoveOp,AddUnique:h.AddUniqueOp,Relation:h.RelationOp},v.Promise=e("./ParsePromise").default,v.Push=e("./Push"),v.Query=e("./ParseQuery").default,v.Relation=e("./ParseRelation").default,v.Role=e("./ParseRole").default,v.Schema=e("./ParseSchema").default,v.Session=e("./ParseSession").default,v.Storage=e("./Storage"),v.User=e("./ParseUser").default,v.LiveQuery=e("./ParseLiveQuery").default,v.LiveQueryClient=e("./LiveQueryClient").default,v._request=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return l.default.getRESTController().request.apply(null,t)},v._ajax=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return l.default.getRESTController().ajax.apply(null,t)},v._decode=function(e,t){return(0,i.default)(t)},v._encode=function(e,t,r){return(0,a.default)(e,r)},v._getInstallationId=function(){return l.default.getInstallationController().currentInstallationId()},l.default.setInstallationController(f.default),l.default.setRESTController(_.default),v.Parse=v,t.exports=v},{"./Analytics":1,"./Cloud":2,"./CoreManager":3,"./FacebookUtils":5,"./InstallationController":6,"./LiveQueryClient":7,"./ParseACL":11,"./ParseConfig":12,"./ParseError":13,"./ParseFile":14,"./ParseGeoPoint":15,"./ParseInstallation":16,"./ParseLiveQuery":17,"./ParseObject":18,"./ParseOp":19,"./ParsePolygon":20,"./ParsePromise":21,"./ParseQuery":22,"./ParseRelation":23,"./ParseRole":24,"./ParseSchema":25,"./ParseSession":26,"./ParseUser":27,"./Push":28,"./RESTController":29,"./Storage":31,"./decode":37,"./encode":38}],11:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/object/keys"),i=n(o),s=e("babel-runtime/helpers/typeof"),a=n(s),u=e("babel-runtime/helpers/classCallCheck"),l=n(u),c=e("babel-runtime/helpers/createClass"),f=n(c),d=e("./ParseRole"),h=n(d),p=e("./ParseUser"),_=n(p),v=function(){function e(t){if((0,l.default)(this,e),this.permissionsById={},t&&"object"===(void 0===t?"undefined":(0,a.default)(t)))if(t instanceof _.default)this.setReadAccess(t,!0),this.setWriteAccess(t,!0);else for(var r in t){var n=t[r];if("string"!=typeof r)throw new TypeError("Tried to create an ACL with an invalid user id.");this.permissionsById[r]={};for(var o in n){var i=n[o];if("read"!==o&&"write"!==o)throw new TypeError("Tried to create an ACL with an invalid permission type.");if("boolean"!=typeof i)throw new TypeError("Tried to create an ACL with an invalid permission value.");this.permissionsById[r][o]=i}}else if("function"==typeof t)throw new TypeError("ParseACL constructed with a function. Did you forget ()?")}return(0,f.default)(e,[{key:"toJSON",value:function(){var e={};for(var t in this.permissionsById)e[t]=this.permissionsById[t];return e}},{key:"equals",value:function(t){if(!(t instanceof e))return!1;var r=(0,i.default)(this.permissionsById),n=(0,i.default)(t.permissionsById);if(r.length!==n.length)return!1;for(var o in this.permissionsById){if(!t.permissionsById[o])return!1;if(this.permissionsById[o].read!==t.permissionsById[o].read)return!1;if(this.permissionsById[o].write!==t.permissionsById[o].write)return!1}return!0}},{key:"_setAccess",value:function(e,t,r){if(t instanceof _.default)t=t.id;else if(t instanceof h.default){var n=t.getName();if(!n)throw new TypeError("Role must have a name");t="role:"+n}if("string"!=typeof t)throw new TypeError("userId must be a string.");if("boolean"!=typeof r)throw new TypeError("allowed must be either true or false.");var o=this.permissionsById[t];if(!o){if(!r)return;o={},this.permissionsById[t]=o}r?this.permissionsById[t][e]=!0:(delete o[e],0===(0,i.default)(o).length&&delete this.permissionsById[t])}},{key:"_getAccess",value:function(e,t){if(t instanceof _.default){if(!(t=t.id))throw new Error("Cannot get access for a ParseUser without an ID")}else if(t instanceof h.default){var r=t.getName();if(!r)throw new TypeError("Role must have a name");t="role:"+r}var n=this.permissionsById[t];return!!n&&!!n[e]}},{key:"setReadAccess",value:function(e,t){this._setAccess("read",e,t)}},{key:"getReadAccess",value:function(e){return this._getAccess("read",e)}},{key:"setWriteAccess",value:function(e,t){this._setAccess("write",e,t)}},{key:"getWriteAccess",value:function(e){return this._getAccess("write",e)}},{key:"setPublicReadAccess",value:function(e){this.setReadAccess("*",e)}},{key:"getPublicReadAccess",value:function(){return this.getReadAccess("*")}},{key:"setPublicWriteAccess",value:function(e){this.setWriteAccess("*",e)}},{key:"getPublicWriteAccess",value:function(){return this.getWriteAccess("*")}},{key:"getRoleReadAccess",value:function(e){if(e instanceof h.default&&(e=e.getName()),"string"!=typeof e)throw new TypeError("role must be a ParseRole or a String");return this.getReadAccess("role:"+e)}},{key:"getRoleWriteAccess",value:function(e){if(e instanceof h.default&&(e=e.getName()),"string"!=typeof e)throw new TypeError("role must be a ParseRole or a String");return this.getWriteAccess("role:"+e)}},{key:"setRoleReadAccess",value:function(e,t){if(e instanceof h.default&&(e=e.getName()),"string"!=typeof e)throw new TypeError("role must be a ParseRole or a String");this.setReadAccess("role:"+e,t)}},{key:"setRoleWriteAccess",value:function(e,t){if(e instanceof h.default&&(e=e.getName()),"string"!=typeof e)throw new TypeError("role must be a ParseRole or a String");this.setWriteAccess("role:"+e,t)}}]),e}();r.default=v},{"./ParseRole":24,"./ParseUser":27,"babel-runtime/core-js/object/keys":53,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/typeof":63}],12:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){try{var t=JSON.parse(e);if(t&&"object"===(void 0===t?"undefined":(0,u.default)(t)))return(0,v.default)(t)}catch(e){return null}}Object.defineProperty(r,"__esModule",{value:!0});var i=e("babel-runtime/core-js/json/stringify"),s=n(i),a=e("babel-runtime/helpers/typeof"),u=n(a),l=e("babel-runtime/helpers/classCallCheck"),c=n(l),f=e("babel-runtime/helpers/createClass"),d=n(f),h=e("./CoreManager"),p=n(h),_=e("./decode"),v=n(_),y=e("./encode"),b=(n(y),e("./escape")),g=n(b),m=e("./ParseError"),C=n(m),k=e("./ParsePromise"),j=n(k),w=e("./Storage"),O=n(w),S=function(){function e(){(0,c.default)(this,e),this.attributes={},this._escapedAttributes={}}return(0,d.default)(e,[{key:"get",value:function(e){return this.attributes[e]}},{key:"escape",value:function(e){var t=this._escapedAttributes[e];if(t)return t;var r=this.attributes[e],n="";return null!=r&&(n=(0,g.default)(r.toString())),this._escapedAttributes[e]=n,n}}],[{key:"current",value:function(){return p.default.getConfigController().current()}},{key:"get",value:function(e){return e=e||{},p.default.getConfigController().get()._thenRunCallbacks(e)}}]),e}(),E=null,P={current:function(){if(E)return E;var e,t=new S,r=O.default.generatePath("currentConfig");if(!O.default.async()){if(e=O.default.getItem(r)){var n=o(e);n&&(t.attributes=n,E=t)}return t}return O.default.getItemAsync(r).then(function(e){if(e){var r=o(e);r&&(t.attributes=r,E=t)}return t})},get:function(){return p.default.getRESTController().request("GET","config",{},{}).then(function(e){if(!e||!e.params){var t=new C.default(C.default.INVALID_JSON,"Config JSON response invalid.");return j.default.error(t)}var r=new S;r.attributes={};for(var n in e.params)r.attributes[n]=(0,v.default)(e.params[n]);return E=r,O.default.setItemAsync(O.default.generatePath("currentConfig"),(0,s.default)(e.params)).then(function(){return r})})}};p.default.setConfigController(P),r.default=S},{"./CoreManager":3,"./ParseError":13,"./ParsePromise":21,"./Storage":31,"./decode":37,"./encode":38,"./escape":40,"babel-runtime/core-js/json/stringify":46,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/typeof":63}],13:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),a=n(s),u=function(){function e(t,r){(0,i.default)(this,e),this.code=t,this.message=r}return(0,a.default)(e,[{key:"toString",value:function(){return"ParseError: "+this.code+" "+this.message}}]),e}();u.OTHER_CAUSE=-1,u.INTERNAL_SERVER_ERROR=1,u.CONNECTION_FAILED=100,u.OBJECT_NOT_FOUND=101,u.INVALID_QUERY=102,u.INVALID_CLASS_NAME=103,u.MISSING_OBJECT_ID=104,u.INVALID_KEY_NAME=105,u.INVALID_POINTER=106,u.INVALID_JSON=107,u.COMMAND_UNAVAILABLE=108,u.NOT_INITIALIZED=109,u.INCORRECT_TYPE=111,u.INVALID_CHANNEL_NAME=112,u.PUSH_MISCONFIGURED=115,u.OBJECT_TOO_LARGE=116,u.OPERATION_FORBIDDEN=119,u.CACHE_MISS=120,u.INVALID_NESTED_KEY=121,u.INVALID_FILE_NAME=122,u.INVALID_ACL=123,u.TIMEOUT=124,u.INVALID_EMAIL_ADDRESS=125,u.MISSING_CONTENT_TYPE=126,u.MISSING_CONTENT_LENGTH=127,u.INVALID_CONTENT_LENGTH=128,u.FILE_TOO_LARGE=129,u.FILE_SAVE_ERROR=130,u.DUPLICATE_VALUE=137,u.INVALID_ROLE_NAME=139,u.EXCEEDED_QUOTA=140,u.SCRIPT_FAILED=141,u.VALIDATION_ERROR=142,u.INVALID_IMAGE_DATA=143,u.UNSAVED_FILE_ERROR=151,u.INVALID_PUSH_TIME_ERROR=152,u.FILE_DELETE_ERROR=153,u.REQUEST_LIMIT_EXCEEDED=155,u.INVALID_EVENT_NAME=160,u.USERNAME_MISSING=200,u.PASSWORD_MISSING=201,u.USERNAME_TAKEN=202,u.EMAIL_TAKEN=203,u.EMAIL_MISSING=204,u.EMAIL_NOT_FOUND=205,u.SESSION_MISSING=206,u.MUST_CREATE_USER_THROUGH_SIGNUP=207,u.ACCOUNT_ALREADY_LINKED=208,u.INVALID_SESSION_TOKEN=209,u.LINKED_ID_MISSING=250,u.INVALID_LINKED_SESSION=251,u.UNSUPPORTED_SERVICE=252,u.INVALID_SCHEMA_OPERATION=255,u.AGGREGATE_ERROR=600,u.FILE_READ_ERROR=601,u.X_DOMAIN_REQUEST=602,r.default=u},{"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59}],14:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){if(e<26)return String.fromCharCode(65+e);if(e<52)return String.fromCharCode(e-26+97);if(e<62)return String.fromCharCode(e-52+48);if(62===e)return"+";if(63===e)return"/";throw new TypeError("Tried to encode large digit "+e+" in base64.")}Object.defineProperty(r,"__esModule",{value:!0});var i=e("babel-runtime/helpers/classCallCheck"),s=n(i),a=e("babel-runtime/helpers/createClass"),u=n(a),l=e("./CoreManager"),c=n(l),f=e("./ParsePromise"),d=(n(f),/^data:([a-zA-Z]*\/[a-zA-Z+.-]*);(charset=[a-zA-Z0-9\-\/\s]*,)?base64,/),h=function(){function e(t,r,n){(0,s.default)(this,e);var o=n||"";if(this._name=t,void 0!==r)if(Array.isArray(r))this._source={format:"base64",base64:e.encodeBase64(r),type:o};else if("undefined"!=typeof File&&r instanceof File)this._source={format:"file",file:r,type:o};else{
if(!r||"string"!=typeof r.base64)throw new TypeError("Cannot create a Parse.File with that data.");var i=r.base64,a=i.indexOf(",");if(-1!==a){var u=d.exec(i.slice(0,a+1));this._source={format:"base64",base64:i.slice(a+1),type:u[1]}}else this._source={format:"base64",base64:i,type:o}}}return(0,u.default)(e,[{key:"name",value:function(){return this._name}},{key:"url",value:function(e){if(e=e||{},this._url)return e.forceSecure?this._url.replace(/^http:\/\//i,"https://"):this._url}},{key:"save",value:function(e){var t=this;e=e||{};var r=c.default.getFileController();if(this._previousSave||("file"===this._source.format?this._previousSave=r.saveFile(this._name,this._source,e).then(function(e){return t._name=e.name,t._url=e.url,t}):this._previousSave=r.saveBase64(this._name,this._source,e).then(function(e){return t._name=e.name,t._url=e.url,t})),this._previousSave)return this._previousSave._thenRunCallbacks(e)}},{key:"toJSON",value:function(){return{__type:"File",name:this._name,url:this._url}}},{key:"equals",value:function(t){return this===t||t instanceof e&&this.name()===t.name()&&this.url()===t.url()&&void 0!==this.url()}}],[{key:"fromJSON",value:function(t){if("File"!==t.__type)throw new TypeError("JSON object does not represent a ParseFile");var r=new e(t.name);return r._url=t.url,r}},{key:"encodeBase64",value:function(e){var t=[];t.length=Math.ceil(e.length/3);for(var r=0;r<t.length;r++){var n=e[3*r],i=e[3*r+1]||0,s=e[3*r+2]||0,a=3*r+1<e.length,u=3*r+2<e.length;t[r]=[o(n>>2&63),o(n<<4&48|i>>4&15),a?o(i<<2&60|s>>6&3):"=",u?o(63&s):"="].join("")}return t.join("")}}]),e}(),p={saveFile:function(e,t){if("file"!==t.format)throw new Error("saveFile can only be used with File-type sources.");var r={"X-Parse-Application-ID":c.default.get("APPLICATION_ID"),"X-Parse-JavaScript-Key":c.default.get("JAVASCRIPT_KEY"),"Content-Type":t.type||(t.file?t.file.type:null)},n=c.default.get("SERVER_URL");return"/"!==n[n.length-1]&&(n+="/"),n+="files/"+e,c.default.getRESTController().ajax("POST",n,t.file,r)},saveBase64:function(e,t,r){if("base64"!==t.format)throw new Error("saveBase64 can only be used with Base64-type sources.");var n={base64:t.base64};return t.type&&(n._ContentType=t.type),c.default.getRESTController().request("POST","files/"+e,n,r)}};c.default.setFileController(p),r.default=h},{"./CoreManager":3,"./ParsePromise":21,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59}],15:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/typeof"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),a=n(s),u=e("babel-runtime/helpers/createClass"),l=n(u),c=e("./ParsePromise"),f=n(c),d=function(){function e(t,r){(0,a.default)(this,e),Array.isArray(t)?(e._validate(t[0],t[1]),this._latitude=t[0],this._longitude=t[1]):"object"===(void 0===t?"undefined":(0,i.default)(t))?(e._validate(t.latitude,t.longitude),this._latitude=t.latitude,this._longitude=t.longitude):"number"==typeof t&&"number"==typeof r?(e._validate(t,r),this._latitude=t,this._longitude=r):(this._latitude=0,this._longitude=0)}return(0,l.default)(e,[{key:"toJSON",value:function(){return e._validate(this._latitude,this._longitude),{__type:"GeoPoint",latitude:this._latitude,longitude:this._longitude}}},{key:"equals",value:function(t){return t instanceof e&&this.latitude===t.latitude&&this.longitude===t.longitude}},{key:"radiansTo",value:function(e){var t=Math.PI/180,r=this.latitude*t,n=this.longitude*t,o=e.latitude*t,i=e.longitude*t,s=Math.sin((r-o)/2),a=Math.sin((n-i)/2),u=s*s+Math.cos(r)*Math.cos(o)*a*a;return u=Math.min(1,u),2*Math.asin(Math.sqrt(u))}},{key:"kilometersTo",value:function(e){return 6371*this.radiansTo(e)}},{key:"milesTo",value:function(e){return 3958.8*this.radiansTo(e)}},{key:"latitude",get:function(){return this._latitude},set:function(t){e._validate(t,this.longitude),this._latitude=t}},{key:"longitude",get:function(){return this._longitude},set:function(t){e._validate(this.latitude,t),this._longitude=t}}],[{key:"_validate",value:function(e,t){if(e!==e||t!==t)throw new TypeError("GeoPoint latitude and longitude must be valid numbers");if(e<-90)throw new TypeError("GeoPoint latitude out of bounds: "+e+" < -90.0.");if(e>90)throw new TypeError("GeoPoint latitude out of bounds: "+e+" > 90.0.");if(t<-180)throw new TypeError("GeoPoint longitude out of bounds: "+t+" < -180.0.");if(t>180)throw new TypeError("GeoPoint longitude out of bounds: "+t+" > 180.0.")}},{key:"current",value:function(t){var r=new f.default;return navigator.geolocation.getCurrentPosition(function(t){r.resolve(new e(t.coords.latitude,t.coords.longitude))},function(e){r.reject(e)}),r._thenRunCallbacks(t)}}]),e}();r.default=d},{"./ParsePromise":21,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/typeof":63}],16:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/typeof"),i=n(o),s=e("babel-runtime/core-js/object/get-prototype-of"),a=n(s),u=e("babel-runtime/helpers/classCallCheck"),l=n(u),c=e("babel-runtime/helpers/possibleConstructorReturn"),f=n(c),d=e("babel-runtime/helpers/inherits"),h=n(d),p=e("./ParseObject"),_=n(p),v=function(e){function t(e){(0,l.default)(this,t);var r=(0,f.default)(this,(t.__proto__||(0,a.default)(t)).call(this,"_Installation"));if(e&&"object"===(void 0===e?"undefined":(0,i.default)(e))&&!r.set(e||{}))throw new Error("Can't create an invalid Session");return r}return(0,h.default)(t,e),t}(_.default);r.default=v,_.default.registerSubclass("_Installation",v)},{"./ParseObject":18,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/inherits":61,"babel-runtime/helpers/possibleConstructorReturn":62,"babel-runtime/helpers/typeof":63}],17:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(){h.default.getLiveQueryController().open()}function i(){h.default.getLiveQueryController().close()}function s(){return h.default.getUserController().currentUserAsync().then(function(e){return e?e.getSessionToken():void 0})}function a(){return h.default.getLiveQueryController().getDefaultLiveQueryClient()}Object.defineProperty(r,"__esModule",{value:!0});var u=e("./EventEmitter"),l=n(u),c=e("./LiveQueryClient"),f=n(c),d=e("./CoreManager"),h=n(d),p=e("./ParsePromise"),_=n(p),v=new l.default;v.open=o,v.close=i,v.on("error",function(){}),r.default=v;var y=void 0,b={setDefaultLiveQueryClient:function(e){y=e},getDefaultLiveQueryClient:function(){return y?_.default.as(y):s().then(function(e){var t=h.default.get("LIVEQUERY_SERVER_URL");if(t&&0!==t.indexOf("ws"))throw new Error("You need to set a proper Parse LiveQuery server url before using LiveQueryClient");if(!t){var r=h.default.get("SERVER_URL"),n="ws://";0===r.indexOf("https")&&(n="wss://");t=n+r.replace(/^https?:\/\//,""),h.default.set("LIVEQUERY_SERVER_URL",t)}var o=h.default.get("APPLICATION_ID"),i=h.default.get("JAVASCRIPT_KEY"),s=h.default.get("MASTER_KEY");return y=new f.default({applicationId:o,serverURL:t,javascriptKey:i,masterKey:s,sessionToken:e}),y.on("error",function(e){v.emit("error",e)}),y.on("open",function(){v.emit("open")}),y.on("close",function(){v.emit("close")}),y})},open:function(){var e=this;a().then(function(t){e.resolve(t.open())})},close:function(){var e=this;a().then(function(t){e.resolve(t.close())})},subscribe:function(e){var t=this,r=new l.default;return a().then(function(n){return n.shouldOpen()&&n.open(),s().then(function(o){var i=n.subscribe(e,o);r.id=i.id,r.query=i.query,r.sessionToken=i.sessionToken,r.unsubscribe=i.unsubscribe,i.on("open",function(){r.emit("open")}),i.on("create",function(e){r.emit("create",e)}),i.on("update",function(e){r.emit("update",e)}),i.on("enter",function(e){r.emit("enter",e)}),i.on("leave",function(e){r.emit("leave",e)}),i.on("delete",function(e){r.emit("delete",e)}),i.on("close",function(e){r.emit("close",e)}),i.on("error",function(e){r.emit("error",e)}),t.resolve()})}),r},unsubscribe:function(e){var t=this;a().then(function(r){t.resolve(r.unsubscribe(e))})},_clearCachedDefaultClient:function(){y=null}};h.default.setLiveQueryController(b)},{"./CoreManager":3,"./EventEmitter":4,"./LiveQueryClient":7,"./ParsePromise":21}],18:[function(e,t,r){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(){var e=j.default.get("SERVER_URL");"/"!==e[e.length-1]&&(e+="/");var t=e.replace(/https?:\/\//,"");return t.substr(t.indexOf("/"))}Object.defineProperty(r,"__esModule",{value:!0});var s=e("babel-runtime/core-js/object/define-property"),a=o(s),u=e("babel-runtime/core-js/object/create"),l=o(u),c=e("babel-runtime/core-js/object/freeze"),f=o(c),d=e("babel-runtime/core-js/json/stringify"),h=o(d),p=e("babel-runtime/core-js/object/keys"),_=o(p),v=e("babel-runtime/helpers/typeof"),y=o(v),b=e("babel-runtime/helpers/classCallCheck"),g=o(b),m=e("babel-runtime/helpers/createClass"),C=o(m),k=e("./CoreManager"),j=o(k),w=e("./canBeSerialized"),O=o(w),S=e("./decode"),E=o(S),P=e("./encode"),A=o(P),T=e("./equals"),I=(o(T),e("./escape")),N=o(I),R=e("./ParseACL"),M=o(R),x=e("./parseDate"),L=o(x),D=e("./ParseError"),U=o(D),F=e("./ParseFile"),q=o(F),K=e("./ParseOp"),J=e("./ParsePromise"),W=o(J),Q=e("./ParseQuery"),B=o(Q),G=e("./ParseRelation"),V=o(G),z=e("./SingleInstanceStateController"),Y=n(z),H=e("./unique"),$=o(H),X=e("./UniqueInstanceStateController"),Z=n(X),ee=e("./unsavedChildren"),te=o(ee),re={},ne=0,oe=0,ie=!j.default.get("IS_NODE");ie?j.default.setObjectStateController(Y):j.default.setObjectStateController(Z);var se=function(){function e(t,r,n){(0,g.default)(this,e),"function"==typeof this.initialize&&this.initialize.apply(this,arguments);var o=null;if(this._objCount=oe++,"string"==typeof t)this.className=t,r&&"object"===(void 0===r?"undefined":(0,y.default)(r))&&(o=r);else if(t&&"object"===(void 0===t?"undefined":(0,y.default)(t))){this.className=t.className,o={};for(var i in t)"className"!==i&&(o[i]=t[i]);r&&"object"===(void 0===r?"undefined":(0,y.default)(r))&&(n=r)}if(o&&!this.set(o,n))throw new Error("Can't create an invalid Parse Object")}return(0,C.default)(e,[{key:"_getId",value:function(){if("string"==typeof this.id)return this.id;if("string"==typeof this._localId)return this._localId;var e="local"+String(ne++);return this._localId=e,e}},{key:"_getStateIdentifier",value:function(){if(ie){var e=this.id;return e||(e=this._getId()),{id:e,className:this.className}}return this}},{key:"_getServerData",value:function(){return j.default.getObjectStateController().getServerData(this._getStateIdentifier())}},{key:"_clearServerData",value:function(){var e=this._getServerData(),t={};for(var r in e)t[r]=void 0;j.default.getObjectStateController().setServerData(this._getStateIdentifier(),t)}},{key:"_getPendingOps",value:function(){return j.default.getObjectStateController().getPendingOps(this._getStateIdentifier())}},{key:"_clearPendingOps",value:function(){var e=this._getPendingOps(),t=e[e.length-1];(0,_.default)(t).forEach(function(e){delete t[e]})}},{key:"_getDirtyObjectAttributes",value:function(){var t=this.attributes,r=j.default.getObjectStateController(),n=r.getObjectCache(this._getStateIdentifier()),o={};for(var i in t){var s=t[i];if(s&&"object"===(void 0===s?"undefined":(0,y.default)(s))&&!(s instanceof e)&&!(s instanceof q.default)&&!(s instanceof V.default))try{var a=(0,A.default)(s,!1,!0),u=(0,h.default)(a);n[i]!==u&&(o[i]=s)}catch(e){o[i]=s}}return o}},{key:"_toFullJSON",value:function(e){var t=this.toJSON(e);return t.__type="Object",t.className=this.className,t}},{key:"_getSaveJSON",value:function(){var e=this._getPendingOps(),t=this._getDirtyObjectAttributes(),r={};for(var n in t)r[n]=new K.SetOp(t[n]).toJSON();for(n in e[0])r[n]=e[0][n].toJSON();return r}},{key:"_getSaveParams",value:function(){var e=this.id?"PUT":"POST",t=this._getSaveJSON(),r="classes/"+this.className;return this.id?r+="/"+this.id:"_User"===this.className&&(r="users"),{method:e,body:t,path:r}}},{key:"_finishFetch",value:function(e){!this.id&&e.objectId&&(this.id=e.objectId);var t=j.default.getObjectStateController();t.initializeState(this._getStateIdentifier());var r={};for(var n in e)"ACL"===n?r[n]=new M.default(e[n]):"objectId"!==n&&(r[n]=(0,E.default)(e[n]),r[n]instanceof V.default&&r[n]._ensureParentAndKey(this,n));r.createdAt&&"string"==typeof r.createdAt&&(r.createdAt=(0,L.default)(r.createdAt)),r.updatedAt&&"string"==typeof r.updatedAt&&(r.updatedAt=(0,L.default)(r.updatedAt)),!r.updatedAt&&r.createdAt&&(r.updatedAt=r.createdAt),t.commitServerChanges(this._getStateIdentifier(),r)}},{key:"_setExisted",value:function(e){var t=j.default.getObjectStateController(),r=t.getState(this._getStateIdentifier());r&&(r.existed=e)}},{key:"_migrateId",value:function(e){if(this._localId&&e)if(ie){var t=j.default.getObjectStateController(),r=t.removeState(this._getStateIdentifier());this.id=e,delete this._localId,r&&t.initializeState(this._getStateIdentifier(),r)}else this.id=e,delete this._localId}},{key:"_handleSaveResponse",value:function(e,t){var r={},n=j.default.getObjectStateController(),o=n.popPendingState(this._getStateIdentifier());for(var i in o)o[i]instanceof K.RelationOp?r[i]=o[i].applyTo(void 0,this,i):i in e||(r[i]=o[i].applyTo(void 0));for(i in e)"createdAt"!==i&&"updatedAt"!==i||"string"!=typeof e[i]?"ACL"===i?r[i]=new M.default(e[i]):"objectId"!==i&&(r[i]=(0,E.default)(e[i]),r[i]instanceof K.UnsetOp&&(r[i]=void 0)):r[i]=(0,L.default)(e[i]);r.createdAt&&!r.updatedAt&&(r.updatedAt=r.createdAt),this._migrateId(e.objectId),201!==t&&this._setExisted(!0),n.commitServerChanges(this._getStateIdentifier(),r)}},{key:"_handleSaveError",value:function(){this._getPendingOps(),j.default.getObjectStateController().mergeFirstPendingState(this._getStateIdentifier())}},{key:"initialize",value:function(){}},{key:"toJSON",value:function(e){var t=this.id?this.className+":"+this.id:this,e=e||[t],r={},n=this.attributes;for(var o in n)"createdAt"!==o&&"updatedAt"!==o||!n[o].toJSON?r[o]=(0,A.default)(n[o],!1,!1,e):r[o]=n[o].toJSON();var i=this._getPendingOps();for(var o in i[0])r[o]=i[0][o].toJSON();return this.id&&(r.objectId=this.id),r}},{key:"equals",value:function(t){return this===t||t instanceof e&&this.className===t.className&&this.id===t.id&&void 0!==this.id}},{key:"dirty",value:function(e){if(!this.id)return!0;var t=this._getPendingOps(),r=this._getDirtyObjectAttributes();if(e){if(r.hasOwnProperty(e))return!0;for(var n=0;n<t.length;n++)if(t[n].hasOwnProperty(e))return!0;return!1}return 0!==(0,_.default)(t[0]).length||0!==(0,_.default)(r).length}},{key:"dirtyKeys",value:function(){for(var e=this._getPendingOps(),t={},r=0;r<e.length;r++)for(var n in e[r])t[n]=!0;var o=this._getDirtyObjectAttributes();for(var n in o)t[n]=!0;return(0,_.default)(t)}},{key:"toPointer",value:function(){if(!this.id)throw new Error("Cannot create a pointer to an unsaved ParseObject");return{__type:"Pointer",className:this.className,objectId:this.id}}},{key:"get",value:function(e){return this.attributes[e]}},{key:"relation",value:function(e){var t=this.get(e);if(t){if(!(t instanceof V.default))throw new Error("Called relation() on non-relation field "+e);return t._ensureParentAndKey(this,e),t}return new V.default(this,e)}},{key:"escape",value:function(e){var t=this.attributes[e];if(null==t)return"";if("string"!=typeof t){if("function"!=typeof t.toString)return"";t=t.toString()}return(0,N.default)(t)}},{key:"has",value:function(e){var t=this.attributes;return!!t.hasOwnProperty(e)&&null!=t[e]}},{key:"set",value:function(e,t,r){var n={},o={};if(e&&"object"===(void 0===e?"undefined":(0,y.default)(e)))n=e,r=t;else{if("string"!=typeof e)return this;n[e]=t}r=r||{};var i=[];"function"==typeof this.constructor.readOnlyAttributes&&(i=i.concat(this.constructor.readOnlyAttributes()));for(var s in n)if("createdAt"!==s&&"updatedAt"!==s){if(i.indexOf(s)>-1)throw new Error("Cannot modify readonly attribute: "+s);r.unset?o[s]=new K.UnsetOp:n[s]instanceof K.Op?o[s]=n[s]:n[s]&&"object"===(0,y.default)(n[s])&&"string"==typeof n[s].__op?o[s]=(0,K.opFromJSON)(n[s]):"objectId"===s||"id"===s?"string"==typeof n[s]&&(this.id=n[s]):"ACL"!==s||"object"!==(0,y.default)(n[s])||n[s]instanceof M.default?o[s]=new K.SetOp(n[s]):o[s]=new K.SetOp(new M.default(n[s]))}var a=this.attributes,u={};for(var l in o)o[l]instanceof K.RelationOp?u[l]=o[l].applyTo(a[l],this,l):o[l]instanceof K.UnsetOp||(u[l]=o[l].applyTo(a[l]));if(!r.ignoreValidation){var c=this.validate(u);if(c)return"function"==typeof r.error&&r.error(this,c),!1}var f=this._getPendingOps(),d=f.length-1,h=j.default.getObjectStateController();for(var l in o){var p=o[l].mergeWith(f[d][l]);h.setPendingOp(this._getStateIdentifier(),l,p)}return this}},{key:"unset",value:function(e,t){return t=t||{},t.unset=!0,this.set(e,null,t)}},{key:"increment",value:function(e,t){if(void 0===t&&(t=1),"number"!=typeof t)throw new Error("Cannot increment by a non-numeric amount.");return this.set(e,new K.IncrementOp(t))}},{key:"add",value:function(e,t){return this.set(e,new K.AddOp([t]))}},{key:"addAll",value:function(e,t){return this.set(e,new K.AddOp(t))}},{key:"addUnique",value:function(e,t){return this.set(e,new K.AddUniqueOp([t]))}},{key:"addAllUnique",value:function(e,t){return this.set(e,new K.AddUniqueOp(t))}},{key:"remove",value:function(e,t){return this.set(e,new K.RemoveOp([t]))}},{key:"removeAll",value:function(e,t){return this.set(e,new K.RemoveOp(t))}},{key:"op",value:function(e){for(var t=this._getPendingOps(),r=t.length;r--;)if(t[r][e])return t[r][e]}},{key:"clone",value:function(){var e=new this.constructor;e.className||(e.className=this.className);var t=this.attributes;if("function"==typeof this.constructor.readOnlyAttributes){var r=this.constructor.readOnlyAttributes()||[],n={};for(var o in t)r.indexOf(o)<0&&(n[o]=t[o]);t=n}return e.set&&e.set(t),e}},{key:"newInstance",value:function(){var e=new this.constructor;if(e.className||(e.className=this.className),e.id=this.id,ie)return e;var t=j.default.getObjectStateController();return t&&t.duplicateState(this._getStateIdentifier(),e._getStateIdentifier()),e}},{key:"isNew",value:function(){return!this.id}},{key:"existed",value:function(){if(!this.id)return!1;var e=j.default.getObjectStateController(),t=e.getState(this._getStateIdentifier());return!!t&&t.existed}},{key:"isValid",value:function(){return!this.validate(this.attributes)}},{key:"validate",value:function(e){if(e.hasOwnProperty("ACL")&&!(e.ACL instanceof M.default))return new U.default(U.default.OTHER_CAUSE,"ACL must be a Parse ACL.");for(var t in e)if(!/^[A-Za-z][0-9A-Za-z_]*$/.test(t))return new U.default(U.default.INVALID_KEY_NAME);return!1}},{key:"getACL",value:function(){var e=this.get("ACL");return e instanceof M.default?e:null}},{key:"setACL",value:function(e,t){return this.set("ACL",e,t)}},{key:"revert",value:function(){this._clearPendingOps()}},{key:"clear",value:function(){var e=this.attributes,t={},r=["createdAt","updatedAt"];"function"==typeof this.constructor.readOnlyAttributes&&(r=r.concat(this.constructor.readOnlyAttributes()));for(var n in e)r.indexOf(n)<0&&(t[n]=!0);return this.set(t,{unset:!0})}},{key:"fetch",value:function(e){e=e||{};var t={};return e.hasOwnProperty("useMasterKey")&&(t.useMasterKey=e.useMasterKey),e.hasOwnProperty("sessionToken")&&(t.sessionToken=e.sessionToken),j.default.getObjectController().fetch(this,!0,t)._thenRunCallbacks(e)}},{key:"save",value:function(e,t,r){var n,o,i=this;if("object"===(void 0===e?"undefined":(0,y.default)(e))||void 0===e?(n=e,"object"===(void 0===t?"undefined":(0,y.default)(t))&&(o=t)):(n={},n[e]=t,o=r),!o&&n&&(o={},"function"==typeof n.success&&(o.success=n.success,delete n.success),"function"==typeof n.error&&(o.error=n.error,delete n.error)),n){var s=this.validate(n);if(s)return o&&"function"==typeof o.error&&o.error(this,s),W.default.error(s);this.set(n,o)}o=o||{};var a={};o.hasOwnProperty("useMasterKey")&&(a.useMasterKey=!!o.useMasterKey),o.hasOwnProperty("sessionToken")&&"string"==typeof o.sessionToken&&(a.sessionToken=o.sessionToken);var u=j.default.getObjectController(),l=(0,te.default)(this);return u.save(l,a).then(function(){return u.save(i,a)})._thenRunCallbacks(o,this)}},{key:"destroy",value:function(e){e=e||{};var t={};return e.hasOwnProperty("useMasterKey")&&(t.useMasterKey=e.useMasterKey),e.hasOwnProperty("sessionToken")&&(t.sessionToken=e.sessionToken),this.id?j.default.getObjectController().destroy(this,t)._thenRunCallbacks(e):W.default.as()._thenRunCallbacks(e)}},{key:"attributes",get:function(){var e=j.default.getObjectStateController();return(0,f.default)(e.estimateAttributes(this._getStateIdentifier()))}},{key:"createdAt",get:function(){return this._getServerData().createdAt}},{key:"updatedAt",get:function(){return this._getServerData().updatedAt}}],[{key:"_clearAllState",value:function(){j.default.getObjectStateController().clearAllState()}},{key:"fetchAll",value:function(e,t){var t=t||{},r={};return t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),t.hasOwnProperty("sessionToken")&&(r.sessionToken=t.sessionToken),j.default.getObjectController().fetch(e,!0,r)._thenRunCallbacks(t)}},{key:"fetchAllIfNeeded",value:function(e,t){var t=t||{},r={};return t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),t.hasOwnProperty("sessionToken")&&(r.sessionToken=t.sessionToken),j.default.getObjectController().fetch(e,!1,r)._thenRunCallbacks(t)}},{key:"destroyAll",value:function(e,t){var t=t||{},r={};return t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),t.hasOwnProperty("sessionToken")&&(r.sessionToken=t.sessionToken),j.default.getObjectController().destroy(e,r)._thenRunCallbacks(t)}},{key:"saveAll",value:function(e,t){var t=t||{},r={};return t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),t.hasOwnProperty("sessionToken")&&(r.sessionToken=t.sessionToken),j.default.getObjectController().save(e,r)._thenRunCallbacks(t)}},{key:"createWithoutData",value:function(e){var t=new this;return t.id=e,t}},{key:"fromJSON",value:function(t,r){if(!t.className)throw new Error("Cannot create an object without a className");var n=re[t.className],o=n?new n:new e(t.className),i={};for(var s in t)"className"!==s&&"__type"!==s&&(i[s]=t[s]);if(r){i.objectId&&(o.id=i.objectId);var a=null;"function"==typeof o._preserveFieldsOnFetch&&(a=o._preserveFieldsOnFetch()),o._clearServerData(),a&&o._finishFetch(a)}return o._finishFetch(i),t.objectId&&o._setExisted(!0),o}},{key:"registerSubclass",value:function(e,t){if("string"!=typeof e)throw new TypeError("The first argument must be a valid class name.");if(void 0===t)throw new TypeError("You must supply a subclass constructor.");if("function"!=typeof t)throw new TypeError("You must register the subclass constructor. Did you attempt to register an instance of the subclass?");re[e]=t,t.className||(t.className=e)}},{key:"extend",value:function(t,r,n){if("string"!=typeof t){if(t&&"string"==typeof t.className)return e.extend(t.className,t,r);throw new Error("Parse.Object.extend's first argument should be the className.")}var o=t;"User"===o&&j.default.get("PERFORM_USER_REWRITE")&&(o="_User");var i=e.prototype;this.hasOwnProperty("__super__")&&this.__super__?i=this.prototype:re[o]&&(i=re[o].prototype);var s=function(e,t){if(this.className=o,this._objCount=oe++,"function"==typeof this.initialize&&this.initialize.apply(this,arguments),e&&"object"===(void 0===e?"undefined":(0,y.default)(e))&&!this.set(e||{},t))throw new Error("Can't create an invalid Parse Object")};if(s.className=o,s.__super__=i,s.prototype=(0,l.default)(i,{constructor:{value:s,enumerable:!1,writable:!0,configurable:!0}}),r)for(var u in r)"className"!==u&&(0,a.default)(s.prototype,u,{value:r[u],enumerable:!1,writable:!0,configurable:!0});if(n)for(var u in n)"className"!==u&&(0,a.default)(s,u,{value:n[u],enumerable:!1,writable:!0,configurable:!0});return s.extend=function(t,r,n){return"string"==typeof t?e.extend.call(s,t,r,n):e.extend.call(s,o,t,r)},s.createWithoutData=e.createWithoutData,re[o]=s,s}},{key:"enableSingleInstance",value:function(){ie=!0,j.default.setObjectStateController(Y)}},{key:"disableSingleInstance",value:function(){ie=!1,j.default.setObjectStateController(Z)}}]),e}(),ae={fetch:function(e,t,r){if(Array.isArray(e)){if(e.length<1)return W.default.as([]);var n=[],o=[],i=null,s=[],a=null;if(e.forEach(function(e){a||(i||(i=e.className),i!==e.className&&(a=new U.default(U.default.INVALID_CLASS_NAME,"All objects should be of the same class")),e.id||(a=new U.default(U.default.MISSING_OBJECT_ID,"All objects must have an ID")),(t||0===(0,_.default)(e._getServerData()).length)&&(o.push(e.id),n.push(e)),s.push(e))}),a)return W.default.error(a);var u=new B.default(i);return u.containedIn("objectId",o),u._limit=o.length,u.find(r).then(function(e){var r={};e.forEach(function(e){r[e.id]=e});for(var o=0;o<n.length;o++){var i=n[o];if((!i||!i.id||!r[i.id])&&t)return W.default.error(new U.default(U.default.OBJECT_NOT_FOUND,"All objects must exist on the server."))}if(!ie)for(var o=0;o<s.length;o++){var i=s[o];if(i&&i.id&&r[i.id]){var a=i.id;i._finishFetch(r[a].toJSON()),s[o]=r[a]}}return W.default.as(s)})}return j.default.getRESTController().request("GET","classes/"+e.className+"/"+e._getId(),{},r).then(function(t){return e instanceof se&&(e._clearPendingOps(),e._clearServerData(),e._finishFetch(t)),e})},destroy:function(e,t){var r=j.default.getRESTController();if(Array.isArray(e)){if(e.length<1)return W.default.as([]);var n=[[]];e.forEach(function(e){e.id&&(n[n.length-1].push(e),n[n.length-1].length>=20&&n.push([]))}),0===n[n.length-1].length&&n.pop();var o=W.default.as(),s=[];return n.forEach(function(e){o=o.then(function(){return r.request("POST","batch",{requests:e.map(function(e){return{method:"DELETE",path:i()+"classes/"+e.className+"/"+e._getId(),body:{}}})},t).then(function(t){for(var r=0;r<t.length;r++)if(t[r]&&t[r].hasOwnProperty("error")){var n=new U.default(t[r].error.code,t[r].error.error);n.object=e[r],s.push(n)}})})}),o.then(function(){if(s.length){var t=new U.default(U.default.AGGREGATE_ERROR);return t.errors=s,W.default.error(t)}return W.default.as(e)})}return e instanceof se?r.request("DELETE","classes/"+e.className+"/"+e._getId(),{},t).then(function(){return W.default.as(e)}):W.default.as(e)},save:function(e,t){var r=j.default.getRESTController(),n=j.default.getObjectStateController();if(Array.isArray(e)){if(e.length<1)return W.default.as([]);for(var o=e.concat(),s=0;s<e.length;s++)e[s]instanceof se&&(o=o.concat((0,te.default)(e[s],!0)));o=(0,$.default)(o);var a=W.default.as(),u=[];return o.forEach(function(e){e instanceof q.default?a=a.then(function(){return e.save()}):e instanceof se&&u.push(e)}),a.then(function(){var o=null;return W.default._continueWhile(function(){return u.length>0},function(){var e=[],s=[];if(u.forEach(function(t){e.length<20&&(0,O.default)(t)?e.push(t):s.push(t)}),u=s,e.length<1)return W.default.error(new U.default(U.default.OTHER_CAUSE,"Tried to save a batch with a cycle."));var a=new W.default,l=[],c=[];return e.forEach(function(e,t){var r=new W.default;l.push(r),n.pushPendingState(e._getStateIdentifier()),c.push(n.enqueueTask(e._getStateIdentifier(),function(){return r.resolve(),a.then(function(r,n){if(r[t].hasOwnProperty("success"))e._handleSaveResponse(r[t].success,n);else{if(!o&&r[t].hasOwnProperty("error")){var i=r[t].error;o=new U.default(i.code,i.error),u=[]}e._handleSaveError()}})}))}),W.default.when(l).then(function(){return r.request("POST","batch",{requests:e.map(function(e){var t=e._getSaveParams();return t.path=i()+t.path,t})},t)}).then(function(e,t){a.resolve(e,t)}),W.default.when(c)}).then(function(){return o?W.default.error(o):W.default.as(e)})})}if(e instanceof se){var l=e,c=function(){var e=l._getSaveParams();return r.request(e.method,e.path,e.body,t).then(function(e,t){l._handleSaveResponse(e,t)},function(e){return l._handleSaveError(),W.default.error(e)})};return n.pushPendingState(e._getStateIdentifier()),n.enqueueTask(e._getStateIdentifier(),c).then(function(){return e},function(e){return W.default.error(e)})}return W.default.as()}};j.default.setObjectController(ae),r.default=se},{"./CoreManager":3,"./ParseACL":11,"./ParseError":13,"./ParseFile":14,"./ParseOp":19,"./ParsePromise":21,"./ParseQuery":22,"./ParseRelation":23,"./SingleInstanceStateController":30,"./UniqueInstanceStateController":34,"./canBeSerialized":36,"./decode":37,"./encode":38,"./equals":39,"./escape":40,"./parseDate":42,"./unique":43,"./unsavedChildren":44,"babel-runtime/core-js/json/stringify":46,"babel-runtime/core-js/object/create":48,"babel-runtime/core-js/object/define-property":49,"babel-runtime/core-js/object/freeze":50,"babel-runtime/core-js/object/keys":53,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/typeof":63}],19:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){if(!e||!e.__op)return null;switch(e.__op){case"Delete":return new A;case"Increment":return new T(e.amount);case"Add":return new I((0,b.default)(e.objects));case"AddUnique":return new N((0,b.default)(e.objects));case"Remove":return new R((0,b.default)(e.objects));case"AddRelation":var t=(0,b.default)(e.objects);return Array.isArray(t)?new M(t,[]):new M([],[]);case"RemoveRelation":var r=(0,b.default)(e.objects);return Array.isArray(r)?new M([],r):new M([],[]);case"Batch":for(var t=[],r=[],n=0;n<e.ops.length;n++)"AddRelation"===e.ops[n].__op?t=t.concat((0,b.default)(e.ops[n].objects)):"RemoveRelation"===e.ops[n].__op&&(r=r.concat((0,b.default)(e.ops[n].objects)));return new M(t,r)}return null}Object.defineProperty(r,"__esModule",{value:!0}),r.RelationOp=r.RemoveOp=r.AddUniqueOp=r.AddOp=r.IncrementOp=r.UnsetOp=r.SetOp=r.Op=void 0;var i=e("babel-runtime/core-js/object/get-prototype-of"),s=n(i),a=e("babel-runtime/helpers/possibleConstructorReturn"),u=n(a),l=e("babel-runtime/helpers/inherits"),c=n(l),f=e("babel-runtime/helpers/classCallCheck"),d=n(f),h=e("babel-runtime/helpers/createClass"),p=n(h);r.opFromJSON=o;var _=e("./arrayContainsObject"),v=n(_),y=e("./decode"),b=n(y),g=e("./encode"),m=n(g),C=e("./ParseObject"),k=n(C),j=e("./ParseRelation"),w=n(j),O=e("./unique"),S=n(O),E=r.Op=function(){function e(){(0,d.default)(this,e)}return(0,p.default)(e,[{key:"applyTo",value:function(){}},{key:"mergeWith",value:function(){}},{key:"toJSON",value:function(){}}]),e}(),P=r.SetOp=function(e){function t(e){(0,d.default)(this,t);var r=(0,u.default)(this,(t.__proto__||(0,s.default)(t)).call(this));return r._value=e,r}return(0,c.default)(t,e),(0,p.default)(t,[{key:"applyTo",value:function(){return this._value}},{key:"mergeWith",value:function(){return new t(this._value)}},{key:"toJSON",value:function(){return(0,m.default)(this._value,!1,!0)}}]),t}(E),A=r.UnsetOp=function(e){function t(){return(0,d.default)(this,t),(0,u.default)(this,(t.__proto__||(0,s.default)(t)).apply(this,arguments))}return(0,c.default)(t,e),(0,p.default)(t,[{key:"applyTo",value:function(){}},{key:"mergeWith",value:function(){return new t}},{key:"toJSON",value:function(){return{__op:"Delete"}}}]),t}(E),T=r.IncrementOp=function(e){function t(e){(0,d.default)(this,t);var r=(0,u.default)(this,(t.__proto__||(0,s.default)(t)).call(this));if("number"!=typeof e)throw new TypeError("Increment Op must be initialized with a numeric amount.");return r._amount=e,r}return(0,c.default)(t,e),(0,p.default)(t,[{key:"applyTo",value:function(e){if(void 0===e)return this._amount;if("number"!=typeof e)throw new TypeError("Cannot increment a non-numeric value.");return this._amount+e}},{key:"mergeWith",value:function(e){if(!e)return this;if(e instanceof P)return new P(this.applyTo(e._value))
;if(e instanceof A)return new P(this._amount);if(e instanceof t)return new t(this.applyTo(e._amount));throw new Error("Cannot merge Increment Op with the previous Op")}},{key:"toJSON",value:function(){return{__op:"Increment",amount:this._amount}}}]),t}(E),I=r.AddOp=function(e){function t(e){(0,d.default)(this,t);var r=(0,u.default)(this,(t.__proto__||(0,s.default)(t)).call(this));return r._value=Array.isArray(e)?e:[e],r}return(0,c.default)(t,e),(0,p.default)(t,[{key:"applyTo",value:function(e){if(null==e)return this._value;if(Array.isArray(e))return e.concat(this._value);throw new Error("Cannot add elements to a non-array value")}},{key:"mergeWith",value:function(e){if(!e)return this;if(e instanceof P)return new P(this.applyTo(e._value));if(e instanceof A)return new P(this._value);if(e instanceof t)return new t(this.applyTo(e._value));throw new Error("Cannot merge Add Op with the previous Op")}},{key:"toJSON",value:function(){return{__op:"Add",objects:(0,m.default)(this._value,!1,!0)}}}]),t}(E),N=r.AddUniqueOp=function(e){function t(e){(0,d.default)(this,t);var r=(0,u.default)(this,(t.__proto__||(0,s.default)(t)).call(this));return r._value=(0,S.default)(Array.isArray(e)?e:[e]),r}return(0,c.default)(t,e),(0,p.default)(t,[{key:"applyTo",value:function(e){if(null==e)return this._value||[];if(Array.isArray(e)){var t=e,r=[];return this._value.forEach(function(e){e instanceof k.default?(0,v.default)(t,e)||r.push(e):t.indexOf(e)<0&&r.push(e)}),e.concat(r)}throw new Error("Cannot add elements to a non-array value")}},{key:"mergeWith",value:function(e){if(!e)return this;if(e instanceof P)return new P(this.applyTo(e._value));if(e instanceof A)return new P(this._value);if(e instanceof t)return new t(this.applyTo(e._value));throw new Error("Cannot merge AddUnique Op with the previous Op")}},{key:"toJSON",value:function(){return{__op:"AddUnique",objects:(0,m.default)(this._value,!1,!0)}}}]),t}(E),R=r.RemoveOp=function(e){function t(e){(0,d.default)(this,t);var r=(0,u.default)(this,(t.__proto__||(0,s.default)(t)).call(this));return r._value=(0,S.default)(Array.isArray(e)?e:[e]),r}return(0,c.default)(t,e),(0,p.default)(t,[{key:"applyTo",value:function(e){if(null==e)return[];if(Array.isArray(e)){for(var t=e.indexOf(this._value),r=e.concat([]),t=0;t<this._value.length;t++){for(var n=r.indexOf(this._value[t]);n>-1;)r.splice(n,1),n=r.indexOf(this._value[t]);if(this._value[t]instanceof k.default&&this._value[t].id)for(var o=0;o<r.length;o++)r[o]instanceof k.default&&this._value[t].id===r[o].id&&(r.splice(o,1),o--)}return r}throw new Error("Cannot remove elements from a non-array value")}},{key:"mergeWith",value:function(e){if(!e)return this;if(e instanceof P)return new P(this.applyTo(e._value));if(e instanceof A)return new A;if(e instanceof t){for(var r=e._value.concat([]),n=0;n<this._value.length;n++)this._value[n]instanceof k.default?(0,v.default)(r,this._value[n])||r.push(this._value[n]):r.indexOf(this._value[n])<0&&r.push(this._value[n]);return new t(r)}throw new Error("Cannot merge Remove Op with the previous Op")}},{key:"toJSON",value:function(){return{__op:"Remove",objects:(0,m.default)(this._value,!1,!0)}}}]),t}(E),M=r.RelationOp=function(e){function t(e,r){(0,d.default)(this,t);var n=(0,u.default)(this,(t.__proto__||(0,s.default)(t)).call(this));return n._targetClassName=null,Array.isArray(e)&&(n.relationsToAdd=(0,S.default)(e.map(n._extractId,n))),Array.isArray(r)&&(n.relationsToRemove=(0,S.default)(r.map(n._extractId,n))),n}return(0,c.default)(t,e),(0,p.default)(t,[{key:"_extractId",value:function(e){if("string"==typeof e)return e;if(!e.id)throw new Error("You cannot add or remove an unsaved Parse Object from a relation");if(this._targetClassName||(this._targetClassName=e.className),this._targetClassName!==e.className)throw new Error("Tried to create a Relation with 2 different object types: "+this._targetClassName+" and "+e.className+".");return e.id}},{key:"applyTo",value:function(e,t,r){if(!e){if(!t||!r)throw new Error("Cannot apply a RelationOp without either a previous value, or an object and a key");var n=new k.default(t.className);t.id&&0===t.id.indexOf("local")?n._localId=t.id:t.id&&(n.id=t.id);var o=new w.default(n,r);return o.targetClassName=this._targetClassName,o}if(e instanceof w.default){if(this._targetClassName)if(e.targetClassName){if(this._targetClassName!==e.targetClassName)throw new Error("Related object must be a "+e.targetClassName+", but a "+this._targetClassName+" was passed in.")}else e.targetClassName=this._targetClassName;return e}throw new Error("Relation cannot be applied to a non-relation field")}},{key:"mergeWith",value:function(e){if(!e)return this;if(e instanceof A)throw new Error("You cannot modify a relation after deleting it.");if(e instanceof t){if(e._targetClassName&&e._targetClassName!==this._targetClassName)throw new Error("Related object must be of class "+e._targetClassName+", but "+(this._targetClassName||"null")+" was passed in.");var r=e.relationsToAdd.concat([]);this.relationsToRemove.forEach(function(e){var t=r.indexOf(e);t>-1&&r.splice(t,1)}),this.relationsToAdd.forEach(function(e){r.indexOf(e)<0&&r.push(e)});var n=e.relationsToRemove.concat([]);this.relationsToAdd.forEach(function(e){var t=n.indexOf(e);t>-1&&n.splice(t,1)}),this.relationsToRemove.forEach(function(e){n.indexOf(e)<0&&n.push(e)});var o=new t(r,n);return o._targetClassName=this._targetClassName,o}throw new Error("Cannot merge Relation Op with the previous Op")}},{key:"toJSON",value:function(){var e=this,t=function(t){return{__type:"Pointer",className:e._targetClassName,objectId:t}},r=null,n=null,o=null;return this.relationsToAdd.length>0&&(o=this.relationsToAdd.map(t),r={__op:"AddRelation",objects:o}),this.relationsToRemove.length>0&&(o=this.relationsToRemove.map(t),n={__op:"RemoveRelation",objects:o}),r&&n?{__op:"Batch",ops:[r,n]}:r||n||{}}}]),t}(E)},{"./ParseObject":18,"./ParseRelation":23,"./arrayContainsObject":35,"./decode":37,"./encode":38,"./unique":43,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/inherits":61,"babel-runtime/helpers/possibleConstructorReturn":62}],20:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),a=n(s),u=e("./ParseGeoPoint"),l=n(u),c=function(){function e(t){(0,i.default)(this,e),this._coordinates=e._validate(t)}return(0,a.default)(e,[{key:"toJSON",value:function(){return e._validate(this._coordinates),{__type:"Polygon",coordinates:this._coordinates}}},{key:"equals",value:function(t){if(!(t instanceof e)||this.coordinates.length!==t.coordinates.length)return!1;for(var r=!0,n=1;n<this._coordinates.length;n+=1)if(this._coordinates[n][0]!=t.coordinates[n][0]||this._coordinates[n][1]!=t.coordinates[n][1]){r=!1;break}return r}},{key:"containsPoint",value:function(e){for(var t=this._coordinates[0][0],r=this._coordinates[0][0],n=this._coordinates[0][1],o=this._coordinates[0][1],i=1;i<this._coordinates.length;i+=1){var s=this._coordinates[i];t=Math.min(s[0],t),r=Math.max(s[0],r),n=Math.min(s[1],n),o=Math.max(s[1],o)}if(e.latitude<t||e.latitude>r||e.longitude<n||e.longitude>o)return!1;for(var a=!1,u=0,l=this._coordinates.length-1;u<this._coordinates.length;l=u++){var c=this._coordinates[u][0],f=this._coordinates[u][1],d=this._coordinates[l][0],h=this._coordinates[l][1];f>e.longitude!=h>e.longitude&&e.latitude<(d-c)*(e.longitude-f)/(h-f)+c&&(a=!a)}return a}},{key:"coordinates",get:function(){return this._coordinates},set:function(t){this._coordinates=e._validate(t)}}],[{key:"_validate",value:function(e){if(!Array.isArray(e))throw new TypeError("Coordinates must be an Array");if(e.length<3)throw new TypeError("Polygon must have at least 3 GeoPoints or Points");for(var t=[],r=0;r<e.length;r+=1){var n=e[r],o=void 0;if(n instanceof l.default)o=n;else{if(!Array.isArray(n)||2!==n.length)throw new TypeError("Coordinates must be an Array of GeoPoints or Points");o=new l.default(n[0],n[1])}t.push([o.latitude,o.longitude])}return t}}]),e}();r.default=c},{"./ParseGeoPoint":15,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59}],21:[function(e,t,r){(function(t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/get-iterator"),i=n(o),s=e("babel-runtime/helpers/typeof"),a=n(s),u=e("babel-runtime/helpers/classCallCheck"),l=n(u),c=e("babel-runtime/helpers/createClass"),f=n(c),d=!0,h=function(){function e(t){(0,l.default)(this,e),this._resolved=!1,this._rejected=!1,this._resolvedCallbacks=[],this._rejectedCallbacks=[],"function"==typeof t&&t(this.resolve.bind(this),this.reject.bind(this))}return(0,f.default)(e,[{key:"resolve",value:function(){if(this._resolved||this._rejected)throw new Error("A promise was resolved even though it had already been "+(this._resolved?"resolved":"rejected")+".");this._resolved=!0;for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this._result=t;for(var n=0;n<this._resolvedCallbacks.length;n++)this._resolvedCallbacks[n].apply(this,t);this._resolvedCallbacks=[],this._rejectedCallbacks=[]}},{key:"reject",value:function(e){if(this._resolved||this._rejected)throw new Error("A promise was rejected even though it had already been "+(this._resolved?"resolved":"rejected")+".");this._rejected=!0,this._error=e;for(var t=0;t<this._rejectedCallbacks.length;t++)this._rejectedCallbacks[t](e);this._resolvedCallbacks=[],this._rejectedCallbacks=[]}},{key:"then",value:function(r,n){var o=this,i=new e,s=function(){for(var t=arguments.length,n=Array(t),o=0;o<t;o++)n[o]=arguments[o];if("function"==typeof r)if(d)try{n=[r.apply(this,n)]}catch(t){n=[e.error(t)]}else n=[r.apply(this,n)];1===n.length&&e.is(n[0])?n[0].then(function(){i.resolve.apply(i,arguments)},function(e){i.reject(e)}):i.resolve.apply(i,n)},a=function(t){var r=[];if("function"==typeof n){if(d)try{r=[n(t)]}catch(t){r=[e.error(t)]}else r=[n(t)];1===r.length&&e.is(r[0])?r[0].then(function(){i.resolve.apply(i,arguments)},function(e){i.reject(e)}):d?i.resolve.apply(i,r):i.reject(r[0])}else i.reject(t)},u=function(e){e.call()};return d&&(void 0!==t&&"function"==typeof t.nextTick?u=function(e){t.nextTick(e)}:"function"==typeof setTimeout&&(u=function(e){setTimeout(e,0)})),this._resolved?u(function(){s.apply(o,o._result)}):this._rejected?u(function(){a(o._error)}):(this._resolvedCallbacks.push(s),this._rejectedCallbacks.push(a)),i}},{key:"always",value:function(e){return this.then(e,e)}},{key:"done",value:function(e){return this.then(e)}},{key:"fail",value:function(e){return this.then(null,e)}},{key:"catch",value:function(e){return this.then(null,e)}},{key:"_thenRunCallbacks",value:function(t,r){var n={};return"function"==typeof t?(n.success=function(e){t(e,null)},n.error=function(e){t(null,e)}):"object"===(void 0===t?"undefined":(0,a.default)(t))&&("function"==typeof t.success&&(n.success=t.success),"function"==typeof t.error&&(n.error=t.error)),this.then(function(){for(var t=arguments.length,r=Array(t),o=0;o<t;o++)r[o]=arguments[o];return n.success&&n.success.apply(this,r),e.as.apply(e,arguments)},function(t){return n.error&&(void 0!==r?n.error(r,t):n.error(t)),e.error(t)})}},{key:"_continueWith",value:function(e){return this.then(function(){for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];return e(r,null)},function(t){return e(null,t)})}}],[{key:"is",value:function(e){return null!=e&&"function"==typeof e.then}},{key:"as",value:function(){for(var t=new e,r=arguments.length,n=Array(r),o=0;o<r;o++)n[o]=arguments[o];return t.resolve.apply(t,n),t}},{key:"resolve",value:function(t){return new e(function(r,n){e.is(t)?t.then(r,n):r(t)})}},{key:"error",value:function(){for(var t=new e,r=arguments.length,n=Array(r),o=0;o<r;o++)n[o]=arguments[o];return t.reject.apply(t,n),t}},{key:"reject",value:function(){for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];return e.error.apply(null,r)}},{key:"when",value:function(t){var r,n=Array.isArray(t);r=n?t:arguments;var o=r.length,i=!1,s=[],a=n?[s]:s,u=[];if(s.length=r.length,u.length=r.length,0===o)return e.as.apply(this,a);for(var l=new e,c=function(){--o<=0&&(i?l.reject(u):l.resolve.apply(l,a))},f=0;f<r.length;f++)!function(t,r){e.is(t)?t.then(function(e){s[r]=e,c()},function(e){u[r]=e,i=!0,c()}):(s[f]=t,c())}(r[f],f);return l}},{key:"all",value:function(t){var r=0,n=[],o=!0,s=!1,a=void 0;try{for(var u,l=(0,i.default)(t);!(o=(u=l.next()).done);o=!0){var c=u.value;n[r++]=c}}catch(e){s=!0,a=e}finally{try{!o&&l.return&&l.return()}finally{if(s)throw a}}if(0===r)return e.as([]);var f=!1,d=new e,h=0,p=[];return n.forEach(function(t,n){e.is(t)?t.then(function(e){if(f)return!1;p[n]=e,++h>=r&&d.resolve(p)},function(e){d.reject(e),f=!0}):(p[n]=t,h++,!f&&h>=r&&d.resolve(p))}),d}},{key:"race",value:function(t){var r=!1,n=new e,o=!0,s=!1,a=void 0;try{for(var u,l=(0,i.default)(t);!(o=(u=l.next()).done);o=!0){var c=u.value;e.is(c)?c.then(function(e){r||(r=!0,n.resolve(e))},function(e){r||(r=!0,n.reject(e))}):r||(r=!0,n.resolve(c))}}catch(e){s=!0,a=e}finally{try{!o&&l.return&&l.return()}finally{if(s)throw a}}return n}},{key:"_continueWhile",value:function(t,r){return t()?r().then(function(){return e._continueWhile(t,r)}):e.as()}},{key:"isPromisesAPlusCompliant",value:function(){return d}},{key:"enableAPlusCompliant",value:function(){d=!0}},{key:"disableAPlusCompliant",value:function(){d=!1}}]),e}();r.default=h}).call(this,e("_process"))},{_process:64,"babel-runtime/core-js/get-iterator":45,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/typeof":63}],22:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return"\\Q"+e.replace("\\E","\\E\\\\E\\Q")+"\\E"}function i(e){var t=null;return e.forEach(function(e){if(t||(t=e.className),t!==e.className)throw new Error("All queries must be for the same class.")}),t}function s(e,t){var r={};if(t.forEach(function(t){var n=-1!==t.indexOf(".");if(n||e.hasOwnProperty(t)){if(n){var o=t.split("."),i=e,s=r;o.forEach(function(e,t,r){i&&!i.hasOwnProperty(e)&&(i[e]=void 0),void 0!==i&&(i=i[e]),t<r.length-1&&(s[e]||(s[e]={}),s=s[e])})}}else e[t]=void 0}),(0,p.default)(r).length>0){var n=v.default.getObjectStateController().getServerData({id:e.objectId,className:e.className});!function e(t,r,n,o){if(o)for(var i in t)t.hasOwnProperty(i)&&!r.hasOwnProperty(i)&&(r[i]=t[i]);for(var i in n)void 0!==r[i]&&null!==r[i]&&void 0!==t&&null!==t&&e(t[i],r[i],n[i],!0)}(n,e,r,!1)}}Object.defineProperty(r,"__esModule",{value:!0});var a=e("babel-runtime/helpers/typeof"),u=n(a),l=e("babel-runtime/helpers/classCallCheck"),c=n(l),f=e("babel-runtime/helpers/createClass"),d=n(f),h=e("babel-runtime/core-js/object/keys"),p=n(h),_=e("./CoreManager"),v=n(_),y=e("./encode"),b=n(y),g=e("./ParseError"),m=n(g),C=e("./ParseGeoPoint"),k=n(C),j=e("./ParsePolygon"),w=(n(j),e("./ParseObject")),O=n(w),S=e("./ParsePromise"),E=n(S),P=function(){function e(t){if((0,c.default)(this,e),"string"==typeof t)"User"===t&&v.default.get("PERFORM_USER_REWRITE")?this.className="_User":this.className=t;else if(t instanceof O.default)this.className=t.className;else{if("function"!=typeof t)throw new TypeError("A ParseQuery must be constructed with a ParseObject or class name.");if("string"==typeof t.className)this.className=t.className;else{var r=new t;this.className=r.className}}this._where={},this._include=[],this._limit=-1,this._skip=0,this._extraOptions={}}return(0,d.default)(e,[{key:"_orQuery",value:function(e){var t=e.map(function(e){return e.toJSON().where});return this._where.$or=t,this}},{key:"_andQuery",value:function(e){var t=e.map(function(e){return e.toJSON().where});return this._where.$and=t,this}},{key:"_addCondition",value:function(e,t,r){return this._where[e]&&"string"!=typeof this._where[e]||(this._where[e]={}),this._where[e][t]=(0,b.default)(r,!1,!0),this}},{key:"toJSON",value:function(){var e={where:this._where};this._include.length&&(e.include=this._include.join(",")),this._select&&(e.keys=this._select.join(",")),this._limit>=0&&(e.limit=this._limit),this._skip>0&&(e.skip=this._skip),this._order&&(e.order=this._order.join(","));for(var t in this._extraOptions)e[t]=this._extraOptions[t];return e}},{key:"withJSON",value:function(e){e.where&&(this._where=e.where),e.include&&(this._include=e.include.split(",")),e.keys&&(this._select=e.keys.split(",")),e.limit&&(this._limit=e.limit),e.skip&&(this._skip=e.skip),e.order&&(this._order=e.order.split(","));for(var t in e)e.hasOwnProperty(t)&&-1===["where","include","keys","limit","skip","order"].indexOf(t)&&(this._extraOptions[t]=e[t]);return this}},{key:"get",value:function(e,t){this.equalTo("objectId",e);var r={};return t&&t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),t&&t.hasOwnProperty("sessionToken")&&(r.sessionToken=t.sessionToken),this.first(r).then(function(e){if(e)return e;var t=new m.default(m.default.OBJECT_NOT_FOUND,"Object not found.");return E.default.error(t)})._thenRunCallbacks(t,null)}},{key:"find",value:function(e){var t=this;e=e||{};var r={};e.hasOwnProperty("useMasterKey")&&(r.useMasterKey=e.useMasterKey),e.hasOwnProperty("sessionToken")&&(r.sessionToken=e.sessionToken);var n=v.default.getQueryController(),o=this._select;return n.find(this.className,this.toJSON(),r).then(function(e){return e.results.map(function(r){var n=e.className||t.className;return r.className||(r.className=n),o&&s(r,o),O.default.fromJSON(r,!o)})})._thenRunCallbacks(e)}},{key:"count",value:function(e){e=e||{};var t={};e.hasOwnProperty("useMasterKey")&&(t.useMasterKey=e.useMasterKey),e.hasOwnProperty("sessionToken")&&(t.sessionToken=e.sessionToken);var r=v.default.getQueryController(),n=this.toJSON();return n.limit=0,n.count=1,r.find(this.className,n,t).then(function(e){return e.count})._thenRunCallbacks(e)}},{key:"distinct",value:function(e,t){t=t||{};var r={useMasterKey:!0};t.hasOwnProperty("sessionToken")&&(r.sessionToken=t.sessionToken);var n=v.default.getQueryController(),o={distinct:e,where:this._where};return n.aggregate(this.className,o,r).then(function(e){return e.results})._thenRunCallbacks(t)}},{key:"aggregate",value:function(e,t){t=t||{};var r={useMasterKey:!0};t.hasOwnProperty("sessionToken")&&(r.sessionToken=t.sessionToken);var n=v.default.getQueryController(),o={};if(Array.isArray(e))e.forEach(function(e){for(var t in e)o[t]=e[t]});else{if(!e||"object"!==(void 0===e?"undefined":(0,u.default)(e)))throw new Error("Invalid pipeline must be Array or Object");o=e}return n.aggregate(this.className,o,r).then(function(e){return e.results})._thenRunCallbacks(t)}},{key:"first",value:function(e){var t=this;e=e||{};var r={};e.hasOwnProperty("useMasterKey")&&(r.useMasterKey=e.useMasterKey),e.hasOwnProperty("sessionToken")&&(r.sessionToken=e.sessionToken);var n=v.default.getQueryController(),o=this.toJSON();o.limit=1;var i=this._select;return n.find(this.className,o,r).then(function(e){var r=e.results;if(r[0])return r[0].className||(r[0].className=t.className),i&&s(r[0],i),O.default.fromJSON(r[0],!i)})._thenRunCallbacks(e)}},{key:"each",value:function(t,r){if(r=r||{},this._order||this._skip||this._limit>=0)return E.default.error("Cannot iterate on a query with sort, skip, or limit.")._thenRunCallbacks(r);new E.default;var n=new e(this.className);n._limit=r.batchSize||100,n._include=this._include.map(function(e){return e}),this._select&&(n._select=this._select.map(function(e){return e})),n._where={};for(var o in this._where){var i=this._where[o];if(Array.isArray(i))n._where[o]=i.map(function(e){return e});else if(i&&"object"===(void 0===i?"undefined":(0,u.default)(i))){var s={};n._where[o]=s;for(var a in i)s[a]=i[a]}else n._where[o]=i}n.ascending("objectId");var l={};r.hasOwnProperty("useMasterKey")&&(l.useMasterKey=r.useMasterKey),r.hasOwnProperty("sessionToken")&&(l.sessionToken=r.sessionToken);var c=!1;return E.default._continueWhile(function(){return!c},function(){return n.find(l).then(function(e){var r=E.default.as();return e.forEach(function(e){r=r.then(function(){return t(e)})}),r.then(function(){e.length>=n._limit?n.greaterThan("objectId",e[e.length-1].id):c=!0})})})._thenRunCallbacks(r)}},{key:"equalTo",value:function(e,t){return void 0===t?this.doesNotExist(e):(this._where[e]=(0,b.default)(t,!1,!0),this)}},{key:"notEqualTo",value:function(e,t){return this._addCondition(e,"$ne",t)}},{key:"lessThan",value:function(e,t){return this._addCondition(e,"$lt",t)}},{key:"greaterThan",value:function(e,t){return this._addCondition(e,"$gt",t)}},{key:"lessThanOrEqualTo",value:function(e,t){return this._addCondition(e,"$lte",t)}},{key:"greaterThanOrEqualTo",value:function(e,t){return this._addCondition(e,"$gte",t)}},{key:"containedIn",value:function(e,t){return this._addCondition(e,"$in",t)}},{key:"notContainedIn",value:function(e,t){return this._addCondition(e,"$nin",t)}},{key:"containsAll",value:function(e,t){return this._addCondition(e,"$all",t)}},{key:"exists",value:function(e){return this._addCondition(e,"$exists",!0)}},{key:"doesNotExist",value:function(e){return this._addCondition(e,"$exists",!1)}},{key:"matches",value:function(e,t,r){return this._addCondition(e,"$regex",t),r||(r=""),t.ignoreCase&&(r+="i"),t.multiline&&(r+="m"),r.length&&this._addCondition(e,"$options",r),this}},{key:"matchesQuery",value:function(e,t){var r=t.toJSON();return r.className=t.className,this._addCondition(e,"$inQuery",r)}},{key:"doesNotMatchQuery",value:function(e,t){var r=t.toJSON();return r.className=t.className,this._addCondition(e,"$notInQuery",r)}},{key:"matchesKeyInQuery",value:function(e,t,r){var n=r.toJSON();return n.className=r.className,this._addCondition(e,"$select",{key:t,query:n})}},{key:"doesNotMatchKeyInQuery",value:function(e,t,r){var n=r.toJSON();return n.className=r.className,this._addCondition(e,"$dontSelect",{key:t,query:n})}},{key:"contains",value:function(e,t){if("string"!=typeof t)throw new Error("The value being searched for must be a string.");return this._addCondition(e,"$regex",o(t))}},{key:"fullText",value:function(e,t){if(!e)throw new Error("A key is required.");if(!t)throw new Error("A search term is required");if("string"!=typeof t)throw new Error("The value being searched for must be a string.");return this._addCondition(e,"$text",{$search:{$term:t}})}},{key:"startsWith",value:function(e,t){if("string"!=typeof t)throw new Error("The value being searched for must be a string.");return this._addCondition(e,"$regex","^"+o(t))}},{key:"endsWith",value:function(e,t){if("string"!=typeof t)throw new Error("The value being searched for must be a string.");return this._addCondition(e,"$regex",o(t)+"$")}},{key:"near",value:function(e,t){return t instanceof k.default||(t=new k.default(t)),this._addCondition(e,"$nearSphere",t)}},{key:"withinRadians",value:function(e,t,r){return this.near(e,t),this._addCondition(e,"$maxDistance",r)}},{key:"withinMiles",value:function(e,t,r){return this.withinRadians(e,t,r/3958.8)}},{key:"withinKilometers",value:function(e,t,r){return this.withinRadians(e,t,r/6371)}},{key:"withinGeoBox",value:function(e,t,r){return t instanceof k.default||(t=new k.default(t)),r instanceof k.default||(r=new k.default(r)),this._addCondition(e,"$within",{$box:[t,r]}),this}},{key:"withinPolygon",value:function(e,t){return this._addCondition(e,"$geoWithin",{$polygon:t})}},{key:"polygonContains",value:function(e,t){return this._addCondition(e,"$geoIntersects",{$point:t})}},{key:"ascending",value:function(){this._order=[];for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return this.addAscending.apply(this,t)}},{key:"addAscending",value:function(){var e=this;this._order||(this._order=[]);for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];return r.forEach(function(t){Array.isArray(t)&&(t=t.join()),e._order=e._order.concat(t.replace(/\s/g,"").split(","))}),this}},{key:"descending",value:function(){this._order=[];for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return this.addDescending.apply(this,t)}},{key:"addDescending",value:function(){var e=this;this._order||(this._order=[]);for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];return r.forEach(function(t){Array.isArray(t)&&(t=t.join()),e._order=e._order.concat(t.replace(/\s/g,"").split(",").map(function(e){return"-"+e}))}),this}},{key:"skip",value:function(e){if("number"!=typeof e||e<0)throw new Error("You can only skip by a positive number");return this._skip=e,this}},{key:"limit",value:function(e){if("number"!=typeof e)throw new Error("You can only set the limit to a numeric value");return this._limit=e,this}},{key:"include",value:function(){for(var e=this,t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];return r.forEach(function(t){Array.isArray(t)?e._include=e._include.concat(t):e._include.push(t)}),this}},{key:"select",value:function(){var e=this;this._select||(this._select=[]);for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];return r.forEach(function(t){Array.isArray(t)?e._select=e._select.concat(t):e._select.push(t)}),this}},{key:"subscribe",value:function(){return v.default.getLiveQueryController().subscribe(this)}}],[{key:"fromJSON",value:function(t,r){return new e(t).withJSON(r)}},{key:"or",value:function(){for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];var o=i(r),s=new e(o);return s._orQuery(r),s}},{key:"and",value:function(){for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];var o=i(r),s=new e(o);return s._andQuery(r),s}}]),e}(),A={find:function(e,t,r){return v.default.getRESTController().request("GET","classes/"+e,t,r)},aggregate:function(e,t,r){return v.default.getRESTController().request("GET","aggregate/"+e,t,r)}};v.default.setQueryController(A),r.default=P},{"./CoreManager":3,"./ParseError":13,"./ParseGeoPoint":15,"./ParseObject":18,"./ParsePolygon":20,"./ParsePromise":21,"./encode":38,"babel-runtime/core-js/object/keys":53,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/typeof":63}],23:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),a=n(s),u=e("./ParseOp"),l=e("./ParseObject"),c=(n(l),e("./ParseQuery")),f=n(c),d=function(){function e(t,r){(0,i.default)(this,e),this.parent=t,this.key=r,this.targetClassName=null}return(0,a.default)(e,[{key:"_ensureParentAndKey",value:function(e,t){if(this.key=this.key||t,this.key!==t)throw new Error("Internal Error. Relation retrieved from two different keys.");if(this.parent){if(this.parent.className!==e.className)throw new Error("Internal Error. Relation retrieved from two different Objects.");if(this.parent.id){if(this.parent.id!==e.id)throw new Error("Internal Error. Relation retrieved from two different Objects.")}else e.id&&(this.parent=e)}else this.parent=e}},{key:"add",value:function(e){Array.isArray(e)||(e=[e]);var t=new u.RelationOp(e,[]),r=this.parent;if(!r)throw new Error("Cannot add to a Relation without a parent");return r.set(this.key,t),this.targetClassName=t._targetClassName,r}},{key:"remove",value:function(e){Array.isArray(e)||(e=[e]);var t=new u.RelationOp([],e);if(!this.parent)throw new Error("Cannot remove from a Relation without a parent");this.parent.set(this.key,t),this.targetClassName=t._targetClassName}},{key:"toJSON",value:function(){return{__type:"Relation",className:this.targetClassName}}},{key:"query",value:function(){var e,t=this.parent;if(!t)throw new Error("Cannot construct a query for a Relation without a parent");return this.targetClassName?e=new f.default(this.targetClassName):(e=new f.default(t.className),e._extraOptions.redirectClassNameForKey=this.key),e._addCondition("$relatedTo","object",{__type:"Pointer",className:t.className,objectId:t.id}),e._addCondition("$relatedTo","key",this.key),e}}]),e}();r.default=d},{"./ParseObject":18,"./ParseOp":19,"./ParseQuery":22,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59}],24:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/object/get-prototype-of"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),a=n(s),u=e("babel-runtime/helpers/createClass"),l=n(u),c=e("babel-runtime/helpers/possibleConstructorReturn"),f=n(c),d=e("babel-runtime/helpers/get"),h=n(d),p=e("babel-runtime/helpers/inherits"),_=n(p),v=e("./ParseACL"),y=n(v),b=e("./ParseError"),g=n(b),m=e("./ParseObject"),C=n(m),k=function(e){function t(e,r){(0,a.default)(this,t);var n=(0,f.default)(this,(t.__proto__||(0,i.default)(t)).call(this,"_Role"));return"string"==typeof e&&r instanceof y.default&&(n.setName(e),n.setACL(r)),n}return(0,_.default)(t,e),(0,l.default)(t,[{key:"getName",value:function(){var e=this.get("name");return null==e||"string"==typeof e?e:""}},{key:"setName",value:function(e,t){return this.set("name",e,t)}},{key:"getUsers",value:function(){return this.relation("users")}},{key:"getRoles",value:function(){return this.relation("roles")}},{key:"validate",value:function(e,r){var n=(0,h.default)(t.prototype.__proto__||(0,i.default)(t.prototype),"validate",this).call(this,e,r);if(n)return n;if("name"in e&&e.name!==this.getName()){var o=e.name;if(this.id&&this.id!==e.objectId)return new g.default(g.default.OTHER_CAUSE,"A role's name can only be set before it has been saved.");if("string"!=typeof o)return new g.default(g.default.OTHER_CAUSE,"A role's name must be a String.");if(!/^[0-9a-zA-Z\-_ ]+$/.test(o))return new g.default(g.default.OTHER_CAUSE,"A role's name can be only contain alphanumeric characters, _, -, and spaces.")}return!1}}]),t}(C.default);C.default.registerSubclass("_Role",k),r.default=k},{"./ParseACL":11,"./ParseError":13,"./ParseObject":18,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/get":60,"babel-runtime/helpers/inherits":61,"babel-runtime/helpers/possibleConstructorReturn":62}],25:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),a=n(s),u=e("./CoreManager"),l=n(u),c=e("./ParsePromise"),f=(n(c),["String","Number","Boolean","Date","File","GeoPoint","Polygon","Array","Object","Pointer","Relation"]),d=function(){function e(t){(0,i.default)(this,e),"string"==typeof t&&("User"===t&&l.default.get("PERFORM_USER_REWRITE")?this.className="_User":this.className=t),this._fields={},this._indexes={}}return(0,a.default)(e,[{key:"get",value:function(e){return this.assertClassName(),e=e||{},l.default.getSchemaController().get(this.className,e).then(function(e){if(!e)throw new Error("Schema not found.");return e})._thenRunCallbacks(e)}},{key:"save",value:function(e){this.assertClassName(),e=e||{};var t=l.default.getSchemaController(),r={className:this.className,fields:this._fields,indexes:this._indexes};return t.create(this.className,r,e).then(function(e){return e})._thenRunCallbacks(e)}},{key:"update",value:function(e){this.assertClassName(),e=e||{};var t=l.default.getSchemaController(),r={className:this.className,fields:this._fields,indexes:this._indexes};return this._fields={},this._indexes={},t.update(this.className,r,e).then(function(e){return e})._thenRunCallbacks(e)}},{key:"delete",value:function(e){return this.assertClassName(),e=e||{},l.default.getSchemaController().delete(this.className,e).then(function(e){return e})._thenRunCallbacks(e)}},{key:"purge",value:function(e){return this.assertClassName(),
l.default.getSchemaController().purge(this.className).then(function(e){return e})._thenRunCallbacks(e)}},{key:"assertClassName",value:function(){if(!this.className)throw new Error("You must set a Class Name before making any request.")}},{key:"addField",value:function(e,t){if(t=t||"String",!e)throw new Error("field name may not be null.");if(-1===f.indexOf(t))throw new Error(t+" is not a valid type.");return this._fields[e]={type:t},this}},{key:"addIndex",value:function(e,t){if(!e)throw new Error("index name may not be null.");if(!t)throw new Error("index may not be null.");return this._indexes[e]=t,this}},{key:"addString",value:function(e){return this.addField(e,"String")}},{key:"addNumber",value:function(e){return this.addField(e,"Number")}},{key:"addBoolean",value:function(e){return this.addField(e,"Boolean")}},{key:"addDate",value:function(e){return this.addField(e,"Date")}},{key:"addFile",value:function(e){return this.addField(e,"File")}},{key:"addGeoPoint",value:function(e){return this.addField(e,"GeoPoint")}},{key:"addPolygon",value:function(e){return this.addField(e,"Polygon")}},{key:"addArray",value:function(e){return this.addField(e,"Array")}},{key:"addObject",value:function(e){return this.addField(e,"Object")}},{key:"addPointer",value:function(e,t){if(!e)throw new Error("field name may not be null.");if(!t)throw new Error("You need to set the targetClass of the Pointer.");return this._fields[e]={type:"Pointer",targetClass:t},this}},{key:"addRelation",value:function(e,t){if(!e)throw new Error("field name may not be null.");if(!t)throw new Error("You need to set the targetClass of the Relation.");return this._fields[e]={type:"Relation",targetClass:t},this}},{key:"deleteField",value:function(e){this._fields[e]={__op:"Delete"}}},{key:"deleteIndex",value:function(e){this._indexes[e]={__op:"Delete"}}}],[{key:"all",value:function(e){return e=e||{},l.default.getSchemaController().get("",e).then(function(e){if(0===e.results.length)throw new Error("Schema not found.");return e.results})._thenRunCallbacks(e)}}]),e}(),h={send:function(e,t,r,n){var o=l.default.getRESTController(),i={useMasterKey:!0};return n.hasOwnProperty("sessionToken")&&(i.sessionToken=n.sessionToken),o.request(t,"schemas/"+e,r,i)},get:function(e,t){return this.send(e,"GET",{},t)},create:function(e,t,r){return this.send(e,"POST",t,r)},update:function(e,t,r){return this.send(e,"PUT",t,r)},delete:function(e,t){return this.send(e,"DELETE",{},t)},purge:function(e){return l.default.getRESTController().request("DELETE","purge/"+e,{},{useMasterKey:!0})}};l.default.setSchemaController(h),r.default=d},{"./CoreManager":3,"./ParsePromise":21,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59}],26:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/typeof"),i=n(o),s=e("babel-runtime/core-js/object/get-prototype-of"),a=n(s),u=e("babel-runtime/helpers/classCallCheck"),l=n(u),c=e("babel-runtime/helpers/createClass"),f=n(c),d=e("babel-runtime/helpers/possibleConstructorReturn"),h=n(d),p=e("babel-runtime/helpers/inherits"),_=n(p),v=e("./CoreManager"),y=n(v),b=e("./isRevocableSession"),g=n(b),m=e("./ParseObject"),C=n(m),k=e("./ParsePromise"),j=n(k),w=e("./ParseUser"),O=n(w),S=function(e){function t(e){(0,l.default)(this,t);var r=(0,h.default)(this,(t.__proto__||(0,a.default)(t)).call(this,"_Session"));if(e&&"object"===(void 0===e?"undefined":(0,i.default)(e))&&!r.set(e||{}))throw new Error("Can't create an invalid Session");return r}return(0,_.default)(t,e),(0,f.default)(t,[{key:"getSessionToken",value:function(){var e=this.get("sessionToken");return"string"==typeof e?e:""}}],[{key:"readOnlyAttributes",value:function(){return["createdWith","expiresAt","installationId","restricted","sessionToken","user"]}},{key:"current",value:function(e){e=e||{};var t=y.default.getSessionController(),r={};return e.hasOwnProperty("useMasterKey")&&(r.useMasterKey=e.useMasterKey),O.default.currentAsync().then(function(e){return e?(e.getSessionToken(),r.sessionToken=e.getSessionToken(),t.getSession(r)):j.default.error("There is no current user.")})}},{key:"isCurrentSessionRevocable",value:function(){var e=O.default.current();return!!e&&(0,g.default)(e.getSessionToken()||"")}}]),t}(C.default);C.default.registerSubclass("_Session",S);var E={getSession:function(e){var t=y.default.getRESTController(),r=new S;return t.request("GET","sessions/me",{},e).then(function(e){return r._finishFetch(e),r._setExisted(!0),r})}};y.default.setSessionController(E),r.default=S},{"./CoreManager":3,"./ParseObject":18,"./ParsePromise":21,"./ParseUser":27,"./isRevocableSession":41,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/inherits":61,"babel-runtime/helpers/possibleConstructorReturn":62,"babel-runtime/helpers/typeof":63}],27:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/json/stringify"),i=n(o),s=e("babel-runtime/core-js/object/define-property"),a=n(s),u=e("babel-runtime/helpers/typeof"),l=n(u),c=e("babel-runtime/core-js/object/get-prototype-of"),f=n(c),d=e("babel-runtime/helpers/classCallCheck"),h=n(d),p=e("babel-runtime/helpers/createClass"),_=n(p),v=e("babel-runtime/helpers/possibleConstructorReturn"),y=n(v),b=e("babel-runtime/helpers/get"),g=n(b),m=e("babel-runtime/helpers/inherits"),C=n(m),k=e("./CoreManager"),j=n(k),w=e("./isRevocableSession"),O=n(w),S=e("./ParseError"),E=n(S),P=e("./ParseObject"),A=n(P),T=e("./ParsePromise"),I=n(T),N=e("./ParseSession"),R=n(N),M=e("./Storage"),x=n(M),L=!j.default.get("IS_NODE"),D=!1,U=null,F={},q=function(e){function t(e){(0,h.default)(this,t);var r=(0,y.default)(this,(t.__proto__||(0,f.default)(t)).call(this,"_User"));if(e&&"object"===(void 0===e?"undefined":(0,l.default)(e))&&!r.set(e||{}))throw new Error("Can't create an invalid Parse User");return r}return(0,C.default)(t,e),(0,_.default)(t,[{key:"_upgradeToRevocableSession",value:function(e){e=e||{};var t={};return e.hasOwnProperty("useMasterKey")&&(t.useMasterKey=e.useMasterKey),j.default.getUserController().upgradeToRevocableSession(this,t)._thenRunCallbacks(e)}},{key:"_linkWith",value:function(e,t){var r,n=this;if("string"==typeof e?(r=e,e=F[e]):r=e.getAuthType(),t&&t.hasOwnProperty("authData")){var o=this.get("authData")||{};if("object"!==(void 0===o?"undefined":(0,l.default)(o)))throw new Error("Invalid type: authData field should be an object");o[r]=t.authData;return j.default.getUserController().linkWith(this,o)._thenRunCallbacks(t,this)}var i=new I.default;return e.authenticate({success:function(e,r){var o={};o.authData=r,t.success&&(o.success=t.success),t.error&&(o.error=t.error),n._linkWith(e,o).then(function(){i.resolve(n)},function(e){i.reject(e)})},error:function(e,r){"function"==typeof t.error&&t.error(n,r),i.reject(r)}}),i}},{key:"_synchronizeAuthData",value:function(e){if(this.isCurrent()&&e){var t;"string"==typeof e?(t=e,e=F[t]):t=e.getAuthType();var r=this.get("authData");if(e&&r&&"object"===(void 0===r?"undefined":(0,l.default)(r))){e.restoreAuthentication(r[t])||this._unlinkFrom(e)}}}},{key:"_synchronizeAllAuthData",value:function(){var e=this.get("authData");if("object"===(void 0===e?"undefined":(0,l.default)(e)))for(var t in e)this._synchronizeAuthData(t)}},{key:"_cleanupAuthData",value:function(){if(this.isCurrent()){var e=this.get("authData");if("object"===(void 0===e?"undefined":(0,l.default)(e)))for(var t in e)e[t]||delete e[t]}}},{key:"_unlinkFrom",value:function(e,t){var r=this;return"string"==typeof e?e=F[e]:e.getAuthType(),this._linkWith(e,{authData:null}).then(function(){return r._synchronizeAuthData(e),I.default.as(r)})._thenRunCallbacks(t)}},{key:"_isLinked",value:function(e){var t;t="string"==typeof e?e:e.getAuthType();var r=this.get("authData")||{};return"object"===(void 0===r?"undefined":(0,l.default)(r))&&!!r[t]}},{key:"_logOutWithAll",value:function(){var e=this.get("authData");if("object"===(void 0===e?"undefined":(0,l.default)(e)))for(var t in e)this._logOutWith(t)}},{key:"_logOutWith",value:function(e){this.isCurrent()&&("string"==typeof e&&(e=F[e]),e&&e.deauthenticate&&e.deauthenticate())}},{key:"_preserveFieldsOnFetch",value:function(){return{sessionToken:this.get("sessionToken")}}},{key:"isCurrent",value:function(){var e=t.current();return!!e&&e.id===this.id}},{key:"getUsername",value:function(){var e=this.get("username");return null==e||"string"==typeof e?e:""}},{key:"setUsername",value:function(e){var t=this.get("authData");t&&"object"===(void 0===t?"undefined":(0,l.default)(t))&&t.hasOwnProperty("anonymous")&&(t.anonymous=null),this.set("username",e)}},{key:"setPassword",value:function(e){this.set("password",e)}},{key:"getEmail",value:function(){var e=this.get("email");return null==e||"string"==typeof e?e:""}},{key:"setEmail",value:function(e){this.set("email",e)}},{key:"getSessionToken",value:function(){var e=this.get("sessionToken");return null==e||"string"==typeof e?e:""}},{key:"authenticated",value:function(){var e=t.current();return!!this.get("sessionToken")&&!!e&&e.id===this.id}},{key:"signUp",value:function(e,t){t=t||{};var r={};return t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),t.hasOwnProperty("installationId")&&(r.installationId=t.installationId),j.default.getUserController().signUp(this,e,r)._thenRunCallbacks(t,this)}},{key:"logIn",value:function(e){e=e||{};var t={};return e.hasOwnProperty("useMasterKey")&&(t.useMasterKey=e.useMasterKey),e.hasOwnProperty("installationId")&&(t.installationId=e.installationId),j.default.getUserController().logIn(this,t)._thenRunCallbacks(e,this)}},{key:"save",value:function(){for(var e=this,r=arguments.length,n=Array(r),o=0;o<r;o++)n[o]=arguments[o];return(0,g.default)(t.prototype.__proto__||(0,f.default)(t.prototype),"save",this).apply(this,n).then(function(){return e.isCurrent()?j.default.getUserController().updateUserOnDisk(e):e})}},{key:"destroy",value:function(){for(var e=this,r=arguments.length,n=Array(r),o=0;o<r;o++)n[o]=arguments[o];return(0,g.default)(t.prototype.__proto__||(0,f.default)(t.prototype),"destroy",this).apply(this,n).then(function(){return e.isCurrent()?j.default.getUserController().removeUserFromDisk():e})}},{key:"fetch",value:function(){for(var e=this,r=arguments.length,n=Array(r),o=0;o<r;o++)n[o]=arguments[o];return(0,g.default)(t.prototype.__proto__||(0,f.default)(t.prototype),"fetch",this).apply(this,n).then(function(){return e.isCurrent()?j.default.getUserController().updateUserOnDisk(e):e})}}],[{key:"readOnlyAttributes",value:function(){return["sessionToken"]}},{key:"extend",value:function(e,r){if(e)for(var n in e)"className"!==n&&(0,a.default)(t.prototype,n,{value:e[n],enumerable:!1,writable:!0,configurable:!0});if(r)for(var n in r)"className"!==n&&(0,a.default)(t,n,{value:r[n],enumerable:!1,writable:!0,configurable:!0});return t}},{key:"current",value:function(){return L?j.default.getUserController().currentUser():null}},{key:"currentAsync",value:function(){return L?j.default.getUserController().currentUserAsync():I.default.as(null)}},{key:"signUp",value:function(e,r,n,o){return n=n||{},n.username=e,n.password=r,new t(n).signUp({},o)}},{key:"logIn",value:function(e,r,n){if("string"!=typeof e)return I.default.error(new E.default(E.default.OTHER_CAUSE,"Username must be a string."));if("string"!=typeof r)return I.default.error(new E.default(E.default.OTHER_CAUSE,"Password must be a string."));var o=new t;return o._finishFetch({username:e,password:r}),o.logIn(n)}},{key:"become",value:function(e,t){if(!L)throw new Error("It is not memory-safe to become a user in a server environment");t=t||{};var r={sessionToken:e};return t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),j.default.getUserController().become(r)._thenRunCallbacks(t)}},{key:"logInWith",value:function(e,r){return t._logInWith(e,r)}},{key:"logOut",value:function(){if(!L)throw new Error("There is no current user on a node.js server environment.");return j.default.getUserController().logOut()}},{key:"requestPasswordReset",value:function(e,t){t=t||{};var r={};return t.hasOwnProperty("useMasterKey")&&(r.useMasterKey=t.useMasterKey),j.default.getUserController().requestPasswordReset(e,r)._thenRunCallbacks(t)}},{key:"allowCustomUserClass",value:function(e){j.default.set("PERFORM_USER_REWRITE",!e)}},{key:"enableRevocableSession",value:function(e){if(e=e||{},j.default.set("FORCE_REVOCABLE_SESSION",!0),L){var r=t.current();if(r)return r._upgradeToRevocableSession(e)}return I.default.as()._thenRunCallbacks(e)}},{key:"enableUnsafeCurrentUser",value:function(){L=!0}},{key:"disableUnsafeCurrentUser",value:function(){L=!1}},{key:"_registerAuthenticationProvider",value:function(e){F[e.getAuthType()]=e,t.currentAsync().then(function(t){t&&t._synchronizeAuthData(e.getAuthType())})}},{key:"_logInWith",value:function(e,r){return(new t)._linkWith(e,r)}},{key:"_clearCache",value:function(){U=null,D=!1}},{key:"_setCurrentUserCache",value:function(e){U=e}}]),t}(A.default);A.default.registerSubclass("_User",q);var K={updateUserOnDisk:function(e){var t=x.default.generatePath("currentUser"),r=e.toJSON();return r.className="_User",x.default.setItemAsync(t,(0,i.default)(r)).then(function(){return e})},removeUserFromDisk:function(){var e=x.default.generatePath("currentUser");return D=!0,U=null,x.default.removeItemAsync(e)},setCurrentUser:function(e){return U=e,e._cleanupAuthData(),e._synchronizeAllAuthData(),K.updateUserOnDisk(e)},currentUser:function(){if(U)return U;if(D)return null;if(x.default.async())throw new Error("Cannot call currentUser() when using a platform with an async storage system. Call currentUserAsync() instead.");var e=x.default.generatePath("currentUser"),t=x.default.getItem(e);if(D=!0,!t)return U=null,null;t=JSON.parse(t),t.className||(t.className="_User"),t._id&&(t.objectId!==t._id&&(t.objectId=t._id),delete t._id),t._sessionToken&&(t.sessionToken=t._sessionToken,delete t._sessionToken);var r=A.default.fromJSON(t);return U=r,r._synchronizeAllAuthData(),r},currentUserAsync:function(){if(U)return I.default.as(U);if(D)return I.default.as(null);var e=x.default.generatePath("currentUser");return x.default.getItemAsync(e).then(function(e){if(D=!0,!e)return U=null,I.default.as(null);e=JSON.parse(e),e.className||(e.className="_User"),e._id&&(e.objectId!==e._id&&(e.objectId=e._id),delete e._id),e._sessionToken&&(e.sessionToken=e._sessionToken,delete e._sessionToken);var t=A.default.fromJSON(e);return U=t,t._synchronizeAllAuthData(),I.default.as(t)})},signUp:function(e,t,r){var n=t&&t.username||e.get("username"),o=t&&t.password||e.get("password");return n&&n.length?o&&o.length?e.save(t,r).then(function(){return e._finishFetch({password:void 0}),L?K.setCurrentUser(e):e}):I.default.error(new E.default(E.default.OTHER_CAUSE,"Cannot sign up user with an empty password.")):I.default.error(new E.default(E.default.OTHER_CAUSE,"Cannot sign up user with an empty name."))},logIn:function(e,t){var r=j.default.getRESTController(),n=j.default.getObjectStateController(),o={username:e.get("username"),password:e.get("password")};return r.request("GET","login",o,t).then(function(t){return e._migrateId(t.objectId),e._setExisted(!0),n.setPendingOp(e._getStateIdentifier(),"username",void 0),n.setPendingOp(e._getStateIdentifier(),"password",void 0),t.password=void 0,e._finishFetch(t),L?K.setCurrentUser(e):I.default.as(e)})},become:function(e){var t=new q;return j.default.getRESTController().request("GET","users/me",{},e).then(function(e){return t._finishFetch(e),t._setExisted(!0),K.setCurrentUser(t)})},logOut:function(){return K.currentUserAsync().then(function(e){var t=x.default.generatePath("currentUser"),r=x.default.removeItemAsync(t),n=j.default.getRESTController();if(null!==e){var o=e.getSessionToken();o&&(0,O.default)(o)&&(r=r.then(function(){return n.request("POST","logout",{},{sessionToken:o})})),e._logOutWithAll(),e._finishFetch({sessionToken:void 0})}return D=!0,U=null,r})},requestPasswordReset:function(e,t){return j.default.getRESTController().request("POST","requestPasswordReset",{email:e},t)},upgradeToRevocableSession:function(e,t){var r=e.getSessionToken();return r?(t.sessionToken=r,j.default.getRESTController().request("POST","upgradeToRevocableSession",{},t).then(function(t){var r=new R.default;return r._finishFetch(t),e._finishFetch({sessionToken:r.getSessionToken()}),e.isCurrent()?K.setCurrentUser(e):I.default.as(e)})):I.default.error(new E.default(E.default.SESSION_MISSING,"Cannot upgrade a user with no session token"))},linkWith:function(e,t){return e.save({authData:t}).then(function(){return L?K.setCurrentUser(e):e})}};j.default.setUserController(K),r.default=q},{"./CoreManager":3,"./ParseError":13,"./ParseObject":18,"./ParsePromise":21,"./ParseSession":26,"./Storage":31,"./isRevocableSession":41,"babel-runtime/core-js/json/stringify":46,"babel-runtime/core-js/object/define-property":49,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59,"babel-runtime/helpers/get":60,"babel-runtime/helpers/inherits":61,"babel-runtime/helpers/possibleConstructorReturn":62,"babel-runtime/helpers/typeof":63}],28:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(t=t||{},e.where&&e.where instanceof c.default&&(e.where=e.where.toJSON().where),e.push_time&&"object"===(0,s.default)(e.push_time)&&(e.push_time=e.push_time.toJSON()),e.expiration_time&&"object"===(0,s.default)(e.expiration_time)&&(e.expiration_time=e.expiration_time.toJSON()),e.expiration_time&&e.expiration_interval)throw new Error("expiration_time and expiration_interval cannot both be set.");return u.default.getPushController().send(e,{useMasterKey:t.useMasterKey})._thenRunCallbacks(t)}Object.defineProperty(r,"__esModule",{value:!0});var i=e("babel-runtime/helpers/typeof"),s=n(i);r.send=o;var a=e("./CoreManager"),u=n(a),l=e("./ParseQuery"),c=n(l),f={send:function(e,t){return u.default.getRESTController().request("POST","push",e,{useMasterKey:!!t.useMasterKey})._thenRunCallbacks(t)}};u.default.setPushController(f)},{"./CoreManager":3,"./ParseQuery":22,"babel-runtime/helpers/typeof":63}],29:[function(e,t,r){(function(r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t,r){var n=new p.default,o=new XDomainRequest;return o.onload=function(){var e;try{e=JSON.parse(o.responseText)}catch(e){n.reject(e)}e&&n.resolve(e)},o.onerror=o.ontimeout=function(){var e={responseText:(0,u.default)({code:d.default.X_DOMAIN_REQUEST,error:"IE's XDomainRequest does not supply error info."})};n.reject(e)},o.onprogress=function(){},o.open(e,t),o.send(r),n}var i=e("babel-runtime/helpers/typeof"),s=n(i),a=e("babel-runtime/core-js/json/stringify"),u=n(a),l=e("./CoreManager"),c=n(l),f=e("./ParseError"),d=n(f),h=e("./ParsePromise"),p=n(h),_=e("./Storage"),v=(n(_),null);"undefined"!=typeof XMLHttpRequest&&(v=XMLHttpRequest);var y=!1;"undefined"==typeof XDomainRequest||"withCredentials"in new XMLHttpRequest||(y=!0);var b={ajax:function(e,t,n,i){if(y)return o(e,t,n);var s=new p.default,a=0;return function o(){if(null==v)throw new Error("Cannot make a request: No definition of XMLHttpRequest was found.");var u=!1,l=new v;l.onreadystatechange=function(){if(4===l.readyState&&!u)if(u=!0,l.status>=200&&l.status<300){var e;try{e=JSON.parse(l.responseText)}catch(e){s.reject(e.toString())}e&&s.resolve(e,l.status,l)}else if(l.status>=500||0===l.status)if(++a<c.default.get("REQUEST_ATTEMPT_LIMIT")){var t=Math.round(125*Math.random()*Math.pow(2,a));setTimeout(o,t)}else 0===l.status?s.reject("Unable to connect to the Parse API"):s.reject(l);else s.reject(l)},i=i||{},"string"!=typeof i["Content-Type"]&&(i["Content-Type"]="text/plain"),c.default.get("IS_NODE")&&(i["User-Agent"]="Parse/"+c.default.get("VERSION")+" (NodeJS "+r.versions.node+")"),l.open(e,t,!0);for(var f in i)l.setRequestHeader(f,i[f]);l.send(n)}(),s},request:function(e,t,r,n){n=n||{};var o=c.default.get("SERVER_URL");"/"!==o[o.length-1]&&(o+="/"),o+=t;var i={};if(r&&"object"===(void 0===r?"undefined":(0,s.default)(r)))for(var a in r)i[a]=r[a];"POST"!==e&&(i._method=e,e="POST"),i._ApplicationId=c.default.get("APPLICATION_ID");var l=c.default.get("JAVASCRIPT_KEY");l&&(i._JavaScriptKey=l),i._ClientVersion=c.default.get("VERSION");var f=n.useMasterKey;if(void 0===f&&(f=c.default.get("USE_MASTER_KEY")),f){if(!c.default.get("MASTER_KEY"))throw new Error("Cannot use the Master Key, it has not been provided.");delete i._JavaScriptKey,i._MasterKey=c.default.get("MASTER_KEY")}c.default.get("FORCE_REVOCABLE_SESSION")&&(i._RevocableSession="1");var h,_=n.installationId;if(_&&"string"==typeof _)h=p.default.as(_);else{h=c.default.getInstallationController().currentInstallationId()}return h.then(function(e){i._InstallationId=e;var t=c.default.getUserController();return n&&"string"==typeof n.sessionToken?p.default.as(n.sessionToken):t?t.currentUserAsync().then(function(e){return e?p.default.as(e.getSessionToken()):p.default.as(null)}):p.default.as(null)}).then(function(t){t&&(i._SessionToken=t);var r=(0,u.default)(i);return b.ajax(e,o,r)}).then(null,function(e){var t;if(e&&e.responseText)try{var r=JSON.parse(e.responseText);t=new d.default(r.code,r.error)}catch(r){t=new d.default(d.default.INVALID_JSON,"Received an error with invalid JSON from Parse: "+e.responseText)}else t=new d.default(d.default.CONNECTION_FAILED,"XMLHttpRequest failed: "+(0,u.default)(e));return p.default.error(t)})},_setXHR:function(e){v=e}};t.exports=b}).call(this,e("_process"))},{"./CoreManager":3,"./ParseError":13,"./ParsePromise":21,"./Storage":31,_process:64,"babel-runtime/core-js/json/stringify":46,"babel-runtime/helpers/typeof":63}],30:[function(e,t,r){"use strict";function n(e){var t=k[e.className];return t?t[e.id]||null:null}function o(e,t){var r=n(e);return r||(k[e.className]||(k[e.className]={}),t||(t=C.defaultState()),r=k[e.className][e.id]=t)}function i(e){var t=n(e);return null===t?null:(delete k[e.className][e.id],t)}function s(e){var t=n(e);return t?t.serverData:{}}function a(e,t){var r=o(e).serverData;C.setServerData(r,t)}function u(e){var t=n(e);return t?t.pendingOps:[{}]}function l(e,t,r){var n=o(e).pendingOps;C.setPendingOp(n,t,r)}function c(e){var t=o(e).pendingOps;C.pushPendingState(t)}function f(e){var t=o(e).pendingOps;return C.popPendingState(t)}function d(e){var t=u(e);C.mergeFirstPendingState(t)}function h(e){var t=n(e);return t?t.objectCache:{}}function p(e,t){var r=s(e),n=u(e);return C.estimateAttribute(r,n,e.className,e.id,t)}function _(e){var t=s(e),r=u(e);return C.estimateAttributes(t,r,e.className,e.id)}function v(e,t){var r=o(e);C.commitServerChanges(r.serverData,r.objectCache,t)}function y(e,t){return o(e).tasks.enqueue(t)}function b(){k={}}function g(e,t){t.id=e.id}Object.defineProperty(r,"__esModule",{value:!0}),r.getState=n,r.initializeState=o,r.removeState=i,r.getServerData=s,r.setServerData=a,r.getPendingOps=u,r.setPendingOp=l,r.pushPendingState=c,r.popPendingState=f,r.mergeFirstPendingState=d,r.getObjectCache=h,r.estimateAttribute=p,r.estimateAttributes=_,r.commitServerChanges=v,r.enqueueTask=y,r.clearAllState=b,r.duplicateState=g;var m=e("./ObjectStateMutations"),C=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(m),k={}},{"./ObjectStateMutations":9}],31:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var o=e("./CoreManager"),i=n(o),s=e("./ParsePromise"),a=n(s),u={async:function(){return!!i.default.getStorageController().async},getItem:function(e){var t=i.default.getStorageController();if(1===t.async)throw new Error("Synchronous storage is not supported by the current storage controller");return t.getItem(e)},getItemAsync:function(e){var t=i.default.getStorageController();return 1===t.async?t.getItemAsync(e):a.default.as(t.getItem(e))},setItem:function(e,t){var r=i.default.getStorageController();if(1===r.async)throw new Error("Synchronous storage is not supported by the current storage controller");return r.setItem(e,t)},setItemAsync:function(e,t){var r=i.default.getStorageController();return 1===r.async?r.setItemAsync(e,t):a.default.as(r.setItem(e,t))},removeItem:function(e){var t=i.default.getStorageController();if(1===t.async)throw new Error("Synchronous storage is not supported by the current storage controller");return t.removeItem(e)},removeItemAsync:function(e){var t=i.default.getStorageController();return 1===t.async?t.removeItemAsync(e):a.default.as(t.removeItem(e))},generatePath:function(e){if(!i.default.get("APPLICATION_ID"))throw new Error("You need to call Parse.initialize before using Parse.");if("string"!=typeof e)throw new Error("Tried to get a Storage path that was not a String.");return"/"===e[0]&&(e=e.substr(1)),"Parse/"+i.default.get("APPLICATION_ID")+"/"+e},_clear:function(){var e=i.default.getStorageController();e.hasOwnProperty("clear")&&e.clear()}};t.exports=u,i.default.setStorageController(e("./StorageController.browser"))},{"./CoreManager":3,"./ParsePromise":21,"./StorageController.browser":32}],32:[function(e,t,r){"use strict";var n=e("./ParsePromise"),o=(function(e){e&&e.__esModule}(n),{async:0,getItem:function(e){return localStorage.getItem(e)},setItem:function(e,t){try{localStorage.setItem(e,t)}catch(e){}},removeItem:function(e){localStorage.removeItem(e)},clear:function(){localStorage.clear()}});t.exports=o},{"./ParsePromise":21}],33:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),a=n(s),u=e("./ParsePromise"),l=n(u),c=function(){function e(){(0,i.default)(this,e),this.queue=[]}return(0,a.default)(e,[{key:"enqueue",value:function(e){var t=this,r=new l.default;return this.queue.push({task:e,_completion:r}),1===this.queue.length&&e().then(function(){t._dequeue(),r.resolve()},function(e){t._dequeue(),r.reject(e)}),r}},{key:"_dequeue",value:function(){var e=this;if(this.queue.shift(),this.queue.length){var t=this.queue[0];t.task().then(function(){e._dequeue(),t._completion.resolve()},function(r){e._dequeue(),t._completion.reject(r)})}}}]),e}();t.exports=c},{"./ParsePromise":21,"babel-runtime/helpers/classCallCheck":58,"babel-runtime/helpers/createClass":59}],34:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return E.get(e)||null}function i(e,t){var r=o(e);return r||(t||(t={serverData:{},pendingOps:[{}],objectCache:{},tasks:new S.default,existed:!1}),r=t,E.set(e,r),r)}function s(e){var t=o(e);return null===t?null:(E.delete(e),t)}function a(e){var t=o(e);return t?t.serverData:{}}function u(e,t){var r=i(e).serverData;w.setServerData(r,t)}function l(e){var t=o(e);return t?t.pendingOps:[{}]}function c(e,t,r){var n=i(e).pendingOps;w.setPendingOp(n,t,r)}function f(e){var t=i(e).pendingOps;w.pushPendingState(t)}function d(e){var t=i(e).pendingOps;return w.popPendingState(t)}function h(e){var t=l(e);w.mergeFirstPendingState(t)}function p(e){var t=o(e);return t?t.objectCache:{}}function _(e,t){var r=a(e),n=l(e);return w.estimateAttribute(r,n,e.className,e.id,t)}function v(e){var t=a(e),r=l(e);return w.estimateAttributes(t,r,e.className,e.id)}function y(e,t){var r=i(e);w.commitServerChanges(r.serverData,r.objectCache,t)}function b(e,t){return i(e).tasks.enqueue(t)}function g(e,t){var r=i(e),n=i(t);for(var o in r.serverData)n.serverData[o]=r.serverData[o];for(var s=0;s<r.pendingOps.length;s++)for(var a in r.pendingOps[s])n.pendingOps[s][a]=r.pendingOps[s][a];for(var u in r.objectCache)n.objectCache[u]=r.objectCache[u];n.existed=r.existed}function m(){E=new k.default}Object.defineProperty(r,"__esModule",{value:!0});var C=e("babel-runtime/core-js/weak-map"),k=n(C);r.getState=o,r.initializeState=i,r.removeState=s,r.getServerData=a,r.setServerData=u,r.getPendingOps=l,r.setPendingOp=c,r.pushPendingState=f,r.popPendingState=d,r.mergeFirstPendingState=h,r.getObjectCache=p,r.estimateAttribute=_,r.estimateAttributes=v,r.commitServerChanges=y,r.enqueueTask=b,r.duplicateState=g,r.clearAllState=m;var j=e("./ObjectStateMutations"),w=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(j),O=e("./TaskQueue"),S=n(O),E=new k.default},{"./ObjectStateMutations":9,"./TaskQueue":33,"babel-runtime/core-js/weak-map":57}],35:[function(e,t,r){"use strict";function n(e,t){if(e.indexOf(t)>-1)return!0;for(var r=0;r<e.length;r++)if(e[r]instanceof i.default&&e[r].className===t.className&&e[r]._getId()===t._getId())return!0;return!1}Object.defineProperty(r,"__esModule",{value:!0}),r.default=n;var o=e("./ParseObject"),i=function(e){return e&&e.__esModule?e:{default:e}}(o)},{"./ParseObject":18}],36:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){if(!(e instanceof f.default))return!0;var t=e.attributes;for(var r in t){if(!i(t[r]))return!1}return!0}function i(e){if("object"!==(void 0===e?"undefined":(0,a.default)(e)))return!0;if(e instanceof h.default)return!0;if(e instanceof f.default)return!!e.id;if(e instanceof l.default)return!!e.url();if(Array.isArray(e)){for(var t=0;t<e.length;t++)if(!i(e[t]))return!1;return!0}for(var r in e)if(!i(e[r]))return!1;return!0}Object.defineProperty(r,"__esModule",{value:!0});var s=e("babel-runtime/helpers/typeof"),a=n(s);r.default=o;var u=e("./ParseFile"),l=n(u),c=e("./ParseObject"),f=n(c),d=e("./ParseRelation"),h=n(d)},{"./ParseFile":14,"./ParseObject":18,"./ParseRelation":23,"babel-runtime/helpers/typeof":63}],37:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){if(null===e||"object"!==(void 0===e?"undefined":(0,s.default)(e)))return e;if(Array.isArray(e)){var t=[];return e.forEach(function(e,r){t[r]=o(e)}),t}if("string"==typeof e.__op)return(0,v.opFromJSON)(e);if("Pointer"===e.__type&&e.className)return _.default.fromJSON(e);if("Object"===e.__type&&e.className)return _.default.fromJSON(e);if("Relation"===e.__type){var r=new b.default(null,null);return r.targetClassName=e.className,r}if("Date"===e.__type)return new Date(e.iso);if("File"===e.__type)return l.default.fromJSON(e);if("GeoPoint"===e.__type)return new f.default({latitude:e.latitude,longitude:e.longitude});if("Polygon"===e.__type)return new h.default(e.coordinates);var n={};for(var i in e)n[i]=o(e[i]);return n}Object.defineProperty(r,"__esModule",{value:!0});var i=e("babel-runtime/helpers/typeof"),s=n(i);r.default=o;var a=e("./ParseACL"),u=(n(a),e("./ParseFile")),l=n(u),c=e("./ParseGeoPoint"),f=n(c),d=e("./ParsePolygon"),h=n(d),p=e("./ParseObject"),_=n(p),v=e("./ParseOp"),y=e("./ParseRelation"),b=n(y)},{"./ParseACL":11,"./ParseFile":14,"./ParseGeoPoint":15,"./ParseObject":18,"./ParseOp":19,"./ParsePolygon":20,"./ParseRelation":23,"babel-runtime/helpers/typeof":63}],38:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t,r,n){if(e instanceof b.default){if(t)throw new Error("Parse Objects not allowed here");var i=e.id?e.className+":"+e.id:e;return r||!n||n.indexOf(i)>-1||e.dirty()||(0,u.default)(e._getServerData()).length<1?e.toPointer():(n=n.concat(i),e._toFullJSON(n))}if(e instanceof g.Op||e instanceof c.default||e instanceof p.default||e instanceof v.default||e instanceof C.default)return e.toJSON();if(e instanceof d.default){if(!e.url())throw new Error("Tried to encode an unsaved file.");return e.toJSON()}if("[object Date]"===k.call(e)){if(isNaN(e))throw new Error("Tried to encode an invalid date.");return{__type:"Date",iso:e.toJSON()}}if("[object RegExp]"===k.call(e)&&"string"==typeof e.source)return e.source;if(Array.isArray(e))return e.map(function(e){return o(e,t,r,n)})
;if(e&&"object"===(void 0===e?"undefined":(0,s.default)(e))){var a={};for(var l in e)a[l]=o(e[l],t,r,n);return a}return e}Object.defineProperty(r,"__esModule",{value:!0});var i=e("babel-runtime/helpers/typeof"),s=n(i),a=e("babel-runtime/core-js/object/keys"),u=n(a);r.default=function(e,t,r,n){return o(e,!!t,!!r,n||[])};var l=e("./ParseACL"),c=n(l),f=e("./ParseFile"),d=n(f),h=e("./ParseGeoPoint"),p=n(h),_=e("./ParsePolygon"),v=n(_),y=e("./ParseObject"),b=n(y),g=e("./ParseOp"),m=e("./ParseRelation"),C=n(m),k=Object.prototype.toString},{"./ParseACL":11,"./ParseFile":14,"./ParseGeoPoint":15,"./ParseObject":18,"./ParseOp":19,"./ParsePolygon":20,"./ParseRelation":23,"babel-runtime/core-js/object/keys":53,"babel-runtime/helpers/typeof":63}],39:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if((void 0===e?"undefined":(0,u.default)(e))!==(void 0===t?"undefined":(0,u.default)(t)))return!1;if(!e||"object"!==(void 0===e?"undefined":(0,u.default)(e)))return e===t;if(Array.isArray(e)||Array.isArray(t)){if(!Array.isArray(e)||!Array.isArray(t))return!1;if(e.length!==t.length)return!1;for(var r=e.length;r--;)if(!o(e[r],t[r]))return!1;return!0}if(e instanceof c.default||e instanceof d.default||e instanceof p.default||e instanceof v.default)return e.equals(t);if((0,s.default)(e).length!==(0,s.default)(t).length)return!1;for(var n in e)if(!o(e[n],t[n]))return!1;return!0}Object.defineProperty(r,"__esModule",{value:!0});var i=e("babel-runtime/core-js/object/keys"),s=n(i),a=e("babel-runtime/helpers/typeof"),u=n(a);r.default=o;var l=e("./ParseACL"),c=n(l),f=e("./ParseFile"),d=n(f),h=e("./ParseGeoPoint"),p=n(h),_=e("./ParseObject"),v=n(_)},{"./ParseACL":11,"./ParseFile":14,"./ParseGeoPoint":15,"./ParseObject":18,"babel-runtime/core-js/object/keys":53,"babel-runtime/helpers/typeof":63}],40:[function(e,t,r){"use strict";function n(e){return e.replace(/[&<>\/'"]/g,function(e){return o[e]})}Object.defineProperty(r,"__esModule",{value:!0}),r.default=n;var o={"&":"&amp;","<":"&lt;",">":"&gt;","/":"&#x2F;","'":"&#x27;",'"':"&quot;"}},{}],41:[function(e,t,r){"use strict";function n(e){return e.indexOf("r:")>-1}Object.defineProperty(r,"__esModule",{value:!0}),r.default=n},{}],42:[function(e,t,r){"use strict";function n(e){var t=new RegExp("^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})(.([0-9]+))?Z$"),r=t.exec(e);if(!r)return null;var n=r[1]||0,o=(r[2]||1)-1,i=r[3]||0,s=r[4]||0,a=r[5]||0,u=r[6]||0,l=r[8]||0;return new Date(Date.UTC(n,o,i,s,a,u,l))}Object.defineProperty(r,"__esModule",{value:!0}),r.default=n},{}],43:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){var t=[];return e.forEach(function(e){e instanceof u.default?(0,s.default)(t,e)||t.push(e):t.indexOf(e)<0&&t.push(e)}),t}Object.defineProperty(r,"__esModule",{value:!0}),r.default=o;var i=e("./arrayContainsObject"),s=n(i),a=e("./ParseObject"),u=n(a)},{"./ParseObject":18,"./arrayContainsObject":35}],44:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var r={objects:{},files:[]},n=e.className+":"+e._getId();r.objects[n]=!e.dirty()||e;var o=e.attributes;for(var s in o)"object"===(0,a.default)(o[s])&&i(o[s],r,!1,!!t);var u=[];for(var l in r.objects)l!==n&&!0!==r.objects[l]&&u.push(r.objects[l]);return u.concat(r.files)}function i(e,t,r,n){if(e instanceof f.default){if(!e.id&&r)throw new Error("Cannot create a pointer to an unsaved Object.");var o=e.className+":"+e._getId();if(!t.objects[o]){t.objects[o]=!e.dirty()||e;var s=e.attributes;for(var u in s)"object"===(0,a.default)(s[u])&&i(s[u],t,!n,n)}}else{if(e instanceof l.default)return void(!e.url()&&t.files.indexOf(e)<0&&t.files.push(e));if(!(e instanceof h.default)){Array.isArray(e)&&e.forEach(function(e){"object"===(void 0===e?"undefined":(0,a.default)(e))&&i(e,t,r,n)});for(var c in e)"object"===(0,a.default)(e[c])&&i(e[c],t,r,n)}}}Object.defineProperty(r,"__esModule",{value:!0});var s=e("babel-runtime/helpers/typeof"),a=n(s);r.default=o;var u=e("./ParseFile"),l=n(u),c=e("./ParseObject"),f=n(c),d=e("./ParseRelation"),h=n(d)},{"./ParseFile":14,"./ParseObject":18,"./ParseRelation":23,"babel-runtime/helpers/typeof":63}],45:[function(e,t,r){t.exports={default:e("core-js/library/fn/get-iterator"),__esModule:!0}},{"core-js/library/fn/get-iterator":65}],46:[function(e,t,r){t.exports={default:e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":66}],47:[function(e,t,r){t.exports={default:e("core-js/library/fn/map"),__esModule:!0}},{"core-js/library/fn/map":67}],48:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/create"),__esModule:!0}},{"core-js/library/fn/object/create":68}],49:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":69}],50:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/freeze"),__esModule:!0}},{"core-js/library/fn/object/freeze":70}],51:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/get-own-property-descriptor"),__esModule:!0}},{"core-js/library/fn/object/get-own-property-descriptor":71}],52:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/get-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/get-prototype-of":72}],53:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":73}],54:[function(e,t,r){t.exports={default:e("core-js/library/fn/object/set-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/set-prototype-of":74}],55:[function(e,t,r){t.exports={default:e("core-js/library/fn/symbol"),__esModule:!0}},{"core-js/library/fn/symbol":75}],56:[function(e,t,r){t.exports={default:e("core-js/library/fn/symbol/iterator"),__esModule:!0}},{"core-js/library/fn/symbol/iterator":76}],57:[function(e,t,r){t.exports={default:e("core-js/library/fn/weak-map"),__esModule:!0}},{"core-js/library/fn/weak-map":77}],58:[function(e,t,r){"use strict";r.__esModule=!0,r.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],59:[function(e,t,r){"use strict";r.__esModule=!0;var n=e("../core-js/object/define-property"),o=function(e){return e&&e.__esModule?e:{default:e}}(n);r.default=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,o.default)(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()},{"../core-js/object/define-property":49}],60:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}r.__esModule=!0;var o=e("../core-js/object/get-prototype-of"),i=n(o),s=e("../core-js/object/get-own-property-descriptor"),a=n(s);r.default=function e(t,r,n){null===t&&(t=Function.prototype);var o=(0,a.default)(t,r);if(void 0===o){var s=(0,i.default)(t);return null===s?void 0:e(s,r,n)}if("value"in o)return o.value;var u=o.get;if(void 0!==u)return u.call(n)}},{"../core-js/object/get-own-property-descriptor":51,"../core-js/object/get-prototype-of":52}],61:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}r.__esModule=!0;var o=e("../core-js/object/set-prototype-of"),i=n(o),s=e("../core-js/object/create"),a=n(s),u=e("../helpers/typeof"),l=n(u);r.default=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,l.default)(t)));e.prototype=(0,a.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(i.default?(0,i.default)(e,t):e.__proto__=t)}},{"../core-js/object/create":48,"../core-js/object/set-prototype-of":54,"../helpers/typeof":63}],62:[function(e,t,r){"use strict";r.__esModule=!0;var n=e("../helpers/typeof"),o=function(e){return e&&e.__esModule?e:{default:e}}(n);r.default=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,o.default)(t))&&"function"!=typeof t?e:t}},{"../helpers/typeof":63}],63:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}r.__esModule=!0;var o=e("../core-js/symbol/iterator"),i=n(o),s=e("../core-js/symbol"),a=n(s),u="function"==typeof a.default&&"symbol"==typeof i.default?function(e){return typeof e}:function(e){return e&&"function"==typeof a.default&&e.constructor===a.default&&e!==a.default.prototype?"symbol":typeof e};r.default="function"==typeof a.default&&"symbol"===u(i.default)?function(e){return void 0===e?"undefined":u(e)}:function(e){return e&&"function"==typeof a.default&&e.constructor===a.default&&e!==a.default.prototype?"symbol":void 0===e?"undefined":u(e)}},{"../core-js/symbol":55,"../core-js/symbol/iterator":56}],64:[function(e,t,r){},{}],65:[function(e,t,r){e("../modules/web.dom.iterable"),e("../modules/es6.string.iterator"),t.exports=e("../modules/core.get-iterator")},{"../modules/core.get-iterator":155,"../modules/es6.string.iterator":166,"../modules/web.dom.iterable":176}],66:[function(e,t,r){var n=e("../../modules/_core"),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(e){return o.stringify.apply(o,arguments)}},{"../../modules/_core":93}],67:[function(e,t,r){e("../modules/es6.object.to-string"),e("../modules/es6.string.iterator"),e("../modules/web.dom.iterable"),e("../modules/es6.map"),e("../modules/es7.map.to-json"),e("../modules/es7.map.of"),e("../modules/es7.map.from"),t.exports=e("../modules/_core").Map},{"../modules/_core":93,"../modules/es6.map":157,"../modules/es6.object.to-string":165,"../modules/es6.string.iterator":166,"../modules/es7.map.from":169,"../modules/es7.map.of":170,"../modules/es7.map.to-json":171,"../modules/web.dom.iterable":176}],68:[function(e,t,r){e("../../modules/es6.object.create");var n=e("../../modules/_core").Object;t.exports=function(e,t){return n.create(e,t)}},{"../../modules/_core":93,"../../modules/es6.object.create":158}],69:[function(e,t,r){e("../../modules/es6.object.define-property");var n=e("../../modules/_core").Object;t.exports=function(e,t,r){return n.defineProperty(e,t,r)}},{"../../modules/_core":93,"../../modules/es6.object.define-property":159}],70:[function(e,t,r){e("../../modules/es6.object.freeze"),t.exports=e("../../modules/_core").Object.freeze},{"../../modules/_core":93,"../../modules/es6.object.freeze":160}],71:[function(e,t,r){e("../../modules/es6.object.get-own-property-descriptor");var n=e("../../modules/_core").Object;t.exports=function(e,t){return n.getOwnPropertyDescriptor(e,t)}},{"../../modules/_core":93,"../../modules/es6.object.get-own-property-descriptor":161}],72:[function(e,t,r){e("../../modules/es6.object.get-prototype-of"),t.exports=e("../../modules/_core").Object.getPrototypeOf},{"../../modules/_core":93,"../../modules/es6.object.get-prototype-of":162}],73:[function(e,t,r){e("../../modules/es6.object.keys"),t.exports=e("../../modules/_core").Object.keys},{"../../modules/_core":93,"../../modules/es6.object.keys":163}],74:[function(e,t,r){e("../../modules/es6.object.set-prototype-of"),t.exports=e("../../modules/_core").Object.setPrototypeOf},{"../../modules/_core":93,"../../modules/es6.object.set-prototype-of":164}],75:[function(e,t,r){e("../../modules/es6.symbol"),e("../../modules/es6.object.to-string"),e("../../modules/es7.symbol.async-iterator"),e("../../modules/es7.symbol.observable"),t.exports=e("../../modules/_core").Symbol},{"../../modules/_core":93,"../../modules/es6.object.to-string":165,"../../modules/es6.symbol":167,"../../modules/es7.symbol.async-iterator":172,"../../modules/es7.symbol.observable":173}],76:[function(e,t,r){e("../../modules/es6.string.iterator"),e("../../modules/web.dom.iterable"),t.exports=e("../../modules/_wks-ext").f("iterator")},{"../../modules/_wks-ext":152,"../../modules/es6.string.iterator":166,"../../modules/web.dom.iterable":176}],77:[function(e,t,r){e("../modules/es6.object.to-string"),e("../modules/web.dom.iterable"),e("../modules/es6.weak-map"),e("../modules/es7.weak-map.of"),e("../modules/es7.weak-map.from"),t.exports=e("../modules/_core").WeakMap},{"../modules/_core":93,"../modules/es6.object.to-string":165,"../modules/es6.weak-map":168,"../modules/es7.weak-map.from":174,"../modules/es7.weak-map.of":175,"../modules/web.dom.iterable":176}],78:[function(e,t,r){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],79:[function(e,t,r){t.exports=function(){}},{}],80:[function(e,t,r){t.exports=function(e,t,r,n){if(!(e instanceof t)||void 0!==n&&n in e)throw TypeError(r+": incorrect invocation!");return e}},{}],81:[function(e,t,r){var n=e("./_is-object");t.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},{"./_is-object":111}],82:[function(e,t,r){var n=e("./_for-of");t.exports=function(e,t){var r=[];return n(e,!1,r.push,r,t),r}},{"./_for-of":102}],83:[function(e,t,r){var n=e("./_to-iobject"),o=e("./_to-length"),i=e("./_to-absolute-index");t.exports=function(e){return function(t,r,s){var a,u=n(t),l=o(u.length),c=i(s,l);if(e&&r!=r){for(;l>c;)if((a=u[c++])!=a)return!0}else for(;l>c;c++)if((e||c in u)&&u[c]===r)return e||c||0;return!e&&-1}}},{"./_to-absolute-index":143,"./_to-iobject":145,"./_to-length":146}],84:[function(e,t,r){var n=e("./_ctx"),o=e("./_iobject"),i=e("./_to-object"),s=e("./_to-length"),a=e("./_array-species-create");t.exports=function(e,t){var r=1==e,u=2==e,l=3==e,c=4==e,f=6==e,d=5==e||f,h=t||a;return function(t,a,p){for(var _,v,y=i(t),b=o(y),g=n(a,p,3),m=s(b.length),C=0,k=r?h(t,m):u?h(t,0):void 0;m>C;C++)if((d||C in b)&&(_=b[C],v=g(_,C,y),e))if(r)k[C]=v;else if(v)switch(e){case 3:return!0;case 5:return _;case 6:return C;case 2:k.push(_)}else if(c)return!1;return f?-1:l||c?c:k}}},{"./_array-species-create":86,"./_ctx":94,"./_iobject":108,"./_to-length":146,"./_to-object":147}],85:[function(e,t,r){var n=e("./_is-object"),o=e("./_is-array"),i=e("./_wks")("species");t.exports=function(e){var t;return o(e)&&(t=e.constructor,"function"!=typeof t||t!==Array&&!o(t.prototype)||(t=void 0),n(t)&&null===(t=t[i])&&(t=void 0)),void 0===t?Array:t}},{"./_is-array":110,"./_is-object":111,"./_wks":153}],86:[function(e,t,r){var n=e("./_array-species-constructor");t.exports=function(e,t){return new(n(e))(t)}},{"./_array-species-constructor":85}],87:[function(e,t,r){var n=e("./_cof"),o=e("./_wks")("toStringTag"),i="Arguments"==n(function(){return arguments}()),s=function(e,t){try{return e[t]}catch(e){}};t.exports=function(e){var t,r,a;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=s(t=Object(e),o))?r:i?n(t):"Object"==(a=n(t))&&"function"==typeof t.callee?"Arguments":a}},{"./_cof":88,"./_wks":153}],88:[function(e,t,r){var n={}.toString;t.exports=function(e){return n.call(e).slice(8,-1)}},{}],89:[function(e,t,r){"use strict";var n=e("./_object-dp").f,o=e("./_object-create"),i=e("./_redefine-all"),s=e("./_ctx"),a=e("./_an-instance"),u=e("./_for-of"),l=e("./_iter-define"),c=e("./_iter-step"),f=e("./_set-species"),d=e("./_descriptors"),h=e("./_meta").fastKey,p=e("./_validate-collection"),_=d?"_s":"size",v=function(e,t){var r,n=h(t);if("F"!==n)return e._i[n];for(r=e._f;r;r=r.n)if(r.k==t)return r};t.exports={getConstructor:function(e,t,r,l){var c=e(function(e,n){a(e,c,t,"_i"),e._t=t,e._i=o(null),e._f=void 0,e._l=void 0,e[_]=0,void 0!=n&&u(n,r,e[l],e)});return i(c.prototype,{clear:function(){for(var e=p(this,t),r=e._i,n=e._f;n;n=n.n)n.r=!0,n.p&&(n.p=n.p.n=void 0),delete r[n.i];e._f=e._l=void 0,e[_]=0},delete:function(e){var r=p(this,t),n=v(r,e);if(n){var o=n.n,i=n.p;delete r._i[n.i],n.r=!0,i&&(i.n=o),o&&(o.p=i),r._f==n&&(r._f=o),r._l==n&&(r._l=i),r[_]--}return!!n},forEach:function(e){p(this,t);for(var r,n=s(e,arguments.length>1?arguments[1]:void 0,3);r=r?r.n:this._f;)for(n(r.v,r.k,this);r&&r.r;)r=r.p},has:function(e){return!!v(p(this,t),e)}}),d&&n(c.prototype,"size",{get:function(){return p(this,t)[_]}}),c},def:function(e,t,r){var n,o,i=v(e,t);return i?i.v=r:(e._l=i={i:o=h(t,!0),k:t,v:r,p:n=e._l,n:void 0,r:!1},e._f||(e._f=i),n&&(n.n=i),e[_]++,"F"!==o&&(e._i[o]=i)),e},getEntry:v,setStrong:function(e,t,r){l(e,t,function(e,r){this._t=p(e,t),this._k=r,this._l=void 0},function(){for(var e=this,t=e._k,r=e._l;r&&r.r;)r=r.p;return e._t&&(e._l=r=r?r.n:e._t._f)?"keys"==t?c(0,r.k):"values"==t?c(0,r.v):c(0,[r.k,r.v]):(e._t=void 0,c(1))},r?"entries":"values",!r,!0),f(t)}}},{"./_an-instance":80,"./_ctx":94,"./_descriptors":96,"./_for-of":102,"./_iter-define":114,"./_iter-step":115,"./_meta":118,"./_object-create":120,"./_object-dp":121,"./_redefine-all":133,"./_set-species":138,"./_validate-collection":150}],90:[function(e,t,r){var n=e("./_classof"),o=e("./_array-from-iterable");t.exports=function(e){return function(){if(n(this)!=e)throw TypeError(e+"#toJSON isn't generic");return o(this)}}},{"./_array-from-iterable":82,"./_classof":87}],91:[function(e,t,r){"use strict";var n=e("./_redefine-all"),o=e("./_meta").getWeak,i=e("./_an-object"),s=e("./_is-object"),a=e("./_an-instance"),u=e("./_for-of"),l=e("./_array-methods"),c=e("./_has"),f=e("./_validate-collection"),d=l(5),h=l(6),p=0,_=function(e){return e._l||(e._l=new v)},v=function(){this.a=[]},y=function(e,t){return d(e.a,function(e){return e[0]===t})};v.prototype={get:function(e){var t=y(this,e);if(t)return t[1]},has:function(e){return!!y(this,e)},set:function(e,t){var r=y(this,e);r?r[1]=t:this.a.push([e,t])},delete:function(e){var t=h(this.a,function(t){return t[0]===e});return~t&&this.a.splice(t,1),!!~t}},t.exports={getConstructor:function(e,t,r,i){var l=e(function(e,n){a(e,l,t,"_i"),e._t=t,e._i=p++,e._l=void 0,void 0!=n&&u(n,r,e[i],e)});return n(l.prototype,{delete:function(e){if(!s(e))return!1;var r=o(e);return!0===r?_(f(this,t)).delete(e):r&&c(r,this._i)&&delete r[this._i]},has:function(e){if(!s(e))return!1;var r=o(e);return!0===r?_(f(this,t)).has(e):r&&c(r,this._i)}}),l},def:function(e,t,r){var n=o(i(t),!0);return!0===n?_(e).set(t,r):n[e._i]=r,e},ufstore:_}},{"./_an-instance":80,"./_an-object":81,"./_array-methods":84,"./_for-of":102,"./_has":104,"./_is-object":111,"./_meta":118,"./_redefine-all":133,"./_validate-collection":150}],92:[function(e,t,r){"use strict";var n=e("./_global"),o=e("./_export"),i=e("./_meta"),s=e("./_fails"),a=e("./_hide"),u=e("./_redefine-all"),l=e("./_for-of"),c=e("./_an-instance"),f=e("./_is-object"),d=e("./_set-to-string-tag"),h=e("./_object-dp").f,p=e("./_array-methods")(0),_=e("./_descriptors");t.exports=function(e,t,r,v,y,b){var g=n[e],m=g,C=y?"set":"add",k=m&&m.prototype,j={};return _&&"function"==typeof m&&(b||k.forEach&&!s(function(){(new m).entries().next()}))?(m=t(function(t,r){c(t,m,e,"_c"),t._c=new g,void 0!=r&&l(r,y,t[C],t)}),p("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","),function(e){var t="add"==e||"set"==e;e in k&&(!b||"clear"!=e)&&a(m.prototype,e,function(r,n){if(c(this,m,e),!t&&b&&!f(r))return"get"==e&&void 0;var o=this._c[e](0===r?0:r,n);return t?this:o})}),b||h(m.prototype,"size",{get:function(){return this._c.size}})):(m=v.getConstructor(t,e,y,C),u(m.prototype,r),i.NEED=!0),d(m,e),j[e]=m,o(o.G+o.W+o.F,j),b||v.setStrong(m,e,y),m}},{"./_an-instance":80,"./_array-methods":84,"./_descriptors":96,"./_export":100,"./_fails":101,"./_for-of":102,"./_global":103,"./_hide":105,"./_is-object":111,"./_meta":118,"./_object-dp":121,"./_redefine-all":133,"./_set-to-string-tag":139}],93:[function(e,t,r){var n=t.exports={version:"2.5.3"};"number"==typeof __e&&(__e=n)},{}],94:[function(e,t,r){var n=e("./_a-function");t.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},{"./_a-function":78}],95:[function(e,t,r){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],96:[function(e,t,r){t.exports=!e("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":101}],97:[function(e,t,r){var n=e("./_is-object"),o=e("./_global").document,i=n(o)&&n(o.createElement);t.exports=function(e){return i?o.createElement(e):{}}},{"./_global":103,"./_is-object":111}],98:[function(e,t,r){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],99:[function(e,t,r){var n=e("./_object-keys"),o=e("./_object-gops"),i=e("./_object-pie");t.exports=function(e){var t=n(e),r=o.f;if(r)for(var s,a=r(e),u=i.f,l=0;a.length>l;)u.call(e,s=a[l++])&&t.push(s);return t}},{"./_object-gops":126,"./_object-keys":129,"./_object-pie":130}],100:[function(e,t,r){var n=e("./_global"),o=e("./_core"),i=e("./_ctx"),s=e("./_hide"),a=function(e,t,r){var u,l,c,f=e&a.F,d=e&a.G,h=e&a.S,p=e&a.P,_=e&a.B,v=e&a.W,y=d?o:o[t]||(o[t]={}),b=y.prototype,g=d?n:h?n[t]:(n[t]||{}).prototype;d&&(r=t);for(u in r)(l=!f&&g&&void 0!==g[u])&&u in y||(c=l?g[u]:r[u],y[u]=d&&"function"!=typeof g[u]?r[u]:_&&l?i(c,n):v&&g[u]==c?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(c):p&&"function"==typeof c?i(Function.call,c):c,p&&((y.virtual||(y.virtual={}))[u]=c,e&a.R&&b&&!b[u]&&s(b,u,c)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},{"./_core":93,"./_ctx":94,"./_global":103,"./_hide":105}],101:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(e){return!0}}},{}],102:[function(e,t,r){var n=e("./_ctx"),o=e("./_iter-call"),i=e("./_is-array-iter"),s=e("./_an-object"),a=e("./_to-length"),u=e("./core.get-iterator-method"),l={},c={},r=t.exports=function(e,t,r,f,d){var h,p,_,v,y=d?function(){return e}:u(e),b=n(r,f,t?2:1),g=0;if("function"!=typeof y)throw TypeError(e+" is not iterable!");if(i(y)){for(h=a(e.length);h>g;g++)if((v=t?b(s(p=e[g])[0],p[1]):b(e[g]))===l||v===c)return v}else for(_=y.call(e);!(p=_.next()).done;)if((v=o(_,b,p.value,t))===l||v===c)return v};r.BREAK=l,r.RETURN=c},{"./_an-object":81,"./_ctx":94,"./_is-array-iter":109,"./_iter-call":112,"./_to-length":146,"./core.get-iterator-method":154}],103:[function(e,t,r){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],104:[function(e,t,r){var n={}.hasOwnProperty;t.exports=function(e,t){return n.call(e,t)}},{}],105:[function(e,t,r){var n=e("./_object-dp"),o=e("./_property-desc");t.exports=e("./_descriptors")?function(e,t,r){return n.f(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},{"./_descriptors":96,"./_object-dp":121,"./_property-desc":132}],106:[function(e,t,r){var n=e("./_global").document;t.exports=n&&n.documentElement},{"./_global":103}],107:[function(e,t,r){t.exports=!e("./_descriptors")&&!e("./_fails")(function(){return 7!=Object.defineProperty(e("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":96,"./_dom-create":97,"./_fails":101}],108:[function(e,t,r){var n=e("./_cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},{"./_cof":88}],109:[function(e,t,r){var n=e("./_iterators"),o=e("./_wks")("iterator"),i=Array.prototype;t.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},{"./_iterators":116,"./_wks":153}],110:[function(e,t,r){var n=e("./_cof");t.exports=Array.isArray||function(e){return"Array"==n(e)}},{"./_cof":88}],111:[function(e,t,r){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],112:[function(e,t,r){var n=e("./_an-object");t.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(t){var i=e.return;throw void 0!==i&&n(i.call(e)),t}}},{"./_an-object":81}],113:[function(e,t,r){"use strict";var n=e("./_object-create"),o=e("./_property-desc"),i=e("./_set-to-string-tag"),s={};e("./_hide")(s,e("./_wks")("iterator"),function(){return this}),t.exports=function(e,t,r){e.prototype=n(s,{next:o(1,r)}),i(e,t+" Iterator")}},{"./_hide":105,"./_object-create":120,"./_property-desc":132,"./_set-to-string-tag":139,"./_wks":153}],114:[function(e,t,r){"use strict";var n=e("./_library"),o=e("./_export"),i=e("./_redefine"),s=e("./_hide"),a=e("./_has"),u=e("./_iterators"),l=e("./_iter-create"),c=e("./_set-to-string-tag"),f=e("./_object-gpo"),d=e("./_wks")("iterator"),h=!([].keys&&"next"in[].keys()),p=function(){return this};t.exports=function(e,t,r,_,v,y,b){l(r,t,_);var g,m,C,k=function(e){if(!h&&e in S)return S[e];switch(e){case"keys":case"values":return function(){return new r(this,e)}}return function(){return new r(this,e)}},j=t+" Iterator",w="values"==v,O=!1,S=e.prototype,E=S[d]||S["@@iterator"]||v&&S[v],P=!h&&E||k(v),A=v?w?k("entries"):P:void 0,T="Array"==t?S.entries||E:E;if(T&&(C=f(T.call(new e)))!==Object.prototype&&C.next&&(c(C,j,!0),n||a(C,d)||s(C,d,p)),w&&E&&"values"!==E.name&&(O=!0,P=function(){return E.call(this)}),n&&!b||!h&&!O&&S[d]||s(S,d,P),u[t]=P,u[j]=p,v)if(g={values:w?P:k("values"),keys:y?P:k("keys"),entries:A},b)for(m in g)m in S||i(S,m,g[m]);else o(o.P+o.F*(h||O),t,g);return g}},{"./_export":100,"./_has":104,"./_hide":105,"./_iter-create":113,"./_iterators":116,"./_library":117,"./_object-gpo":127,"./_redefine":134,"./_set-to-string-tag":139,"./_wks":153}],115:[function(e,t,r){t.exports=function(e,t){return{value:t,done:!!e}}},{}],116:[function(e,t,r){t.exports={}},{}],117:[function(e,t,r){t.exports=!0},{}],118:[function(e,t,r){var n=e("./_uid")("meta"),o=e("./_is-object"),i=e("./_has"),s=e("./_object-dp").f,a=0,u=Object.isExtensible||function(){return!0},l=!e("./_fails")(function(){return u(Object.preventExtensions({}))}),c=function(e){s(e,n,{value:{i:"O"+ ++a,w:{}}})},f=function(e,t){if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,n)){if(!u(e))return"F";if(!t)return"E";c(e)}return e[n].i},d=function(e,t){if(!i(e,n)){if(!u(e))return!0;if(!t)return!1;c(e)}return e[n].w},h=function(e){return l&&p.NEED&&u(e)&&!i(e,n)&&c(e),e},p=t.exports={KEY:n,NEED:!1,fastKey:f,getWeak:d,onFreeze:h}},{"./_fails":101,"./_has":104,"./_is-object":111,"./_object-dp":121,"./_uid":149}],119:[function(e,t,r){"use strict";var n=e("./_object-keys"),o=e("./_object-gops"),i=e("./_object-pie"),s=e("./_to-object"),a=e("./_iobject"),u=Object.assign;t.exports=!u||e("./_fails")(function(){var e={},t={},r=Symbol(),n="abcdefghijklmnopqrst";return e[r]=7,n.split("").forEach(function(e){t[e]=e}),7!=u({},e)[r]||Object.keys(u({},t)).join("")!=n})?function(e,t){for(var r=s(e),u=arguments.length,l=1,c=o.f,f=i.f;u>l;)for(var d,h=a(arguments[l++]),p=c?n(h).concat(c(h)):n(h),_=p.length,v=0;_>v;)f.call(h,d=p[v++])&&(r[d]=h[d]);return r}:u},{"./_fails":101,"./_iobject":108,"./_object-gops":126,"./_object-keys":129,"./_object-pie":130,"./_to-object":147}],120:[function(e,t,r){var n=e("./_an-object"),o=e("./_object-dps"),i=e("./_enum-bug-keys"),s=e("./_shared-key")("IE_PROTO"),a=function(){},u=function(){var t,r=e("./_dom-create")("iframe"),n=i.length;for(r.style.display="none",e("./_html").appendChild(r),r.src="javascript:",t=r.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),u=t.F;n--;)delete u.prototype[i[n]];return u()};t.exports=Object.create||function(e,t){var r;return null!==e?(a.prototype=n(e),r=new a,a.prototype=null,r[s]=e):r=u(),void 0===t?r:o(r,t)}},{"./_an-object":81,"./_dom-create":97,"./_enum-bug-keys":98,"./_html":106,"./_object-dps":122,"./_shared-key":140}],121:[function(e,t,r){var n=e("./_an-object"),o=e("./_ie8-dom-define"),i=e("./_to-primitive"),s=Object.defineProperty;r.f=e("./_descriptors")?Object.defineProperty:function(e,t,r){if(n(e),t=i(t,!0),n(r),o)try{return s(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},{"./_an-object":81,"./_descriptors":96,"./_ie8-dom-define":107,"./_to-primitive":148}],122:[function(e,t,r){var n=e("./_object-dp"),o=e("./_an-object"),i=e("./_object-keys");t.exports=e("./_descriptors")?Object.defineProperties:function(e,t){o(e);for(var r,s=i(t),a=s.length,u=0;a>u;)n.f(e,r=s[u++],t[r]);return e}},{"./_an-object":81,"./_descriptors":96,"./_object-dp":121,"./_object-keys":129}],123:[function(e,t,r){var n=e("./_object-pie"),o=e("./_property-desc"),i=e("./_to-iobject"),s=e("./_to-primitive"),a=e("./_has"),u=e("./_ie8-dom-define"),l=Object.getOwnPropertyDescriptor;r.f=e("./_descriptors")?l:function(e,t){if(e=i(e),t=s(t,!0),u)try{return l(e,t)}catch(e){}if(a(e,t))return o(!n.f.call(e,t),e[t])}},{"./_descriptors":96,"./_has":104,"./_ie8-dom-define":107,"./_object-pie":130,"./_property-desc":132,"./_to-iobject":145,"./_to-primitive":148}],124:[function(e,t,r){var n=e("./_to-iobject"),o=e("./_object-gopn").f,i={}.toString,s="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(e){try{return o(e)}catch(e){return s.slice()}};t.exports.f=function(e){return s&&"[object Window]"==i.call(e)?a(e):o(n(e))}},{"./_object-gopn":125,"./_to-iobject":145}],125:[function(e,t,r){var n=e("./_object-keys-internal"),o=e("./_enum-bug-keys").concat("length","prototype");r.f=Object.getOwnPropertyNames||function(e){return n(e,o)}},{"./_enum-bug-keys":98,"./_object-keys-internal":128}],126:[function(e,t,r){r.f=Object.getOwnPropertySymbols},{}],127:[function(e,t,r){var n=e("./_has"),o=e("./_to-object"),i=e("./_shared-key")("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(e){return e=o(e),n(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?s:null}},{"./_has":104,"./_shared-key":140,"./_to-object":147}],128:[function(e,t,r){var n=e("./_has"),o=e("./_to-iobject"),i=e("./_array-includes")(!1),s=e("./_shared-key")("IE_PROTO");t.exports=function(e,t){var r,a=o(e),u=0,l=[];for(r in a)r!=s&&n(a,r)&&l.push(r);for(;t.length>u;)n(a,r=t[u++])&&(~i(l,r)||l.push(r));return l}},{"./_array-includes":83,"./_has":104,"./_shared-key":140,"./_to-iobject":145}],129:[function(e,t,r){var n=e("./_object-keys-internal"),o=e("./_enum-bug-keys");t.exports=Object.keys||function(e){return n(e,o)}},{"./_enum-bug-keys":98,"./_object-keys-internal":128}],130:[function(e,t,r){r.f={}.propertyIsEnumerable},{}],131:[function(e,t,r){var n=e("./_export"),o=e("./_core"),i=e("./_fails");t.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],s={};s[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",s)}},{"./_core":93,"./_export":100,"./_fails":101}],132:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],133:[function(e,t,r){var n=e("./_hide");t.exports=function(e,t,r){for(var o in t)r&&e[o]?e[o]=t[o]:n(e,o,t[o]);return e}},{"./_hide":105}],134:[function(e,t,r){t.exports=e("./_hide")},{"./_hide":105}],135:[function(e,t,r){"use strict";var n=e("./_export"),o=e("./_a-function"),i=e("./_ctx"),s=e("./_for-of");t.exports=function(e){n(n.S,e,{from:function(e){var t,r,n,a,u=arguments[1];return o(this),t=void 0!==u,t&&o(u),void 0==e?new this:(r=[],t?(n=0,a=i(u,arguments[2],2),s(e,!1,function(e){r.push(a(e,n++))})):s(e,!1,r.push,r),new this(r))}})}},{"./_a-function":78,"./_ctx":94,"./_export":100,"./_for-of":102}],136:[function(e,t,r){"use strict";var n=e("./_export");t.exports=function(e){n(n.S,e,{of:function(){for(var e=arguments.length,t=new Array(e);e--;)t[e]=arguments[e];return new this(t)}})}},{"./_export":100}],137:[function(e,t,r){var n=e("./_is-object"),o=e("./_an-object"),i=function(e,t){if(o(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,n){try{n=e("./_ctx")(Function.call,e("./_object-gopd").f(Object.prototype,"__proto__").set,2),n(t,[]),r=!(t instanceof Array)}catch(e){r=!0}
return function(e,t){return i(e,t),r?e.__proto__=t:n(e,t),e}}({},!1):void 0),check:i}},{"./_an-object":81,"./_ctx":94,"./_is-object":111,"./_object-gopd":123}],138:[function(e,t,r){"use strict";var n=e("./_global"),o=e("./_core"),i=e("./_object-dp"),s=e("./_descriptors"),a=e("./_wks")("species");t.exports=function(e){var t="function"==typeof o[e]?o[e]:n[e];s&&t&&!t[a]&&i.f(t,a,{configurable:!0,get:function(){return this}})}},{"./_core":93,"./_descriptors":96,"./_global":103,"./_object-dp":121,"./_wks":153}],139:[function(e,t,r){var n=e("./_object-dp").f,o=e("./_has"),i=e("./_wks")("toStringTag");t.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},{"./_has":104,"./_object-dp":121,"./_wks":153}],140:[function(e,t,r){var n=e("./_shared")("keys"),o=e("./_uid");t.exports=function(e){return n[e]||(n[e]=o(e))}},{"./_shared":141,"./_uid":149}],141:[function(e,t,r){var n=e("./_global"),o=n["__core-js_shared__"]||(n["__core-js_shared__"]={});t.exports=function(e){return o[e]||(o[e]={})}},{"./_global":103}],142:[function(e,t,r){var n=e("./_to-integer"),o=e("./_defined");t.exports=function(e){return function(t,r){var i,s,a=String(o(t)),u=n(r),l=a.length;return u<0||u>=l?e?"":void 0:(i=a.charCodeAt(u),i<55296||i>56319||u+1===l||(s=a.charCodeAt(u+1))<56320||s>57343?e?a.charAt(u):i:e?a.slice(u,u+2):s-56320+(i-55296<<10)+65536)}}},{"./_defined":95,"./_to-integer":144}],143:[function(e,t,r){var n=e("./_to-integer"),o=Math.max,i=Math.min;t.exports=function(e,t){return e=n(e),e<0?o(e+t,0):i(e,t)}},{"./_to-integer":144}],144:[function(e,t,r){var n=Math.ceil,o=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?o:n)(e)}},{}],145:[function(e,t,r){var n=e("./_iobject"),o=e("./_defined");t.exports=function(e){return n(o(e))}},{"./_defined":95,"./_iobject":108}],146:[function(e,t,r){var n=e("./_to-integer"),o=Math.min;t.exports=function(e){return e>0?o(n(e),9007199254740991):0}},{"./_to-integer":144}],147:[function(e,t,r){var n=e("./_defined");t.exports=function(e){return Object(n(e))}},{"./_defined":95}],148:[function(e,t,r){var n=e("./_is-object");t.exports=function(e,t){if(!n(e))return e;var r,o;if(t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;if("function"==typeof(r=e.valueOf)&&!n(o=r.call(e)))return o;if(!t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":111}],149:[function(e,t,r){var n=0,o=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+o).toString(36))}},{}],150:[function(e,t,r){var n=e("./_is-object");t.exports=function(e,t){if(!n(e)||e._t!==t)throw TypeError("Incompatible receiver, "+t+" required!");return e}},{"./_is-object":111}],151:[function(e,t,r){var n=e("./_global"),o=e("./_core"),i=e("./_library"),s=e("./_wks-ext"),a=e("./_object-dp").f;t.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:n.Symbol||{});"_"==e.charAt(0)||e in t||a(t,e,{value:s.f(e)})}},{"./_core":93,"./_global":103,"./_library":117,"./_object-dp":121,"./_wks-ext":152}],152:[function(e,t,r){r.f=e("./_wks")},{"./_wks":153}],153:[function(e,t,r){var n=e("./_shared")("wks"),o=e("./_uid"),i=e("./_global").Symbol,s="function"==typeof i;(t.exports=function(e){return n[e]||(n[e]=s&&i[e]||(s?i:o)("Symbol."+e))}).store=n},{"./_global":103,"./_shared":141,"./_uid":149}],154:[function(e,t,r){var n=e("./_classof"),o=e("./_wks")("iterator"),i=e("./_iterators");t.exports=e("./_core").getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[n(e)]}},{"./_classof":87,"./_core":93,"./_iterators":116,"./_wks":153}],155:[function(e,t,r){var n=e("./_an-object"),o=e("./core.get-iterator-method");t.exports=e("./_core").getIterator=function(e){var t=o(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return n(t.call(e))}},{"./_an-object":81,"./_core":93,"./core.get-iterator-method":154}],156:[function(e,t,r){"use strict";var n=e("./_add-to-unscopables"),o=e("./_iter-step"),i=e("./_iterators"),s=e("./_to-iobject");t.exports=e("./_iter-define")(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./_add-to-unscopables":79,"./_iter-define":114,"./_iter-step":115,"./_iterators":116,"./_to-iobject":145}],157:[function(e,t,r){"use strict";var n=e("./_collection-strong"),o=e("./_validate-collection");t.exports=e("./_collection")("Map",function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}},{get:function(e){var t=n.getEntry(o(this,"Map"),e);return t&&t.v},set:function(e,t){return n.def(o(this,"Map"),0===e?0:e,t)}},n,!0)},{"./_collection":92,"./_collection-strong":89,"./_validate-collection":150}],158:[function(e,t,r){var n=e("./_export");n(n.S,"Object",{create:e("./_object-create")})},{"./_export":100,"./_object-create":120}],159:[function(e,t,r){var n=e("./_export");n(n.S+n.F*!e("./_descriptors"),"Object",{defineProperty:e("./_object-dp").f})},{"./_descriptors":96,"./_export":100,"./_object-dp":121}],160:[function(e,t,r){var n=e("./_is-object"),o=e("./_meta").onFreeze;e("./_object-sap")("freeze",function(e){return function(t){return e&&n(t)?e(o(t)):t}})},{"./_is-object":111,"./_meta":118,"./_object-sap":131}],161:[function(e,t,r){var n=e("./_to-iobject"),o=e("./_object-gopd").f;e("./_object-sap")("getOwnPropertyDescriptor",function(){return function(e,t){return o(n(e),t)}})},{"./_object-gopd":123,"./_object-sap":131,"./_to-iobject":145}],162:[function(e,t,r){var n=e("./_to-object"),o=e("./_object-gpo");e("./_object-sap")("getPrototypeOf",function(){return function(e){return o(n(e))}})},{"./_object-gpo":127,"./_object-sap":131,"./_to-object":147}],163:[function(e,t,r){var n=e("./_to-object"),o=e("./_object-keys");e("./_object-sap")("keys",function(){return function(e){return o(n(e))}})},{"./_object-keys":129,"./_object-sap":131,"./_to-object":147}],164:[function(e,t,r){var n=e("./_export");n(n.S,"Object",{setPrototypeOf:e("./_set-proto").set})},{"./_export":100,"./_set-proto":137}],165:[function(e,t,r){arguments[4][64][0].apply(r,arguments)},{dup:64}],166:[function(e,t,r){"use strict";var n=e("./_string-at")(!0);e("./_iter-define")(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},{"./_iter-define":114,"./_string-at":142}],167:[function(e,t,r){"use strict";var n=e("./_global"),o=e("./_has"),i=e("./_descriptors"),s=e("./_export"),a=e("./_redefine"),u=e("./_meta").KEY,l=e("./_fails"),c=e("./_shared"),f=e("./_set-to-string-tag"),d=e("./_uid"),h=e("./_wks"),p=e("./_wks-ext"),_=e("./_wks-define"),v=e("./_enum-keys"),y=e("./_is-array"),b=e("./_an-object"),g=e("./_is-object"),m=e("./_to-iobject"),C=e("./_to-primitive"),k=e("./_property-desc"),j=e("./_object-create"),w=e("./_object-gopn-ext"),O=e("./_object-gopd"),S=e("./_object-dp"),E=e("./_object-keys"),P=O.f,A=S.f,T=w.f,I=n.Symbol,N=n.JSON,R=N&&N.stringify,M=h("_hidden"),x=h("toPrimitive"),L={}.propertyIsEnumerable,D=c("symbol-registry"),U=c("symbols"),F=c("op-symbols"),q=Object.prototype,K="function"==typeof I,J=n.QObject,W=!J||!J.prototype||!J.prototype.findChild,Q=i&&l(function(){return 7!=j(A({},"a",{get:function(){return A(this,"a",{value:7}).a}})).a})?function(e,t,r){var n=P(q,t);n&&delete q[t],A(e,t,r),n&&e!==q&&A(q,t,n)}:A,B=function(e){var t=U[e]=j(I.prototype);return t._k=e,t},G=K&&"symbol"==typeof I.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof I},V=function(e,t,r){return e===q&&V(F,t,r),b(e),t=C(t,!0),b(r),o(U,t)?(r.enumerable?(o(e,M)&&e[M][t]&&(e[M][t]=!1),r=j(r,{enumerable:k(0,!1)})):(o(e,M)||A(e,M,k(1,{})),e[M][t]=!0),Q(e,t,r)):A(e,t,r)},z=function(e,t){b(e);for(var r,n=v(t=m(t)),o=0,i=n.length;i>o;)V(e,r=n[o++],t[r]);return e},Y=function(e,t){return void 0===t?j(e):z(j(e),t)},H=function(e){var t=L.call(this,e=C(e,!0));return!(this===q&&o(U,e)&&!o(F,e))&&(!(t||!o(this,e)||!o(U,e)||o(this,M)&&this[M][e])||t)},$=function(e,t){if(e=m(e),t=C(t,!0),e!==q||!o(U,t)||o(F,t)){var r=P(e,t);return!r||!o(U,t)||o(e,M)&&e[M][t]||(r.enumerable=!0),r}},X=function(e){for(var t,r=T(m(e)),n=[],i=0;r.length>i;)o(U,t=r[i++])||t==M||t==u||n.push(t);return n},Z=function(e){for(var t,r=e===q,n=T(r?F:m(e)),i=[],s=0;n.length>s;)!o(U,t=n[s++])||r&&!o(q,t)||i.push(U[t]);return i};K||(I=function(){if(this instanceof I)throw TypeError("Symbol is not a constructor!");var e=d(arguments.length>0?arguments[0]:void 0),t=function(r){this===q&&t.call(F,r),o(this,M)&&o(this[M],e)&&(this[M][e]=!1),Q(this,e,k(1,r))};return i&&W&&Q(q,e,{configurable:!0,set:t}),B(e)},a(I.prototype,"toString",function(){return this._k}),O.f=$,S.f=V,e("./_object-gopn").f=w.f=X,e("./_object-pie").f=H,e("./_object-gops").f=Z,i&&!e("./_library")&&a(q,"propertyIsEnumerable",H,!0),p.f=function(e){return B(h(e))}),s(s.G+s.W+s.F*!K,{Symbol:I});for(var ee="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),te=0;ee.length>te;)h(ee[te++]);for(var re=E(h.store),ne=0;re.length>ne;)_(re[ne++]);s(s.S+s.F*!K,"Symbol",{for:function(e){return o(D,e+="")?D[e]:D[e]=I(e)},keyFor:function(e){if(!G(e))throw TypeError(e+" is not a symbol!");for(var t in D)if(D[t]===e)return t},useSetter:function(){W=!0},useSimple:function(){W=!1}}),s(s.S+s.F*!K,"Object",{create:Y,defineProperty:V,defineProperties:z,getOwnPropertyDescriptor:$,getOwnPropertyNames:X,getOwnPropertySymbols:Z}),N&&s(s.S+s.F*(!K||l(function(){var e=I();return"[null]"!=R([e])||"{}"!=R({a:e})||"{}"!=R(Object(e))})),"JSON",{stringify:function(e){for(var t,r,n=[e],o=1;arguments.length>o;)n.push(arguments[o++]);if(r=t=n[1],(g(t)||void 0!==e)&&!G(e))return y(t)||(t=function(e,t){if("function"==typeof r&&(t=r.call(this,e,t)),!G(t))return t}),n[1]=t,R.apply(N,n)}}),I.prototype[x]||e("./_hide")(I.prototype,x,I.prototype.valueOf),f(I,"Symbol"),f(Math,"Math",!0),f(n.JSON,"JSON",!0)},{"./_an-object":81,"./_descriptors":96,"./_enum-keys":99,"./_export":100,"./_fails":101,"./_global":103,"./_has":104,"./_hide":105,"./_is-array":110,"./_is-object":111,"./_library":117,"./_meta":118,"./_object-create":120,"./_object-dp":121,"./_object-gopd":123,"./_object-gopn":125,"./_object-gopn-ext":124,"./_object-gops":126,"./_object-keys":129,"./_object-pie":130,"./_property-desc":132,"./_redefine":134,"./_set-to-string-tag":139,"./_shared":141,"./_to-iobject":145,"./_to-primitive":148,"./_uid":149,"./_wks":153,"./_wks-define":151,"./_wks-ext":152}],168:[function(e,t,r){"use strict";var n,o=e("./_array-methods")(0),i=e("./_redefine"),s=e("./_meta"),a=e("./_object-assign"),u=e("./_collection-weak"),l=e("./_is-object"),c=e("./_fails"),f=e("./_validate-collection"),d=s.getWeak,h=Object.isExtensible,p=u.ufstore,_={},v=function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}},y={get:function(e){if(l(e)){var t=d(e);return!0===t?p(f(this,"WeakMap")).get(e):t?t[this._i]:void 0}},set:function(e,t){return u.def(f(this,"WeakMap"),e,t)}},b=t.exports=e("./_collection")("WeakMap",v,y,u,!0,!0);c(function(){return 7!=(new b).set((Object.freeze||Object)(_),7).get(_)})&&(n=u.getConstructor(v,"WeakMap"),a(n.prototype,y),s.NEED=!0,o(["delete","has","get","set"],function(e){var t=b.prototype,r=t[e];i(t,e,function(t,o){if(l(t)&&!h(t)){this._f||(this._f=new n);var i=this._f[e](t,o);return"set"==e?this:i}return r.call(this,t,o)})}))},{"./_array-methods":84,"./_collection":92,"./_collection-weak":91,"./_fails":101,"./_is-object":111,"./_meta":118,"./_object-assign":119,"./_redefine":134,"./_validate-collection":150}],169:[function(e,t,r){e("./_set-collection-from")("Map")},{"./_set-collection-from":135}],170:[function(e,t,r){e("./_set-collection-of")("Map")},{"./_set-collection-of":136}],171:[function(e,t,r){var n=e("./_export");n(n.P+n.R,"Map",{toJSON:e("./_collection-to-json")("Map")})},{"./_collection-to-json":90,"./_export":100}],172:[function(e,t,r){e("./_wks-define")("asyncIterator")},{"./_wks-define":151}],173:[function(e,t,r){e("./_wks-define")("observable")},{"./_wks-define":151}],174:[function(e,t,r){e("./_set-collection-from")("WeakMap")},{"./_set-collection-from":135}],175:[function(e,t,r){e("./_set-collection-of")("WeakMap")},{"./_set-collection-of":136}],176:[function(e,t,r){e("./es6.array.iterator");for(var n=e("./_global"),o=e("./_hide"),i=e("./_iterators"),s=e("./_wks")("toStringTag"),a="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),u=0;u<a.length;u++){var l=a[u],c=n[l],f=c&&c.prototype;f&&!f[s]&&o(f,s,l),i[l]=i.Array}},{"./_global":103,"./_hide":105,"./_iterators":116,"./_wks":153,"./es6.array.iterator":156}],177:[function(e,t,r){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function o(e){return"function"==typeof e}function i(e){return"number"==typeof e}function s(e){return"object"==typeof e&&null!==e}function a(e){return void 0===e}t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!i(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,r,n,i,u,l;if(this._events||(this._events={}),"error"===e&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if((t=arguments[1])instanceof Error)throw t;var c=new Error('Uncaught, unspecified "error" event. ('+t+")");throw c.context=t,c}if(r=this._events[e],a(r))return!1;if(o(r))switch(arguments.length){case 1:r.call(this);break;case 2:r.call(this,arguments[1]);break;case 3:r.call(this,arguments[1],arguments[2]);break;default:i=Array.prototype.slice.call(arguments,1),r.apply(this,i)}else if(s(r))for(i=Array.prototype.slice.call(arguments,1),l=r.slice(),n=l.length,u=0;u<n;u++)l[u].apply(this,i);return!0},n.prototype.addListener=function(e,t){var r;if(!o(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,o(t.listener)?t.listener:t),this._events[e]?s(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,s(this._events[e])&&!this._events[e].warned&&(r=a(this._maxListeners)?n.defaultMaxListeners:this._maxListeners)&&r>0&&this._events[e].length>r&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace()),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function r(){this.removeListener(e,r),n||(n=!0,t.apply(this,arguments))}if(!o(t))throw TypeError("listener must be a function");var n=!1;return r.listener=t,this.on(e,r),this},n.prototype.removeListener=function(e,t){var r,n,i,a;if(!o(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(r=this._events[e],i=r.length,n=-1,r===t||o(r.listener)&&r.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(s(r)){for(a=i;a-- >0;)if(r[a]===t||r[a].listener&&r[a].listener===t){n=a;break}if(n<0)return this;1===r.length?(r.length=0,delete this._events[e]):r.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,r;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(r=this._events[e],o(r))this.removeListener(e,r);else if(r)for(;r.length;)this.removeListener(e,r[r.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){return this._events&&this._events[e]?o(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(o(t))return 1;if(t)return t.length}return 0},n.listenerCount=function(e,t){return e.listenerCount(t)}},{}]},{},[10])(10)});
!function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){r(2),r(3),e.exports=r(1).name},function(e,t,r){var n=r(4);e.exports=n.module("ngParse",[])},function(e,t){e.exports=window.Parse},function(e,t,r){function n(){function e(t,r){return t instanceof o.Object?(r instanceof Array||(r=Array.prototype.slice.call(arguments,1)),void r.forEach(function(e){Object.defineProperty(t,e,{get:function(){return this.get(e)},set:function(t){this.set(e,t)},configurable:!0,enumerable:!0})})):"function"==typeof t?e(t.prototype,r):(r=t instanceof Array?t:Array.prototype.slice.call(arguments,0),function(t){e(t,r)})}function t(e){function t(e,r){return["_rejected","_rejectedCallbacks","_resolved","_resolvedCallbacks","_result","reject","resolve"].forEach(function(t){e[t]=r[t]}),["_continueWith","_thenRunCallbacks","always","done","fail"].forEach(function(t){e[t]=n(r[t])}),["then","catch"].forEach(function(n){var o=e[n];e[n]=function(){var e=Array.prototype.slice.call(arguments,0),n=o.apply(this,e);return t(n,r),n}}),e}function n(r){return function(){var n=Array.prototype.slice.call(arguments,0),o=r.apply(this,n),c=e(o.then.bind(o));return t(c,o),c}}function o(e,t){t instanceof Array||(t=Array.prototype.slice.call(arguments,1)),t.forEach(function(t){e[t]=n(e[t])})}return r.wrapObject=o,o(r.Cloud,["run"]),o(r.Config,["get"]),o(r.FacebookUtils,["link","logIn","unlink"]),o(r.File.prototype,["save"]),o(r.Object,["destroyAll","fetchAll","fetchAllIfNeeded","saveAll"]),o(r.Object.prototype,["destroy","fetch","save"]),o(r.Promise,["_continueWhile","as","error","when"]),o(r.Push,["send"]),o(r.Query.prototype,["count","each","find","first","get"]),o(r.Session,["current"]),o(r.User,["become","currentAsync","enableRevocableSession","logIn","logOut","requestPasswordReset","signUp"]),o(r.User.prototype,["logIn","signUp"]),r}var r=Object.create(o);e(r.User,["email","password","username"]);var n=r;return n.defineAttributes=e,n.$get=t,t.$inject=["$q"],n}var o=r(2),c=r(1);n.$inject=[],c.provider("Parse",n)},function(e,t){e.exports=window.angular}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vYW5ndWxhci1wYXJzZS5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTI0MzgwYzZkODc1OWJkMWEyOGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwid2luZG93LlBhcnNlXCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIndpbmRvdy5hbmd1bGFyXCIiXSwibmFtZXMiOlsibW9kdWxlcyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImluc3RhbGxlZE1vZHVsZXMiLCJleHBvcnRzIiwibW9kdWxlIiwiaWQiLCJsb2FkZWQiLCJjYWxsIiwibSIsImMiLCJwIiwibmFtZSIsImFuZ3VsYXIiLCJ3aW5kb3ciLCJQYXJzZSIsIlBhcnNlUHJvdmlkZXIiLCJkZWZpbmVBdHRyaWJ1dGVzIiwib2JqZWN0IiwiYXR0cmlidXRlcyIsIk9iamVjdCIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJhcmd1bWVudHMiLCJmb3JFYWNoIiwiYXR0cmlidXRlIiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJ0aGlzIiwic2V0IiwidmFsdWUiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwidGFyZ2V0IiwiUGFyc2VGYWN0b3J5IiwiJHEiLCJ3cmFwUGFyc2VQcm9taXNlIiwicHJvbWlzZSIsInBhcnNlUHJvbWlzZSIsInByb3AiLCJtZXRob2QiLCJ3cmFwIiwiZnVuYyIsImFyZ3MiLCJhcHBseSIsInRoZW4iLCJiaW5kIiwid3JhcE9iamVjdCIsIm1ldGhvZHMiLCJBbmd1bGFyUGFyc2UiLCJDbG91ZCIsIkNvbmZpZyIsIkZhY2Vib29rVXRpbHMiLCJGaWxlIiwiUHJvbWlzZSIsIlB1c2giLCJRdWVyeSIsIlNlc3Npb24iLCJVc2VyIiwiY3JlYXRlIiwicHJvdmlkZXIiLCIkZ2V0IiwiJGluamVjdCIsIm5nUGFyc2VNb2R1bGUiXSwibWFwcGluZ3MiOiJDQUFTLFNBQVVBLEdDSW5CLFFBQUFDLEdBQUFDLEdBR0EsR0FBQUMsRUFBQUQsR0FDQSxNQUFBQyxHQUFBRCxHQUFBRSxPQUdBLElBQUFDLEdBQUFGLEVBQUFELElBQ0FFLFdBQ0FFLEdBQUFKLEVBQ0FLLFFBQUEsRUFVQSxPQU5BUCxHQUFBRSxHQUFBTSxLQUFBSCxFQUFBRCxRQUFBQyxJQUFBRCxRQUFBSCxHQUdBSSxFQUFBRSxRQUFBLEVBR0FGLEVBQUFELFFBdkJBLEdBQUFELEtBcUNBLE9BVEFGLEdBQUFRLEVBQUFULEVBR0FDLEVBQUFTLEVBQUFQLEVBR0FGLEVBQUFVLEVBQUEsR0FHQVYsRUFBQSxLRE1NLFNBQVNJLEVBQVFELEVBQVNILEdFNUNoQ0EsRUFBQSxHQUNBQSxFQUFBLEdBQ0FJLEVBQUFELFFBQUFILEVBQUEsR0FBQVcsTUZtRE0sU0FBU1AsRUFBUUQsRUFBU0gsR0dyRGhDLEdBQUFZLEdBQUFaLEVBQUEsRUFTQUksR0FBQUQsUUFBQVMsRUFBQVIsT0FBQSxlSDRETSxTQUFTQSxFQUFRRCxHSXJFdkJDLEVBQUFELFFBQUFVLE9BQUFDLE9KMkVNLFNBQVNWLEVBQVFELEVBQVNILEdLaEVoQyxRQUFBZSxLQVdBLFFBQUFDLEdBQUFDLEVBQUFDLEdBQ0EsTUFBQUQsYUFBQUgsR0FBQUssUUFDQUQsWUFBQUUsU0FBQUYsRUFBQUUsTUFBQUMsVUFBQUMsTUFBQWYsS0FBQWdCLFVBQUEsUUFDQUwsR0FBQU0sUUFBQSxTQUFBQyxHQUNBTixPQUFBTyxlQUFBVCxFQUFBUSxHQUNBRSxJQUFBLFdBQ0EsTUFBQUMsTUFBQUQsSUFBQUYsSUFFQUksSUFBQSxTQUFBQyxHQUNBRixLQUFBQyxJQUFBSixFQUFBSyxJQUVBQyxjQUFBLEVBQ0FDLFlBQUEsT0FHSyxrQkFBQWYsR0FDTEQsRUFBQUMsRUFBQUksVUFBQUgsSUFFQUEsRUFBQUQsWUFBQUcsT0FBQUgsRUFDQUcsTUFBQUMsVUFBQUMsTUFBQWYsS0FBQWdCLFVBQUEsR0FDQSxTQUFBVSxHQUNBakIsRUFBQWlCLEVBQUFmLEtBaUNBLFFBQUFnQixHQUFBQyxHQVFBLFFBQUFDLEdBQUFDLEVBQUFDLEdBb0JBLE9BbkJBLGdHQUNBZCxRQUFBLFNBQUFlLEdBQ0FGLEVBQUFFLEdBQUFELEVBQUFDLE1BR0EsNERBQUFmLFFBQUEsU0FBQWdCLEdBQ0FILEVBQUFHLEdBQUFDLEVBQUFILEVBQUFFLE9BR0EsZ0JBQUFoQixRQUFBLFNBQUFnQixHQUNBLEdBQUFFLEdBQUFMLEVBQUFHLEVBQ0FILEdBQUFHLEdBQUEsV0FDQSxHQUFBRyxHQUFBdkIsTUFBQUMsVUFBQUMsTUFBQWYsS0FBQWdCLFVBQUEsR0FDQWMsRUFBQUssRUFBQUUsTUFBQWhCLEtBQUFlLEVBRUEsT0FEQVAsR0FBQUMsRUFBQUMsR0FDQUQsS0FJQUEsRUFVQSxRQUFBSSxHQUFBQyxHQUNBLGtCQUNBLEdBQUFDLEdBQUF2QixNQUFBQyxVQUFBQyxNQUFBZixLQUFBZ0IsVUFBQSxHQUNBZSxFQUFBSSxFQUFBRSxNQUFBaEIsS0FBQWUsR0FDQU4sRUFBQUYsRUFBQUcsRUFBQU8sS0FBQUMsS0FBQVIsR0FFQSxPQURBRixHQUFBQyxFQUFBQyxHQUNBRCxHQVVBLFFBQUFVLEdBQUE5QixFQUFBK0IsR0FDQUEsWUFBQTVCLFNBQUE0QixFQUFBNUIsTUFBQUMsVUFBQUMsTUFBQWYsS0FBQWdCLFVBQUEsSUFDQXlCLEVBQUF4QixRQUFBLFNBQUFnQixHQUNBdkIsRUFBQXVCLEdBQUFDLEVBQUF4QixFQUFBdUIsTUE2Q0EsTUFsQ0FTLEdBQUFGLGFBR0FBLEVBQUFFLEVBQUFDLE9BQUEsUUFHQUgsRUFBQUUsRUFBQUUsUUFBQSxRQUdBSixFQUFBRSxFQUFBRyxlQUFBLDBCQUdBTCxFQUFBRSxFQUFBSSxLQUFBaEMsV0FBQSxTQUdBMEIsRUFBQUUsRUFBQTlCLFFBQUEsdURBQ0E0QixFQUFBRSxFQUFBOUIsT0FBQUUsV0FBQSwyQkFHQTBCLEVBQUFFLEVBQUFLLFNBQUEsdUNBR0FQLEVBQUFFLEVBQUFNLE1BQUEsU0FHQVIsRUFBQUUsRUFBQU8sTUFBQW5DLFdBQUEsc0NBR0EwQixFQUFBRSxFQUFBUSxTQUFBLFlBR0FWLEVBQUFFLEVBQUFTLE1BQUEsb0dBQ0FYLEVBQUFFLEVBQUFTLEtBQUFyQyxXQUFBLG1CQUVBNEIsRUFqSUEsR0FBQUEsR0FBQTlCLE9BQUF3QyxPQUFBN0MsRUFHQUUsR0FBQWlDLEVBQUFTLE1BQUEsK0JBRUEsSUFBQUUsR0FBQVgsQ0ErSEEsT0F0SEFXLEdBQUE1QyxtQkFXQTRDLEVBQUFDLEtBQUEzQixFQUNBQSxFQUFBNEIsU0FBQSxNQTBHQUYsRUFyTEEsR0FBQTlDLEdBQUFkLEVBQUEsR0FDQStELEVBQUEvRCxFQUFBLEVBU0FlLEdBQUErQyxXQThLQUMsRUFDQUgsU0FBQSxRQUFBN0MsSUxrRk0sU0FBU1gsRUFBUUQsR00zUXZCQyxFQUFBRCxRQUFBVSxPQUFBRCIsImZpbGUiOiJhbmd1bGFyLXBhcnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xyXG5cdF9fd2VicGFja19yZXF1aXJlX18oMyk7XHJcblx0bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLm5hbWU7XHJcblxuXG4vKioqLyB9LFxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFuZ3VsYXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpO1xyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEBuZ2RvYyBvdmVydmlld1xyXG5cdCAqIEBuYW1lIG5nUGFyc2VcclxuXHQgKlxyXG5cdCAqIEBkZXNjcmlwdGlvblxyXG5cdCAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgW1BhcnNlLmNvbSBKYXZhU2NyaXB0IFNES117QGxpbmsgaHR0cHM6Ly9wYXJzZS5jb20vZG9jcy9qcy9hcGkvfS5cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCduZ1BhcnNlJywgW10pO1xyXG5cblxuLyoqKi8gfSxcbi8qIDIgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gd2luZG93LlBhcnNlO1xuXG4vKioqLyB9LFxuLyogMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIFBhcnNlID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcclxuXHR2YXIgbmdQYXJzZU1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XHJcblx0XHJcblx0LyoqXHJcblx0ICogQG5nZG9jIG9iamVjdFxyXG5cdCAqIEBuYW1lIG5nUGFyc2UuUGFyc2VQcm92aWRlclxyXG5cdCAqXHJcblx0ICogQGRlc2NyaXB0aW9uXHJcblx0ICogUHJvdmlkZXIgZm9yIFBhcnNlIHNlcnZpY2UuXHJcblx0ICovXHJcblx0UGFyc2VQcm92aWRlci4kaW5qZWN0ID0gW107XHJcblx0ZnVuY3Rpb24gUGFyc2VQcm92aWRlcigpIHtcclxuXHQgIC8qKlxyXG5cdCAgICogRGVmaW5lcyBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGZvciB0aGUgYXR0cmlidXRlc1xyXG5cdCAgICogb2YgdGhlIGdpdmVuIG9iamVjdCBvciBmdW5jdGlvbiBwcm90b3R5cGUuXHJcblx0ICAgKiBPciBjcmVhdGUgYSBkZWNvcmF0b3IgdGhhdCBkZWZpbmVzIGdldHRlcnNcclxuXHQgICAqIGFuZCBzZXR0ZXJzIGZvciB0aGUgc3ViY2xhc3MgUGFyc2UuT2JqZWN0LlxyXG5cdCAgICpcclxuXHQgICAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufFN0cmluZ3xTdHJpbmdbXX0gb2JqZWN0XHJcblx0ICAgKiBAcGFyYW0gey4uLlN0cmluZ3xTdHJpbmdbXT19IGF0dHJpYnV0ZXNcclxuXHQgICAqIEByZXR1cm5zIHsqfVxyXG5cdCAgICovXHJcblx0ICBmdW5jdGlvbiBkZWZpbmVBdHRyaWJ1dGVzKG9iamVjdCwgYXR0cmlidXRlcykge1xyXG5cdCAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XHJcblx0ICAgICAgaWYgKCEoYXR0cmlidXRlcyBpbnN0YW5jZW9mIEFycmF5KSkgYXR0cmlidXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcblx0ICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcclxuXHQgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGF0dHJpYnV0ZSwge1xyXG5cdCAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoYXR0cmlidXRlKTtcclxuXHQgICAgICAgICAgfSxcclxuXHQgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnNldChhdHRyaWJ1dGUsIHZhbHVlKTtcclxuXHQgICAgICAgICAgfSxcclxuXHQgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdCAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXHJcblx0ICAgICAgICB9KTtcclxuXHQgICAgICB9KTtcclxuXHQgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqZWN0ID09ICdmdW5jdGlvbicpIHtcclxuXHQgICAgICByZXR1cm4gZGVmaW5lQXR0cmlidXRlcyhvYmplY3QucHJvdG90eXBlLCBhdHRyaWJ1dGVzKVxyXG5cdCAgICB9IGVsc2Uge1xyXG5cdCAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheSkgYXR0cmlidXRlcyA9IG9iamVjdDtcclxuXHQgICAgICBlbHNlIGF0dHJpYnV0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xyXG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiBkZWZpbmVBdHRyaWJ1dGVzRGVjb3JhdG9yKHRhcmdldCkge1xyXG5cdCAgICAgICAgZGVmaW5lQXR0cmlidXRlcyh0YXJnZXQsIGF0dHJpYnV0ZXMpO1xyXG5cdCAgICAgIH1cclxuXHQgICAgfVxyXG5cdCAgfVxyXG5cdFxyXG5cdCAgLy8gUGFyc2VcclxuXHQgIHZhciBBbmd1bGFyUGFyc2UgPSBPYmplY3QuY3JlYXRlKFBhcnNlKTtcclxuXHRcclxuXHQgIC8vIFBhcnNlVXNlclxyXG5cdCAgZGVmaW5lQXR0cmlidXRlcyhBbmd1bGFyUGFyc2UuVXNlciwgWydlbWFpbCcsICdwYXNzd29yZCcsICd1c2VybmFtZSddKTtcclxuXHRcclxuXHQgIHZhciBwcm92aWRlciA9IEFuZ3VsYXJQYXJzZTtcclxuXHRcclxuXHQgIC8qKlxyXG5cdCAgICogQG5nZG9jIG1ldGhvZFxyXG5cdCAgICogQG5hbWUgbmdQYXJzZS5QYXJzZVByb3ZpZGVyI2RlZmluZUF0dHJpYnV0ZXNcclxuXHQgICAqIEBtZXRob2RPZiBuZ1BhcnNlLlBhcnNlUHJvdmlkZXJcclxuXHQgICAqIEBzdGF0aWNcclxuXHQgICAqIEBzZWUge0BsaW5rIGRlZmluZUF0dHJpYnV0ZXN9XHJcblx0ICAgKi9cclxuXHQgIHByb3ZpZGVyLmRlZmluZUF0dHJpYnV0ZXMgPSBkZWZpbmVBdHRyaWJ1dGVzO1xyXG5cdFxyXG5cdCAgLyoqXHJcblx0ICAgKiBAbmdkb2Mgc2VydmljZVxyXG5cdCAgICogQG5hbWUgbmdQYXJzZS5QYXJzZVxyXG5cdCAgICpcclxuXHQgICAqIEByZXF1aXJlcyAkcVxyXG5cdCAgICpcclxuXHQgICAqIEBkZXNjcmlwdGlvblxyXG5cdCAgICogVGhpcyBpcyBhIHdyYXBwZXIgZm9yIFtQYXJzZV17QGxpbmsgaHR0cHM6Ly9wYXJzZS5jb20vZG9jcy9qcy9hcGkvY2xhc3Nlcy9QYXJzZS5odG1sfS5cclxuXHQgICAqL1xyXG5cdCAgcHJvdmlkZXIuJGdldCA9IFBhcnNlRmFjdG9yeTtcclxuXHQgIFBhcnNlRmFjdG9yeS4kaW5qZWN0ID0gWyckcSddO1xyXG5cdCAgZnVuY3Rpb24gUGFyc2VGYWN0b3J5KCRxKSB7XHJcblx0ICAgIC8qKlxyXG5cdCAgICAgKiBXcmFwcyBQcm9taXNlLlxyXG5cdCAgICAgKlxyXG5cdCAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvbWlzZVxyXG5cdCAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyc2VQcm9taXNlXHJcblx0ICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcblx0ICAgICAqL1xyXG5cdCAgICBmdW5jdGlvbiB3cmFwUGFyc2VQcm9taXNlKHByb21pc2UsIHBhcnNlUHJvbWlzZSkge1xyXG5cdCAgICAgIFsnX3JlamVjdGVkJywgJ19yZWplY3RlZENhbGxiYWNrcycsICdfcmVzb2x2ZWQnLCAnX3Jlc29sdmVkQ2FsbGJhY2tzJywgJ19yZXN1bHQnLCAncmVqZWN0JywgJ3Jlc29sdmUnXVxyXG5cdCAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcclxuXHQgICAgICAgICAgcHJvbWlzZVtwcm9wXSA9IHBhcnNlUHJvbWlzZVtwcm9wXTtcclxuXHQgICAgICAgIH0pO1xyXG5cdFxyXG5cdCAgICAgIFsnX2NvbnRpbnVlV2l0aCcsICdfdGhlblJ1bkNhbGxiYWNrcycsICdhbHdheXMnLCAnZG9uZScsICdmYWlsJ10uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XHJcblx0ICAgICAgICBwcm9taXNlW21ldGhvZF0gPSB3cmFwKHBhcnNlUHJvbWlzZVttZXRob2RdKTtcclxuXHQgICAgICB9KTtcclxuXHRcclxuXHQgICAgICBbJ3RoZW4nLCAnY2F0Y2gnXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcclxuXHQgICAgICAgIHZhciBmdW5jID0gcHJvbWlzZVttZXRob2RdO1xyXG5cdCAgICAgICAgcHJvbWlzZVttZXRob2RdID0gZnVuY3Rpb24gd3JhcHBlZEFuZ3VsYXJQcm9taXNlKCkge1xyXG5cdCAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcblx0ICAgICAgICAgIHZhciBwcm9taXNlID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcclxuXHQgICAgICAgICAgd3JhcFBhcnNlUHJvbWlzZShwcm9taXNlLCBwYXJzZVByb21pc2UpO1xyXG5cdCAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuXHQgICAgICAgIH07XHJcblx0ICAgICAgfSk7XHJcblx0XHJcblx0ICAgICAgcmV0dXJuIHByb21pc2U7XHJcblx0ICAgIH1cclxuXHRcclxuXHQgICAgLyoqXHJcblx0ICAgICAqIFdyYXBzIGZ1bmN0aW9uLlxyXG5cdCAgICAgKlxyXG5cdCAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIEZ1bmN0aW9uIHRoYXQgcmV0dXJuc1xyXG5cdCAgICAgKiBbUGFyc2UuUHJvbWlzZV17QGxpbmsgaHR0cHM6Ly9wYXJzZS5jb20vZG9jcy9qcy9hcGkvY2xhc3Nlcy9QYXJzZS5Qcm9taXNlLmh0bWx9LlxyXG5cdCAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IEZ1bmN0aW9uIHRoYXQgcmV0dXJucyAkcSBwcm9taXNlcy5cclxuXHQgICAgICovXHJcblx0ICAgIGZ1bmN0aW9uIHdyYXAoZnVuYykge1xyXG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkUGFyc2VQcm9taXNlKCkge1xyXG5cdCAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xyXG5cdCAgICAgICAgdmFyIHBhcnNlUHJvbWlzZSA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XHJcblx0ICAgICAgICB2YXIgcHJvbWlzZSA9ICRxKHBhcnNlUHJvbWlzZS50aGVuLmJpbmQocGFyc2VQcm9taXNlKSk7XHJcblx0ICAgICAgICB3cmFwUGFyc2VQcm9taXNlKHByb21pc2UsIHBhcnNlUHJvbWlzZSk7XHJcblx0ICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuXHQgICAgICB9O1xyXG5cdCAgICB9XHJcblx0XHJcblx0ICAgIC8qKlxyXG5cdCAgICAgKiBXcmFwcyBvYmplY3QuXHJcblx0ICAgICAqXHJcblx0ICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcclxuXHQgICAgICogQHBhcmFtIHsuLi5TdHJpbmd8U3RyaW5nW109fSBtZXRob2RzXHJcblx0ICAgICAqL1xyXG5cdCAgICBmdW5jdGlvbiB3cmFwT2JqZWN0KG9iamVjdCwgbWV0aG9kcykge1xyXG5cdCAgICAgIGlmICghKG1ldGhvZHMgaW5zdGFuY2VvZiBBcnJheSkpIG1ldGhvZHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cdCAgICAgIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XHJcblx0ICAgICAgICBvYmplY3RbbWV0aG9kXSA9IHdyYXAob2JqZWN0W21ldGhvZF0pO1xyXG5cdCAgICAgIH0pO1xyXG5cdCAgICB9XHJcblx0XHJcblx0ICAgIC8qKlxyXG5cdCAgICAgKiBAbmdkb2MgbWV0aG9kXHJcblx0ICAgICAqIEBuYW1lIG5nUGFyc2UuUGFyc2Ujd3JhcE9iamVjdFxyXG5cdCAgICAgKiBAbWV0aG9kT2YgbmdQYXJzZS5QYXJzZVxyXG5cdCAgICAgKiBAc3RhdGljXHJcblx0ICAgICAqIEBzZWUge0BsaW5rIHdyYXBPYmplY3R9XHJcblx0ICAgICAqL1xyXG5cdCAgICBBbmd1bGFyUGFyc2Uud3JhcE9iamVjdCA9IHdyYXBPYmplY3Q7XHJcblx0XHJcblx0ICAgIC8vIFBhcnNlQ2xvdWRcclxuXHQgICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuQ2xvdWQsIFsncnVuJ10pO1xyXG5cdFxyXG5cdCAgICAvLyBQYXJzZUNvbmZpZ1xyXG5cdCAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5Db25maWcsIFsnZ2V0J10pO1xyXG5cdFxyXG5cdCAgICAvL0ZhY2Vib29rVXRpbHNcclxuXHQgICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuRmFjZWJvb2tVdGlscywgWydsaW5rJywgJ2xvZ0luJywgJ3VubGluayddKTtcclxuXHRcclxuXHQgICAgLy8gUGFyc2VGaWxlXHJcblx0ICAgIHdyYXBPYmplY3QoQW5ndWxhclBhcnNlLkZpbGUucHJvdG90eXBlLCBbJ3NhdmUnXSk7XHJcblx0XHJcblx0ICAgIC8vIFBhcnNlT2JqZWN0XHJcblx0ICAgIHdyYXBPYmplY3QoQW5ndWxhclBhcnNlLk9iamVjdCwgWydkZXN0cm95QWxsJywgJ2ZldGNoQWxsJywgJ2ZldGNoQWxsSWZOZWVkZWQnLCAnc2F2ZUFsbCddKTtcclxuXHQgICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuT2JqZWN0LnByb3RvdHlwZSwgWydkZXN0cm95JywgJ2ZldGNoJywgJ3NhdmUnXSk7XHJcblx0XHJcblx0ICAgIC8vIFBhcnNlUHJvbWlzZVxyXG5cdCAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5Qcm9taXNlLCBbJ19jb250aW51ZVdoaWxlJywgJ2FzJywgJ2Vycm9yJywgJ3doZW4nXSk7XHJcblx0XHJcblx0ICAgIC8vIFBhcnNlUHVzaFxyXG5cdCAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5QdXNoLCBbJ3NlbmQnXSk7XHJcblx0XHJcblx0ICAgIC8vIFBhcnNlUXVlcnlcclxuXHQgICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuUXVlcnkucHJvdG90eXBlLCBbJ2NvdW50JywgJ2VhY2gnLCAnZmluZCcsICdmaXJzdCcsICdnZXQnXSk7XHJcblx0XHJcblx0ICAgIC8vIFBhcnNlU2Vzc2lvblxyXG5cdCAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5TZXNzaW9uLCBbJ2N1cnJlbnQnXSk7XHJcblx0XHJcblx0ICAgIC8vIFBhcnNlVXNlclxyXG5cdCAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5Vc2VyLCBbJ2JlY29tZScsICdjdXJyZW50QXN5bmMnLCAnZW5hYmxlUmV2b2NhYmxlU2Vzc2lvbicsICdsb2dJbicsICdsb2dPdXQnLCAncmVxdWVzdFBhc3N3b3JkUmVzZXQnLCAnc2lnblVwJ10pO1xyXG5cdCAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5Vc2VyLnByb3RvdHlwZSwgWydsb2dJbicsICdzaWduVXAnXSk7XHJcblx0XHJcblx0ICAgIHJldHVybiBBbmd1bGFyUGFyc2U7XHJcblx0ICB9XHJcblx0XHJcblx0ICByZXR1cm4gcHJvdmlkZXI7XHJcblx0fVxyXG5cdFxyXG5cdG5nUGFyc2VNb2R1bGVcclxuXHQgIC5wcm92aWRlcignUGFyc2UnLCBQYXJzZVByb3ZpZGVyKTtcclxuXG5cbi8qKiovIH0sXG4vKiA0ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5hbmd1bGFyO1xuXG4vKioqLyB9XG4vKioqKioqLyBdKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBhbmd1bGFyLXBhcnNlLmpzXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA5MjQzODBjNmQ4NzU5YmQxYTI4ZFxuICoqLyIsInJlcXVpcmUoJ3BhcnNlJyk7XHJcbnJlcXVpcmUoJy4vUGFyc2UuanMnKTtcclxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL21vZHVsZS5qcycpLm5hbWU7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcclxuXHJcbi8qKlxyXG4gKiBAbmdkb2Mgb3ZlcnZpZXdcclxuICogQG5hbWUgbmdQYXJzZVxyXG4gKlxyXG4gKiBAZGVzY3JpcHRpb25cclxuICogQW5ndWxhciB3cmFwcGVyIGZvciBbUGFyc2UuY29tIEphdmFTY3JpcHQgU0RLXXtAbGluayBodHRwczovL3BhcnNlLmNvbS9kb2NzL2pzL2FwaS99LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnbmdQYXJzZScsIFtdKTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tb2R1bGUuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5QYXJzZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwid2luZG93LlBhcnNlXCJcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgUGFyc2UgPSByZXF1aXJlKCdwYXJzZScpO1xyXG52YXIgbmdQYXJzZU1vZHVsZSA9IHJlcXVpcmUoJy4vbW9kdWxlLmpzJyk7XHJcblxyXG4vKipcclxuICogQG5nZG9jIG9iamVjdFxyXG4gKiBAbmFtZSBuZ1BhcnNlLlBhcnNlUHJvdmlkZXJcclxuICpcclxuICogQGRlc2NyaXB0aW9uXHJcbiAqIFByb3ZpZGVyIGZvciBQYXJzZSBzZXJ2aWNlLlxyXG4gKi9cclxuUGFyc2VQcm92aWRlci4kaW5qZWN0ID0gW107XHJcbmZ1bmN0aW9uIFBhcnNlUHJvdmlkZXIoKSB7XHJcbiAgLyoqXHJcbiAgICogRGVmaW5lcyBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGZvciB0aGUgYXR0cmlidXRlc1xyXG4gICAqIG9mIHRoZSBnaXZlbiBvYmplY3Qgb3IgZnVuY3Rpb24gcHJvdG90eXBlLlxyXG4gICAqIE9yIGNyZWF0ZSBhIGRlY29yYXRvciB0aGF0IGRlZmluZXMgZ2V0dGVyc1xyXG4gICAqIGFuZCBzZXR0ZXJzIGZvciB0aGUgc3ViY2xhc3MgUGFyc2UuT2JqZWN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb258U3RyaW5nfFN0cmluZ1tdfSBvYmplY3RcclxuICAgKiBAcGFyYW0gey4uLlN0cmluZ3xTdHJpbmdbXT19IGF0dHJpYnV0ZXNcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICBmdW5jdGlvbiBkZWZpbmVBdHRyaWJ1dGVzKG9iamVjdCwgYXR0cmlidXRlcykge1xyXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xyXG4gICAgICBpZiAoIShhdHRyaWJ1dGVzIGluc3RhbmNlb2YgQXJyYXkpKSBhdHRyaWJ1dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBhdHRyaWJ1dGUsIHtcclxuICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoYXR0cmlidXRlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldChhdHRyaWJ1dGUsIHZhbHVlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqZWN0ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmV0dXJuIGRlZmluZUF0dHJpYnV0ZXMob2JqZWN0LnByb3RvdHlwZSwgYXR0cmlidXRlcylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheSkgYXR0cmlidXRlcyA9IG9iamVjdDtcclxuICAgICAgZWxzZSBhdHRyaWJ1dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGRlZmluZUF0dHJpYnV0ZXNEZWNvcmF0b3IodGFyZ2V0KSB7XHJcbiAgICAgICAgZGVmaW5lQXR0cmlidXRlcyh0YXJnZXQsIGF0dHJpYnV0ZXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBQYXJzZVxyXG4gIHZhciBBbmd1bGFyUGFyc2UgPSBPYmplY3QuY3JlYXRlKFBhcnNlKTtcclxuXHJcbiAgLy8gUGFyc2VVc2VyXHJcbiAgZGVmaW5lQXR0cmlidXRlcyhBbmd1bGFyUGFyc2UuVXNlciwgWydlbWFpbCcsICdwYXNzd29yZCcsICd1c2VybmFtZSddKTtcclxuXHJcbiAgdmFyIHByb3ZpZGVyID0gQW5ndWxhclBhcnNlO1xyXG5cclxuICAvKipcclxuICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICogQG5hbWUgbmdQYXJzZS5QYXJzZVByb3ZpZGVyI2RlZmluZUF0dHJpYnV0ZXNcclxuICAgKiBAbWV0aG9kT2YgbmdQYXJzZS5QYXJzZVByb3ZpZGVyXHJcbiAgICogQHN0YXRpY1xyXG4gICAqIEBzZWUge0BsaW5rIGRlZmluZUF0dHJpYnV0ZXN9XHJcbiAgICovXHJcbiAgcHJvdmlkZXIuZGVmaW5lQXR0cmlidXRlcyA9IGRlZmluZUF0dHJpYnV0ZXM7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBuZ2RvYyBzZXJ2aWNlXHJcbiAgICogQG5hbWUgbmdQYXJzZS5QYXJzZVxyXG4gICAqXHJcbiAgICogQHJlcXVpcmVzICRxXHJcbiAgICpcclxuICAgKiBAZGVzY3JpcHRpb25cclxuICAgKiBUaGlzIGlzIGEgd3JhcHBlciBmb3IgW1BhcnNlXXtAbGluayBodHRwczovL3BhcnNlLmNvbS9kb2NzL2pzL2FwaS9jbGFzc2VzL1BhcnNlLmh0bWx9LlxyXG4gICAqL1xyXG4gIHByb3ZpZGVyLiRnZXQgPSBQYXJzZUZhY3Rvcnk7XHJcbiAgUGFyc2VGYWN0b3J5LiRpbmplY3QgPSBbJyRxJ107XHJcbiAgZnVuY3Rpb24gUGFyc2VGYWN0b3J5KCRxKSB7XHJcbiAgICAvKipcclxuICAgICAqIFdyYXBzIFByb21pc2UuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb21pc2VcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJzZVByb21pc2VcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHdyYXBQYXJzZVByb21pc2UocHJvbWlzZSwgcGFyc2VQcm9taXNlKSB7XHJcbiAgICAgIFsnX3JlamVjdGVkJywgJ19yZWplY3RlZENhbGxiYWNrcycsICdfcmVzb2x2ZWQnLCAnX3Jlc29sdmVkQ2FsbGJhY2tzJywgJ19yZXN1bHQnLCAncmVqZWN0JywgJ3Jlc29sdmUnXVxyXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgICAgICBwcm9taXNlW3Byb3BdID0gcGFyc2VQcm9taXNlW3Byb3BdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgWydfY29udGludWVXaXRoJywgJ190aGVuUnVuQ2FsbGJhY2tzJywgJ2Fsd2F5cycsICdkb25lJywgJ2ZhaWwnXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcclxuICAgICAgICBwcm9taXNlW21ldGhvZF0gPSB3cmFwKHBhcnNlUHJvbWlzZVttZXRob2RdKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBbJ3RoZW4nLCAnY2F0Y2gnXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcclxuICAgICAgICB2YXIgZnVuYyA9IHByb21pc2VbbWV0aG9kXTtcclxuICAgICAgICBwcm9taXNlW21ldGhvZF0gPSBmdW5jdGlvbiB3cmFwcGVkQW5ndWxhclByb21pc2UoKSB7XHJcbiAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcbiAgICAgICAgICB2YXIgcHJvbWlzZSA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICB3cmFwUGFyc2VQcm9taXNlKHByb21pc2UsIHBhcnNlUHJvbWlzZSk7XHJcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV3JhcHMgZnVuY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBGdW5jdGlvbiB0aGF0IHJldHVybnNcclxuICAgICAqIFtQYXJzZS5Qcm9taXNlXXtAbGluayBodHRwczovL3BhcnNlLmNvbS9kb2NzL2pzL2FwaS9jbGFzc2VzL1BhcnNlLlByb21pc2UuaHRtbH0uXHJcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IEZ1bmN0aW9uIHRoYXQgcmV0dXJucyAkcSBwcm9taXNlcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gd3JhcChmdW5jKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkUGFyc2VQcm9taXNlKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgICAgICB2YXIgcGFyc2VQcm9taXNlID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxKHBhcnNlUHJvbWlzZS50aGVuLmJpbmQocGFyc2VQcm9taXNlKSk7XHJcbiAgICAgICAgd3JhcFBhcnNlUHJvbWlzZShwcm9taXNlLCBwYXJzZVByb21pc2UpO1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV3JhcHMgb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcclxuICAgICAqIEBwYXJhbSB7Li4uU3RyaW5nfFN0cmluZ1tdPX0gbWV0aG9kc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB3cmFwT2JqZWN0KG9iamVjdCwgbWV0aG9kcykge1xyXG4gICAgICBpZiAoIShtZXRob2RzIGluc3RhbmNlb2YgQXJyYXkpKSBtZXRob2RzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcclxuICAgICAgICBvYmplY3RbbWV0aG9kXSA9IHdyYXAob2JqZWN0W21ldGhvZF0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lIG5nUGFyc2UuUGFyc2Ujd3JhcE9iamVjdFxyXG4gICAgICogQG1ldGhvZE9mIG5nUGFyc2UuUGFyc2VcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBzZWUge0BsaW5rIHdyYXBPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIEFuZ3VsYXJQYXJzZS53cmFwT2JqZWN0ID0gd3JhcE9iamVjdDtcclxuXHJcbiAgICAvLyBQYXJzZUNsb3VkXHJcbiAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5DbG91ZCwgWydydW4nXSk7XHJcblxyXG4gICAgLy8gUGFyc2VDb25maWdcclxuICAgIHdyYXBPYmplY3QoQW5ndWxhclBhcnNlLkNvbmZpZywgWydnZXQnXSk7XHJcblxyXG4gICAgLy9GYWNlYm9va1V0aWxzXHJcbiAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5GYWNlYm9va1V0aWxzLCBbJ2xpbmsnLCAnbG9nSW4nLCAndW5saW5rJ10pO1xyXG5cclxuICAgIC8vIFBhcnNlRmlsZVxyXG4gICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuRmlsZS5wcm90b3R5cGUsIFsnc2F2ZSddKTtcclxuXHJcbiAgICAvLyBQYXJzZU9iamVjdFxyXG4gICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuT2JqZWN0LCBbJ2Rlc3Ryb3lBbGwnLCAnZmV0Y2hBbGwnLCAnZmV0Y2hBbGxJZk5lZWRlZCcsICdzYXZlQWxsJ10pO1xyXG4gICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuT2JqZWN0LnByb3RvdHlwZSwgWydkZXN0cm95JywgJ2ZldGNoJywgJ3NhdmUnXSk7XHJcblxyXG4gICAgLy8gUGFyc2VQcm9taXNlXHJcbiAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5Qcm9taXNlLCBbJ19jb250aW51ZVdoaWxlJywgJ2FzJywgJ2Vycm9yJywgJ3doZW4nXSk7XHJcblxyXG4gICAgLy8gUGFyc2VQdXNoXHJcbiAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5QdXNoLCBbJ3NlbmQnXSk7XHJcblxyXG4gICAgLy8gUGFyc2VRdWVyeVxyXG4gICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuUXVlcnkucHJvdG90eXBlLCBbJ2NvdW50JywgJ2VhY2gnLCAnZmluZCcsICdmaXJzdCcsICdnZXQnXSk7XHJcblxyXG4gICAgLy8gUGFyc2VTZXNzaW9uXHJcbiAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5TZXNzaW9uLCBbJ2N1cnJlbnQnXSk7XHJcblxyXG4gICAgLy8gUGFyc2VVc2VyXHJcbiAgICB3cmFwT2JqZWN0KEFuZ3VsYXJQYXJzZS5Vc2VyLCBbJ2JlY29tZScsICdjdXJyZW50QXN5bmMnLCAnZW5hYmxlUmV2b2NhYmxlU2Vzc2lvbicsICdsb2dJbicsICdsb2dPdXQnLCAncmVxdWVzdFBhc3N3b3JkUmVzZXQnLCAnc2lnblVwJ10pO1xyXG4gICAgd3JhcE9iamVjdChBbmd1bGFyUGFyc2UuVXNlci5wcm90b3R5cGUsIFsnbG9nSW4nLCAnc2lnblVwJ10pO1xyXG5cclxuICAgIHJldHVybiBBbmd1bGFyUGFyc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJvdmlkZXI7XHJcbn1cclxuXHJcbm5nUGFyc2VNb2R1bGVcclxuICAucHJvdmlkZXIoJ1BhcnNlJywgUGFyc2VQcm92aWRlcik7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvUGFyc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5hbmd1bGFyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJ3aW5kb3cuYW5ndWxhclwiXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==
/*! 
 * angular-loading-bar v0.9.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2016 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","$log","cfpLoadingBar",function(b,c,d,e,f,g){function h(){d.cancel(j),g.complete(),l=0,k=0}function i(b){var d,e=c.get("$http"),f=a.defaults;!b.cache&&!f.cache||b.cache===!1||"GET"!==b.method&&"JSONP"!==b.method||(d=angular.isObject(b.cache)?b.cache:angular.isObject(f.cache)?f.cache:e);var g=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&g!==b.cached?b.cached:(b.cached=g,g)}var j,k=0,l=0,m=g.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||i(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===k&&(j=d(function(){g.start()},m)),k++,g.set(l/k)),a},response:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),a):(f.error("Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),a)},responseError:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),b.reject(a)):(f.error("Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),b.reject(a))}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.autoIncrement=!0,this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.spinnerTemplate='<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',this.loadingBarTemplate='<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',this.$get=["$injector","$document","$timeout","$rootScope",function(a,b,c,d){function e(){if(k||(k=a.get("$animate")),c.cancel(m),!r){var e=b[0],g=e.querySelector?e.querySelector(n):b.find(n)[0];g||(g=e.getElementsByTagName("body")[0]);var h=angular.element(g),i=g.lastChild&&angular.element(g.lastChild);d.$broadcast("cfpLoadingBar:started"),r=!0,v&&k.enter(o,h,i),u&&k.enter(q,h,o),f(w)}}function f(a){if(r){var b=100*a+"%";p.css("width",b),s=a,t&&(c.cancel(l),l=c(function(){g()},250))}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return s}function i(){s=0,r=!1}function j(){k||(k=a.get("$animate")),d.$broadcast("cfpLoadingBar:completed"),f(1),c.cancel(m),m=c(function(){var a=k.leave(o,i);a&&a.then&&a.then(i),k.leave(q)},500)}var k,l,m,n=this.parentSelector,o=angular.element(this.loadingBarTemplate),p=o.find("div").eq(0),q=angular.element(this.spinnerTemplate),r=!1,s=0,t=this.autoIncrement,u=this.includeSpinner,v=this.includeBar,w=this.startSize;return{start:e,set:f,status:h,inc:g,complete:j,autoIncrement:this.autoIncrement,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();