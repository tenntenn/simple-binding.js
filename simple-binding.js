/**
 * @namespace 
 */
var sb = {};
/**
 * Create an expandable function 
 * which can expand with other function.
 * Forexample, let f is expandable function and g is normal function.
 * f.expand(g) expand f with g.
 * Calling expanded f do the original process of f and then do the g's process. 
 * 
 * @return {function(*):*} expandable function
 */
sb.expandable = function() {
    
    /**
     * Expandable function.
     * @type {function(*):*} 
     */
    var that = function() {
        var args = sb.argumentsToArray(arguments);
        that.funcs.forEach(function(f) {
            f.apply(that, args);
        });
    };

    /**
     * Arguments array of this function.
     * @type {Array.<*>}
     */
    var args = sb.argumentsToArray(arguments);

    /**
     * Sub functions.
     * @type {Array.<function(*):*>}
     */
    that.funcs = args.filter(function(arg) {
        return typeof arg === "function";
    });
 
    /**
     * Expand with given function.
     * @param {function(*):*} newFunc new sub function which is run at last.
     */
    that.expand = function(newFunc) {
        if (typeof newFunc === "function") {
            that.funcs.push(newFunc);
        }
        return that;
    };

    return that;
};
/**
 * Computed function.
 * It is used when notifies changing an observable value
 * to other binded observables by using computing notified value at sb.Binding.
 * @typedef {function(sb.Parameters):sb.Parameters}
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
 * A binding between observables.
 * If an observer which contained of input observables
 * notifies changing own value to the observer 
 * observer will notifies values which converted by computed function
 * to binded observables which contained of output observables. 
 * 
 * @param {sb.Observer} observer the observer
 * @param {sb.Parameters} inputs input observables
 * @param {sb.Parameters} outputs output observables
 * @param {sb.Computed} computed computed function
 */
sb.Binding = function(observer, inputs, outputs, computed) {

    /**
     * @type {sb.Binding} own
     */
    var that = this;

    /**
     * @type {sb.Parameters} input observables
     */
    that.inputs = inputs;

    /**
     * 
     * @type {sb.Parameters} output observables
     */
    that.outputs = outputs;

    /**
     * Computed function.
     * @type {sb.Computed}
     */
    that.computed = computed;

    /**
     * Enable this binding.
     * @return {sb.Binding}
     */
    that.bind = function() {
        observer.add(that);
        return that;
    };

    /**
     * Disable this binding.
     * @return {sb.Binding}
     */
    that.unbind = function() {
        observer.remove(that);
        return that;
    };

    /**
     * Notify changing to output observables.
     * 
     * @param {Array.<sb.ObservableProperty>}
     * @return {sb.Binding}
     */
    that.notify = function(callStack) {

        /**
         * @type {sb.Parameters} result of computed
         */
        var result = computed(inputs);

        /**
         * @type {sb.ObservableProperty} input observable
         */
        var input = callStack[callStack.length - 1];

        // notify to output observables
        Object.keys(result).forEach(function(name){
            var observable = outputs[name];
            if (input !== observable
                    && outputs.hasOwnProperty(name)
                    && sb.isObservable(observable)) {
                observable.notify(callStack, result[name]);
            }
        });

        return that;
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
     * A set of bindings which provide binding functions as method chains.
     * @param {sb.Observer} observer 
     * @param {Array.<sb.ObservableProperty>} observables
     */
    sb.BindingChain = function(observer, observables) {

        /**
         * Create bindings.
         * @type {sb.expandable}
         */
        var bindingsMaker = sb.expandable();

        /**
         * A set of bindings.
         * @type {Array.<sb.Binding>}
         */
        var bindings = [];

        /**
         * Synchronize observables which are same value each other
         * and when an observable changes, others immediately synchronized.
         * 
         * @return {sb.BindingChain} own 
         */
        this.synchronize = function() {

            /**
             * Arguments array this function.
             * @type {Array.<*>}
             */
            var args = sb.argumentsToArray(arguments);

            /**
             * Observables which are synchronized.
             * @type {Array.<sb.ObservableProperty>}
             */
            var syncObservables = [];

            args.forEach(function(arg) {
                if (sb.isObservable(arg)) {
                    syncObservables.push(arg);
                    if (observables.indexOf(arg) < 0) {
                        observables.push(arg);
                    }
                } 
            }); 

            /**
             * Bindings which are used for synchronize given observables.
             * @type {Array.<sb.Binding>}
             */
            var syncBindings = syncObservables.map(function(input) {
                var inputs = {input: input};
                var outputs = {};
                syncObservables.forEach(function(output, i) {
                    if (input !== output) {
                        outputs["output"+i] = output;
                    }
                });
                var computed = function(inputs) { 
                    var results = {};
                    Object.keys(outputs).forEach(function(key){
                        results[key] = inputs.input();
                    });
                    return results;
                };
                var b = new sb.Binding(observer, inputs, outputs, computed);
                return b;
            });


            // for lazy evaluation
            bindingsMaker.expand(function() {
                bindings = bindings.concat(syncBindings);
            });

            return this;
        };

        
        /**
         * Add computed binding.
         * @param {sb.ObservableProperty} observable target observable
         * @param {sb.Computed} func computed function
         * @return {sb.BindingChain} own
         */
        this.computed = function(observable, func) {

            if (!sb.isObservable(observable)
                    || typeof func !== "function") {
                return this;
            }

            if (observables.indexOf(observable) < 0) {
                observables.push(observable);
            }

            // lazy evaluation
            bindingsMaker.expand(function() {
                var inputs = {};
                observables.forEach(function(input, i) {
                    if (observable !== input) {
                        inputs["input"+i] = input;
                    }
                });
                var outputs = {output: observable}; 

                var b = new sb.Binding(
                    observer,
                    inputs,
                    outputs,
                    function(inputs) {
                        return {output: func(inputs)};
                    }
                );

                bindings.push(b);
            });

            return this;
        };

        /**
         * Add callback which call after changing a given observable value.
         * @param {sb.ObservableProperty} observable target observable.
         * @param {function(*):*} callback callback function
         * @return {sb.BindingChain} own
         */
        this.onChange = function(observable, callback) {

            if (!sb.isObservable(observable)
                    || typeof callback !== "function") {
                return this;
            }

            if (observables.indexOf(observable)) {
                observables.push(observable);
            }

            var b = new sb.Binding(
                observer,
                {input: observable},
                {},
                function() {
                    callback();
                    return {};
                }
            );

            // for lazy evaluation
            bindingsMaker.expand(function() {
                bindings.push(b);
            });
            return this;
        };

        /**
         * Enable internal all internal bindings.
         * @return {sb.BindingChain} own
         */
        this.bind = function() {

            // init
            this.unbind();
            bindingsMaker();

            bindings.forEach(function(b) {
                b.bind();
            });

            return this;
        };

        /**
         * Disable internal all internal bindings.
         * @return {sb.BindingChain} own
         */
        this.unbind = function() {
            
            bindings.forEach(function(b) {
                b.unbind();
            });
            bindings = [];

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

