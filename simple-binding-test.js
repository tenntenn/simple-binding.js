
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
    console.log(foo());
    console.log(bar());
    console.log(hoge());
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

