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

        bs.forEach(function(binding) {
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
            if (input !== observable
                    && outputs.hasOwnProperty(name)
                    && sb.isObservable(observable)) {
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
        var pre = value;
        if (callStack.lastIndexOf(property) < 0) {
           value = v;
           bindingMaster.notify(callStack.concat(property), property);
        }  
    };

    property.observable = this;
    this.property = property;
};

sb.isObservable = function(obj) {

    if (obj instanceof sb.Observable) {
        return true;
    }

    if (obj.observable 
            && obj.observable instanceof sb.Observable){
        return true;
    }
    
    return false;
};
(function(){

    sb.BindingChain = function(bindingMaster, observables) {

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
                var b = new sb.Binding(bindingMaster, inputs, outputs, compute);
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
                bindingMaster,
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
                bindingMaster,
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
(function() {


    /**
     * @type {sb.BindingMaster}
     */
    var bindingMaster = new sb.BindingMaster();

    sb.binding = function() {
        var observables = [];
        var args = arguments;
        Object.keys(args).forEach(function(i) {
            var arg = args[i];
            if (sb.isObservable(arg)) {
                observables.push(arg);
            }
        });

        var chain = new sb.BindingChain(bindingMaster, observables);

        return chain;
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
}

// init
// foo: 100, hoge - bar
// bar: 200, hoge - foo
// hoge: 500, foo + bar

sb.binding(foo, bar, hoge)
    .compute(foo, function() {
        return hoge() - bar();
    })
    .compute(bar, function() {
        return hoge() - foo();
    })
    .compute(hoge, function() {
        return foo() + bar();
    })
    .bind();

// foo(200) -> bar(500 - 200) -> hoge(200 + 300)
console.log("test1");
foo(200);
test(200, 300, 500);
console.log("done");

// bar(4000) -> foo(500 - 4000) -> hoge(-3500 + 4000)
console.log("test2");
bar(4000);
test(-3500, 4000, 500);
console.log("done");

var piyo = sb.observable(200);
var piyopiyo = sb.observable(300);
var piyopiyopiyo = sb.observable(400);
sb.binding(piyo, piyopiyo, piyopiyopiyo)
    .synchronize(piyo, piyopiyo, piyopiyopiyo).bind();
console.log("test3");
piyo(500);
if (piyo() !== piyopiyo() || piyo() !== piyopiyopiyo()) {
    console.error("piyo() and piyopiyo() and piyopiyopiyo() must be same");
}
console.log("done");

var ok = false;
var hogera = sb.observable(100);
sb.binding(hogera).onChange(hogera, function() {
    ok = true;
}).bind();
console.log("test4");
hogera(200);
if (!ok) {
    console.error("ok must be true");
}
console.log("done");
