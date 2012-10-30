/**
 * @namespace 
 */
var sb = {};
sb.extend = function(superclass, constructor) {
    function f(){};
    f.property = superclass.property;
    constructor.property = new f();
    constructor.superclass = superclass.property;
    constructor.superclass.constructor = superclass;
    constructor.property.constructor = constructor;

    return constructor;
};
/**
 * @private
 * @typedef {function(void):*}
 */
sb.Computed;
/**
 * @constructor
 */
sb.Observer = function() {

    /**
     * @type {Array.<sb.Binding>}
     */
    var bindings = [];

    /**
     * @param {sb.Binding} binding
     * @return void
     */
    this.add = function(binding) {

        if (binding === null
                || typeof binding === "undefined") {
            return;
        }

        if (bindings.indexOf(binding) < 0) {
            bindings.push(binding);
        }
    };

    /**
     * @param {Array<sb.Observable>} callStack
     * @param {Array<sb.Observable>} input
     * @return void
     */
    this.notify = function(callStack, input) {

        // get bindings which has given input as argument
        var bs = bindings.filter(function(binding) {
            var found = false;
            Object.keys(binding.inputs).forEach(function(key) {
                if (binding.inputs.hasOwnProperty(key)
                        && binding.inputs[key] === input) {
                    found = true;
                    return;
                }
            });
            return found;
        });

        bs.forEach(function(binding) {
            binding.notify(callStack);
        });
   };

    /**
     * @param {sb.Binding} target
     * @return void
     */
    this.remove = function(target) {
        var index = bindings.lastIndexOf(target);
        if (index >= 0) {
            bindings.splice(index, 1);
        }
    };
};
/**
 * @param {sb.Observer} observer
 * @param {Object} inputs
 * @param {Object} outputs
 * @param {sb.Compute} compute
 */
sb.Binding = function(observer, inputs, outputs, compute) {

    this.inputs = inputs;
    this.outputs = outputs;
    this.compute = compute;

    /**
     * @param {void}
     * @return {void}
     */
    this.bind = function() {
        observer.add(this);
        return this;
    };

    /**
     * @param {void}
     * @return {void}
     */
    this.unbind = function() {
        observer.remove(this);
        return this;
    };

    /**
     * @param {Array.<sb.Observable>}
     * @return {sb.Binding}
     */
    this.notify = function(callStack) {
        var result = compute(inputs);
        var input = callStack[callStack.length - 1];
        Object.keys(result).forEach(function(name){
            var observable = outputs[name];
            if (input !== observable
                    && outputs.hasOwnProperty(name)
                    && sb.isObservable(observable)) {
                observable.notify(callStack, result[name]);
            }
        });

        return this;
    };

};
/**
 * A property of observable value.
 * It is a function and provides notify function as method.
 * @interface
 */
sb.ObservableProperty;

/**
 * Check either obj is sb.ObservableProperty or not.
 * @param {*} tested object 
 * @return {boolean} true indicates that obj implements sb.ObservableProperty. 
 */
sb.isObservable = function(obj) {

    // either obj is a function or not?
    if (typeof obj !== "function") { 
        return false;
    }

    // either obj has notify function as own method.
    if (!obj.notify
            || typeof obj.notify !== "function") {
        return false;
    }

    return true;
};
/**
 * An observable value which is observable by sb.Observer.
 * 
 * @constructor
 * @param {sb.Observer} observer observer of this observable value
 * @param {*} value
 */
