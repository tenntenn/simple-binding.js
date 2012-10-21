
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
var piyopiyopiyo = sb.observable(400);
sb.binding(piyo, piyopiyo, piyopiyopiyo).bind();
piyo(500);
if (piyo() !== piyopiyo() || piyo() !== piyopiyopiyo()) {
    console.error("piyo() and piyopiyo() and piyopiyopiyo() must be same");
}

var ok = false;
var hogera = sb.observable(100);
sb.binding(hogera, function() {
    ok = true;
}).bind();
hogera(200);
console.log(hogera());
if (!ok) {
    console.error("ok must be true");
}
