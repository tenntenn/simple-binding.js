/**
 * @namespace 
 */
var sb = {};
/**
 * It provides utility functions and data structures.
 * @namespace
 */
sb.util = {};
/**
 * Create an expandable function 
 * which can expand with other function.
 * Forexample, let f is expandable function and g is normal function.
 * f.expand(g) expand f with g.
 * Calling expanded f do the original process of f and then do the g's process. 
 * 
 * @return {function(*):*} expandable function
 */
sb.util.expandable = function() {
    
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
sb.util.argumentsToArray = function(args) {
    var arry = [];
    Object.keys(args).forEach(function(i) {
        arry.push(args[i]);
    });

    return arry;
};
/**
 * It provides objects which are related to binding.
 * @namespace
 */
sb.binding = {};
/**
 * Computed function.
 * It is used when notifies changing an observable value
 * to other binded observables by using computing notified value at sb.Binding.
 * @typedef {function(sb.Parameters):sb.Parameters}
 */
sb.Computed;
/**
 * It provide context of propagation and can test availability of propagation.
 * @typedef {function(sb.ObservableProperty, Object): boolean}
 */
sb.Propagation;
/**
 * 
 * @constructor
 */
sb.PropagationGuardian = function(stopCondition, timeout) {

    if (typeof stopCondition !== "function") {
        stopCondition = function() {
            return true;
        };
    }

    if (typeof timeout !== "number"
            || timeout <= 0) {
        timeout = 1;
    }

    this.createPropagation = function() {

        /**
         * Call Stack of observable.
         * @type {Array.<sb.ObservableProperty>}
         */
        var callStack = [];

        /**
         * Test propagation is success with given stopCondition and timeout.
         * @type {sb.Propagation}
         * @param {sb.ObservableProperty} source adjacent source of notify propagation
         * @param {Object} e event object.
         */
        var propagation =  function(source, e) {

            // getter of callStack
            propagation.callStack = function() {
                return callStack.concat();
            };

            /**
             * Counter for number of appearance
             * of same observable in callstack.
             * @type {number}
             */
            var loopCount = 0;
            callStack.forEach(function(o) {
                if (o === source) {
                    loopCount++;
                }
            });

            // either loopCounter over timeout
            if (timeout <= loopCount) {
                return false;
            }

            if (!stopCondition(source, e)) {
                return false;
            }

            callStack.push(source);

            return true;
        };


        return propagation;
    };     
};

/**
 * Default sb.PropagationGuardian.
 * @const {sb.PropagationGuardian}
 */
sb.defaultPropagationGuardian = new sb.PropagationGuardian(null, 1);

/**
 * @constructor
 */
sb.Observer = function(propagationGuardian) {

    if (!propagationGuardian
            || !propagationGuardian instanceof sb.PropagationGuardian) {
        console.log("hoge");
        propagationGuardian = sb.defaultPropagationGuardian;
    }

    /**
     * @type {Array.<sb.Binding>}
     */
    var bindings = [];

    /**
     * Get sb.PropagationGuardian.
     * @return {sb.PropagationGuardian}
     */
    this.getPropagationGuardian = function() {
        return propagationGuardian;
    }

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
     * @param {sb.Propagation} propagation 
     * @param {Array<sb.Observable>} input
     * @return void
     */
    this.notify = function(propagation, input) {

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
            binding.notify(propagation);
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
sb.binding.Binding = function(observer, inputs, outputs, computed) {

    /**
     * @type {sb.binding.Binding} own
     */
    var that = this;

    /**
     * @type {sb.binding.Parameters} input observables
     */
    that.inputs = inputs;

    /**
     * 
     * @type {sb.binding.Parameters} output observables
     */
    that.outputs = outputs;

    /**
     * Computed function.
     * @type {sb.binding.Computed}
     */
    that.computed = computed;

    /**
     * Enable this binding.
     * @return {sb.binding.Binding}
     */
    that.bind = function() {
        observer.add(that);
        return that;
    };

    /**
     * Disable this binding.
     * @return {sb.binding.Binding}
     */
    that.unbind = function() {
        observer.remove(that);
        return that;
    };

    /**
     * Notify changing to output observables.
     * 
     * @param {sb.binding.Propagation} propagation propagation context
     * @return {sb.binding.Binding}
     */
    that.notify = function(propagation) {

        /**
         * @type {sb.binding.Parameters} result of computed
         */
        var result = computed(inputs);

        /**
         * @type {Array.<sb.observable.ObservableObject>}
         */
        var callStack = propagation.callStack();

        /**
         * @type {sb.observable.ObservableObject} input observable
         */
        var input = callStack[callStack.length - 1];

        // notify to output observables
        Object.keys(result).forEach(function(name){
            var observable = outputs[name];
            if (input !== observable
                    && outputs.hasOwnProperty(name)
                    && sb.isObservable(observable)) {
                observable.notify(propagation, result[name]);
            }
        });

        return that;
    };

};
(function(){

    /**
     * A set of bindings which provide binding functions as method chains.
     * @param {sb.binding.Observer} observer 
     * @param {Array.<sb.observable.ObservableObject>} observables
     */
    sb.binding.BindingChain = function(observer, observables) {

        /**
         * Create bindings.
         * @type {sb.util.expandable}
         */
        var bindingsMaker = sb.util.expandable();

        /**
         * A set of bindings.
         * @type {Array.<sb.binding.Binding>}
         */
        var bindings = [];

        /**
         * Synchronize observables which are same value each other
         * and when an observable changes, others immediately synchronized.
         * 
         * @return {sb.binding.BindingChain} own 
         */
        this.synchronize = function() {

            /**
             * Arguments array this function.
             * @type {Array.<*>}
             */
            var args = sb.util.argumentsToArray(arguments);

            /**
             * Observables which are synchronized.
             * @type {Array.<sb.binding.ObservableObject>}
             */
            var syncObservables = [];

            args.forEach(function(arg) {
                if (sb.observable.isObservable(arg)) {
                    syncObservables.push(arg);
                    if (observables.indexOf(arg) < 0) {
                        observables.push(arg);
                    }
                } 
            }); 

            /**
             * Bindings which are used for synchronize given observables.
             * @type {Array.<sb.binding.Binding>}
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
                var b = new sb.binding.Binding(observer, inputs, outputs, computed);
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
         * @param {sb.observable.ObservableObject} observable target observable
         * @param {sb.binding.Computed} func computed function
         * @return {sb.binding.BindingChain} own
         */
        this.computed = function(observable, func) {

            if (!sb.observable.isObservable(observable)
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

                var b = new sb.binding.Binding(
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
         * @param {sb.observable.ObservableObject} observable target observable.
         * @param {function(*):*} callback callback function
         * @return {sb.binding.BindingChain} own
         */
        this.onChange = function(observable, callback) {

            if (!sb.observable.isObservable(observable)
                    || typeof callback !== "function") {
                return this;
            }

            if (observables.indexOf(observable)) {
                observables.push(observable);
            }

            var b = new sb.binding.Binding(
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
         * @return {sb.binding.BindingChain} own
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
         * @return {sb.binding.BindingChain} own
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
/**
 * It provides data structures of observables.
 * @namespace
 */
sb.observable = {};
/**
 * An interface for observable objects.
 * It is a function and provides followings :
 *  + notify function as method
 * @interface
 */
sb.observable.ObservableObject;

/**
 * Check either obj is sb.ObservableyObject or not.
 * @param {*} tested object 
 * @return {boolean} true indicates that obj implements sb.ObservableObject. 
 */
sb.observable.isObservableObject = function(obj) {

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
 * An observable object which can have an internal value.
 *
 * @typedef {function(*):*}
*/
sb.observable.Observable;

/**
 * Create an sb.observable.Observable object.
 * 
 * @param {sb.Observer} observer observer of this observable value
 * @param {*} value
 */
sb.observable.newObservable = function(observer, value) {

    /**
     * @implements {sb.observable.ObservableObject}
     * @type {sb.observable.Observable}
     * @param {*} v it is set for this observable 
     * @return {*} set value at this observable
     */
    var observable = function(v) {

        /**
         * Propagation context.
         * @type {sb.Propagation}
         */
        var propagation;

        // if v is not undefined, it works as setter.
        if (v !== undefined) {
            propagation = observer.getPropagationGuardian().createPropagation();
            observable.notify(propagation, v);
        }

        // getter
        return value;
    };

    /**
     * @param {sb.Propagation} propagation propagation context
     * @param {*} v it is set for this observable
     */
    observable.notify = function(propagation, v) {
        if (propagation(observable, v)) {
           value = v;
           observer.notify(propagation, observable);
        }  
    };

    return observable;
};

/**
 * An array which can be observed.
 * If new element is added or an element deleted,
 * sb.observable.ObservableArray notify binded other sb.ObservableObject.
 *
 * @typedef {function():Array.<*>}
 */
sb.observable.ObservableArray;

/**
 * @param {sb.Observer} observer
 * @param {Array.<*>} initArray
 */
sb.observable.newObservableArray = function(observer, initArray) {

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
    var observable = function() {
        return array.concat();
    };

    /**
     * Notify changing for observer.
     * @param {sb.Propagation} propagation propagation context
     */
    observable.notify = function(propagation) {
        
        if (propagation(observable, observable)) {
           observer.notify(propagation, observable);
        }  
    };

    /**
     * Get array size which wrapes the internal array length.
     * @return {numnber} array size
     */
    observable.length = function() {
        return array.length;
    };

    /**
     * Get value with index i.
     */
    observable.get = function(i) {
        return array[i];
    };

    /**
     * Set value with index i.
     * And it notify observer.
     */
    observable.set = function(i, v) {

        /**
         * Propagation context.
         * @type {sb.Propagation}
         */
        var propagation = observer.getPropagationGuardian().createPropagation();

        array[i] = v;
       
        observable.notify(propagation);
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
            observable[fn] = function() {
                var args = sb.argumentsToArray(arguments);
                var ret = array[fn].apply(array, args); 
                /**
                 * Propagation context.
                 * @type {sb.Propagation}
                 */
                var propagation = observer.getPropagationGuardian().createPropagation();
                observable.notify(propagation);

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
            observable[fn] = function() {
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
            observable[fn] = function() {
                var args = sb.argumentsToArray(arguments);
                var ret = array[fn].apply(array, args);
                return ret;
            };
        }
    });

    return observable;
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