sb.Observable = function(observer, value) {

    /**
     * @type {sb.Observable} own
     */
    var that = this;

    /**
     * @implements {sb.ObservableProperty}
     * @param {*} v it is set for this observable 
     * @return {*} set value at this observable
     * @this {sb.Observable}
     */
    that.property = function(v) {

        // if v is not undefined, it works as setter.
        if (v !== undefined) {
            that.property.notify([], v);
        }

        // getter
        return value;
    };

    /**
     * @param {Array.<sb.ObservableProperty>} callStack stack of sb.ObservableProperty which have already propagated.
     * @param {*} v it is set for this observable
     */
    that.property.notify = function(callStack, v) {
        if (callStack.lastIndexOf(that.property) < 0) {
           value = v;
           observer.notify(callStack.concat(that.property), that.property);
        }  
    };

};
(function(){
    /**
     * @constructor
     * @param {sb.Observer} observer
     * @param {Array.<*>} initArray
     */
    sb.ObservableArray = function(observer, initArray) {

        /**
         * @type {sb.ObservableArray} own
         */
        var that = this;

        /**
         * @type {Array.<*>} internal array
         */
        var array = initArray;
        if (!(array instanceof Array)) {
            array = [];
        }

        /**
         * Get internal array.
         * @return {Array.<*>} internal array
         */
        that.property = function() {
            return array.concat();
        };
    
        /**
         * Notify changing for observer.
         * @param {Array.<sb.ObservableProperty>} callStack
         */
        that.property.notify = function(callStack) {
            if (callStack.lastIndexOf(that.property) < 0) {
               observer.notify(callStack.concat(that.property), that.property);
            }  
        };

        /**
         * Get array size which wrapes the internal array length.
         * @return {numnber} array size
         */
        that.property.length = function() {
            return array.length;
        };

        /**
         * Get value with index i.
         */
        that.property.get = function(i) {
            return array[i];
        };

        /**
         * Set value with index i.
         * And it notify observer.
         */
        that.property.set = function(i, v) {
            array[i] = v;
            that.property.notify([]);
        };

        // wrapper for functions which change the internal array
        [
            "push", 
            "pop", 
            "shift", 
            "unshift", 
            "splice", 
            "reverse",
            "sort"
        ].forEach(function(fn) {
            if (typeof array[fn] === "function") {
                that.property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args); 
                    that.property.notify([]);

                    return ret;
                };
            }
        });


        // wrapper for functions which return array
        // without changing the internal array.
        [
            "concat",
            "map",
            "filter"
        ].forEach(function(fn) {
             if (typeof array[fn] === "function") {
                that.property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args); 

                    // wrap with ObservableArray
                    var oa = new sb.ObservableArray(observer, ret);
                    
                    return oa;
                };
            }           
        });


        // wrapper for functions which return non array value
        // without changing the internal array.
        [
            "join",
            "toString",
            "toLocalString",
            "indexOf",
            "lastIndexOf",
            "forEach"
        ].forEach(function(fn) {
            if (typeof array[fn] === "function") {
                that.property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args);
                    return ret;
                };
            }
        });
   
    };
})();
(function(){

    /**
     * A set of binding which provide binding functions as method chains.
     * @param {sb.Observer} observer 
     * @param {Array.<sb.ObservableProperty>} observables
     */
    sb.BindingChain = function(observer, observables) {

        var bindings = [];

        this.synchronize = function() {

            var syncObservables = [];
            var args = arguments;
            Object.keys(args).forEach(function(i) {
                var arg = args[i];
                if (sb.isObservable(arg)
                        && observables.indexOf(arg) >= 0) {
                    syncObservables.push(arg);
                }
            });

            syncObservables.forEach(function(input) {
                var inputs = {input: input};
                var outputs = {};
                syncObservables.forEach(function(output, i) {
                    if (input !== output) {
                        outputs["output"+i] = output;
                    }
                });
                var compute = function(inputs) { 
                    var results = {};
                    Object.keys(outputs).forEach(function(key){
                        results[key] = inputs.input();
                    });
                    return results;
                };
                var b = new sb.Binding(observer, inputs, outputs, compute);
                bindings.push(b);
            });

            return this;
        };

        this.compute = function(o, f) {

            if (!sb.isObservable(o)
                    || typeof f !== "function"
                    || observables.indexOf(o) < 0){
                return this;
            }

            var inputs = {};
            observables.forEach(function(input, i) {
                if (o !== input) {
                    inputs["input"+i] = input;
                }
            });
            var outputs = {output: o}; 

            var b = new sb.Binding(
                observer,
                inputs,
                outputs,
                function(inputs) {
                    return {output: f(inputs)};
                }
            );

            bindings.push(b);

            return this;
        };

        this.onChange = function(o, callback) {
            if (!sb.isObservable(o)
                    || typeof callback !== "function"
                    || observables.indexOf(o) < 0) {
                return this;
            }

            var b = new sb.Binding(
                observer,
                {input: o},
                {},
                function() {
                    callback();
                    return {};
                }
            );

            bindings.push(b);
            return this;
        };

        this.bind = function() {
            bindings.forEach(function(b) {
                b.bind();
            });
            return this;
        };

        this.unbind = function() {
            bindings.forEach(function(b) {
                b.unbind();
            });
            return this;
        };
    };

})();
sb.argumentsToArray = function(args) {
    var arry = [];
    Object.keys(args).forEach(function(i) {
        arry.push(args[i]);
    });

    return arry;
};
// It provide functions which can be use easily.
(function() {

    /**
     * @const {sb.Observer} default observer.
     */
    var observer = new sb.Observer();

    /**
     * Create default setting binding chain.
     * @return {sb.BindingChain} default setting binding chain.
     */
    sb.binding = function() {

        /**
         * @type {Array.<*>} arguments array of this function.
         */
        var args = sb.argumentsToArray(arguments);

        /**
         * @type {Array.<sb.ObservableProperty>} 
         */
        var observables = args.filter(function(arg){
            return sb.isObservable(arg);
        });

        /**
         * @type {sb.BindingChain} default setting binding chain.
         */
        var chain = new sb.BindingChain(observer, observables);

        return chain;
    };

    /**
     * Create default setting property of sb.Observable.
     * @param {*} initValue initial value.
     * @return {sb.ObservableProperty} default setting property of sb.Observable.
     */
    sb.observable = function(initValue) {
        /**
         * @type {sb.ObservableProperty} default setting property of sb.Observable.
         */
        var observable = new sb.Observable(observer, initValue);
        return observable.property;
    };

     /**
      * Create default setting property of sb.ObservableArray.
      * @param {*} array initial value.
      * @return {sb.ObservableProperty} default setting property of sb.ObservableArray.
      */
    sb.observableArray = function(array) {
        /**
         * @type {sb.ObservableProperty} default setting property of sb.ObservableArray.
         */
        var observableArray = new sb.ObservableArray(observer, array);
        return observableArray.property;
    };

})();

