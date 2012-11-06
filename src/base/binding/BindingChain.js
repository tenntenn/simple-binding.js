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
