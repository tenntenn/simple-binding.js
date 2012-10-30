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
