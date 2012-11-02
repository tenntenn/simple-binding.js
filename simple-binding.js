/** @preserve simple-binding.js - It is a javascript simple binding library and provides simple observable objects and binding.
* https://github.com/tenntenn/simple-binding.js
*
* Copyright (c) 2012, Takuya Ueda and Yuji Katsumata.
* All rights reserved.
* 
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
* 
* * Redistributions of source code must retain the above copyright notice,
*   this list of conditions and the following disclaimer.
* * Redistributions in binary form must reproduce the above copyright notice,
*   this list of conditions and the following disclaimer in the documentation
*   and/or other materials provided with the distribution.
* * Neither the name of the author nor the names of its contributors may be used
*   to endorse or promote products derived from this software
*   without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
* ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @namespace 
 */
var sb = {};
/**
 * It provides utility functions and data structures.
 * @namespace
 */
sb.util = sb.util || {};
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
        var args = sb.util.argumentsToArray(arguments);
        that.funcs.forEach(function(f) {
            f.apply(that, args);
        });
    };

    /**
     * Arguments array of this function.
     * @type {Array.<*>}
     */
    var args = sb.util.argumentsToArray(arguments);

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
 * It provides base of structures.
 * @namespace
 */
sb.base = sb.base || {};
/**
 * It provides objects which are related to binding.
 * @namespace
 */
sb.base.binding = sb.base.binding || {};
/**
 * Computed function.
 * It is used when notifies changing an observable value
 * to other binded observables by using computing notified value at sb.base.binding.Binding.
 * @typedef {function(sb.base.binding.Parameters):sb.base.binding.Parameters}
 */
sb.base.binding.Computed;
/**
 * It provide context of propagation and can test availability of propagation.
 * @typedef {function(sb.base.binding.ObservableProperty, Object): boolean}
 */
sb.base.binding.Propagation;
/**
 * 
 * @constructor
 */
