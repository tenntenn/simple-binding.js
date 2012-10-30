simple-binding.js
=================

Sinmple binding library.

Authors
-------------
* @tenntenn (Takuya Ueda)
* spd-user
* kazuma-s

Build
-------------

Build script create a minified js file by executing such as following.

    $ ./build


Usage
-------------

    var foo = sb.observable(100);
    var bar = sb.observable(200);
    var hoge = sb.observable(300);
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
    foo(200); // foo = 200, bar = hoge - foo, hoge = foo + bar


    var piyo = sb.observable(100);
    var piyopiyo = sb.observable(200);
    var piyopiyopiyo = sb.observable(300);
    sb.binding(piyo, piyopiyo, piyopiyopiyo)
        .synchronize(piyo, piyopiyo, piyopiyopiyo).bind();
    piyo(200); // piyo() === piyopiyo() === piyopiyopiyo()


    var hogera = sb.observable(100);
    sb.binding(hogera).onChage(hogera, function() {
        console.log("callback!!");
    }).bind();
    hogera(200); // print "callback!!" on consle.
