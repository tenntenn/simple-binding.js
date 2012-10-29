
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


var observableArray = sb.observableArray([100]);
if (observableArray.get(0) !== 100) {
    console.log("observableArray.get(0) is expected as 100 but actual is " + observableArray.get(0));
} 

ok = false;
sb.binding(observableArray).onChange(observableArray, function() {
    ok = true;
}).bind();
observableArray.push(200);
if (!ok) {
    console.error("ok must be true");
}