sb.base.binding.PropagationGuardian = function(continueCondition, timeout) {

    if (typeof continueCondition !== "function") {
        continueCondition = function() {
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
         * @type {Array.<sb.base.binding.ObservableProperty>}
         */
        var callStack = [];

        /**
         * Test propagation is success with given continueCondition and timeout.
         * @type {sb.base.binding.Propagation}
         * @param {sb.base.binding.ObservableProperty} source adjacent source of notify propagation
         * @param {sb.base.binding.NotificationEvent} e event object.
         */
        var propagation =  function(source, e) {

            // getter of callStack
            propagation.callStack = function() {
                return callStack.concat();
            };

            // getter of source observable
            propagation.getSource = function() {
                return source;
            };

            // getter of event object
            propagation.getEventObject = function() {
                return e;
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

            if (!continueCondition(source, e)) {
                return false;
            }

            callStack.push(source);

            return true;
        };


        return propagation;
    };     
};

/**
 * Default sb.base.binding.PropagationGuardian.
 * @const {sb.base.binding.PropagationGuardian}
 */
sb.base.binding.defaultPropagationGuardian = new sb.base.binding.PropagationGuardian(null, 1);

/**
 * Notification event object.
 * @typedef {Object}
 */
sb.base.binding.NotificationEvent;
/**
 * @constructor
 */
sb.base.binding.Observer = function(propagationGuardian) {

    if (!propagationGuardian
            || !propagationGuardian instanceof sb.base.binding.PropagationGuardian) {
        propagationGuardian = sb.base.binding.defaultPropagationGuardian;
    }

    /**
     * @type {Array.<sb.base.binding.Binding>}
     */
    var bindings = [];

    /**
     * Get sb.base.binding.PropagationGuardian.
     * @return {sb.base.binding.PropagationGuardian}
     */
    this.getPropagationGuardian = function() {
        return propagationGuardian;
    }

    /**
     * @param {sb.base.binding.Binding} binding
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
     * @param {sb.base.binding.Propagation} propagation 
     * @param {Array<sb.base.binding.Observable>} input
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
     * @param {sb.base.binding.Binding} target
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
 * @param {sb.base.binding.Observer} observer the observer
 * @param {sb.base.binding.Parameters} inputs input observables
 * @param {sb.base.binding.Parameters} outputs output observables
 * @param {sb.base.binding.Computed} computed computed function
 */
sb.base.binding.Binding = function(observer, inputs, outputs, computed) {

    /**
     * @type {sb.base.binding.Binding} own
     */
    var that = this;

    /**
     * @type {sb.base.binding.Parameters} input observables
     */
    that.inputs = inputs;

    /**
     * 
     * @type {sb.base.binding.Parameters} output observables
     */
    that.outputs = outputs;

    /**
     * Computed function.
     * @type {sb.base.binding.Computed}
     */
    that.computed = computed;

    /**
     * Enable this binding.
     * @return {sb.base.binding.Binding}
     */
    that.bind = function() {
        observer.add(that);
        return that;
    };

    /**
     * Disable this binding.
     * @return {sb.base.binding.Binding}
     */
    that.unbind = function() {
        observer.remove(that);
        return that;
    };

    /**
     * Notify changing to output observables.
     * 
     * @param {sb.base.binding.Propagation} propagation propagation context
     * @return {sb.base.binding.Binding}
     */
    that.notify = function(propagation) {

        /**
         * @type {sb.base.observable.ObservableObject} source of notification
         */
        var source = propagation.getSource();

        /**
         * @type {sb.base.binding.NotificationEvent} event object
         */
        var e = propagation.getEventObject();

        /**
         * @type {sb.base.binding.Parameters} result of computed
         */
        var result = computed(inputs, source, e);

        /**
         * @type {Array.<sb.base.observable.ObservableObject>}
         */
        var callStack = propagation.callStack();

        /**
         * @type {sb.base.observable.ObservableObject} input observable
         */
        var input = callStack[callStack.length - 1];

        // notify to output observables
        Object.keys(result).forEach(function(name){
            var observable = outputs[name];
            if (input !== observable
                    && outputs.hasOwnProperty(name)
                    && sb.base.observable.isObservableObject(observable)) {
                observable.notify(propagation, result[name]);
            }
        });

        return that;
    };

};
(function(){

    /**
     * A set of bindings which provide binding functions as method chains.
     * @param {sb.base.binding.Observer} observer 
     * @param {Array.<sb.base.observable.ObservableObject>} observables
     */
    sb.base.binding.BindingChain = function(observer, observables) {

        /**
         * Create bindings.
         * @type {sb.util.expandable}
         */
        var bindingsMaker = sb.util.expandable();

        /**
         * A set of bindings.
         * @type {Array.<sb.base.binding.Binding>}
         */
        var bindings = [];

        /**
         * Synchronize observables which are same value each other
         * and when an observable changes, others immediately synchronized.
         * 
         * @return {sb.base.binding.BindingChain} own 
         */
        this.synchronize = function() {

            /**
             * Arguments array this function.
             * @type {Array.<*>}
             */
            var args = sb.util.argumentsToArray(arguments);

            /**
             * Observables which are synchronized.
             * @type {Array.<sb.base.binding.ObservableObject>}
             */
            var syncObservables = [];

            args.forEach(function(arg) {
                if (sb.base.observable.isObservableObject(arg)) {
                    syncObservables.push(arg);
                    if (observables.indexOf(arg) < 0) {
                        observables.push(arg);
                    }
                } 
            }); 

            /**
             * Bindings which are used for synchronize given observables.
             * @type {Array.<sb.base.binding.Binding>}
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
                var b = new sb.base.binding.Binding(observer, inputs, outputs, computed);
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
         * @param {sb.base.observable.ObservableObject} observable target observable
         * @param {sb.base.binding.Computed} func computed function
         * @return {sb.base.binding.BindingChain} own
         */
        this.computed = function(observable, func) {

            if (!sb.base.observable.isObservableObject(observable)
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

                var b = new sb.base.binding.Binding(
                    observer,
                    inputs,
                    outputs,
                    function(inputs, source, e) {
                        return {output: func(inputs, source, e)};
                    }
                );

                bindings.push(b);
            });

            return this;
        };

        /**
         * Add callback which call after changing a given observable value.
         * @param {sb.base.observable.ObservableObject} observable target observable.
         * @param {function(sb.base.observable.ObservableObject, sb.base.binding.NotificationEvent):*} callback callback function
         * @return {sb.base.binding.BindingChain} own
         */
        this.onChange = function(observable, callback) {

            if (!sb.base.observable.isObservableObject(observable)
                    || typeof callback !== "function") {
                return this;
            }

            if (observables.indexOf(observable)) {
                observables.push(observable);
            }

            var b = new sb.base.binding.Binding(
                observer,
                {input: observable},
                {},
                function(inputs, source, e) {
                    callback(source, e);
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
         * @return {sb.base.binding.BindingChain} own
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
         * @return {sb.base.binding.BindingChain} own
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
sb.base.observable = sb.base.observable || {};
/**
 * An interface for observable objects.
 * It is a function and provides followings :
 *  + notify function as method
 * @interface
 */
sb.base.observable.ObservableObject;

/**
 * Check either obj is sb.ObservableyObject or not.
 * @param {*} tested object 
 * @return {boolean} true indicates that obj implements sb.ObservableObject. 
 */
sb.base.observable.isObservableObject = function(obj) {

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
sb.base.observable.Observable;

/**
 * Create an sb.base.observable.Observable object.
 * 
 * @param {sb.Observer} observer observer of this observable value
 * @param {*} value
 */
sb.base.observable.newObservable = function(observer, value) {

    /**
     * @implements {sb.base.observable.ObservableObject}
     * @type {sb.base.observable.Observable}
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

        /**
         * @type {sb.base.binding.NotificationEvent}
         */
        var e = {
            previousValue : value,
            newValue : v
        };

        if (propagation(observable, e)) {
           value = v;
           observer.notify(propagation, observable);
        }  
    };

    return observable;
};

/**
 * An array which can be observed.
 * If new element is added or an element deleted,
 * sb.base.observable.ObservableArray notify binded other sb.ObservableObject.
 *
 * @typedef {function():Array.<*>}
 */
sb.base.observable.ObservableArray;

/**
 * @param {sb.Observer} observer
 * @param {Array.<*>} initArray
 */
sb.base.observable.newObservableArray = function(observer, initArray) {

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
    observable.notify = function(propagation, e) {

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

        /**
         * @type {sb.base.binding.NotificationEvent}
         */
        var e = {
            modifiedElements : [{
                index: i,
                previousValue: array[i],
                newValue: v
            }]
        };
 
        array[i] = v;
      
        observable.notify(propagation, e);
    };

    // wrapper for functions which change the internal array
    [
        "pop", 
        "shift", 
        "unshift", 
        "splice", 
        "reverse",
        "sort"
    ].forEach(function(fn) {
        if (typeof array[fn] === "function") {
            observable[fn] = function() {
                var args = sb.util.argumentsToArray(arguments);
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

    /**
     * A wrapper of Array.push.
     * @return length of the array after adding new elements.
     */
    observable.push = function() {

        var args = sb.util.argumentsToArray(arguments);
        var length;        

        /**
         * Propagation context.
         * @type {sb.Propagation}
         */
        var propagation = observer.getPropagationGuardian().createPropagation();

        /**
         * @type {sb.base.binding.NotificationEvent}
         */
        var e = {
            addedElements : []
        };

        var index = array.length + index;
        args.forEach(function(arg) {
            e.addedElements.push({
                index: index,
                value: arg
            });
            index++;
        });
        
        length = array.push.apply(array, args);

        observable.notify(propagation, e);

        return length;
    };


    // wrapper for functions which return array
    // without changing the internal array.
    [
        "concat",
        "map",
        "filter"
    ].forEach(function(fn) {
         if (typeof array[fn] === "function") {
            observable[fn] = function() {
                var args = sb.util.argumentsToArray(arguments);
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
                var args = sb.util.argumentsToArray(arguments);
                var ret = array[fn].apply(array, args);
                return ret;
            };
        }
    });

    return observable;
};
/**
 * It provides wrappers of KnockoutJS.
 * @namespace
 */
sb.base.observable.ko = sb.base.observable.ko || {};
/**
 * A wraper for ko.observable. 
 * @typedef {sb.base.observable.Observable}
 * @implements {sb.base.observable.ObservableObject}
 */
sb.base.observable.ko.Observable;

/**
 * @param {sb.base.binding.Observer} observer observer of this observable object
 * @param {ko.observable} koObservable observable object of KnockoutJS
 */
sb.base.observable.ko.newObservable = function(observer, koObservable) {

        /**
         * wrapper
         * @type {sb.base.observable.Observable}
         */
        var observable = sb.base.observable.newObservable(observer, koObservable());

        /**
         * handling changing of ko.observable value. 
         * @type {ko.computed}
         */
        var koComputed = ko.computed(function() {
                var v = koObservable();
                if (v !== observable()) {
                        observable(v);
                }
                return v;
        });

        /**
         * handling chaing of observable value.
         * @type {sb.base.binding.Binding}
         */
        var binding = new sb.base.binding.Binding(
                        observer,
                        {observable: observable}, // inputs
                        {},                       // outputs
                        function() {              // computed
                                var v = observable();
                                if (v !== koObservable()) {
                                        koObservable(v);
                                }
                                return {};
                        }
        );
        binding.bind();

        return observable;
};
// It provide functions which can be use easily.
(function() {

    /**
     * @const {sb.base.binding.Observer} default observer.
     */
    var observer = new sb.base.binding.Observer();

    /**
     * Create default setting binding chain.
     * @return {sb.base.binding.BindingChain} default setting binding chain.
     */
    sb.binding = function() {

        /**
         * @type {Array.<*>} arguments array of this function.
         */
        var args = sb.util.argumentsToArray(arguments);

        /**
         * @type {Array.<sb.base.observable.ObservableObject>} 
         */
        var observables = args.filter(function(arg){
            return sb.base.observable.isObservableObject(arg);
        });

        /**
         * @type {sb.base.binding.BindingChain} default setting binding chain.
         */
        var chain = new sb.base.binding.BindingChain(observer, observables);

        return chain;
    };

    /**
     * Create default setting of sb.base.observable.Observable.
     * @param {*} initValue initial value.
     * @return {sb.base.observable.Observable} default setting of sb.base.observable.Observable.
     */
    sb.observable = function(initValue) {
        /**
         * @type {sb.base.observable.Observable} default setting of sb.base.observable.Observable.
         */
        var observable = sb.base.observable.newObservable(observer, initValue);
        return observable;
    };

     /**
      * Create default setting of sb.base.observable.ObservableArray.
      * @param {*} array initial value.
      * @return {sb.base.observable.ObservableArray} default setting sb.base.observable.ObservableArray.
      */
    sb.observableArray = function(array) {
        /**
         * @type {sb.base.observable.ObservableArray} default setting of sb.base.observable.ObservableArray.
         */
        var observableArray = sb.base.observable.newObservableArray(observer, array);
        return observableArray;
    };


    // wrappers of KnockoutJS.
    sb.ko = {};

    /**
     * Create default setting of sb.base.observable.ko.Observable.
     * @param {ko.observable} koObservable observable object of KnockoutJS
     * @return {sb.base.observable.ko.Observable} default setting of sb.base.observable.ko.Observable
     */
    sb.ko.observable = function(koObservable) {
        /**
         * default setting of sb.base.observable.ko.Observable.
         * @type {sb.base.observable.ko.Observable} 
         */
        var observable = sb.base.observable.ko.newObservable(observer, koObservable);
        return observable;
    };
})();

