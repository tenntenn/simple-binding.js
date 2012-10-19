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
     * @param {sb.Observable} input
     * @return {Array.<sb.Binding>} result
     */
    this.findByInput = function(input) {

        /**
         * @type {number}
         */
        var i, j;

        /**
         * @type {Array.<sb.Observable>}
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
         * @type {sb.stackTracer}
         */
        var input;

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
 * @type {sb.BindingMaster}
 */
var bindingMaster = new sb.BindingMaster();

/**
 * @private
 * @param {Array.<sb.Observables>} inputs
 * @param {Array.<sb.Observables>} outputs
 * @param {sb.Compute} compute
 */
sb.Binding = function(inputs, outputs, compute) {

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

    var value = value;

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

/**
 * @private
 * @constructor
 */
sb.StackTracer = function() {

    var that = this;

    that.stack = [];

    this.push = function(input) {
        that.stack.push(input);
    };

    this.reset = function() {
        that.stack.length = 0;
    };

    this.find = function(input) {

        var i;

        for (i = 0; i < that.stack.length; i++) {
            if (that.stack[i] === input) {
                return true;
            }
        }
        return false;
    };
}


/**
 * @private
 * @type {sb.BindingMaster}
 */
var bindingMaster = new sb.BindingMaster();

var stackTracer = new sb.StackTracer();

/**
 * @param {*} value
 * @param {sb.Compute} compute
 */
sb.observable = function(value) {
    var observable = new sb.Observable(bindingMaster, value);
    return observable.property;
};

