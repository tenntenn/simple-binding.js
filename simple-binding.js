/**
 * @namespace 
 */
var sb = {};

/**
 * @private
 * @typedef {function(void):*}
 */
sb.Compute;

/**
 * @private
 * @constructor
 */
sb.BindingMaster = function() {

    /**
     * @type {sb.Observer}
     */
    var that = this;

    /**
     * @type {Array.<sb.Binding>}
     */
    var bindings = [];

    /**
     * Find observable which is registered as input in binding.
     * @param {sb.Observable} input
     * @return {Array.<sb.Binding>}
     */
    this.findByInput = function(input) {

        /**
         * @type {number}
         */
        var i, j;

        /**
         * @type {Object}
         */
        var inputs;

        /**
         * @type {Array.<sb.Binding>}
         */
        var result = [];

        for (i = 0; i < bindings.length; i++) {
            inputs = bindings[i].inputs;
            for (j in inputs) {
                if (inputs.hasOwnProperty(j)) {
                    if (inputs[j] === input.property) {
                        result.push(bindings[i]);
                    }
                }
            }
        }

        return result;
    }

    /**
     * @param {sb.Binding} binding
     * @return void
     */
    this.add = function(binding) {
        /**
         * @type {number}
         */
        var i;

        if (binding === null || typeof binding === "undefined") {
            return;
        }

        for (i = 0; i < bindings.length; i++) {
            if (bindings[i] === binding) {
                return;
            }
        }

        bindings.push(binding);
    };

    /**
     * @param {Array<sb.Observable>} input
     * @return void
     */
    this.notify = function(input) {

        /**
         * @type {number}
         */
        var i;

        /**
         * @type {Array.<sb.Binding>}
         */
        var bindings;

        bindings = that.findByInput(input);
        for (i = 0; i < bindings.length; i++) {
            if (!stackTracer.find(bindings[i])) {
                stackTracer.push(bindings[i]);
                bindings[i].compute();
            }
        }
    };

    /**
     * @param {sb.Binding} target
     * @return void
     */
    this.remove = function(target) {

        /**
         * @type {number}
         */
        var i;

        for (i = bindings.length - 1; i >= 0; i--) {
            if (bindings[i] === target) {
                bindings.splice(i, 1);
            }
        }

    };
}

/**
 * @private
 * @param {sb.BindingMaster} bindingMaster
 * @param {Object} inputs
 * @param {Object} outputs
 * @param {sb.Compute} compute
 */
sb.Binding = function(bindingMaster, inputs, outputs, compute) {

    /**
     * @param {void}
     * @return {void}
     */
    this.bind = function() {
        bindingMaster.add(this);
    };

    /**
     * @param {void}
     * @return {void}
     */
    this.unbind = function() {
        bindingMaster.remove(this);
    };

    this.inputs = inputs;

    /**
     * @param {void}
     * @return {void}
     */
    this.compute = function() {
        var result = compute(inputs);
        var output;
        for (output in outputs) {
            if (outputs.hasOwnProperty(output) 
	                && typeof outputs[output] === "function") {
                outputs[output](result[output]);
            }
        }
    };

}


/**
 * @private
 * @constructor
 * @param {sb.BindingMaster} bindingMaster
 * @param {*} value
 */
sb.Observable = function(bindingMaster, value) {

    /**
     * @type {sb.Observable}
     */
    var that = this;

    /**
     * @param {(void|*)} v
     * @return {*}
     * @this {sb.Observable}
     */
    this.property = function(v) {

        if (v !== undefined) {
            value = v;
            bindingMaster.notify(that);
        }

        return value;
    };
}

(function() {


    /**
     * @type {sb.BindingMaster}
     */
    var bindingMaster = new BindingMaster();

    /**
     * @param {*} value
     */
    sb.observable = function(value) {
        var observable = new sb.Observable(bindingMaster, value);
        return observable.property;
    };
})();

