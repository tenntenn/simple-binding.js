(function() {


    /**
     * @type {sb.BindingMaster}
     */
    var bindingMaster = new sb.BindingMaster();

    /**
     * @param {Object} inputs
     * @param {Object} outputs
     * @param {sb.Compute} compute
     */
    sb.binding = function() {
        var inputs, outputs;
        var compute = function() {
            var result = {};
            Object.keys(outputs).forEach(function(output) {
                Object.keys(inputs).forEach(function(input) {
                    if (input !== output
                            && inputs[input]() !== outputs[output]()) {
                        result[output] = inputs[input]();
                        return;
                    }
                });
            });

            return result;
        };

        var callback;

        var observables = [];
        for (arg in arguments) {
            if (arguments[arg].prototype === sb.Observable) {
                observables.push(arguments[arg])
            }
        }
        if (observables.length === arguments.length) {
            inputs = {};
            observables.forEach(function(observable, key){
                inputs["observable"+key] = observable; 
            });
            outputs = inputs;
        } else if (arguments.length == 1) {
            inputs = arguments[0];
            outputs = arguments[0];
        } else if (arguments.length <= 2) {
            if (typeof arguments[1] === "function") {
                callback = arguments[1];
                if (arguments[0].prototype === sb.Observable) {
                    inputs = {"observable": arguments[0]};
                    outputs = {};
                    compute = function(inputs) {
                        callback(inputs.observable);
                        return {};
                    }
                } else {
                    inputs = arguments[0];
                    outputs = arguments[0];
                    compute = arguments[1];
                }
            } else {
                inputs = arguments[0];
                outputs = arguments[1];
            }
        } else if (arguments.length > 2) {
            inputs = arguments[0];
            outputs = arguments[1];
            compute = arguments[2];
        }

       var binding = new sb.Binding(bindingMaster, inputs, outputs, compute);
        return binding;
    };

    /**
     * @param {*} value
     */
    sb.observable = function(value) {
        var observable = new sb.Observable(bindingMaster, value);
        return observable.property;
    };


})();

