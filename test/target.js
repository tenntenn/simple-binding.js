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
     * @type {Array.<sb.Binding>}
     */
    var bindings = [];

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
     * @param {Array<sb.Observable>} callStack
     * @param {Array<sb.Observable>} input
     * @return void
     */
    this.notify = function(callStack, input) {

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

        bindings.forEach(function(binding) {
            binding.notify(callStack);
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
 * @private
 * @param {sb.BindingMaster} bindingMaster
 * @param {Object} inputs
 * @param {Object} outputs
 * @param {sb.Compute} compute
 */
sb.Binding = function(bindingMaster, inputs, outputs, compute) {

    this.inputs = inputs;
    this.outputs = outputs;
    this.compute = compute;

    /**
     * @param {void}
     * @return {void}
     */
    this.bind = function() {
        bindingMaster.add(this);
        return this;
    };

    /**
     * @param {void}
     * @return {void}
     */
    this.unbind = function() {
        bindingMaster.remove(this);
        return this;
    };

    /**
     * @param {Array.<sb.Observable>}
     * @return {void}
     */
    this.notify = function(callStack) {
        var result = compute(inputs);
        var input = callStack[callStack.length - 1];
        Object.keys(result).forEach(function(name){
            var observable = outputs[name];
            if (outputs.hasOwnProperty(name)
                    && typeof observable === "function"
                    && input !== observable) {
                observable.notify(callStack, result[name]);
            }
        });

        return this;
    };

};
/**
 * @private
 * @constructor
 * @param {sb.BindingMaster} bindingMaster
 * @param {*} value
 */
sb.Observable = function(bindingMaster, value) {

    /**
     * @param {(void|*)} v
     * @return {*}
     * @this {sb.Observable}
     */
    var property = function(v) {

        if (v !== undefined) {
            property.notify([], v);
        }

        return value;
    };

    /**
     * @param {Array.<sb.Observable>} callStack
     * @param {*} v
     */
    property.notify = function(callStack, v) {
        if (callStack.lastIndexOf(property) < 0) {
            value = v;
            bindingMaster.notify(callStack.concat(property), property);
        }  
    };

    property.prototype = sb.Observable;
    this.property = property;
};
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
            inputs = arguments[0];
            if (typeof arguments[1] === "function") {
                outputs = arguments[0];
                compute = arguments[1];
            } else {
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


var foo = sb.observable(100);
var bar = sb.observable(200);
var hoge = sb.observable(500);
/*
var binding1 = sb.binding(
    {foo: foo, hoge:hoge},
    {bar: bar},
    function(input) {
        return {
            bar : input.hoge() - input.foo()
        }
    }
).bind().unbind();

var binding2 = sb.binding(
    {bar: bar, hoge: hoge},
    {foo: foo},
    function(input) {
        return {
            foo: input.hoge() - input.bar()
        };
    }
).bind().unbind();

var binding3 = sb.binding(
    {bar: bar, foo: foo},
    {hoge: hoge},
    function(input) {
        return {
            hoge: input.foo() + input.bar()
        };
    }
).bind().unbind();
*/
function test(expectFoo, expectBar, expectHoge) {
    if (foo() !== expectFoo) {
        console.error("foo is expected as "+expectFoo+" but actual is " + foo());
    }
    if (bar() !== expectBar) {
        console.error("bar is expected as "+expectBar+" but actual is " + bar());
    }
    if (hoge() !== expectHoge) {
        console.error("hoge is expected as "+expectHoge+" but actual is " + hoge());
    }   
    console.error();
}

// init
// foo: 100, hoge - bar
// bar: 200, hoge - foo
// hoge: 500, foo + bar

sb.binding(
    {foo: foo, bar: bar, hoge:hoge},
    function(inputs) {
        return {
            foo: inputs.hoge() - inputs.bar(),
            bar: inputs.hoge() - inputs.foo(),
            hoge: inputs.foo() + inputs.bar(),
        };
    }
).bind();

// foo(200) -> bar(500 - 200) -> hoge(200 + 300)
foo(200);
test(200, 200, 400);

// bar(4000) -> foo(500 - 4000) -> hoge(-3500 + 4000)
bar(4000);
test(200, 4000, 4200);

var piyo = sb.observable(200);
var piyopiyo = sb.observable(300);
sb.binding(piyo, piyopiyo).bind();
piyo(500);
if (piyo() !== piyopiyo()) {
    console.error("piyo() and piyopiyo() must be same");
}

