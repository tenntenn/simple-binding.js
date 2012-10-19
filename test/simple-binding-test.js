
var foo = sb.observable(100);
var bar = sb.observable(200);
var hoge = sb.observable(500);

var binding1 = sb.binding(
    {foo: foo, hoge:hoge},
    {bar: bar},
    function(input) {
        return {
            bar : input.hoge() - input.foo()
        }
    }
).bind();

var binding2 = sb.binding(
    {bar: bar, hoge: hoge},
    {foo: foo},
    function(input) {
        return {
            foo: input.hoge() - input.bar()
        };
    }
).bind();

var binding3 = sb.binding(
    {bar: bar, foo: foo},
    {hoge: hoge},
    function(input) {
        return {
            hoge: input.foo() + input.bar()
        };
    }
).bind();

function test(expectFoo, expectBar, expectHoge) {
    if (foo() !== expectFoo) {
        console.error("foo is expected as "+expectFoo+" but actual is " + foo());
    }
    if (bar() !== expectBar) {
        console.error("foo is expected as "+expectBar+" but actual is " + bar());
    }
    if (hoge() !== expectHoge) {
        console.error("foo is expected as "+expectHoge+"but actual is " + hoge());
    }   
}

// init
// foo: 100, hoge - bar
// bar: 200, hoge - foo
// hoge: 500, foo + bar

// foo(200) -> bar(500 - 200) -> hoge(200 + 300)
foo(200);
test(200, 300, 500);

// bar(4000) -> foo(500 - 4000) -> hoge(-3500 + 4000)
bar(4000);
test(-3500, 4000, 500);
