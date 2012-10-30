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
