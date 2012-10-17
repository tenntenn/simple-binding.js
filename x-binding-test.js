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
     * @param {Array<sb.Observable>} inputs
     * @return void
     */
    this.notify = function(input) {

        /**
         * @type {number}
         */
        var i;

        /**
         * @type {stack}
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
            if (outputs.hasOwnProperty(output) && typeof outputs[output] === "function") {
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

// observable
// create an observable object
// @param {Object} init initial value
var foo = sb.observable(100);
var bar = sb.observable(200);
var hoge = sb.observable(500);



// binding
// create a constraint binding
// @param {Object} inputs it has input observables as properties
// @param {Object} outputs it has input observables as properties
// @param {function} constraint it returns computed values as a object's properties
var binding = new sb.Binding(
// input observables
{
    foo: foo,
    hoge: hoge
},
// output observables
{
    bar: bar
},
// constraint function

function(input) {
    return {
        bar: input.hoge() - input.foo()
    };
});


var binding2 = new sb.Binding({
    bar: bar,
    hoge: hoge
}, {
    foo: foo
},

function(input) {
    return {
        foo: input.hoge() - input.bar()
    };
});

var binding3 = new sb.Binding({
    bar: bar,
    foo: foo
}, {
    hoge: hoge
},

function(input) {
    return {
        hoge: input.foo() + input.bar()
    };
});


// bind
// regist to BindingMaster
// foo, bar -> hoge
binding.bind();
binding2.bind();
binding3.bind();

// unbind
// remote from BindingMaster
// binding.unbind();

function showAll() {
    alert(foo());
    alert(bar());
    alert(hoge());
};
//showAll();
// foo --notify[]--> BindingMaster --notify[]-->
// binding --notify[binding]--> hoge(400)
foo(200);
        stackTracer.reset();
showAll();


foo(1000);
showAll();
        stackTracer.reset();
 
bar(4000);
showAll();
        stackTracer.reset();

