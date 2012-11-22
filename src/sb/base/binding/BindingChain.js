define(
        "sb/base/binding/BindingChain",
        [
                "sb/util/main",
                "sb/base/binding/Binding",
                "sb/base/observable/isObservableObject"
        ],
        function(util, Binding, isObservableObject){

                /**
                 * A set of bindings which provide binding functions as method chains.
                 * @class BindingChain
                 * @constructor
                 * @namespace sb.base.binding
                 * @param {sb.base.binding.Observer} observer 
                 * @param {Array} observables
                 */
                function BindingChain(observer, observables) {

                        /**
                         * Create bindings.
                         * @property bindingsMaker
                         * @private
                         * @type {sb.util.expandable}
                         */
                        var bindingsMaker = util.expandable();

                        /**
                         * A set of bindings.
                         * @property bindings
                         * @private
                         * @type {Array}
                         */
                        var bindings = [];

                        /**
                         * Synchronize observables which are same value each other
                         * and when an observable changes, others immediately synchronized.
                         * @method sync
                         * @public
                         * @chainable
                         * @return {sb.base.binding.BindingChain} own object
                         */
                        this.sync = function() {

                                // Arguments array this function. 
                                var args = util.argumentsToArray(arguments);

                                // Observables which are synchronized. 
                                var syncObservables = [];

                                args.forEach(function(arg) {
                                        if (isObservableObject(arg)) {
                                                syncObservables.push(arg);
                                                if (observables.indexOf(arg) < 0) {
                                                        observables.push(arg);
                                                }
                                        } 
                                }); 

                                // Bindings which are used for synchronize given observables. 
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
                                        var b = new Binding(observer, inputs, outputs, computed);
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
                         * @method computed
                         * @public
                         * @chainable
                         * @param {sb.base.observable.ObservableObject} observable target observable
                         * @param {sb.base.binding.Computed} func computed function
                         * @return {sb.base.binding.BindingChain} own object
                         */
                        this.computed = function(observable, func) {

                                if (!isObservableObject(observable) || 
                                    typeof func !== "function") {
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

                                        var b = new Binding(
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
                         * @method onChange
                         * @public
                         * @chainable
                         * @param {sb.base.observable.ObservableObject} observable target observable.
                         * @param {function(sb.base.observable.ObservableObject, sb.base.binding.NotificationEvent)} callback callback function
                         * @return {sb.base.binding.BindingChain} own object
                         */
                        this.onChange = function(observable, callback) {

                                if (!isObservableObject(observable) ||
                                    typeof callback !== "function") {
                                        return this;
                                }

                                if (observables.indexOf(observable)) {
                                        observables.push(observable);
                                }

                                var b = new Binding(
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
                         * @method bind
                         * @public
                         * @chainable
                         * @return {sb.base.binding.BindingChain} own object
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
                         * @method unbind
                         * @public
                         * @chainable
                         * @return {sb.base.binding.BindingChain} own object
                         */
                        this.unbind = function() {

                                bindings.forEach(function(b) {
                                        b.unbind();
                                });
                                bindings = [];

                                return this;
                        };
                }
                return BindingChain;
        }
);

